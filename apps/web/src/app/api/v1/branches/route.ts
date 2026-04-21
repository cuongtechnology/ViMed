import { prisma } from "@clinic/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, requirePermission, serverError } from "@/lib/api-guard";
import { getPagination } from "@/lib/pagination";
import { getUserOrganizationId } from "@/lib/user-context";

const createBranchSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission("BRANCH_READ");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const { skip, limit, page } = getPagination(request.nextUrl.searchParams);
    const [total, branches] = await Promise.all([
      prisma.branch.count({ where: { organizationId, deletedAt: null } }),
      prisma.branch.findMany({
        where: { organizationId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: branches,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission("BRANCH_CREATE");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createBranchSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const branch = await prisma.branch.create({
      data: {
        ...parsed.data,
        organizationId,
        createdBy: auth.user.id,
      },
    });

    return NextResponse.json({ data: branch }, { status: 201 });
  } catch {
    return serverError();
  }
}
