export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";
import ClientStats from "./ClientStats";

const prisma = new PrismaClient();

export default async function CodePage({ params }) {
  const { code } = params;

  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) return <div>Link not found</div>;

  return (
    <ClientStats
      link={{
        id: link.id,
        fullUrl: link.fullUrl,
        shortCode: link.shortCode,
        clicks: link.clicks,
        createdAt: link.createdAt.toISOString(),
        lastClicked: link.lastClicked
          ? link.lastClicked.toISOString()
          : null,
      }}
    />
  );
}
