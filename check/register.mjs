// Registers the extension-resolving loader for the headless harness.
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./resolver.mjs", pathToFileURL(import.meta.filename));
