import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { userId } = await context.params;

    const parsedId = parseInt(userId);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userActivities = await db
      .select({ date: activities.date })
      .from(activities)
      .where(eq(activities.userId, parsedId))
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
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { userId } = await context.params;

    const parsedId = parseInt(userId);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { date = new Date().toISOString().split("T")[0] } =
      await request.json();

    const newActivity = await db
      .insert(activities)
      .values({ userId: parsedId, date })
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
