import test from 'node:test';
import assert from 'node:assert/strict';
import {needsFailureReview} from '../helpers/phase2-assessment.mjs';
test('reviewed debit-document finding does not conceal a separate cleanup or transport error',()=>{
 const finding='Error: [REL-DN-001] Saved debit document loses its selected product identity.';
 assert.equal(needsFailureReview([finding]),false);
 assert.equal(needsFailureReview([finding,'TimeoutError: inventory restoration did not finish']),true);
 assert.equal(needsFailureReview(['Error: unknown document failure']),true);
});
