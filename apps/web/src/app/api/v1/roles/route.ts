import { prisma } from "@clinic/database";
import { NextResponse } from "next/server";
import { requirePermission, serverError } from "@/lib/api-guard";
import { getUserOrganizationId } from "@/lib/user-context";

export async function GET() {
  const auth = await requirePermission("ROLE_READ");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const roles = await prisma.role.findMany({
      where: {
        OR: [{ organizationId }, { organizationId: null }],
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        isSystem: true,
      },
    });

    return NextResponse.json({ data: roles });
  } catch {
    return serverError();
  }
}
