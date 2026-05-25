import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function Finance() {

    const { user } = useContext(AuthContext);

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [syncLoading, setSyncLoading] = useState(false);
    const [error, setError] = useState("");

    const [typeFilter, setTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        loadFinance();
    }, []);

    const loadFinance = async () => {

        try {

            setLoading(true);

            const data = await apiRequest("/finance");

            setTransactions(
                Array.isArray(data?.transactions)
                    ? data.transactions
                    : []
            );

        } catch {
            setError("Failed to load finance data");
        } finally {
            setLoading(false);
        }
    };

    const syncOrders = async () => {

        try {

            setSyncLoading(true);

            await apiRequest("/finance/sync-orders", {
                method: "POST"
            });

            await loadFinance();

        } catch {
            setError("Failed to sync order transactions");
        } finally {
            setSyncLoading(false);
        }
    };

    const filteredTransactions = useMemo(() => {

        return transactions.filter(transaction => {

            if (
                typeFilter &&
                transaction.type !== typeFilter
            ) {
                return false;
            }

            if (
                categoryFilter &&
                transaction.category !== categoryFilter
            ) {
                return false;
            }

            if (
                dateFrom &&
                transaction.date &&
                new Date(transaction.date) < new Date(dateFrom)
            ) {
                return false;
            }

            if (
                dateTo &&
                transaction.date &&
                new Date(transaction.date) > new Date(dateTo)
            ) {
                return false;
            }

            return true;

        });

    }, [
        transactions,
        typeFilter,
        categoryFilter,
        dateFrom,
        dateTo
    ]);

    const income = filteredTransactions
        .filter(t => t.type === "INCOME")
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const expenses = filteredTransactions
        .filter(t => t.type === "EXPENSE")
        .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const profit = income - expenses;

    const categories = [
        ...new Set(
            transactions
                .map(t => t.category)
                .filter(Boolean)
        )
    ];

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">

                <div className="max-w-7xl mx-auto space-y-6">

                    {/* HEADER */}

                    <div className="flex items-center justify-between">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Finance
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Income, expenses and profit overview
                            </p>

                        </div>

                        <button
                            onClick={syncOrders}
                            disabled={syncLoading}
                            className={`px-4 py-2 rounded-lg text-white ${
                                syncLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {syncLoading
                                ? "Syncing..."
                                : "Sync Orders"}
                        </button>

                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* BALANCE */}

                    <div className="grid md:grid-cols-3 gap-4">

                        <div className="bg-white rounded-2xl shadow p-6">

                            <div className="text-sm text-gray-500">
                                Total Income
                            </div>

                            <div className="text-3xl font-bold text-green-600 mt-2">
                                ${income.toFixed(2)}
                            </div>

                        </div>

                        <div className="bg-white rounded-2xl shadow p-6">

                            <div className="text-sm text-gray-500">
                                Total Expenses
                            </div>

                            <div className="text-3xl font-bold text-red-600 mt-2">
                                ${expenses.toFixed(2)}
                            </div>

                        </div>

                        <div className="bg-white rounded-2xl shadow p-6">

                            <div className="text-sm text-gray-500">
                                Profit
                            </div>

                            <div className={`text-3xl font-bold mt-2 ${
                                profit >= 0
                                    ? "text-blue-600"
                                    : "text-red-600"
                            }`}>
                                ${profit.toFixed(2)}
                            </div>

                        </div>

                    </div>

                    {/* FILTERS */}

                    <div className="bg-white rounded-2xl shadow p-5">

                        <div className="grid md:grid-cols-4 gap-4">

                            <div>

                                <label className="block text-sm text-gray-500 mb-1">
                                    Transaction Type
                                </label>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="">
                                        All
                                    </option>

                                    <option value="INCOME">
                                        Income
                                    </option>

                                    <option value="EXPENSE">
                                        Expense
                                    </option>

                                </select>

                            </div>

                            <div>

                                <label className="block text-sm text-gray-500 mb-1">
                                    Category
                                </label>

                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="">
                                        All
                                    </option>

                                    {categories.map(category => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            <div>

                                <label className="block text-sm text-gray-500 mb-1">
                                    Date From
                                </label>

                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>

                            <div>

                                <label className="block text-sm text-gray-500 mb-1">
                                    Date To
                                </label>

                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>

                        </div>

                    </div>

                    {/* TRANSACTIONS */}

                    <div className="bg-white rounded-2xl shadow overflow-hidden">

                        <div className="p-5 border-b flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-semibold">
                                    Transactions
                                </h2>

                                <div className="text-sm text-gray-500 mt-1">
                                    {filteredTransactions.length} operations found
                                </div>

                            </div>

                        </div>

                        {filteredTransactions.length === 0 ? (

                            <div className="p-6 text-gray-500">
                                No transactions found
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50 border-b">

                                    <tr className="text-left text-sm text-gray-500">

                                        <th className="px-5 py-4">
                                            Type
                                        </th>

                                        <th className="px-5 py-4">
                                            Amount
                                        </th>

                                        <th className="px-5 py-4">
                                            Category
                                        </th>

                                        <th className="px-5 py-4">
                                            Related Order
                                        </th>

                                        <th className="px-5 py-4">
                                            Date
                                        </th>

                                    </tr>

                                    </thead>

                                    <tbody>

                                    {filteredTransactions.map(transaction => (

                                        <tr
                                            key={transaction.id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >

                                            <td className="px-5 py-4">

                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.type === "INCOME"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                    {transaction.type}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 font-semibold">
                                                ${Number(transaction.amount || 0).toFixed(2)}
                                            </td>

                                            <td className="px-5 py-4">
                                                {transaction.category || "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                {transaction.order_title || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-500">
                                                {transaction.date
                                                    ? new Date(transaction.date).toLocaleDateString()
                                                    : "—"}
                                            </td>

                                        </tr>

                                    ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </>
    );
}