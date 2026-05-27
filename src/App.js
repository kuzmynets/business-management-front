import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import { BusinessProvider, useBusiness } from "./contexts/BusinessContext";
import { redirectByRole } from "./utils/redirectByRole";
import "./i18n";

// PUBLIC
import { LandingPage } from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import { RegisterOwnerPage } from "./pages/RegisterOwnerPage";
import AcceptInvite from "./pages/AcceptInvite";

// OWNER
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Team from "./pages/owner/Team";
import MyBusiness from "./pages/owner/MyBusiness";
import Finance from "./pages/owner/Finance";
import Analytic from "./pages/owner/Analytic";
import Subscribe from "./pages/owner/Subscribe";

// MANAGER
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerOrders from "./pages/manager/Orders/ManagerOrdersPage";
import OrderDetails from "./pages/manager/Orders/OrderDetailsPage";
import ManagerTasksPage from "./pages/manager/Tasks/TasksPage";
import TaskDetailsPage from "./pages/manager/Tasks/TaskDetailsPage";

// EMPLOYEE
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

function ProtectedRoute({ children, roles }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to={redirectByRole(user.role)} />;

    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <BusinessProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </BusinessProvider>
        </AuthProvider>
    );
}

function AppRoutes() {
    const { currentBusiness } = useBusiness();

    return (
        <Routes key={currentBusiness?.id || "no-business"}>

            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterOwnerPage />} />
            <Route path="/accept-invite/:token" element={<AcceptInvite />} />

            {/* OWNER */}
            <Route
                path="/owner/*"
                element={
                    <ProtectedRoute roles={["OWNER"]}>
                        <Routes>
                            <Route path="dashboard" element={<OwnerDashboard />} />
                            <Route path="business" element={<MyBusiness />} />
                            <Route path="team" element={<Team />} />
                            <Route path="finance" element={<Finance />} />
                            <Route path="analytic" element={<Analytic />} />
                            <Route path="subscribe" element={<Subscribe />} />
                            <Route path="*" element={<Navigate to="dashboard" />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* MANAGER */}
            <Route
                path="/manager/*"
                element={
                    <ProtectedRoute roles={["MANAGER"]}>
                        <Routes>
                            <Route path="dashboard" element={<ManagerDashboard />} />
                            <Route path="orders" element={<ManagerOrders />} />
                            <Route path="orders/:id" element={<OrderDetails />} />
                            <Route path="tasks" element={<ManagerTasksPage />} />
                            <Route path="tasks/:id" element={<TaskDetailsPage />} />
                            <Route path="team" element={<Team />} />
                            <Route path="*" element={<Navigate to="dashboard" />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* EMPLOYEE */}
            <Route
                path="/employee/*"
                element={
                    <ProtectedRoute roles={["EMPLOYEE"]}>
                        <Routes>
                            <Route path="dashboard" element={<EmployeeDashboard />} />
                            <Route path="*" element={<Navigate to="dashboard" />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
}
