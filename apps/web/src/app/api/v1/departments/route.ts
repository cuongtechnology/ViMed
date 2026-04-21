import { prisma } from "@clinic/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, requirePermission, serverError } from "@/lib/api-guard";
import { getPagination } from "@/lib/pagination";
import { getUserOrganizationId } from "@/lib/user-context";

const createDepartmentSchema = z.object({
  branchId: z.string().optional(),
  parentId: z.string().optional(),
  code: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission("DEPARTMENT_READ");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const { skip, limit, page } = getPagination(request.nextUrl.searchParams);
    const [total, departments] = await Promise.all([
      prisma.department.count({ where: { organizationId, deletedAt: null } }),
      prisma.department.findMany({
        where: { organizationId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: departments,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission("DEPARTMENT_CREATE");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createDepartmentSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const department = await prisma.department.create({
      data: {
        ...parsed.data,
        organizationId,
        createdBy: auth.user.id,
      },
    });

    return NextResponse.json({ data: department }, { status: 201 });
  } catch {
    return serverError();
  }
}
