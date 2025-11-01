// src/components/tags/TagSelector.jsx

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTags,
  selectTags,
  selectTagLoading,
} from "../../store/slices/tagSlice";
import TagBadge from "./TagBadge";
import LoadingSpinner from "../common/LoadingSpinner";

function TagSelector({
  selectedTags = [],
  onTagsChange,
  label = "Tags",
  showCreateOption = false,
}) {
  const dispatch = useDispatch();
  const allTags = useSelector(selectTags);
  const loading = useSelector(selectTagLoading);

  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const handleAddTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const filteredTags = allTags
    .filter(
      (tag) =>
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag.name)
    )
    .slice(0, 5);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Type to search or create tags..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && inputValue && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 flex justify-center">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <>
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag.name)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-900">{tag.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4">
                    {showCreateOption ? (
                      <button
                        onClick={() => handleAddTag(inputValue.trim())}
                        className="w-full text-left text-sm text-blue-600 hover:text-blue-700"
                      >
                        Create "{inputValue.trim()}"
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">No tags found</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTags.map((tag, index) => (
            <TagBadge key={index} tag={tag} onRemove={handleRemoveTag} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TagSelector;
