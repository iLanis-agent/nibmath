const M = require('./engine.js');
const E = require('./expected.json');
let n = 0, fail = 0;
const eq = (a, b, tag) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.error('FAIL', tag, JSON.stringify(a), '!=', JSON.stringify(b)); }
};
for (const c of E.ladder) { let r; try { r = M.ladder(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'ladder ' + c.in); }
for (const c of E.lines) { let r; try { r = M.lines(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'lines ' + c.in); }
for (const c of E.slant) { let r; try { r = M.slant(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'slant ' + c.in); }
for (const c of E.nibcount) { let r; try { r = M.nibcount(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'nibcount ' + c.in); }
// anchors
const l = M.ladder(2, 5, 3, 3);
eq(l.xHeightMm, 10, 'anchor x'); eq(l.lineHeightMm, 22, 'anchor line');
const p = M.lines(297, 20, 20, 11);
eq(p.lines, 23, 'anchor lines'); eq(p.leftoverMm, 4, 'anchor leftover');
const s = M.slant(55, 22);
eq(s.offsetMm, 15.4, 'anchor slant');
eq(M.nibcount(30, 2).widths, 15, 'anchor nibcount');
// invariant: line height equals sum of parts
n++;
{
  const q = M.ladder(1.7, 4.3, 2.1, 2.9);
  if (Math.abs(q.lineHeightMm - (q.xHeightMm + q.ascenderMm + q.descenderMm)) > 0.03) { fail++; console.error('FAIL sum invariant'); }
}
// errors
const errs = [
  () => M.ladder(0, 5, 3, 3), () => M.ladder(2, 0, 3, 3), () => M.ladder(2, 5, -1, 3), () => M.ladder(2, 5, 3, -1),
  () => M.lines(0, 20, 20, 11), () => M.lines(297, -1, 20, 11), () => M.lines(297, 20, 20, 0), () => M.lines(297, 150, 150, 11), () => M.lines(297, 20, 20, 300),
  () => M.slant(0, 22), () => M.slant(90, 22), () => M.slant(95, 22), () => M.slant(55, 0),
  () => M.nibcount(0, 2), () => M.nibcount(30, 0),
];
const msgs = ['nib width must be positive','x-height in nib widths must be positive','ascender nib widths cannot be negative','descender nib widths cannot be negative',
  'page height must be positive','top margin cannot be negative','line pitch must be positive','the margins eat the whole page','no full line fits in the writable height',
  'angle must be positive','angle must be under 90 degrees','angle must be under 90 degrees','rise must be positive',
  'distance must be positive','nib width must be positive'];
errs.forEach((f, i) => {
  n++;
  try { f(); fail++; console.error('FAIL no-throw', i); }
  catch (e) { if (e.message !== msgs[i]) { fail++; console.error('FAIL msg', i, e.message, 'want', msgs[i]); } }
});
console.log(fail ? fail + ' FAILURES / ' + n : n + '/' + n + ' checks pass');
process.exit(fail ? 1 : 0);
