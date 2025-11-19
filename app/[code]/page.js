export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function RedirectPage({ params }) {
  const { code } = params;

  // Fetch link by shortcode
  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return <div>404 - Link not found</div>;
  }

  // Update click count and last clicked time
  await prisma.link.update({
    where: { shortCode: code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  // Redirect to original full URL
  redirect(link.fullUrl);
}
