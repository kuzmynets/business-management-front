import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Додав useLocation для підсвічування активного пункту
import { apiRequest } from "../api/client";
import { AuthContext } from "../contexts/AuthContext";
import { useBusiness } from "../contexts/BusinessContext";
import LogoutButton from "./LogoutButton";

export default function Toolbar({ role }) {
    const { user } = useContext(AuthContext);
    const { currentBusiness, businesses, reloadBusinesses, switchBusiness } = useBusiness();
    const location = useLocation();

    const [creating, setCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Стейт для мобільного меню
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

    // Виніс лінки в масив, щоб не дублювати верстку для десктопу та мобілки
    const getNavLinks = () => {
        if (role === "OWNER") {
            return [
                { to: "/owner/dashboard", label: "Панель" },
                { to: "/owner/business", label: "Бізнес" },
                { to: "/owner/finance", label: "Фінанси" },
                { to: "/owner/team", label: "Команда" },
                { to: "/owner/analytic", label: "Аналітика" },
                { to: "/owner/subscribe", label: "Підписка" },
            ];
        }
        if (role === "MANAGER") {
            return [
                { to: "/manager/dashboard", label: "Панель" },
                { to: "/manager/orders", label: "Замовлення" },
                { to: "/manager/tasks", label: "Завдання" },
                { to: "/manager/team", label: "Команда" },
            ];
        }
        if (role === "EMPLOYEE") {
            return [{ to: "/employee/dashboard", label: "Завдання" }];
        }
        return [];
    };

    const navLinks = getNavLinks();

    return (
        <>
            <header className="w-full bg-gray-900 text-white shadow-md sticky top-0 z-40">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">

                    {/* LEFT: Logo & Burger */}
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Burger Button (Mobile only) */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-800 focus:outline-none shrink-0"
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <div className="w-9 h-9 flex items-center justify-center text-xs shrink-0">
                            {logo ? (
                                <img src={logo} alt="logo" className="w-full h-full object-contain rounded" />
                            ) : (
                                <div className="w-full h-full bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold tracking-wider">
                                    CRM
                                </div>
                            )}
                        </div>

                        {/* Business Name */}
                        <div className="min-w-0">
                            <div className="font-semibold text-sm sm:text-base truncate max-w-[140px] sm:max-w-[200px]">
                                {currentBusiness?.name || "Система бізнесу"}
                            </div>
                        </div>
                    </div>

                    {/* CENTER: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm text-gray-300">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                                        isActive ? "bg-gray-800 text-white" : "hover:text-white hover:bg-gray-800/50"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* RIGHT: Desktop Actions / Mobile Profile Quick view */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Business Selector (Hidden on mobile header, moved to drawer) */}
                        {businesses?.length > 0 && (
                            <div className="hidden sm:block">
                                <select
                                    value={currentBusiness?.id || user?.businessId || ""}
                                    onChange={(e) => handleBusinessChange(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium text-white min-h-[38px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {businesses.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* New Business (Hidden on mobile header) */}
                        {role === "OWNER" && (
                            <button
                                onClick={openModal}
                                className="hidden sm:flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors min-h-[38px]"
                            >
                                + Новий бізнес
                            </button>
                        )}

                        {/* Role Badge (Desktop only) */}
                        <span className="hidden lg:inline-block text-[11px] bg-gray-800 text-gray-400 px-2 py-1 rounded font-semibold tracking-wider uppercase border border-gray-700">
                            {role}
                        </span>

                        <div className="min-h-[44px] flex items-center">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE NAVIGATION DRAWER (Шторка) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="fixed inset-y-0 left-0 w-full max-w-[300px] bg-gray-950 p-5 flex flex-col justify-between shadow-2xl border-r border-gray-800 animate-slide-right">
                        <div className="space-y-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded font-bold uppercase tracking-wider">
                                        {role}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-900 text-gray-400 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Business Selector (If available) */}
                            {businesses?.length > 0 && (
                                <div className="space-y-1.5 sm:hidden">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Поточний бізнес</label>
                                    <select
                                        value={currentBusiness?.id || user?.businessId || ""}
                                        onChange={(e) => {
                                            handleBusinessChange(e.target.value);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-3 text-base font-medium text-white min-h-[48px]"
                                    >
                                        {businesses.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <nav className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-1">Навігація</span>
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.to;
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center px-3 min-h-[48px] rounded-xl text-base font-medium transition-all ${
                                                isActive
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Bottom Actions */}
                        {role === "OWNER" && (
                            <div className="pt-4 border-t border-gray-800 sm:hidden">
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        openModal();
                                    }}
                                    className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-medium py-3 rounded-xl text-base min-h-[48px]"
                                >
                                    + Створити новий бізнес
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL (Вже оптимізоване під Mobile-First) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
                    <div className="bg-white w-full sm:max-w-md p-5 sm:p-6 rounded-t-2xl sm:rounded-2xl space-y-5 shadow-xl text-gray-900">
                        <div className="space-y-1">
                            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Створення бізнесу</h2>
                            <p className="text-xs text-gray-500">Вкажіть назву вашої нової компанії.</p>
                        </div>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Назва бізнесу"
                            className="w-full border border-gray-300 px-3 py-3 sm:py-2 rounded-lg text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-2">
                            <button
                                onClick={closeModal}
                                className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white min-h-[44px]"
                            >
                                Назад
                            </button>
                            <button
                                onClick={createBusiness}
                                disabled={creating}
                                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold min-h-[44px] disabled:bg-gray-300"
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