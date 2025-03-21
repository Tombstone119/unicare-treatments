const { build } = require("esbuild");
const { join } = require("path");

async function runBuild() {
  try {
    await build({
      entryPoints: [join(__dirname, "../src/api/index.ts")],
      bundle: true,
      platform: "node",
      target: "node18",
      outfile: join(__dirname, "../dist/api/index.js"),
      format: "cjs",
      external: ["express", "mongoose", "cors"],
      minify: true,
      sourcemap: true,
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

runBuild();
