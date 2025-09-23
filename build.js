// libs
import { build } from "esbuild";
import { builtinModules } from "module";
import { copyFileSync } from "fs";
import { resolve } from "path";

async function runBuild() {
    try {
        await build({
            entryPoints: ["src/index.ts"],
            bundle: true,
            platform: "node",
            target: "node20",
            format: "cjs",
            outfile: "dist/index.cjs",
            sourcemap: true,
            minify: true,
            external: ["express", ...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        });

        const sourceEnv = resolve(".env.prd");
        const targetEnv = resolve("dist/.env");
        copyFileSync(sourceEnv, targetEnv);

        console.log("✅ Build success!");
        console.log("Copied .env.prd → dist/.env");
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

await runBuild();
