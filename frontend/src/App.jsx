import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DocumentosPage from "./pages/DocumentosPage";
import NotificacionesPage from "./pages/NotificacionesPage";
import AdminPage from "./pages/AdminPage";
import FirmaPage from "./pages/FirmaPage";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);

  // Mostrar loading mientras se verifica
  if (checking || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    console.log("🔒 No autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  console.log("🔒 Autenticado, mostrando children");
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documentos"
        element={
          <ProtectedRoute>
            <DocumentosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notificaciones"
        element={
          <ProtectedRoute>
            <NotificacionesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/firma/:id"
        element={
          <ProtectedRoute>
            <FirmaPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
