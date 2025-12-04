import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import SplashScreen from "./pages/SplashScreen";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// LHV Pages
import SurveyListPage from "./pages/lhv/SurveyListPage";
import SurveyDetailPage from "./pages/lhv/SurveyDetailPage";
import VisitsPage from "./pages/lhv/VisitsPage";
import ReportsPage from "./pages/lhv/ReportsPage";

// Pharmacist Pages
import IssueMedicinePage from "./pages/pharmacist/IssueMedicinePage";
import StockManagementPage from "./pages/pharmacist/StockManagementPage";

// Admin Pages
import StaffManagementPage from "./pages/admin/StaffManagementPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// Routing Components
import RoleBasedDashboard from "./components/routing/RoleBasedDashboard";
import ProtectedRoute from "./components/routing/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* LHV / ANM Routes */}
            <Route
              path="/surveys"
              element={
                <ProtectedRoute allowedRoles={['LHV', 'ANM', 'ASHA_SUPERVISOR']}>
                  <SurveyListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surveys/:id"
              element={
                <ProtectedRoute allowedRoles={['LHV', 'ANM', 'ASHA_SUPERVISOR']}>
                  <SurveyDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visits"
              element={
                <ProtectedRoute allowedRoles={['LHV', 'ANM', 'ASHA_SUPERVISOR']}>
                  <VisitsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['LHV', 'ANM', 'ASHA_SUPERVISOR']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Pharmacist Routes */}
            <Route
              path="/pharmacy/issue"
              element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                  <IssueMedicinePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/stock"
              element={
                <ProtectedRoute allowedRoles={['PHARMACIST']}>
                  <StockManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <StaffManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff/new"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <StaffManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mappings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
