import { Link } from "react-router-dom";

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* HERO */}
            <section className="max-w-6xl mx-auto px-6 py-24 text-center">
                <h1 className="text-5xl font-bold leading-tight">
                    Керуйте бізнесом без хаосу
                </h1>

                <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
                    Система для замовлень, задач і команди в одному місці.
                    Контроль процесів без таблиць і розкиданих інструментів.
                </p>

                <div className="mt-10 flex gap-4 justify-center">
                    <Link
                        to="/register"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Створити бізнес
                    </Link>

                    <Link
                        to="/login"
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Увійти
                    </Link>
                </div>
            </section>

            {/* FEATURES */}
            <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold text-lg mb-2">Owner</h3>
                    <p className="text-gray-600 text-sm">
                        Контроль бізнесу, фінанси, аналітика, команда, підписки.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold text-lg mb-2">Manager</h3>
                    <p className="text-gray-600 text-sm">
                        Управління замовленнями, задачами та операційним процесом.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold text-lg mb-2">Employee</h3>
                    <p className="text-gray-600 text-sm">
                        Виконання задач, статуси, фіксація результатів роботи.
                    </p>
                </div>

            </section>

            {/* PRICING */}
            <section className="bg-white border-t py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">

                    <h2 className="text-3xl font-bold mb-4">Тарифи</h2>

                    <p className="text-gray-600 mb-12">
                        Оберіть план під ваш бізнес
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="border rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-2">Free</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Базове управління замовленнями та задачами.
                            </p>
                            <div className="text-2xl font-bold">0$</div>
                        </div>

                        <div className="border rounded-xl p-6 border-blue-500">
                            <h3 className="text-xl font-semibold mb-2">Pro</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Аналітика, фінанси, розширений контроль процесів.
                            </p>
                            <div className="text-2xl font-bold">20$ / month</div>
                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
};