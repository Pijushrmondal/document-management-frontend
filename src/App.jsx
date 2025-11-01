import { useEffect } from "react";
import config from "./config/config";
import { formatBytes } from "./utils/helpers";
import { formatDate, formatRelativeTime } from "./utils/formatters";
import { isValidEmail } from "./utils/validators";
import apiService from "./services/api";

function App() {
  useEffect(() => {
    // Test config
    console.log("📦 Config:", config);

    // Test helpers
    console.log("📏 Format Bytes:", formatBytes(1048576));
    console.log("📅 Format Date:", formatDate(new Date()));

    // Test formatters
    console.log("⏰ Relative Time:", formatRelativeTime(new Date()));

    // Test validators
    console.log("✉️ Valid Email:", isValidEmail("test@example.com"));

    // Test API health check
    // apiService
    //   .healthCheck()
    //   .then((data) => console.log("❤️ API Health:", data))
    //   .catch((err) => console.error("💔 API Error:", err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Document Management System
        </h1>
        <p className="text-gray-600">
          Foundation setup complete! Check the console for test results.
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-green-600 mr-2">✅</span>
            <span>Config loaded</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 mr-2">✅</span>
            <span>Utils created</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 mr-2">✅</span>
            <span>API service ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
