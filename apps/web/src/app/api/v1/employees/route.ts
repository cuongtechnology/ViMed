import { prisma } from "@clinic/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, requirePermission, serverError } from "@/lib/api-guard";
import { getPagination } from "@/lib/pagination";
import { getUserOrganizationId } from "@/lib/user-context";

const createEmployeeSchema = z.object({
  branchId: z.string(),
  departmentId: z.string().optional(),
  positionId: z.string().optional(),
  employeeCode: z.string().min(2),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  joinDate: z.string().datetime(),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission("EMPLOYEE_READ");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const { skip, limit, page } = getPagination(request.nextUrl.searchParams);
    const [total, employees] = await Promise.all([
      prisma.employee.count({ where: { organizationId, deletedAt: null } }),
      prisma.employee.findMany({
        where: { organizationId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: employees,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission("EMPLOYEE_CREATE");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createEmployeeSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const { firstName, lastName, joinDate, ...rest } = parsed.data;

    const employee = await prisma.employee.create({
      data: {
        ...rest,
        organizationId,
        firstName,
        lastName,
        fullName: `${lastName} ${firstName}`.trim(),
        joinDate: new Date(joinDate),
        createdBy: auth.user.id,
      },
    });

    return NextResponse.json({ data: employee }, { status: 201 });
  } catch {
    return serverError();
  }
}
