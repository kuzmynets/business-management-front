import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Toolbar({ role }) {
    return (
        <div className="h-14 bg-gray-900 text-white flex items-center justify-between px-6">
            <div className="flex gap-4 text-sm">
                {role === "OWNER" && (
                    <>
                        <Link to="/owner/business">My Business</Link>
                        <Link to="/owner/dashboard">Dashboard</Link>
                        <Link to="/owner/finance">Finance</Link>
                        <Link to="/owner/team">Team</Link>
                        <Link to="/owner/analytic">Analytic</Link>
                        <Link to="/owner/subscribe">Subscribe</Link>
                    </>
                )}

                {role === "MANAGER" && (
                    <>
                        <Link to="/manager/dashboard">Dashboard</Link>
                        <Link to="/manager/orders">Orders</Link>
                        <Link to="/manager/tasks">Tasks</Link>
                    </>
                )}

                {role === "EMPLOYEE" && (
                    <Link to="/employee/tasks">My Tasks</Link>
                )}
            </div>

            <LogoutButton />
        </div>
    );
}
