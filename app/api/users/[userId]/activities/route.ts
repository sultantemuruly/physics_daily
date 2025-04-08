import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userActivities = await db
      .select({ date: activities.date })
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(activities.date);

    const activityDates = userActivities.map((activity) => activity.date);

    return NextResponse.json(activityDates);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { date = new Date().toISOString().split("T")[0] } =
      await request.json();

    const newActivity = await db
      .insert(activities)
      .values({ userId, date })
      .onConflictDoNothing()
      .returning();

    return NextResponse.json(
      newActivity[0] || { message: "Activity already exists for this date" }
    );
  } catch (error) {
    console.error("Failed to track activity:", error);
    return NextResponse.json(
      { error: "Failed to track activity" },
      { status: 500 }
    );
  }
}
