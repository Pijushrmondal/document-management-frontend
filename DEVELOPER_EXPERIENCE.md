# Developer Experience & Documentation

This document covers the developer-friendly features and tools we've built into the frontend to make your life easier when working on this codebase. Whether you're adding new features, fixing bugs, or just trying to understand how things work, this guide should help.

## What's Inside

The frontend is structured to make development smooth and maintainable. We've put together a collection of utilities, helpers, and patterns that you'll find yourself using regularly. Most of these are already being used throughout the app, so you'll see them in action as you explore the codebase.

## Utility Functions

### Formatters (`src/utils/formatters.js`)

We've got a solid set of formatting functions that handle all the common cases you'll run into. These are used throughout the UI to display data consistently.

**Date & Time Formatting:**
- `formatDate()` - Format dates in various formats (full, short, date-only, time-only)
- `formatRelativeTime()` - Human-readable relative time ("2 hours ago", "3 days ago")
- `isToday()`, `isOverdue()`, `daysUntil()` - Date comparison helpers

**File Formatting:**
- `formatFileSize()` - Convert bytes to readable format (KB, MB, GB)
- `formatDuration()` - Convert seconds to readable time (e.g., "2h 15m 30s")

**Number & Currency:**
- `formatCurrency()` - Format numbers as currency
- `formatPercentage()` - Format numbers as percentages
- `formatCompactNumber()` - Format large numbers with K/M/B suffixes (e.g., "1.5M")

**Text Formatting:**
- `formatEmail()`, `formatPhoneNumber()`, `formatUrl()` - Format common data types
- `formatList()` - Convert arrays to readable lists ("item1, item2, and item3")
- `formatTagName()`, `formatDisplayName()` - Tag name transformations
- `pluralize()` - Smart pluralization based on count

**Example Usage:**
```javascript
import { formatFileSize, formatRelativeTime, formatCurrency } from '../utils/formatters';

// Display file size
const size = formatFileSize(15728640); // "15 MB"

// Show relative time
const time = formatRelativeTime(document.createdAt); // "2 hours ago"

// Format currency
const price = formatCurrency(99.99); // "$99.99"
```

### Helpers (`src/utils/helpers.js`)

These are the workhorse functions you'll use for common operations. Nothing fancy, just reliable utilities that do their job well.

**File Operations:**
- `getFileExtension()` - Extract file extension from filename
- `getFileNameWithoutExtension()` - Get filename without extension
- `formatBytes()` - Another file size formatter (same as formatters, kept for backwards compatibility)
- `downloadFile()` - Trigger file download

**String Manipulation:**
- `truncateText()` - Truncate long strings with ellipsis
- `capitalizeFirst()` - Capitalize first letter
- `camelToTitle()`, `snakeToTitle()` - Case conversion helpers

**User & Role Checks:**
- `hasRole()`, `isAdmin()`, `isAdminOrSupport()` - Role checking utilities

**Storage:**
- `getFromStorage()`, `saveToStorage()`, `removeFromStorage()` - localStorage helpers
- `clearStorage()` - Clear all app data from localStorage

**JWT Handling:**
- `parseJWT()` - Decode JWT token
- `isTokenExpired()` - Check if token is expired

**Async Utilities:**
- `debounce()`, `throttle()` - Rate limiting functions
- `sleep()` - Delay function for async operations

**Data Manipulation:**
- `deepClone()` - Deep clone objects
- `generateId()` - Generate unique IDs
- `groupBy()` - Group array by key
- `removeDuplicates()` - Remove duplicates from arrays
- `sortBy()` - Sort arrays of objects

**Other Utilities:**
- `isEmpty()`, `isEmptyObject()` - Empty value checks
- `copyToClipboard()` - Copy text to clipboard
- `formatNumber()` - Format numbers with commas
- `calculatePercentage()` - Calculate percentages
- `getRandomColor()` - Get random Tailwind color class

**Example Usage:**
```javascript
import { truncateText, debounce, groupBy } from '../utils/helpers';

// Truncate long text
const short = truncateText("This is a very long string", 20); // "This is a very long..."

// Debounce search input
const debouncedSearch = debounce((query) => {
  searchDocuments(query);
}, 300);

// Group documents by folder
const grouped = groupBy(documents, 'folderName');
```

### Validators (`src/utils/validators.js`)

Validation is critical for data integrity, and we've built a comprehensive validation system that covers most common scenarios.

**Basic Validators:**
- `isValidEmail()` - Email format validation
- `isValidPhone()` - Phone number validation
- `isValidUrl()` - URL validation
- `isValidDate()`, `validateFutureDate()` - Date validation

**File Validation:**
- `isValidFileType()` - Check if file type is allowed
- `isValidFileSize()` - Check if file size is within limits
- `validateFile()` - Comprehensive file validation (type + size)
- `validateFiles()` - Validate multiple files

**Field Validation:**
- `validateRequired()` - Check if field is required
- `validateLength()` - Validate string length
- `validateRange()` - Validate number range

**Domain-Specific Validators:**
- `validateTagName()` - Tag name format validation
- `validateActionScope()` - Action scope validation
- `validateTaskData()` - Complete task validation
- `validateWebhookData()` - Webhook validation

**Form Validation:**
- `validateForm()` - Comprehensive form validation with rules

**Example Usage:**
```javascript
import { validateFile, validateForm, isValidEmail } from '../utils/validators';

// Validate file upload
const fileValidation = validateFile(file);
if (!fileValidation.valid) {
  showError(fileValidation.error);
}

// Validate form
const rules = {
  email: { required: true, email: true, label: 'Email Address' },
  name: { required: true, minLength: 3, maxLength: 50, label: 'Full Name' }
};
const result = validateForm(formData, rules);
if (!result.valid) {
  setErrors(result.errors);
}
```

### Permissions (`src/utils/permissions.js`)

The permissions system is built around role-based access control (RBAC). We've created a simple, centralized way to check permissions throughout the app.

**Permission Methods:**
- `Permissions.canWrite()` - Check if user can perform write operations
- `Permissions.isReadOnly()` - Check if user has read-only access
- `Permissions.hasFullAccess()` - Check if user is admin
- `Permissions.canRunActions()` - Check if user can run AI actions
- `Permissions.canViewMetrics()` - Check if user can view metrics
- `Permissions.canViewAudit()` - Check if user can view audit logs
- `Permissions.canViewWebhooks()` - Check if user can view webhooks
- `Permissions.canManageUsers()` - Check if user can manage other users

**Example Usage:**
```javascript
import { Permissions } from '../utils/permissions';

const canWrite = Permissions.canWrite(user.role);
const isReadOnly = Permissions.isReadOnly(user.role);

// In JSX
{canWrite && (
  <Button onClick={handleDelete}>Delete</Button>
)}
```

## API Service

### Centralized API Client (`src/services/api.js`)

We've built a robust API service that handles all the common HTTP operations, error handling, and authentication automatically. You won't need to worry about tokens, error codes, or response parsing - it's all handled for you.

**Features:**
- Automatic token injection in requests
- Token expiration checking
- Automatic redirect to login on 401 errors
- Comprehensive error handling with user-friendly messages
- Request/response logging in development mode
- File upload with progress tracking
- File download handling
- Batch request support

**Available Methods:**
- `get(url, params, config)` - GET request
- `post(url, data, config)` - POST request
- `put(url, data, config)` - PUT request
- `patch(url, data, config)` - PATCH request
- `delete(url, config)` - DELETE request
- `upload(url, formData, onUploadProgress)` - File upload with progress
- `download(url, filename)` - Download file
- `batch(requests)` - Execute multiple requests in parallel
- `healthCheck()` - Check API health

**Error Handling:**
The API service automatically handles common HTTP errors:
- `401` - Unauthorized (redirects to login)
- `403` - Forbidden (shows permission error)
- `404` - Not found
- `409` - Conflict
- `413` - File too large
- `422` - Validation error
- `429` - Rate limit
- `500+` - Server errors

**Example Usage:**
```javascript
import apiService from '../services/api';

// Simple GET request
const documents = await apiService.get('/docs', { page: 1, limit: 20 });

// POST with data
const newDoc = await apiService.post('/docs', { filename: 'test.pdf' });

// File upload with progress
await apiService.upload('/docs/upload', formData, (progress) => {
  setUploadProgress(progress);
});

// Batch requests
const results = await apiService.batch([
  { method: 'get', url: '/docs' },
  { method: 'get', url: '/tasks' }
]);
```

## Component Library

We've built a set of reusable components that maintain consistency across the app. These are located in `src/components/common/` and are used throughout the application.

### Common Components

**Button** - Consistent button styling with variants (primary, outline, danger) and sizes
**Card** - Container component for content sections
**Modal** - Reusable modal/dialog component
**Alert** - Alert messages for notifications
**Badge** - Status badges and labels
**LoadingSpinner** - Loading indicators
**EmptyState** - Empty state displays
**Pagination** - Pagination controls
**SearchBar** - Search input component
**Table** - Data table component
**Tabs** - Tab navigation component
**ProgressBar** - Progress indicators
**ConfirmDialog** - Confirmation dialogs
**Dropdown** - Dropdown menu component

**Example Usage:**
```javascript
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';

// Button variants
<Button variant="primary">Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="danger">Delete</Button>

// Card component
<Card title="Documents" subtitle="Your uploaded files">
  {/* Card content */}
</Card>

// Modal
<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
  {/* Modal content */}
</Modal>
```

## State Management

We're using Redux Toolkit for state management, which makes working with Redux much simpler. The state is organized into domain-specific slices.

### Redux Slices (`src/store/slices/`)

Each slice handles state for a specific domain:
- `authSlice.js` - Authentication and user state
- `documentSlice.js` - Document management
- `tagSlice.js` - Tags and folders
- `taskSlice.js` - Tasks
- `actionSlice.js` - AI actions
- `webhookSlice.js` - Webhooks
- `auditSlice.js` - Audit logs
- `metricsSlice.js` - Metrics and statistics
- `uiSlice.js` - UI state (modals, loading, etc.)

Each slice follows a consistent pattern with async thunks for API calls and reducers for state updates.

**Example Usage:**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments, selectDocuments } from '../store/slices/documentSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const documents = useSelector(selectDocuments);

  useEffect(() => {
    dispatch(fetchDocuments({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <div>
      {documents.map(doc => (
        <div key={doc.id}>{doc.filename}</div>
      ))}
    </div>
  );
}
```

## Development Tools

### Request/Response Logging

In development mode, the API service automatically logs all requests and responses to the console. This makes debugging API calls much easier. You'll see:
- Request method, URL, and data
- Response status and data
- Error details when requests fail

To enable/disable logging, check the `config.dev.enableLogger` setting in `src/config/config.js`.

### Error Handling

Errors are handled consistently throughout the app:
- API errors are caught and formatted with user-friendly messages
- Network errors are detected and handled
- Validation errors are displayed inline in forms
- Permission errors show clear messages about access restrictions

## Configuration

Configuration is centralized in `src/config/config.js`. This includes:
- API base URL and timeout
- File upload settings (allowed types, max size)
- Feature flags
- Development settings

## Best Practices

Here are some patterns we follow to keep the code maintainable:

1. **Use the utility functions** - Don't reinvent the wheel. Check the formatters, helpers, and validators before writing your own.

2. **Use the API service** - Always use `apiService` instead of direct axios calls. It handles authentication and errors automatically.

3. **Follow component patterns** - When creating new components, follow the patterns used in existing components.

4. **Use Redux for global state** - Keep local component state local, but use Redux for shared state.

5. **Validate early** - Use validators before sending data to the API.

6. **Handle errors gracefully** - Always show user-friendly error messages.

7. **Check permissions** - Use the Permissions utility to check access before showing/hiding UI elements.

## Getting Help

If you're stuck or need clarification on how something works:

1. Check the existing code - Most patterns are already in use somewhere in the codebase
2. Look at similar components - See how other pages/components handle similar scenarios
3. Check the service files - They show how API calls are structured
4. Review the Redux slices - They demonstrate state management patterns

## Contributing

When adding new features:

1. **Add utilities if needed** - If you find yourself writing the same helper function multiple times, add it to the appropriate utility file.

2. **Update validators** - If you're creating new forms, add validators for the new fields.

3. **Follow naming conventions** - Use camelCase for functions, PascalCase for components.

4. **Keep components focused** - Each component should do one thing well.

5. **Document complex logic** - Add comments for non-obvious code.

6. **Test your changes** - Make sure existing functionality still works.

---

That's about it! The codebase is structured to be developer-friendly, and these tools should make your life easier. If you find yourself doing something repetitive or feeling like there should be a better way, there probably is - check the utilities first!

