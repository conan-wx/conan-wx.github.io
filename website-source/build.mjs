import { build } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const source = fileURLToPath(new URL(".", import.meta.url));
const output = fileURLToPath(new URL("../public-mirror-dist", import.meta.url));
if (path.dirname(output) !== path.dirname(source) || path.basename(output) !== "public-mirror-dist") {
  throw new Error("Unexpected mirror output path");
}
await build({ configFile: fileURLToPath(new URL("./vite.config.mts", import.meta.url)) });
