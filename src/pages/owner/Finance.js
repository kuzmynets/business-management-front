import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function FinancePage() {
    const { user } = useContext(AuthContext);

    const [financeData, setFinanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [period, setPeriod] = useState("month"); // default filter: month

    const fetchFinance = async () => {
        setLoading(true);
        try {
            const data = await apiRequest(`/finance?business_id=${user.businessId}&period=${period}`);
            setFinanceData(Array.isArray(data) ? data : []);
        } catch {
            setError("Failed to load finance data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinance();
    }, [period]);

    const calculateTotals = () => {
        let income = 0, expenses = 0;
        financeData.forEach(item => {
            income += item.income || 0;
            expenses += item.expense || 0;
        });
        return { income, expenses, profit: income - expenses };
    };

    const totals = calculateTotals();

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">Finance</h1>
                    {error && <div className="text-red-600">{error}</div>}

                    {/* FILTER */}
                    <div className="flex gap-2 items-center">
                        <label>Period:</label>
                        <select
                            value={period}
                            onChange={e => setPeriod(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="day">Day</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>
                        <button
                            onClick={fetchFinance}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            Apply
                        </button>
                    </div>

                    {/* TOTALS */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-gray-500">Income</div>
                            <div className="text-xl font-semibold">${totals.income.toFixed(2)}</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-gray-500">Expenses</div>
                            <div className="text-xl font-semibold">${totals.expenses.toFixed(2)}</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="text-gray-500">Profit</div>
                            <div className="text-xl font-semibold">${totals.profit.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* DETAILED LIST */}
                    <div className="bg-white p-4 rounded shadow mt-6">
                        <h2 className="font-semibold mb-2">Transactions</h2>
                        {financeData.length === 0 ? (
                            <p className="text-gray-500">No financial data for this period</p>
                        ) : (
                            <table className="w-full table-auto text-sm">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-1 text-left">Date</th>
                                    <th className="px-3 py-1 text-left">Type</th>
                                    <th className="px-3 py-1 text-left">Amount</th>
                                    <th className="px-3 py-1 text-left">Order</th>
                                    <th className="px-3 py-1 text-left">Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {financeData.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-3 py-1">{item.date}</td>
                                        <td className="px-3 py-1">{item.type}</td>
                                        <td className="px-3 py-1">
                                            {item.type === "income" ? `$${item.income.toFixed(2)}` : `$${item.expense.toFixed(2)}`}
                                        </td>
                                        <td className="px-3 py-1">{item.order_title || "—"}</td>
                                        <td className="px-3 py-1">{item.description || ""}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}