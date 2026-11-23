// makefun-meme-sprint — writes the meme image to the output directory.
// The entry image ships in this repo as entry.png; this program copies it
// byte-for-byte to <output>/entry.png so the run is fully deterministic.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
copyFileSync(join(here, "entry.png"), join(outDir, "entry.png"));
console.log(`wrote ${join(outDir, "entry.png")}`);
