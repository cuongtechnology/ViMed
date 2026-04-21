import assert from "node:assert/strict";
import test from "node:test";
import { collectPermissions, parseCredentials } from "./auth-utils";

test("parseCredentials validates email/password", () => {
  const invalid = parseCredentials({ email: "invalid", password: "" });
  assert.equal(invalid.success, false);

  const valid = parseCredentials({ email: "admin@vietcare.vn", password: "Admin@123" });
  assert.equal(valid.success, true);
});

test("collectPermissions deduplicates role permissions", () => {
  const permissions = collectPermissions([
    {
      role: {
        code: "A",
        rolePermissions: [
          { permission: { code: "USER_READ" } },
          { permission: { code: "USER_CREATE" } },
        ],
      },
    },
    {
      role: {
        code: "B",
        rolePermissions: [{ permission: { code: "USER_READ" } }],
      },
    },
  ]);

  assert.deepEqual(permissions.sort(), ["USER_CREATE", "USER_READ"]);
});
