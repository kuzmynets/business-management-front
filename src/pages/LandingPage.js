import { Link } from "react-router-dom";

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">

                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
                        Бізнес під контролем 24/7
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight max-w-5xl mx-auto">
                        Перестаньте керувати бізнесом навмання.
                        <span className="block text-blue-600">
                            Контролюйте кожен процес в одному місці.
                        </span>
                    </h1>

                    <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
                        Замовлення, задачі, команда, фінанси та аналітика —
                        без таблиць, чатів і десятків розрізнених сервісів.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
                        >
                            Створити бізнес безкоштовно
                        </Link>

                        <Link
                            to="/login"
                            className="px-8 py-4 border border-gray-300 rounded-xl font-semibold hover:bg-gray-100 transition"
                        >
                            Увійти в систему
                        </Link>
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                        <span>✓ Замовлення під контролем</span>
                        <span>✓ Команда працює прозоро</span>
                        <span>✓ Всі показники в одному кабінеті</span>
                    </div>

                </div>

            </section>

            {/* BEFORE / AFTER */}
            <section className="py-24 bg-gray-50">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold">
                            Менше хаосу. Більше контролю.
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Відчуйте різницю вже з першого дня роботи.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div className="bg-white rounded-3xl p-8 border border-red-200">
                            <div className="text-red-600 font-bold text-lg mb-6">
                                Без системи
                            </div>

                            <div className="space-y-4 text-gray-700">
                                <p>❌ Замовлення губляться</p>
                                <p>❌ Задачі розкидані по чатах</p>
                                <p>❌ Немає контролю відповідальних</p>
                                <p>❌ Фінанси доводиться рахувати вручну</p>
                                <p>❌ Керівник контролює все самостійно</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-green-200">
                            <div className="text-green-600 font-bold text-lg mb-6">
                                З нашою платформою
                            </div>

                            <div className="space-y-4 text-gray-700">
                                <p>✅ Усі замовлення в одному місці</p>
                                <p>✅ Задачі розподілені автоматично</p>
                                <p>✅ Відповідальні визначені</p>
                                <p>✅ Доходи та витрати видно миттєво</p>
                                <p>✅ Бізнес працює системно</p>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* BENEFITS */}
            <section className="py-24">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold">
                            Усе необхідне для керування бізнесом
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Один інструмент замість десятків сервісів.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                Замовлення без втрат
                            </h3>

                            <p className="text-gray-600">
                                Кожна заявка проходить зрозумілий шлях від створення до завершення.
                            </p>
                        </div>

                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                Контроль команди
                            </h3>

                            <p className="text-gray-600">
                                Завжди видно хто працює над задачею і на якому етапі вона знаходиться.
                            </p>
                        </div>

                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                Фінанси під рукою
                            </h3>

                            <p className="text-gray-600">
                                Доходи, витрати та прибуток доступні в кілька кліків.
                            </p>
                        </div>

                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                Аналітика в реальному часі
                            </h3>

                            <p className="text-gray-600">
                                Приймайте рішення на основі цифр, а не припущень.
                            </p>
                        </div>

                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                Ролі та доступи
                            </h3>

                            <p className="text-gray-600">
                                Кожен співробітник бачить лише те, що потрібно для роботи.
                            </p>
                        </div>

                        <div className="bg-white border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">
                                Масштабування бізнесу
                            </h3>

                            <p className="text-gray-600">
                                Додавайте нові команди та напрямки без втрати контролю.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* HOW IT WORKS */}
            <section className="bg-gray-50 py-24">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold">
                            Почніть роботу за 3 кроки
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="bg-white p-8 rounded-2xl border">
                            <div className="text-blue-600 font-bold mb-3">
                                КРОК 1
                            </div>

                            <h3 className="font-semibold text-lg mb-2">
                                Створіть бізнес
                            </h3>

                            <p className="text-gray-600">
                                Зареєструйте компанію за кілька хвилин.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border">
                            <div className="text-blue-600 font-bold mb-3">
                                КРОК 2
                            </div>

                            <h3 className="font-semibold text-lg mb-2">
                                Додайте команду
                            </h3>

                            <p className="text-gray-600">
                                Запросіть менеджерів та співробітників.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border">
                            <div className="text-blue-600 font-bold mb-3">
                                КРОК 3
                            </div>

                            <h3 className="font-semibold text-lg mb-2">
                                Керуйте процесами
                            </h3>

                            <p className="text-gray-600">
                                Контролюйте задачі, замовлення та фінанси з єдиної панелі.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* TARGET AUDIENCE */}
            <section className="py-24">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="grid md:grid-cols-2 gap-8">

                        <div className="bg-green-50 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Ідеально для
                            </h2>

                            <div className="space-y-3">
                                <p>✓ Сервісних компаній</p>
                                <p>✓ Маркетингових агентств</p>
                                <p>✓ IT-команд</p>
                                <p>✓ Будівельних бригад</p>
                                <p>✓ Малого та середнього бізнесу</p>
                            </div>
                        </div>

                        <div className="bg-red-50 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Не підійде якщо
                            </h2>

                            <div className="space-y-3">
                                <p>✕ Вам достатньо Excel</p>
                                <p>✕ У вас немає команди</p>
                                <p>✕ Ви не плануєте рости</p>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* PRICING */}
            <section className="bg-gray-50 py-24">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold">
                            Оберіть свій тариф
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div className="bg-white rounded-3xl p-8 border shadow-sm">

                            <h3 className="text-2xl font-bold">
                                Starter
                            </h3>

                            <div className="text-5xl font-extrabold mt-6">
                                $0
                            </div>

                            <div className="text-gray-500 mt-2">
                                Для старту та знайомства з системою
                            </div>

                            <ul className="mt-8 space-y-3">
                                <li>✓ Замовлення</li>
                                <li>✓ Задачі</li>
                                <li>✓ Команда</li>
                                <li>✓ Базовий контроль</li>
                            </ul>

                        </div>

                        <div className="bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-lg relative">

                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                Найпопулярніший
                            </div>

                            <h3 className="text-2xl font-bold text-blue-600">
                                Business Pro
                            </h3>

                            <div className="text-5xl font-extrabold mt-6">
                                $20
                            </div>

                            <div className="text-gray-500 mt-2">
                                на місяць
                            </div>

                            <ul className="mt-8 space-y-3">
                                <li>✓ Все зі Starter</li>
                                <li>✓ Фінанси</li>
                                <li>✓ Аналітика</li>
                                <li>✓ Контроль продуктивності</li>
                                <li>✓ Детальна статистика</li>
                            </ul>

                        </div>

                    </div>

                </div>

            </section>

            {/* FINAL CTA */}
            <section className="bg-blue-600 text-white">

                <div className="max-w-4xl mx-auto px-6 py-24 text-center">

                    <h2 className="text-4xl md:text-5xl font-bold">
                        Ваш бізнес росте.
                        Час навести порядок у процесах.
                    </h2>

                    <p className="mt-6 text-blue-100 text-lg">
                        Почніть керувати замовленнями, командою та фінансами
                        в єдиній системі вже сьогодні.
                    </p>

                    <Link
                        to="/register"
                        className="inline-block mt-10 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition"
                    >
                        Створити бізнес безкоштовно
                    </Link>

                    <p className="mt-4 text-sm text-blue-200">
                        Без картки. Без складного налаштування.
                    </p>

                </div>

            </section>

        </div>
    );
};