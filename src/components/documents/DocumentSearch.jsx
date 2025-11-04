// src/components/documents/DocumentSearch.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchDocuments,
  clearSearchResults,
  selectSearching,
} from "../../store/slices/documentSlice";
import Button from "../common/Button";
import SearchBar from "../common/SearchBar";

function DocumentSearch({ onSearch }) {
  const dispatch = useDispatch();
  const searching = useSelector(selectSearching);

  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("folder"); // folder or files
  const [scopeValue, setScopeValue] = useState("");

  const handleSearch = async () => {
    if (!query.trim() || !scopeValue.trim()) return;

    const ids =
      scope === "folder"
        ? [scopeValue]
        : scopeValue.split(",").map((id) => id.trim());

    try {
      const result = await dispatch(searchDocuments({ query, scope, ids })).unwrap();
      // Log for debugging
      if (import.meta.env.DEV) {
        console.log('Search completed:', { query, scope, ids, result });
      }
      if (onSearch) onSearch();
    } catch (error) {
      console.error("Search failed:", error);
      // Still call onSearch to show error state
      if (onSearch) onSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    setScopeValue("");
    dispatch(clearSearchResults());
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <SearchBar
            placeholder="Search documents..."
            onSearch={setQuery}
            debounceDelay={0}
          />
        </div>

        {/* Scope Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search In
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="folder">Folder</option>
            <option value="files">Specific Files</option>
          </select>
        </div>
      </div>

      {/* Scope Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {scope === "folder"
            ? "Folder Name"
            : "Document IDs (comma-separated)"}
        </label>
        <input
          type="text"
          value={scopeValue}
          onChange={(e) => setScopeValue(e.target.value)}
          placeholder={
            scope === "folder"
              ? "e.g., invoices-2025"
              : "e.g., doc1, doc2, doc3"
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={handleSearch}
          loading={searching}
          disabled={!query.trim() || !scopeValue.trim()}
        >
          🔍 Search
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}

export default DocumentSearch;
