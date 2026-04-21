import assert from "node:assert/strict";
import test from "node:test";
import { getPagination } from "./pagination";

test("getPagination returns defaults when values are missing", () => {
  const result = getPagination(new URLSearchParams());
  assert.deepEqual(result, { page: 1, limit: 20, skip: 0 });
});

test("getPagination normalizes invalid values", () => {
  const result = getPagination(new URLSearchParams("page=-5&limit=1000"));
  assert.deepEqual(result, { page: 1, limit: 20, skip: 0 });
});

test("getPagination handles valid values", () => {
  const result = getPagination(new URLSearchParams("page=3&limit=10"));
  assert.deepEqual(result, { page: 3, limit: 10, skip: 20 });
});
