import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");

test("compiled API handler loads under Node ESM the way Vercel runs it", async () => {
  const outDir = await mkdtemp(path.join(tmpdir(), "weather-cast-api-"));
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    esModuleInterop: true,
    strict: false,
    skipLibCheck: true,
    outDir,
    rootDir: root,
    declaration: false,
    sourceMap: false,
  };
  const program = ts.createProgram({
    rootNames: [path.join(root, "api/[[...path]].ts")],
    options,
    host: ts.createCompilerHost(options),
  });

  const emitted = new Map();
  const result = program.emit(undefined, (fileName, text) => {
    emitted.set(fileName, text);
  });
  assert.equal(result.emitSkipped, false, "TypeScript skipped emit of the API handler");

  await writeFile(path.join(outDir, "package.json"), JSON.stringify({ type: "module" }));
  for (const [fileName, text] of emitted) {
    if (!fileName.endsWith(".js")) continue;
    await mkdir(path.dirname(fileName), { recursive: true });
    await writeFile(fileName, text);
  }

  const handlerUrl = pathToFileURL(path.join(outDir, "api/[[...path]].js"));
  const mod = await import(handlerUrl.href);
  assert.equal(typeof mod.default, "function");
});
