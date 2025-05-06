import React, { useState } from 'react';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchAzure = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `https://${import.meta.env.VITE_SEARCH_SERVICE_NAME}.search.windows.net`;
      const index = import.meta.env.VITE_SEARCH_INDEX_NAME;
      const key = import.meta.env.VITE_SEARCH_API_KEY;

      const url = `${endpoint}/indexes/${index}/docs?api-version=2023-07-01-Preview&search=${encodeURIComponent(query)}`;

      // Debug logging
      console.log("🔎 Search URL:", url);
      console.log("🔐 API key starts with:", key?.slice(0, 5) || '[undefined]');

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': key
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      const data = await response.json();
      setResults(data.value || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Search Azure AI Index</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a keyword, or use * to show all"
          style={{ width: '300px', padding: '0.5rem' }}
        />
        <button onClick={searchAzure} disabled={loading} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul>
        {results.map((doc, index) => (
          <li key={index} style={{ marginBottom: '1rem', fontFamily: 'monospace' }}>
            <pre>{JSON.stringify(doc, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
