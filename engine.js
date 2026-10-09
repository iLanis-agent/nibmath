/* Nib math - exact calligraphy layout arithmetic on labeled craft norms. */
const r2 = x => Math.round(x * 100) / 100;
const bad = m => { throw new Error(m); };
const pos = (v, m) => { if (!Number.isFinite(v) || v <= 0) bad(m); };

function ladder(nibMm, xNibs, ascNibs, descNibs) {
  pos(nibMm, 'nib width must be positive'); pos(xNibs, 'x-height in nib widths must be positive');
  if (!Number.isFinite(ascNibs) || ascNibs < 0) bad('ascender nib widths cannot be negative');
  if (!Number.isFinite(descNibs) || descNibs < 0) bad('descender nib widths cannot be negative');
  const x = nibMm * xNibs, asc = nibMm * ascNibs, desc = nibMm * descNibs;
  const line = x + asc + desc;
  const verdict = xNibs < 3.5 ? 'a compressed hand - broad-edge, tight (labeled)' :
    xNibs <= 5.5 ? 'the mid zone - italic and foundational live here (labeled)' :
    'a tall, airy x-height (labeled)';
  return { xHeightMm: r2(x), ascenderMm: r2(asc), descenderMm: r2(desc), lineHeightMm: r2(line), verdict };
}

function lines(pageMm, topMm, bottomMm, pitchMm) {
  pos(pageMm, 'page height must be positive'); pos(pitchMm, 'line pitch must be positive');
  if (!Number.isFinite(topMm) || topMm < 0) bad('top margin cannot be negative');
  if (!Number.isFinite(bottomMm) || bottomMm < 0) bad('bottom margin cannot be negative');
  const writable = pageMm - topMm - bottomMm;
  if (writable <= 0) bad('the margins eat the whole page');
  const n = Math.floor(writable / pitchMm);
  if (n < 1) bad('no full line fits in the writable height');
  const leftover = writable - n * pitchMm;
  const verdict = leftover < pitchMm * 0.25 ? 'lands almost clean - barely a gap at the bottom (labeled)' :
    'a short last gap - nudge the pitch or the margins (labeled)';
  return { writableMm: r2(writable), lines: n, leftoverMm: r2(leftover), verdict };
}

function slant(angleDeg, riseMm) {
  pos(angleDeg, 'angle must be positive'); pos(riseMm, 'rise must be positive');
  if (angleDeg >= 90) bad('angle must be under 90 degrees');
  const offset = riseMm / Math.tan(angleDeg * Math.PI / 180);
  const verdict = angleDeg >= 75 ? 'nearly upright (labeled)' :
    angleDeg >= 50 ? 'the classic cursive slant zone (labeled)' :
    'a laid-back slant (labeled)';
  return { offsetMm: r2(offset), verdict };
}

function nibcount(distanceMm, nibMm) {
  pos(distanceMm, 'distance must be positive'); pos(nibMm, 'nib width must be positive');
  const n = distanceMm / nibMm;
  const verdict = Number.isInteger(r2(n)) ? 'an exact count of nib widths (labeled)' : 'not a clean count - expect a partial nib width (labeled)';
  return { widths: r2(n), verdict };
}

const api = { ladder, lines, slant, nibcount };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.Nibmath = api;
