// app/api/links/route.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
    return new Response(JSON.stringify(links), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, customCode } = body;
    const code = customCode || Math.random().toString(36).substring(2, 8);

    // Validate URL
    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlRegex.test(url)) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for duplicate code
    const existing = await prisma.link.findUnique({ where: { shortCode: code } });
    if (existing) {
      return new Response(JSON.stringify({ error: 'Code already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create new link
    const link = await prisma.link.create({ data: { fullUrl: url, shortCode: code } });
    return new Response(JSON.stringify(link), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
