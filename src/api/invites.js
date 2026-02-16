import { apiRequest } from "./client";

export const getInvites = () => apiRequest("/invites");

export const createInvite = (data) =>
    apiRequest("/invites", {
        method: "POST",
        body: JSON.stringify(data),
    });
