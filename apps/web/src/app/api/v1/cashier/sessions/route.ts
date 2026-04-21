import { prisma } from "@clinic/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, requirePermission, serverError } from "@/lib/api-guard";
import { getPagination } from "@/lib/pagination";

const createCashSessionSchema = z.object({
  branchId: z.string(),
  cashierId: z.string(),
  sessionNo: z.string().min(2),
  openingBalance: z.number().nonnegative().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requirePermission("CASH_SESSION_READ");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const { skip, limit, page } = getPagination(request.nextUrl.searchParams);
    const [total, sessions] = await Promise.all([
      prisma.cashSession.count(),
      prisma.cashSession.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: sessions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission("CASH_SESSION_CREATE");
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const parsed = createCashSessionSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const session = await prisma.cashSession.create({
      data: {
        ...parsed.data,
        openingBalance: parsed.data.openingBalance ?? 0,
        openTime: new Date(),
        openedBy: auth.user.id,
      },
    });

    return NextResponse.json({ data: session }, { status: 201 });
  } catch {
    return serverError();
  }
}
