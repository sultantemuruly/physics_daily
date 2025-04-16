import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const parsedId = parseInt(userId);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    const { newConceptAvailable } = await request.json();

    if (typeof newConceptAvailable !== "boolean") {
      return NextResponse.json(
        {
          error: "Invalid value for newConceptAvailable. It must be a boolean.",
        },
        { status: 400 }
      );
    }

    const updateResult = await db
      .update(users)
      .set({ newConceptAvailable })
      .where(eq(users.id, parsedId));

    if (updateResult.rowCount === 0) {
      return NextResponse.json(
        { error: "User not found or no changes made." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User's concept state updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating newConceptAvailable:", error);
    return NextResponse.json(
      { error: "Failed to update concept state" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const parsedId = parseInt(userId);

    if (isNaN(parsedId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Fetch the user by userId to retrieve the newConceptAvailable value
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, parsedId))
      .limit(1)
      .execute();

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the newConceptAvailable value for the user
    return NextResponse.json(
      { newConceptAvailable: user[0].newConceptAvailable },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving newConceptAvailable:", error);
    return NextResponse.json(
      { error: "Failed to retrieve concept state" },
      { status: 500 }
    );
  }
}
