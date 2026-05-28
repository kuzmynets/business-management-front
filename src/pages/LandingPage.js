import { Link } from "react-router-dom";

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-3xl" />
                </div>

                <div className="max-w-6xl mx-auto px-6 py-28 relative text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                        Система управління бізнесом
                    </h1>

                    <p className="text-gray-600 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
                        Замовлення, задачі, команда і фінанси в одній структурі.
                        Контроль процесів без розривів між інструментами.
                    </p>

                    <div className="mt-10 flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-7 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                        >
                            Почати роботу
                        </Link>

                        <Link
                            to="/login"
                            className="px-7 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                        >
                            Вхід
                        </Link>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Ролі в системі
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Розподіл відповідальності без хаосу
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                        <div className="text-lg font-semibold text-blue-600 mb-2">
                            Owner
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Фінанси, аналітика, підписки, контроль бізнес-структури та доступів.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                        <div className="text-lg font-semibold text-indigo-600 mb-2">
                            Manager
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Замовлення, задачі, розподіл роботи та контроль виконання процесів.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
                        <div className="text-lg font-semibold text-emerald-600 mb-2">
                            Employee
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Виконання задач, оновлення статусів і фіксація результатів роботи.
                        </p>
                    </div>

                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-white border-t">
                <div className="max-w-6xl mx-auto px-6 py-20">

                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Як це працює</h2>
                        <p className="text-gray-500 mt-2">
                            Проста логіка замість складних систем
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="p-6 rounded-2xl border bg-gray-50">
                            <div className="text-sm text-gray-500 mb-2">01</div>
                            <div className="font-semibold mb-2">Створення бізнесу</div>
                            <div className="text-sm text-gray-600">
                                Власник створює структуру і додає команду.
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border bg-gray-50">
                            <div className="text-sm text-gray-500 mb-2">02</div>
                            <div className="font-semibold mb-2">Робота з процесами</div>
                            <div className="text-sm text-gray-600">
                                Менеджер керує замовленнями та задачами.
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border bg-gray-50">
                            <div className="text-sm text-gray-500 mb-2">03</div>
                            <div className="font-semibold mb-2">Виконання</div>
                            <div className="text-sm text-gray-600">
                                Працівники виконують задачі і оновлюють статуси.
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 py-24">

                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Тарифи</h2>
                        <p className="text-gray-500 mt-2">
                            Оберіть рівень під ваш бізнес
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="bg-white rounded-2xl p-8 border shadow-sm">
                            <div className="font-semibold text-lg">Free</div>
                            <div className="text-gray-500 text-sm mt-2">
                                Базові замовлення та задачі без аналітики.
                            </div>
                            <div className="text-3xl font-bold mt-6">0$</div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-blue-500 shadow-md">
                            <div className="font-semibold text-lg text-blue-600">
                                Pro
                            </div>
                            <div className="text-gray-500 text-sm mt-2">
                                Аналітика, фінанси, контроль продуктивності.
                            </div>
                            <div className="text-3xl font-bold mt-6">
                                20$ / місяць
                            </div>
                        </div>

                    </div>

                    <div className="text-center mt-16">
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                        >
                            Створити систему
                        </Link>
                    </div>

                </div>
            </section>

        </div>
    );
};