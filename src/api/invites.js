import { apiRequest } from "./client";

export const getInvites = () => apiRequest("/invites");
export const getMembers = () => apiRequest("/invites/members");

export const createInvite = (data) =>
    apiRequest("/invites", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const approveInvite = (token) =>
    apiRequest(`/invites/${token}/approve`, {
        method: "POST",
    });

export const rejectInvite = (token) =>
    apiRequest(`/invites/${token}/reject`, {
        method: "POST",
    });

export const removeMember = (memberId) =>
    apiRequest(`/invites/members/${memberId}`, {
        method: "DELETE",
    });

export const rejectMemberRemoval = (memberId) =>
    apiRequest(`/invites/members/${memberId}/reject-removal`, {
        method: "POST",
    });
