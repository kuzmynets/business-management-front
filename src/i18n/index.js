import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// UA
import common_ua from "./ua/common_ua.json";
import auth_ua from "./ua/auth_ua.json";
import nav_ua from "./ua/navigation_ua.json";
import dashboard_ua from "./ua/dashboard_ua.json";
import manager_ua from "./ua/managerDashboard_ua.json";
import finance_ua from "./ua/finance_ua.json";
import team_ua from "./ua/team_ua.json";
import business_ua from "./ua/business_ua.json";
import orders_ua from "./ua/orders_ua.json";
import tasks_ua from "./ua/tasks_ua.json";
import analytics_ua from "./ua/analytics_ua.json";

// EN
import common_en from "./en/common.json";
import auth_en from "./en/auth.json";
import nav_en from "./en/navigation.json";
import dashboard_en from "./en/dashboard.json";
import manager_en from "./en/managerDashboard.json";
import finance_en from "./en/finance.json";
import team_en from "./en/team.json";
import business_en from "./en/business.json";
import orders_en from "./en/orders.json";
import tasks_en from "./en/tasks.json";
import analytics_en from "./en/analytics.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ua: {
                common: common_ua,
                auth: auth_ua,
                nav: nav_ua,
                dashboard: dashboard_ua,
                manager: manager_ua,
                finance: finance_ua,
                team: team_ua,
                business: business_ua,
                orders: orders_ua,
                tasks: tasks_ua,
                analytics: analytics_ua
            },
            en: {
                common: common_en,
                auth: auth_en,
                nav: nav_en,
                dashboard: dashboard_en,
                manager: manager_en,
                finance: finance_en,
                team: team_en,
                business: business_en,
                orders: orders_en,
                tasks: tasks_en,
                analytics: analytics_en
            }
        },

        lng: "ua",
        fallbackLng: "en",

        ns: [
            "common",
            "auth",
            "nav",
            "dashboard",
            "manager",
            "finance",
            "team",
            "business",
            "orders",
            "tasks",
            "analytics"
        ],

        defaultNS: "common",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;