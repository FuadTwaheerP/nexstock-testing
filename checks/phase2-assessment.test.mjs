import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyPhase2Result, isUnreviewedFlowError, needsFailureReview } from '../helpers/phase2-assessment.mjs';
const scope = {type:'test-scope',description:'mocked-staff-ui'};
test('mocked UI success cannot count as live account or authorization coverage',()=>{
  assert.equal(classifyPhase2Result('passed',[scope]),'MOCK PASS');
  assert.equal(classifyPhase2Result('passed',[]),'PASS');
});
test('mock observations remain unconfirmed, and promoting a mocked finding to a live bug requires review',()=>{
  assert.equal(classifyPhase2Result('failed',[scope,{type:'mock-observation'}]),'MOCK OBSERVATION');
  assert.equal(classifyPhase2Result('failed',[scope,{type:'confirmed-bug',description:'P2-FAKE'}]),'AUTOMATION REVIEW');
});
test('real blockers, reviewed application failures and unclassified errors stay distinct',()=>{
  assert.equal(classifyPhase2Result('failed',[{type:'blocked'}]),'BLOCKED');
  assert.equal(classifyPhase2Result('failed',[{type:'confirmed-bug',description:'P2-REAL'}]),'FAIL');
  assert.equal(classifyPhase2Result('timedOut',[]),'AUTOMATION REVIEW');
});
test('successful full-flow steps are not errors; plain adapter failures remain reviewable beside known bugs',()=>{
  const steps=[{step:'saved',status:'pass'},{step:'known',error:'Error: [P2-REAL] Missing action'},
    {step:'existing',error:'Error: [RET-002] export 404'},{step:'prerequisite',error:'Error: [BLOCKED] PO creation'},
    {step:'selector',error:'TimeoutError: locator.click: old selector'}];
  assert.deepEqual(steps.filter(isUnreviewedFlowError).map(s=>s.step),['selector']);
});
test('a finally/transport failure cannot be hidden by a previous bug or blocker annotation',()=>{
  assert.equal(needsFailureReview(['Error: [P2-REAL] Missing control','TimeoutError: page.goto during restore']),true);
  assert.equal(needsFailureReview(['Error: [BLOCKED] PO creation','Error: browser context closed']),true);
  assert.equal(needsFailureReview(['Error: [MOCK-OBSERVATION] No profile action','TimeoutError: live state readback']),true);
});
test('known full-flow aggregation is reviewable without misclassifying successful steps or hiding later timeouts',()=>{
  const flow=[[{step:'csv',status:'pass'},{step:'pdf',error:'Error: [P2-PDF] unavailable'}]];
  assert.equal(needsFailureReview(['Error: expect(received).toEqual(expected)'],flow),false);
  assert.equal(needsFailureReview(['TimeoutError: restoration failed'],flow),true);
  assert.equal(needsFailureReview(['Error: expect(invoice.total).toBe(100)']),true);
});
