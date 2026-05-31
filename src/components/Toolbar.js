import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import { AuthContext } from "../contexts/AuthContext";
import { useBusiness } from "../contexts/BusinessContext";
import LogoutButton from "./LogoutButton";
import {imageListClasses} from "@mui/material";

export default function Toolbar({ role }) {
    const { user } = useContext(AuthContext);
    const { currentBusiness, businesses, reloadBusinesses, switchBusiness } = useBusiness();

    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const logo = currentBusiness?.logo_url;

    const handleBusinessChange = (businessId) => {
        switchBusiness(businessId);
    };

    const openModal = () => {
        setName("");
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setName("");
    };

    const createBusiness = async () => {
        if (!name.trim()) return;

        try {
            setCreating(true);

            const created = await apiRequest("/business", {
                method: "POST",
                body: JSON.stringify({ name: name.trim() }),
            });

            switchBusiness(created.id);
            await reloadBusinesses();

            closeModal();
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-6 shadow">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                        {<img src={logo}/> || "CRM"}
                    </div>

                    <div className="font-semibold text-sm">
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

                    {businesses?.length > 0 && (
                        <select
                            value={currentBusiness?.id || user?.businessId || ""}
                            onChange={(e) => handleBusinessChange(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                        >
                            {businesses.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {role === "OWNER" && (
                        <button
                            onClick={openModal}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                        >
                            New Business
                        </button>
                    )}

                    <LogoutButton />

                </div>
            </header>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-96 p-6 rounded-xl space-y-4">

                        <h2 className="text-lg font-semibold">
                            Створити новий бізнес
                        </h2>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Назва бізнесу"
                            className="w-full border px-3 py-2 rounded"
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={closeModal}
                                className="px-3 py-2 border rounded"
                            >
                                Назад
                            </button>

                            <button
                                onClick={createBusiness}
                                disabled={creating}
                                className="px-3 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                            >
                                {creating ? "Створення..." : "Створити"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}