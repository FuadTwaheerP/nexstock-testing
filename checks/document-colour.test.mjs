import test from 'node:test';
import assert from 'node:assert/strict';
import {rgba,compositeBackground,contrastRatio} from '../helpers/document-colour.mjs';
test('document contrast arithmetic uses standard black/white and equal-colour controls',()=>{
  assert.equal(contrastRatio('#000000','#ffffff'),21);
  assert.equal(contrastRatio('#17675e','#17675e'),1);
  assert.deepEqual(rgba('#fff'),[255,255,255,1]);
});
test('developer tint reaches three on the declared slate surface while original brand does not',()=>{
  assert.ok(contrastRatio('#17675e','#0f172a')<3);
  assert.ok(contrastRatio('#236f66','#0f172a')>=3);
});
test('actual background composites translucent layers and respects the nearest opaque surface',()=>{
  assert.deepEqual(compositeBackground(['rgba(0, 0, 0, 0)','rgb(10, 20, 30)','rgb(255, 255, 255)']),[10,20,30]);
  assert.deepEqual(compositeBackground(['rgba(200, 100, 0, 0.5)','rgb(0, 0, 0)']),[100,50,0]);
});
