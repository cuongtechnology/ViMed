import { prisma } from "@clinic/database";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, requirePermission, serverError } from "@/lib/api-guard";
import { getPagination } from "@/lib/pagination";
import { getUserOrganizationId } from "@/lib/user-context";

const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  roleIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission("USER_READ");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const { skip, limit, page } = getPagination(request.nextUrl.searchParams);
    const where = { organizationId, deletedAt: null };
    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          username: true,
          fullName: true,
          phone: true,
          status: true,
          createdAt: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission("USER_CREATE");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const { email, username, password, firstName, lastName, phone, roleIds } = parsed.data;
    const passwordHash = await hash(password, 12);
    const fullName = `${lastName} ${firstName}`.trim();

    const user = await prisma.user.create({
      data: {
        organizationId,
        email,
        username,
        passwordHash,
        firstName,
        lastName,
        fullName,
        phone,
        createdBy: auth.user.id,
        roles: roleIds?.length
          ? {
              create: roleIds.map((roleId) => ({
                roleId,
                grantedBy: auth.user.id,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch {
    return serverError();
  }
}
