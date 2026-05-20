import { Search, X } from "lucide-react";

function SearchBar({ query, setQuery }) {
  return (
    <div style={{ padding: "0 2rem 1.25rem" }}>
      <div className="search-shell">
        <Search size={16} color="#534AB7" />
        <input
          type="text"
          placeholder="Buscar titulo, autor, editorial..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button onClick={() => setQuery("")} title="Limpiar busqueda">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
