// src/components/common/Card.jsx

function Card({
  children,
  title = null,
  subtitle = null,
  footer = null,
  className = "",
  padding = "md",
  hover = false,
}) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClass = hover ? "hover:shadow-lg transition-shadow" : "";

  return (
    <div className={`bg-white rounded-lg shadow ${hoverClass} ${className}`}>
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingClasses[padding]}`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div className={paddingClasses[padding]}>{children}</div>

      {footer && (
        <div
          className={`border-t border-gray-200 ${paddingClasses[padding]} bg-gray-50`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
