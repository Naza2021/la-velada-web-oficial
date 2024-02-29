import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "./src/components/SmokeBackgroundWorker.ts",
	external: [],
	output: [{
		format: "esm", // Formato CommonJS, adecuado para Node.js
		// compact: true,
		// preserveModules: true,
		file: "./dist/SmokeBackgroundWorker.js",
		name: "main"
	}],
	plugins: [
		typescript({ exclude: ["./debug/**/*"], compilerOptions: {} }),
		nodeResolve(),
		terser(),
	]
}
