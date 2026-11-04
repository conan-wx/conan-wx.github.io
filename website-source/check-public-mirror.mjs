import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const dist = fileURLToPath(new URL("../public-mirror-dist", import.meta.url));
const snapshot = JSON.parse(await readFile(path.join(root, "public/site-content.json"), "utf8"));
const fallback = JSON.parse(await readFile(path.join(root, "src/resume-content.json"), "utf8"));
assert.equal(snapshot.canEdit, false);
assert.equal(snapshot.revision, 0);
assert.ok(snapshot.content.posts.every(post => post.status === "published"), "The mirror snapshot must never contain drafts.");
assert.deepEqual(fallback, snapshot.content, "Fallback and public snapshot must contain the same published data.");
const page = await readFile(path.join(root, "src/page.tsx"), "utf8");
for (const forbidden of ["/api/content", "signin-with-chatgpt", "chatgpt.site", "startEdit", "saveEditor", "method: \"PUT\"", "写一笔", "写下第一篇记录"]) {
  assert.ok(!page.includes(forbidden), `The read-only page contains a forbidden dependency: ${forbidden}`);
}
assert.match(page, /fetch\("\/site-content\.json"/);
async function checkAssets(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) await checkAssets(location);
    else if (/\.(js|css|html|json)$/.test(entry.name)) {
      const text = await readFile(location, "utf8");
      for (const forbidden of ["/api/content", "signin-with-chatgpt", "chatgpt.site"]) {
        assert.ok(!text.includes(forbidden), `Build artifact ${entry.name} contains ${forbidden}`);
      }
    }
  }
}
await checkAssets(dist);
const deployedSnapshot = JSON.parse(await readFile(path.join(dist, "site-content.json"), "utf8"));
assert.deepEqual(deployedSnapshot, snapshot);
console.log(`Public mirror verified: ${snapshot.content.projects.length} projects, ${snapshot.content.posts.length} published posts, no online writes or original-host requests.`);
