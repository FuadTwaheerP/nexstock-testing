export function classifyPhase2Result(status, annotations = []) {
  const mocked = annotations.some(a => a.type === 'test-scope' && a.description === 'mocked-staff-ui');
  const confirmed = annotations.some(a => a.type === 'confirmed-bug');
  if (mocked && confirmed) return 'AUTOMATION REVIEW';
  if (status === 'passed') return mocked ? 'MOCK PASS' : 'PASS';
  if (confirmed) return 'FAIL';
  if (annotations.some(a => a.type === 'mock-observation')) return 'MOCK OBSERVATION';
  if (annotations.some(a => a.type === 'blocked')) return 'BLOCKED';
  return 'AUTOMATION REVIEW';
}

export function isUnreviewedFlowError(step) {
  return typeof step.error === 'string' && step.error.length > 0
    && !/^Error:\s*\[(?:P2-|RET-|REL-DN-|BLOCKED|MOCK-OBSERVATION)/.test(step.error);
}

export function needsFailureReview(errors = [], flows = []) {
  const steps = flows.flat();
  const knownAggregate = steps.some(s => s.error) && !steps.some(isUnreviewedFlowError);
  return errors.some(error => {
    const message = String(error).replace(/\x1b\[[0-9;]*m/g, '');
    if (/^Error:\s*\[(?:P2-|RET-|REL-DN-|BLOCKED|MOCK-OBSERVATION)/.test(message)) return false;
    // A full-flow assertion aggregates the attached reviewed step failures.
    // Transport/cleanup exceptions never qualify, even beside known findings.
    if (knownAggregate && /^Error:\s*expect\(/.test(message)) return false;
    return true;
  });
}
