import { apiRequest } from "./client";

export const getMe = () => apiRequest("/auth/me");
export const registerOwner = (data) =>
    apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
