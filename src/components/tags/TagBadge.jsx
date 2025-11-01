// src/components/tags/TagBadge.jsx

import Badge from "../common/Badge";

function TagBadge({ tag, onRemove = null, variant = "default", size = "md" }) {
  return (
    <Badge variant={variant} size={size}>
      <span className="flex items-center">
        {tag}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(tag);
            }}
            className="ml-2 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        )}
      </span>
    </Badge>
  );
}

export default TagBadge;
