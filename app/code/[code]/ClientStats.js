'use client';

export default function ClientStats({ link }) {
  return (
    <div>
      <h1>Stats for {link.shortCode}</h1>
      <p>Full URL: {link.fullUrl}</p>
      <p>Total clicks: {link.clicks}</p>
      <p>Last clicked: {link.lastClicked || '-'}</p>
      <p>Created at: {link.createdAt}</p>
    </div>
  );
}
