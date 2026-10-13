import assert from "node:assert/strict";
import { test } from "node:test";
import { serializeJsonLd } from "../../src/shared/lib/jsonld";

test("CMS text cannot close a JSON-LD script tag", () => {
  const value = { name: '</script><script>alert("test")</script>' };
  const serialized = serializeJsonLd(value);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), value);
});
