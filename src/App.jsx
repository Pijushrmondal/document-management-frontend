// src/App.jsx

import { useSelector } from "react-redux";

function App() {
  // Test Redux connection
  const reduxState = useSelector((state) => state);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 Document Management System
        </h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ✅ Session 1: Foundation Complete
            </h2>
            <ul className="space-y-1 text-sm text-gray-600 ml-4">
              <li>✓ Config & Constants</li>
              <li>✓ Utils & Helpers</li>
              <li>✓ Formatters & Validators</li>
              <li>✓ File Helpers</li>
              <li>✓ API Service</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ✅ Session 2: Redux Store Complete
            </h2>
            <ul className="space-y-1 text-sm text-gray-600 ml-4">
              <li>✓ Redux Store Configuration</li>
              <li>✓ Error Middleware</li>
              <li>✓ Logger Middleware</li>
              <li>✓ Provider Setup</li>
              <li>✓ Toast Notifications</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">
              Redux State (Empty for now):
            </h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(reduxState, null, 2)}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Next:</strong> Session 3 - Auth Module (Login, User State,
              Protected Routes)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
