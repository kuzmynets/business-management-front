import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import LoginPage from "./pages/LoginPage";
import OwnerDashboard from "./pages/owner/Dashboard";
import ManagerDashboard from "./pages/manager/Dashboard";
import EmployeeTasks from "./pages/employee/MyTasks";
import {LandingPage} from "./pages/LandingPage";
import {RegisterOwnerPage} from "./pages/RegisterOwnerPage";

function ProtectedRoute({ children, roles }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;

    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterOwnerPage />} />

                    <Route
                        path="/owner/dashboard"
                        element={
                            <ProtectedRoute roles={["OWNER"]}>
                                <OwnerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/manager/dashboard"
                        element={
                            <ProtectedRoute roles={["MANAGER"]}>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/employee/tasks"
                        element={
                            <ProtectedRoute roles={["EMPLOYEE"]}>
                                <EmployeeTasks />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

            </BrowserRouter>
        </AuthProvider>
    );
}