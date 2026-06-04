import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { apiRequest } from "../../api/client";
import Toolbar from "../../components/Toolbar";

export default function SubscribePage() {
    const { user } = useContext(AuthContext);

    const [subscription, setSubscription] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("");

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = async () => {
        setLoading(true);
        try {
            const data = await apiRequest("/subscription");
            setSubscription(data.current || null);
            setPlans(data.plans || []);
            if (data.plans?.length > 0) setSelectedPlan(data.plans[0].id);
        } catch {
            setError("Не вдалося завантажити дані підписки");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        try {
            await apiRequest(`/subscription/subscribe`, {
                method: "POST",
                body: JSON.stringify({
                    plan_id: selectedPlan,
                    business_id: user.businessId,
                }),
            });

            loadSubscription();
        } catch {
            setError("Не вдалося оформити підписку");
        }
    };

    if (loading) return <div className="p-6">Завантаження...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto space-y-6">

                    <div>
                        <h1 className="text-3xl font-bold">Підписка</h1>
                        <p className="text-gray-500 mt-1">
                            Керування тарифним планом бізнесу
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* CURRENT PLAN */}
                    <div className="bg-white p-5 rounded-xl shadow space-y-2">
                        <h2 className="font-semibold text-lg">Поточний план</h2>

                        {subscription ? (
                            <div className="space-y-1 text-sm text-gray-700">
                                <div>Тариф: {subscription.name}</div>
                                <div>Статус: {subscription.status}</div>
                                <div>Наступна оплата: {subscription.next_billing || "—"}</div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Активної підписки немає</p>
                        )}
                    </div>

                    {/* PLANS */}
                    <div className="bg-white p-5 rounded-xl shadow space-y-4">
                        <h2 className="font-semibold text-lg">Доступні тарифи</h2>

                        {plans.length === 0 ? (
                            <p className="text-gray-500">Тарифи відсутні</p>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {plans.map(plan => (
                                    <label
                                        key={plan.id}
                                        className={`border rounded-xl p-4 cursor-pointer transition
                                            ${selectedPlan === plan.id
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="plan"
                                            value={plan.id}
                                            checked={selectedPlan === plan.id}
                                            onChange={() => setSelectedPlan(plan.id)}
                                            className="mr-2"
                                        />

                                        <div className="font-semibold">
                                            {plan.name}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {plan.price} / {plan.interval}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleSubscribe}
                            disabled={!selectedPlan}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                        >
                            Оформити підписку
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}