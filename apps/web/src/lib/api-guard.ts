import { NextResponse } from "next/server";
import { auth } from "./auth";

type SessionUser = {
  id?: string;
  roles?: string[];
  permissions?: string[];
};

export async function requireAuth() {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { user };
}

export async function requirePermission(permission: string) {
  const auth = await requireAuth();
  if ("error" in auth) {
    return auth;
  }

  const roles = auth.user.roles ?? [];
  const permissions = auth.user.permissions ?? [];
  const hasAccess = roles.includes("SUPER_ADMIN") || permissions.includes(permission);

  if (!hasAccess) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return auth;
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError() {
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
