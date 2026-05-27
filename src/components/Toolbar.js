import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { AuthContext } from "../contexts/AuthContext";
import { useBusiness } from "../contexts/BusinessContext";
import LogoutButton from "./LogoutButton";

export default function Toolbar({ role }) {
    const { user } = useContext(AuthContext);
    const { currentBusiness, businesses, reloadBusinesses, switchBusiness } = useBusiness();
    const [creating, setCreating] = useState(false);

    const handleBusinessChange = (businessId) => {
        switchBusiness(businessId);
    };

    const createBusiness = async () => {
        const name = window.prompt("New business name");
        if (!name?.trim()) return;

        try {
            setCreating(true);
            const created = await apiRequest("/business", {
                method: "POST",
                body: JSON.stringify({ name: name.trim() }),
            });

            switchBusiness(created.id);
            await reloadBusinesses();
        } finally {
            setCreating(false);
        }
    };

    const logo = currentBusiness?.logo_url;

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
                    {currentBusiness?.name || "Business System"}
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
                        <Link className="hover:text-white" to="/manager/team">Team</Link>
                    </>
                )}

                {role === "EMPLOYEE" && (
                    <Link className="hover:text-white" to="/employee/dashboard">Tasks</Link>
                )}
            </nav>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
                {businesses.length > 0 && (
                    <>
                        <select
                            value={currentBusiness?.id || user?.businessId || ""}
                            onChange={(e) => handleBusinessChange(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                        >
                            {businesses.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name || "Business"}
                                </option>
                            ))}
                        </select>

                        {role === "OWNER" && (
                            <button
                                type="button"
                                disabled={creating}
                                onClick={createBusiness}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
                            >
                                {creating ? "Creating..." : "New Business"}
                            </button>
                        )}
                    </>
                )}

                <LogoutButton />
            </div>

        </header>
    );
}
