import { Link } from "react-router-dom";

export const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
            <h1 className="text-4xl font-bold mb-4 text-center">
                Business Management System
            </h1>

            <p className="text-gray-600 max-w-xl text-center mb-8">
                Керування замовленнями, задачами та командою малого бізнесу
                в одному робочому просторі.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Увійти
                </Link>

                <Link
                    to="/register"
                    className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                    Створити бізнес
                </Link>
            </div>
        </div>
    );
};