import { NextResponse } from "next/server";
import { isUnauthorizedError, requireCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id: userId } = await requireCurrentDbUser();
    const body = await request.json();
    const amount = parseInt(body.amountMl) || 0;
    if (amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    const now = new Date();
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    const existing = await prisma.waterIntake.findFirst({ where: { userId, date: { gte: start, lte: end } } });

    if (existing) {
      const updated = await prisma.waterIntake.update({ where: { id: existing.id }, data: { amountMl: existing.amountMl + amount } });
      return NextResponse.json(updated);
    }

    const created = await prisma.waterIntake.create({ data: { userId, date: now, amountMl: amount } });
    return NextResponse.json(created);
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to log water" }, { status: 500 });
  }
}
