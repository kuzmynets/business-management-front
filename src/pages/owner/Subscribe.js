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
            setError("Failed to load subscription info");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        try {
            // POST /subscription/subscribe {plan_id, business_id}
            await apiRequest(`/subscription/subscribe`, {
                method: "POST",
                body: JSON.stringify({
                    plan_id: selectedPlan,
                    business_id: user.businessId,
                }),
            });
            loadSubscription(); // оновлення стану після підписки
        } catch {
            setError("Failed to subscribe");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <>
            <Toolbar role={user.role} />

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto space-y-6">

                    <h1 className="text-2xl font-bold">Subscription</h1>
                    {error && <div className="text-red-600">{error}</div>}

                    {/* Current subscription */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="font-semibold mb-2">Current Plan</h2>
                        {subscription ? (
                            <div>
                                <p className="text-gray-700">Plan: {subscription.name}</p>
                                <p className="text-gray-500">Status: {subscription.status}</p>
                                <p className="text-gray-500">Next billing: {subscription.next_billing}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No active subscription</p>
                        )}
                    </div>

                    {/* Choose plan */}
                    <div className="bg-white p-4 rounded shadow space-y-3">
                        <h2 className="font-semibold mb-2">Choose a Plan</h2>
                        {plans.length === 0 ? (
                            <p className="text-gray-500">No plans available</p>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-4">
                                {plans.map(plan => (
                                    <label
                                        key={plan.id}
                                        className={`border p-4 rounded cursor-pointer flex-1 ${
                                            selectedPlan === plan.id ? "border-blue-600 bg-blue-50" : "border-gray-300"
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
                                        <span className="font-semibold">{plan.name}</span>
                                        <span className="block text-gray-500">{plan.price} / {plan.interval}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={handleSubscribe}
                            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                            disabled={!selectedPlan}
                        >
                            Subscribe
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
