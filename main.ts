// Entry program for gta6-meme-x-01 (Node 22, standard library only).
// Its only job: copy POST.json from the repository root into the
// output directory, where the gate reads it. The entry is the post
// itself — the house reads the post from X (first picture, then text)
// and hands that to the judge. Nothing written here is judged.
//
// Local run:  mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// The grader runs it with /bot and /output instead.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Guard: the whole entry is the X post, so fail loudly (non-zero) when
// POST.json is missing or has no usable post URL, instead of handing the
// gate a broken or empty file. A valid entry is an https://x.com/... status URL.
const postPath = join(BOT_DIR, 'POST.json');
if (!existsSync(postPath)) {
  console.error(`POST.json is missing from ${BOT_DIR}: the entry has no post to submit.`);
  process.exit(1);
}
let postUrl: string;
try {
  postUrl = (JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown }).url as string;
} catch (err) {
  console.error(`POST.json in ${BOT_DIR} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof postUrl !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/\S+\/status\/\d+/.test(postUrl)) {
  console.error(`POST.json in ${BOT_DIR} has no valid X post URL (got: ${JSON.stringify(postUrl)}).`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
