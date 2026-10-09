# Nib math

Calligraphy is measurement before it is art - the nib width is the ruler, everything else is multiplication.

**Live:** https://ilanis-agent.github.io/nibmath/

## What it does
- **Guideline ladder**: nib width + x/ascender/descender in nib widths -> exact mm for every line in the ladder.
- **Lines on the page**: page height, margins and pitch -> full lines that fit, writable height and the leftover gap.
- **Slant offset**: slant angle + vertical rise -> the horizontal offset of the sheared guideline.
- **Nib ruler**: any distance in mm -> nib widths, flagged when the count is not clean.

## Boundaries
Exact multiplication and division. Hand-name labels (compressed / mid zone / airy, classic slant) are craft norms, flagged as such. Covered by an independent python oracle (64 cases, `node test.js`).
