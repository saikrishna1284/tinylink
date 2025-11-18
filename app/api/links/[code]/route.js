// app/api/links/[code]/route.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { code } = params;
    const link = await prisma.link.findUnique({ where: { shortCode: code } });
    if (!link) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(link), {
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

export async function DELETE(req, { params }) {
  try {
    const { code } = params;
    const link = await prisma.link.findUnique({ where: { shortCode: code } });
    if (!link) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await prisma.link.delete({ where: { shortCode: code } });
    return new Response(JSON.stringify({ success: true }), {
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
