import { lstat, realpath, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Fixed generated output only: no CLI arguments, env override, or cwd-based
// path can redirect this cleanup to another project or to source files.
const projectRoot = await realpath(fileURLToPath(new URL("../", import.meta.url)));
const outputDirectory = join(projectRoot, "out");

let existing;
try {
  existing = await lstat(outputDirectory);
} catch (error) {
  if (!error || typeof error !== "object" || !("code" in error) || error.code !== "ENOENT") {
    throw error;
  }
}

if (existing) {
  if (existing.isSymbolicLink() || !existing.isDirectory()) {
    throw new Error("Refusing export cleanup: this project's out/ must be a regular directory, not a symlink or file.");
  }
  await rm(outputDirectory, { recursive: true, force: true, maxRetries: 2 });
  console.log("Removed the previous generated out/ export.");
} else {
  console.log("No previous out/ export to clean.");
}
