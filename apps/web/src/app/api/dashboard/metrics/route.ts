import { prisma } from "@clinic/database";
import { NextResponse } from "next/server";
import { requireAuth, serverError } from "@/lib/api-guard";
import { getUserOrganizationId } from "@/lib/user-context";

export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const organizationId = await getUserOrganizationId(auth.user.id!);
    if (!organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [appointmentsToday, customersToday, todayRevenue, waitingTickets] = await Promise.all([
      prisma.appointment.count({
        where: {
          organizationId,
          appointmentDate: { gte: startOfDay, lte: endOfDay },
        },
      }),
      prisma.customer.count({
        where: {
          organizationId,
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      }),
      prisma.invoice.aggregate({
        where: {
          organizationId,
          issueDate: { gte: startOfDay, lte: endOfDay },
          status: { not: "CANCELLED" },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.internalTicket.count({
        where: {
          organizationId,
          status: { in: ["OPEN", "IN_PROGRESS"] },
        },
      }),
    ]);

    return NextResponse.json({
      appointmentsToday,
      customersToday,
      todayRevenue: todayRevenue._sum.totalAmount ?? 0,
      waitingTickets,
    });
  } catch (error) {
    return serverError();
  }
}
