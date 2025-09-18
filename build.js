// build.js
import { build } from "esbuild";
import { builtinModules } from "module";

build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs",
    outfile: "dist/index.cjs",
    sourcemap: true,
    minify: true,
    external: ["express", ...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
}).catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
});
