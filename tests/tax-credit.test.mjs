import test from 'node:test';
import assert from 'node:assert/strict';
import {estimateCredit, parseAmount} from '../src/lib/tax-credit.js';
const base = {kind:'labor', household:'single', salary:1e7, totalIncome:1e7, property:0};
// Independent hand calculations from the published decreasing-band formula.
test('salary rises in decreasing band: 10m -> 11m', () => {
 assert.ok(Math.abs(estimateCredit(base).amount - 1523076.923076923) < .01);
 assert.ok(Math.abs(estimateCredit({...base,salary:11e6,totalIncome:11e6}).amount - 1396153.8461538462) < .01);
});
test('plateau boundaries and below-plateau special cases', () => {
 assert.equal(estimateCredit({...base,salary:4e6}).amount,165e4);
 assert.equal(estimateCredit({...base,salary:9e6}).amount,165e4);
 assert.equal(estimateCredit({...base,salary:3999999}).amount,null);
 assert.equal(estimateCredit({...base,household:'one',salary:7e6}).amount,285e4);
 assert.equal(estimateCredit({...base,household:'dual',salary:8e6}).amount,330e4);
});
test('property boundaries: unknown != zero, >=170m halves, >=240m unavailable', () => {
 assert.equal(estimateCredit({...base,property:169999999}).amount,estimateCredit(base).amount);
 assert.equal(estimateCredit({...base,property:17e7}).amount,estimateCredit(base).amount/2);
 assert.equal(estimateCredit({...base,property:24e7}).amount,null);
 assert.ok(estimateCredit({...base,property:null}).pending.some(x=>x.includes('재산 미입력')));
 assert.ok(!estimateCredit(base).pending.some(x=>x.includes('재산 미입력')));
});
test('total income eligibility independent of salary and no unverified verdict',()=>{
 assert.equal(estimateCredit({...base,totalIncome:22e6}).amount,null);
 assert.ok(estimateCredit({...base,totalIncome:null}).pending.some(x=>x.includes('총소득 미입력')));
 assert.throws(()=>estimateCredit({...base,totalIncome:9e6}));
});
test('child example and property + late adjustments',()=>{
 const args={...base,kind:'child',household:'one',kids:2,salary:35e6,totalIncome:35e6};
 assert.ok(Math.abs(estimateCredit(args).amount-1714285.7142857143)<.01);
 assert.ok(Math.abs(estimateCredit({...args,property:18e7,late:true}).amount-814285.7142857143)<.01);
 assert.equal(estimateCredit({...args,totalIncome:7e7}).amount,null);
 assert.equal(estimateCredit({...args,kids:0}).amount,null);
 assert.ok(estimateCredit(args).pending.some(x=>x.includes('세액공제')));
});
test('invalid money is rejected rather than silently converted',()=>{
 for(const x of ['-1','1.5','1e6','NaN','Infinity','12,34','1 000','100원','9007199254740992']) assert.throws(()=>parseAmount(x));
 assert.equal(parseAmount(''),null);assert.equal(parseAmount('0'),0);assert.equal(parseAmount('1,000,000'),1e6);
});
test('unsupported situations never produce a fabricated payout',()=>{
 assert.equal(estimateCredit({...base,salary:0,totalIncome:0}).amount,null);
 assert.equal(estimateCredit({...base,salary:21999999,totalIncome:21999999}).amount,null);
 assert.throws(()=>estimateCredit({...base,household:'dual',salary:5e6}));
 assert.throws(()=>estimateCredit({...base,kind:'child',household:'one',kids:1.5}));
 assert.throws(()=>estimateCredit({...base,salary:NaN}));
});
