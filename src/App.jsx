// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/slices/authSlice";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentDetails from "./pages/DocumentDetails";
import Folders from "./pages/Folders";
import FolderDetails from "./pages/FolderDetails";
import Actions from "./pages/Actions";
import ActionDetails from "./pages/ActionDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Webhooks from "./pages/Webhooks";
import WebhookDetails from "./pages/WebhookDetails";
import Audit from "./pages/Audit";
import AuditDetails from "./pages/AuditDetails";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Protected Routes with Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Documents />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DocumentDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/folders"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Folders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/folders/:name"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FolderDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/actions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Actions />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/actions/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ActionDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Tasks />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TaskDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />

        <Route
          path="/webhooks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Webhooks />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/webhooks/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <WebhookDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Audit />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AuditDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
