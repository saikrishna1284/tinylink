// app/[code]/page.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function Redirect({ params }) {
  const { code } = params;

  const link = await prisma.link.findUnique({ where: { shortCode: code } });

  if (!link) {
    return new Response('Not found', { status: 404 });
  }

  await prisma.link.update({
    where: { shortCode: code },
    data: { clicks: link.clicks + 1, lastClicked: new Date() },
  });

  return Response.redirect(link.fullUrl, 302);
}
