import React, { useState } from 'react';

const decodeBase64 = (encoded) => {
  try {
    return atob(encoded);
  } catch (e) {
    return '[Invalid Link]';
  }
};

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

      console.log("🔎 Search URL:", url);
      console.log("🔐 API key starts with:", key?.slice(0, 5));

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': key
        }
      });

      if (!response.ok) throw new Error(`Search failed with status ${response.status}`);
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
      <h2>Search Compendium Docs</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type keywords or * to show all"
          style={{ width: '300px', padding: '0.5rem' }}
        />
        <button onClick={searchAzure} disabled={loading} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div>
        {results.map((doc, i) => {
          const pdfUrl = decodeBase64(doc.metadata_pdfs);
          const preview = doc.content?.slice(0, 300) || '';

          return (
            <div key={i} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <h4>Document {i + 1}</h4>
              <p><strong>PDF:</strong> <a href={pdfUrl} target="_blank" rel="noopener noreferrer">{pdfUrl}</a></p>
              <p><strong>Preview:</strong> {preview}...</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchComponent;
