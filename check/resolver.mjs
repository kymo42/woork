// Resolver hook so the headless harness can import the app's extensionless and
// aliased TypeScript the same way the bundler does. Dev-only; not shipped.
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { resolve as resolvePath } from "node:path";

const SRC = pathToFileURL(resolvePath(process.cwd(), "src") + "/").href;
const EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".jsx"];

export async function resolve(specifier, context, next) {
    // Mirror the tsconfig path alias: "@/*" -> "src/*"
    if (specifier.startsWith("@/")) {
        const mapped = SRC + specifier.slice(2);
        for (const ext of ["", ...EXTENSIONS]) {
            const candidate = mapped + ext;
            try {
                return await next(candidate, context);
            } catch {
                // try the next extension
            }
        }
    }

    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExtension = /\.[cm]?[jt]sx?$/.test(specifier);
    if (isRelative && !hasExtension) {
        for (const ext of EXTENSIONS) {
            try {
                return await next(specifier + ext, context);
            } catch {
                // try the next extension
            }
        }
    }

    // Stub non-code imports (Tailwind CSS) so component modules can load.
    if (specifier.endsWith(".css")) {
        return { url: "data:text/javascript,export default {}", shortCircuit: true, format: "module" };
    }

    return next(specifier, context);
}
