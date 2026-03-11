// src/app/api/verification-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().min(2),
  projectLocation: z.string().min(5),
  serviceType: z.string().min(2),
  description: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const request = await prisma.verificationRequest.create({
      data: { ...parsed.data },
    });

    return NextResponse.json(
      { success: true, id: request.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Verification request error:", error);
    return NextResponse.json(
      { error: "Failed to submit request." },
      { status: 500 },
    );
  }
}
