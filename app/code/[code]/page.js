import { PrismaClient } from '@prisma/client';
import ClientStats from './ClientStats';

const prisma = new PrismaClient();

export default async function CodePage({ params }) {
  const { code } = params;

  // Fetch link from database
  const link = await prisma.link.findUnique({
    where: { shortCode: code },
  });

  if (!link) return <div>Link not found</div>;

  // Convert to plain object before sending to Client Component
  const linkData = {
    id: link.id,
    fullUrl: link.fullUrl,
    shortCode: link.shortCode,
    clicks: link.clicks,
    lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
    createdAt: link.createdAt.toISOString(),
  };

  return <ClientStats link={linkData} />;
}
