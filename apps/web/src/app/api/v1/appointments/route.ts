import { prisma } from "@clinic/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, requirePermission, serverError } from "@/lib/api-guard";
import { getPagination } from "@/lib/pagination";
import { getUserOrganizationId } from "@/lib/user-context";

const createAppointmentSchema = z.object({
  branchId: z.string(),
  customerId: z.string(),
  appointmentNo: z.string().min(2),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  appointmentDate: z.string().datetime(),
  startTime: z.string().min(4),
  endTime: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission("APPOINTMENT_READ");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const { skip, limit, page } = getPagination(request.nextUrl.searchParams);
    const [total, appointments] = await Promise.all([
      prisma.appointment.count({ where: { organizationId, deletedAt: null } }),
      prisma.appointment.findMany({
        where: { organizationId, deletedAt: null },
        skip,
        take: limit,
        orderBy: [{ appointmentDate: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    return NextResponse.json({
      data: appointments,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission("APPOINTMENT_CREATE");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...parsed.data,
        organizationId,
        appointmentDate: new Date(parsed.data.appointmentDate),
        createdBy: auth.user.id,
      },
    });

    return NextResponse.json({ data: appointment }, { status: 201 });
  } catch {
    return serverError();
  }
}
