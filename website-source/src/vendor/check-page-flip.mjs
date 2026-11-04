import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const file = new URL('./page-flip.js', import.meta.url);
const source = fs.readFileSync(file, 'utf8');
const exportToken = 'export{x as PageFlip};';
assert.equal(source.split(exportToken).length, 2, 'Expected upstream ESM export');
const pending = new Map();
let nextId = 1;
const context = {
  window: { navigator: { userAgent: 'lifecycle-check' } },
  requestAnimationFrame: callback => {
    const id = nextId++;
    pending.set(id, callback);
    return id;
  },
  cancelAnimationFrame: id => pending.delete(id),
};
vm.createContext(context);
vm.runInContext(source.replace(exportToken, 'globalThis.TestRender=g;globalThis.TestPageFlip=x;'), context);
const renderer = new context.TestRender({}, {});
let rendered = 0;
renderer.update = () => {};
renderer.drawFrame = () => rendered++;
renderer.start();
assert.equal(pending.size, 1);
renderer.start();
assert.equal(pending.size, 1, 'Restart must cancel the previous scheduled frame');
const [id, callback] = pending.entries().next().value;
pending.delete(id);
callback(16);
assert.equal(rendered, 1);
assert.equal(pending.size, 1, 'Active renderer schedules its next frame');
const lateCallback = pending.values().next().value;
renderer.animation = { sentinel: true };
renderer.stop();
assert.equal(pending.size, 0, 'Stop cancels queued frame');
assert.equal(renderer.animation, null, 'Stop discards active animation');
lateCallback(32);
assert.equal(rendered, 1, 'Late callback must not render after stop');
assert.equal(pending.size, 0, 'Late callback must not schedule another frame');
renderer.start();
const calls = [];
context.TestPageFlip.prototype.destroy.call({
  render: renderer,
  ui: { destroy: () => { assert.equal(pending.size, 0); calls.push('ui'); } },
  block: { remove: () => calls.push('block') },
});
assert.deepEqual(calls, ['ui', 'block']);
assert.equal(pending.size, 0, 'Public destroy stops rendering before DOM cleanup');
process.stdout.write('page-flip lifecycle: restart, stop, late callback, and public destroy passed.\n');
