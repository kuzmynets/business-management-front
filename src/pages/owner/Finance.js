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
            setError("Не вдалося завантажити фінансові дані");
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
            setError("Сума має бути більшою за нуль");
            return;
        }

        if (!category) {
            setError("Категорія обов'язкова");
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
            setError("Не вдалося створити витрату");
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

    if (loading) {
        return (
            <div className="p-4 sm:p-6 text-sm sm:text-base">
                Завантаження...
            </div>
        );
    }

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
                <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Фінанси</h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Доходи, витрати та прибуток
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* CREATE EXPENSE */}
                    <form
                        onSubmit={createExpense}
                        className="bg-white p-4 sm:p-5 rounded shadow space-y-3"
                    >
                        <h2 className="font-semibold text-sm sm:text-base">
                            Додати витрату
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                required
                                placeholder="Сума"
                                value={expenseForm.amount}
                                onChange={e =>
                                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded min-h-[44px]"
                            />

                            <input
                                required
                                placeholder="Категорія"
                                value={expenseForm.category}
                                onChange={e =>
                                    setExpenseForm({ ...expenseForm, category: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded min-h-[44px]"
                            />

                            <input
                                placeholder="Опис"
                                value={expenseForm.description}
                                onChange={e =>
                                    setExpenseForm({ ...expenseForm, description: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded min-h-[44px]"
                            />
                        </div>

                        <button
                            disabled={expenseLoading}
                            className="
                                bg-red-600 text-white px-4 py-2 rounded
                                min-h-[44px] w-full sm:w-auto
                                disabled:opacity-60
                            "
                        >
                            {expenseLoading ? "Збереження..." : "Додати витрату"}
                        </button>
                    </form>

                    {/* BALANCE */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-white p-4 sm:p-6 rounded shadow">
                            <div className="text-gray-500 text-sm">Дохід</div>
                            <div className="text-xl sm:text-2xl text-green-600 font-bold">
                                ${Number(summary.income || 0).toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded shadow">
                            <div className="text-gray-500 text-sm">Витрати</div>
                            <div className="text-xl sm:text-2xl text-red-600 font-bold">
                                ${Number(summary.expenses || 0).toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded shadow">
                            <div className="text-gray-500 text-sm">Прибуток</div>
                            <div className="text-xl sm:text-2xl font-bold">
                                ${Number(summary.profit || 0).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* FILTERS */}
                    <div className="bg-white p-4 rounded shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <select
                            value={typeFilter}
                            onChange={e => setTypeFilter(e.target.value)}
                            className="border px-3 py-2 rounded min-h-[44px]"
                        >
                            <option value="">Всі</option>
                            <option value="INCOME">Дохід</option>
                            <option value="EXPENSE">Витрата</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="border px-3 py-2 rounded min-h-[44px]"
                        >
                            <option value="">Всі категорії</option>
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="border px-3 py-2 rounded min-h-[44px]"
                        />

                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="border px-3 py-2 rounded min-h-[44px]"
                        />
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="w-full min-w-[640px]">
                            <thead className="bg-gray-50">
                            <tr className="text-sm">
                                <th className="p-3 text-left">Тип</th>
                                <th className="p-3 text-left">Сума</th>
                                <th className="p-3 text-left">Категорія</th>
                                <th className="p-3 text-left">Замовлення</th>
                                <th className="p-3 text-left">Дата</th>
                            </tr>
                            </thead>

                            <tbody className="text-sm">
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

                    {/* PAGINATION */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-2 bg-white border rounded min-h-[44px] disabled:opacity-50"
                        >
                            Попередня
                        </button>

                        <span className="text-sm text-gray-600 text-center">
                            Сторінка {page} з {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-3 py-2 bg-white border rounded min-h-[44px] disabled:opacity-50"
                        >
                            Наступна
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}