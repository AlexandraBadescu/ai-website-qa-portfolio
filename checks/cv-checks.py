#!/usr/bin/env python3
# © 2026 Alexandra Badescu. Licensed under CC BY-NC-ND 4.0 (see LICENSE).
"""Pre-publish checks for a CV PDF.

Checks:
  - page count: exactly the expected number of pages (default 2)
  - page fill (heuristic): how far down each page the bulk of the content reaches,
    and the largest blank gap on the page
  - contact details: no email address or phone number (public versions only)
  - extractable text: the PDF contains real text rather than an image of text

What these checks do NOT prove:
  - Page fill is a visual heuristic, not a design review. It renders each page,
    merges lines of ink into text blocks and measures how much of the page height
    those blocks cover, so a lone footer or page number can't make an empty page
    pass. The blank-gap figure catches a page with content at the top and bottom
    but a large hole in the middle. Margins count as page height, so a completely
    full page scores below 100%.
  - Extractable text is a prerequisite for ATS parsing, not proof of ATS
    compatibility. Layout, headings, columns and the employer's own ATS all matter,
    so test with the real system if you can.
  - The contact-detail check uses patterns, so it can miss unusual formats and can
    flag long number strings that aren't phone numbers. Review the matches.

Usage: python3 checks/cv-checks.py CV.pdf [--pages 2] [--min-fill 0.65] [--max-gap 0.30] [--allow-contact]
Needs poppler-utils (pdftotext, pdftoppm) and Pillow.
"""
import argparse
import glob
import re
import subprocess
import sys
import tempfile

from PIL import Image

parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
parser.add_argument('pdf')
parser.add_argument('--pages', type=int, default=2)
parser.add_argument('--min-fill', type=float, default=0.65, help='minimum text coverage per page (0-1); margins mean a full page scores about 0.8-0.9')
parser.add_argument('--max-gap', type=float, default=0.30, help='largest allowed blank vertical gap inside the content (0-1)')
parser.add_argument('--allow-contact', action='store_true', help='skip the email/phone check (application CVs)')
args = parser.parse_args()

import os
if not os.path.isfile(args.pdf):
    print(f'FAIL file not found: {args.pdf}')
    sys.exit(1)

failures = []
text = subprocess.run(['pdftotext', '-layout', args.pdf, '-'], capture_output=True, text=True, check=True).stdout
words = len(text.split())
print(f'extractable text: {words} words')
if words < 200:
    failures.append('very little extractable text: the PDF may be an image of text, which ATS systems cannot read')

if not args.allow_contact:
    emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text)
    phones = re.findall(r'(?<![\w/.-])(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,5}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}(?![\w/.-])', text)
    def looks_like_phone(match):
        digits = re.sub(r'\D', '', match)
        if not 10 <= len(digits) <= 13:
            return False
        # A bare run of digits is only a phone number if it starts like one (0 or +),
        # so reference numbers such as 1234567890123 aren't flagged (see PC-05).
        return match.strip().startswith(('+', '0', '(')) or bool(re.search(r'[\s()-]', match.strip()))
    phones = [p for p in phones if looks_like_phone(p)]
    if emails:
        failures.append(f'email address found in a public CV: {", ".join(sorted(set(emails)))}')
    if phones:
        failures.append(f'possible phone number found in a public CV: {", ".join(sorted(set(p.strip() for p in phones)))}')


def measure(file):
    """Return (coverage, largest_gap) for one rendered page, as fractions of the page height.

    coverage: rows of ink are merged into text blocks (gaps smaller than about a blank
    line count as part of the block), and the block heights are added up. A full page
    of text covers most of the page; a page holding only a footer covers almost none.
    largest_gap: the biggest blank stretch between the first and last ink on the page.
    """
    image = Image.open(file).convert('L')
    width, height = image.size
    pixels = image.load()
    ink_rows = [y for y in range(height) if any(pixels[x, y] < 200 for x in range(0, width, 2))]
    if not ink_rows:
        return 0.0, 1.0
    merge = max(3, round(height * 0.025))  # about one blank line at typical CV sizes
    blocks, start, prev = [], ink_rows[0], ink_rows[0]
    for y in ink_rows[1:]:
        if y - prev > merge:
            blocks.append((start, prev))
            start = y
        prev = y
    blocks.append((start, prev))
    coverage = sum(end - begin + 1 for begin, end in blocks) / height
    gaps = [b[0] - a[1] for a, b in zip(blocks, blocks[1:])]
    return coverage, (max(gaps) if gaps else 0) / height


with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(['pdftoppm', '-r', '40', '-png', args.pdf, f'{tmp}/page'], check=True)
    pages = sorted(glob.glob(f'{tmp}/page-*.png'))
    print(f'pages: {len(pages)}')
    if len(pages) != args.pages:
        failures.append(f'{len(pages)} pages, expected {args.pages}')
    for number, file in enumerate(pages, 1):
        fill, gap = measure(file)
        print(f'page {number}: text covers {fill:.0%} of the page height (heuristic), largest blank gap {gap:.0%}')
        if fill < args.min_fill:
            failures.append(f'page {number}: text covers only {fill:.0%} of the page height')
        if gap > args.max_gap and fill > 0:
            failures.append(f'page {number} has a blank gap of {gap:.0%} of the page')

print('\n'.join(['', *(f'FAIL {f}' for f in failures)]) if failures else '\nAll CV checks passed')
sys.exit(1 if failures else 0)
