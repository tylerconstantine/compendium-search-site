console.log("Search URL:", url);
console.log("API key starts with:", key?.slice(0, 5));
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

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': key
        }
      });

      if (!response.ok) throw new Error(`Search failed: ${response.status}`);

      const data = await response.json();
      setResults(data.value || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Search Documents</h2>
      <input
        type="text"
        value={query}
        placeholder="Enter search query"
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '300px', padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={searchAzure} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <ul>
        {results.map((doc, i) => (
          <li key={i}><pre>{JSON.stringify(doc, null, 2)}</pre></li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
