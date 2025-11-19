export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /api/links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });

    const safeLinks = links.map((link) => ({
      id: link.id,
      fullUrl: link.fullUrl,
      shortCode: link.shortCode,
      clicks: link.clicks,
      createdAt: link.createdAt.toISOString(),
      lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
    }));

    return Response.json(safeLinks, { status: 200 });
  } catch (error) {
    console.error("GET /api/links error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/links
export async function POST(req) {
  try {
    const body = await req.json();
    const { url, customCode } = body;

    const code = customCode || Math.random().toString(36).substring(2, 8);

    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlRegex.test(url)) {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }

    const existing = await prisma.link.findUnique({
      where: { shortCode: code },
    });

    if (existing) {
      return Response.json({ error: "Code already exists" }, { status: 409 });
    }

    const link = await prisma.link.create({
      data: { fullUrl: url, shortCode: code },
    });

    const safeLink = {
      id: link.id,
      fullUrl: link.fullUrl,
      shortCode: link.shortCode,
      clicks: link.clicks,
      createdAt: link.createdAt.toISOString(),
      lastClicked: null,
    };

    return Response.json(safeLink, { status: 201 });
  } catch (error) {
    console.error("POST /api/links error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
