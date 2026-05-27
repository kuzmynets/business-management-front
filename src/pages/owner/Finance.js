import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function Finance() {
    const { user } = useContext(AuthContext);

    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summary, setSummary] = useState({ income: 0, expenses: 0, profit: 0 });

    const [loading, setLoading] = useState(true);
    const [expenseLoading, setExpenseLoading] = useState(false);
    const [error, setError] = useState("");

    const [typeFilter, setTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [expenseForm, setExpenseForm] = useState({
        amount: "",
        category: "",
        description: ""
    });

    const loadFinance = useCallback(async (nextPage = page) => {
        try {
            setLoading(true);

            const data = await apiRequest(`/finance?page=${nextPage}&limit=10`);

            setTransactions(Array.isArray(data?.items) ? data.items : []);
            setTotalPages(data?.total_pages || 1);
            setSummary(data?.summary || { income: 0, expenses: 0, profit: 0 });
        } catch {
            setError("Failed to load finance data");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadFinance(page);
    }, [loadFinance, page]);

    const createExpense = async (e) => {
        e.preventDefault();
        const amount = Number(expenseForm.amount);
        const category = expenseForm.category.trim();

        if (!amount || amount <= 0) {
            setError("Amount must be greater than zero");
            return;
        }

        if (!category) {
            setError("Category is required");
            return;
        }

        try {
            setExpenseLoading(true);
            setError("");

            await apiRequest("/finance/expense", {
                method: "POST",
                body: JSON.stringify({
                    amount,
                    category,
                    description: expenseForm.description
                })
            });

            setExpenseForm({
                amount: "",
                category: "",
                description: ""
            });

            await loadFinance(page);

        } catch {
            setError("Failed to create expense");
        } finally {
            setExpenseLoading(false);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            if (typeFilter && t.type !== typeFilter) return false;
            if (categoryFilter && t.category !== categoryFilter) return false;

            if (dateFrom && t.date && new Date(t.date) < new Date(dateFrom)) return false;
            if (dateTo && t.date && new Date(t.date) > new Date(dateTo)) return false;

            return true;
        });
    }, [transactions, typeFilter, categoryFilter, dateFrom, dateTo]);

    const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))];

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* HEADER */}
                    <div>
                        <div>
                            <h1 className="text-3xl font-bold">Finance</h1>
                            <p className="text-gray-500 mt-1">
                                Income, expenses and profit overview
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* CREATE EXPENSE */}
                    <form
                        onSubmit={createExpense}
                        className="bg-white p-5 rounded shadow space-y-3"
                    >
                        <h2 className="font-semibold">Add Expense</h2>

                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            required
                            placeholder="Amount"
                            value={expenseForm.amount}
                            onChange={e =>
                                setExpenseForm({ ...expenseForm, amount: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                        />

                        <input
                            required
                            placeholder="Category"
                            value={expenseForm.category}
                            onChange={e =>
                                setExpenseForm({ ...expenseForm, category: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                        />

                        <input
                            placeholder="Description"
                            value={expenseForm.description}
                            onChange={e =>
                                setExpenseForm({ ...expenseForm, description: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                        />

                        <button
                            disabled={expenseLoading}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            {expenseLoading ? "Saving..." : "Add Expense"}
                        </button>
                    </form>

                    {/* BALANCE */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded shadow">
                            <div className="text-gray-500">Income</div>
                            <div className="text-2xl text-green-600 font-bold">
                                ${Number(summary.income || 0).toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded shadow">
                            <div className="text-gray-500">Expenses</div>
                            <div className="text-2xl text-red-600 font-bold">
                                ${Number(summary.expenses || 0).toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded shadow">
                            <div className="text-gray-500">Profit</div>
                            <div className="text-2xl font-bold">
                                ${Number(summary.profit || 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* FILTERS */}
                    <div className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-3">
                        <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">All</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">All categories</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="border px-3 py-2 rounded"
                        />

                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="border px-3 py-2 rounded"
                        />
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Order</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t.id} className="border-t">
                                    <td className="p-3">{t.type}</td>
                                    <td className="p-3">${t.amount}</td>
                                    <td className="p-3">{t.category}</td>
                                    <td className="p-3">{t.order_title || "—"}</td>
                                    <td className="p-3">
                                        {t.date ? new Date(t.date).toLocaleDateString() : "—"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-2 bg-white border rounded disabled:text-gray-400"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-3 py-2 bg-white border rounded disabled:text-gray-400"
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
