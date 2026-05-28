import { AuthContextProvider } from "@/context/AuthContext";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import SolutionsPage from "./pages/SolutionsPage";
import PricingPage from "./pages/PricingPage";
import WhyInvictusPage from "./pages/WhyInvictusPage";
import ResourcesPage from "./pages/ResourcesPage";
import AboutPage from "./pages/AboutPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import IndustryDashboard from "./pages/dashboards/IndustryDashboard";
import UnifiedContactsPage from "./pages/dashboards/unified/ContactsPage";
import UnifiedMessagesPage from "./pages/dashboards/unified/MessagesPage";
import UnifiedCalendarPage from "./pages/dashboards/unified/CalendarPage";
import UnifiedSettingsPage from "./pages/dashboards/unified/SettingsPage";
import AnalyticsDashboard from "./pages/dashboards/AnalyticsDashboard";
import LeadsPage from "./pages/LeadsPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }, [location.pathname]);

    return children;
};

export const AppRouter = () => (
    <BrowserRouter>
        <AuthContextProvider>
            <ScrollToTop>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/solutions" element={<SolutionsPage />} />
                    <Route path="/solutions/:industry" element={<SolutionsPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/why-invictus" element={<WhyInvictusPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected routes */}
                    <Route
                        path="/setup"
                        element={
                            <ProtectedRoute requireSetup={false}>
                                <SetupPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Dashboard (consultants only) */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <IndustryDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/:industry"
                        element={
                            <ProtectedRoute>
                                <Navigate to="/dashboard" replace />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/contacts"
                        element={
                            <ProtectedRoute>
                                <UnifiedContactsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/messages"
                        element={
                            <ProtectedRoute>
                                <UnifiedMessagesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/calendar"
                        element={
                            <ProtectedRoute>
                                <UnifiedCalendarPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/settings"
                        element={
                            <ProtectedRoute>
                                <UnifiedSettingsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Leads (protected) */}
                    <Route
                        path="/leads"
                        element={
                            <ProtectedRoute>
                                <LeadsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Analytics */}
                    <Route
                        path="/admin/analytics"
                        element={
                            <ProtectedRoute>
                                <AnalyticsDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ScrollToTop>
        </AuthContextProvider>
    </BrowserRouter>
);

export default AppRouter;
