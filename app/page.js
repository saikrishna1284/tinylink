// app/page.js
'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all links on page load
  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
      setLinks([]);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Add a new link
  const handleAdd = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customCode }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setLinks([data, ...links]);
        setUrl('');
        setCustomCode('');
      } else {
        setError(data.error || 'Error creating link');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  // Delete a link
  const handleDelete = async (code) => {
    if (!confirm(`Delete link ${code}?`)) return;
    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (res.status === 200) {
        setLinks(links.filter(link => link.shortCode !== code));
      } else {
        const data = await res.json();
        alert(data.error || 'Error deleting link');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TinyLink Dashboard</h1>

      {/* Add Link Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 mr-2 w-1/2"
        />
        <input
          type="text"
          placeholder="Custom code (optional)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="border p-2 mr-2 w-1/4"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Link'}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Links Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Short Code</th>
            <th className="border p-2">Target URL</th>
            <th className="border p-2">Clicks</th>
            <th className="border p-2">Last Clicked</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No links yet
              </td>
            </tr>
          )}
          {links.map((link) => (
            <tr key={link.id}>
              <td className="border p-2">{link.shortCode}</td>
              <td className="border p-2 truncate max-w-xs">
                <a href={link.fullUrl} target="_blank" rel="noopener noreferrer">
                  {link.fullUrl}
                </a>
              </td>
              <td className="border p-2">{link.clicks}</td>
              <td className="border p-2">
                {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(link.shortCode)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
