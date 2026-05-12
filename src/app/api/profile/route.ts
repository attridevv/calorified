import { NextResponse } from "next/server";
import { isUnauthorizedError, requireCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const { id: userId } = await requireCurrentDbUser();
    const profile = await prisma.profile.findUnique({ where: { userId } });
    return NextResponse.json(profile || null);
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id: userId } = await requireCurrentDbUser();
    const body = await request.json();

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        calorieTarget: body.calorieTarget || null,
        proteinTarget: body.proteinTarget || null,
        carbsTarget: body.carbsTarget || null,
        fatTarget: body.fatTarget || null,
        waterTarget: body.waterTarget || null,
        age: body.age || null,
        sex: body.sex || null,
        height: body.height || null,
        activityLevel: body.activityLevel || null,
      },
      create: {
        userId,
        calorieTarget: body.calorieTarget || null,
        proteinTarget: body.proteinTarget || null,
        carbsTarget: body.carbsTarget || null,
        fatTarget: body.fatTarget || null,
        waterTarget: body.waterTarget || null,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
