import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import LoginPage from "./pages/LoginPage";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import {LandingPage} from "./pages/LandingPage";
import {RegisterOwnerPage} from "./pages/RegisterOwnerPage";
import Team from "./pages/owner/Team";
import AcceptInvite from "./pages/AcceptInvite";
import ProjectDetails from "./pages/manager/ProjectDetails";
import TasksPage from "./pages/manager/TaskPage";
import OrdersPage from "./pages/manager/OrdersPage";
import MyBusiness from "./pages/owner/MyBusiness";
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
                    <Route path="/accept-invite/:token" element={<AcceptInvite />} />
                    <Route path="/manager/projects/:id" element={<ProjectDetails />} />
                    <Route path="/manager/tasks" element={<TasksPage />} />
                    <Route path="/manager/orders" element={<OrdersPage />} />

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
                        path="/employee/dashboard"
                        element={
                            <ProtectedRoute role="EMPLOYEE">
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/owner/team"
                        element={
                            <ProtectedRoute roles={["OWNER"]}>
                                <Team />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/owner/business"
                        element={
                            <ProtectedRoute roles={["OWNER"]}>
                                <MyBusiness />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

            </BrowserRouter>
        </AuthProvider>
    );
}