import React from 'react';
import SearchComponent from './SearchComponent'; // Assumes it's in src/

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Compendium Document Search</h1>
      <SearchComponent />
    </div>
  );
}

export default App;
// trigger rebuild
