// app/api/links/[code]/route.js
export const dynamic = "force-dynamic";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET → Return stats as JSON (API for dashboard)
export async function GET(req, { params }) {
  try {
    const { code } = params;

    const link = await prisma.link.findUnique({
      where: { shortCode: code }
    });

    if (!link) {
      return new Response(
        JSON.stringify({ error: "Not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // FIX: Convert to JSON-safe object
    const jsonLink = {
      id: link.id,
      fullUrl: link.fullUrl,
      shortCode: link.shortCode,
      clicks: link.clicks,
      lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
      createdAt: link.createdAt.toISOString(),
    };

    return Response.json(jsonLink, { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// DELETE → Remove link
export async function DELETE(req, { params }) {
  try {
    const { code } = params;

    const link = await prisma.link.findUnique({
      where: { shortCode: code }
    });

    if (!link) {
      return new Response(
        JSON.stringify({ error: "Not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.link.delete({
      where: { shortCode: code }
    });

    return Response.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
