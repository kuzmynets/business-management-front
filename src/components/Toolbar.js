import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import LogoutButton from "./LogoutButton";

export default function Toolbar({ role }) {
    const [business, setBusiness] = useState(null);

    useEffect(() => {
        loadBusiness();
    }, []);

    const loadBusiness = async () => {
        try {
            const data = await apiRequest("/business");
            setBusiness(data || null);
        } catch {
            setBusiness(null);
        }
    };

    const logo = business?.logo_url;

    return (
        <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-6 shadow">

            {/* LEFT */}
            <div className="flex items-center gap-3">

                {logo ? (
                    <img
                        src={logo}
                        alt="logo"
                        className="w-8 h-8 rounded object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                        CRM
                    </div>
                )}

                <div className="font-semibold text-sm tracking-wide">
                    Business System
                </div>

                <div className="text-xs text-gray-400 ml-2">
                    {role}
                </div>
            </div>

            {/* CENTER NAV */}
            <nav className="flex gap-5 text-sm text-gray-200">
                {role === "OWNER" && (
                    <>
                        <Link className="hover:text-white" to="/owner/dashboard">Dashboard</Link>
                        <Link className="hover:text-white" to="/owner/business">Business</Link>
                        <Link className="hover:text-white" to="/owner/finance">Finance</Link>
                        <Link className="hover:text-white" to="/owner/team">Team</Link>
                        <Link className="hover:text-white" to="/owner/analytic">Analytics</Link>
                        <Link className="hover:text-white" to="/owner/subscribe">Subscription</Link>
                    </>
                )}

                {role === "MANAGER" && (
                    <>
                        <Link className="hover:text-white" to="/manager/dashboard">Dashboard</Link>
                        <Link className="hover:text-white" to="/manager/orders">Orders</Link>
                        <Link className="hover:text-white" to="/manager/tasks">Tasks</Link>
                    </>
                )}

                {role === "EMPLOYEE" && (
                    <Link className="hover:text-white" to="/employee/tasks">Tasks</Link>
                )}
            </nav>

            {/* RIGHT */}
            <div>
                <LogoutButton />
            </div>

        </header>
    );
}