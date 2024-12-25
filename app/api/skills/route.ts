import { NextRequest, NextResponse } from "next/server";
import { getAllSkills } from "./helper";

export async function GET(request: NextRequest) {
  try {
    const skills = await getAllSkills();

    if (!skills || skills.length === 0) {
      return NextResponse.json({ error: "No skills found" }, { status: 404 });
    }

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 },
    );
  }
}
