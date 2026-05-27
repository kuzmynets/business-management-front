import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import { AuthContext } from "./AuthContext";

export const BusinessContext = createContext(null);

export const BusinessProvider = ({ children }) => {
    const { user, switchBusiness: switchAuthBusiness } = useContext(AuthContext);
    const [businesses, setBusinesses] = useState([]);
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadBusinesses = useCallback(async () => {
        if (!user?.token) {
            setBusinesses([]);
            setCurrentBusiness(null);
            return;
        }

        setLoading(true);
        try {
            const data = await apiRequest("/business/all");
            const list = Array.isArray(data) ? data : [];
            setBusinesses(list);

            const selected =
                list.find((business) => business.id === user.businessId) ||
                list[0] ||
                null;

            setCurrentBusiness(selected);

            if (selected && selected.id !== user.businessId) {
                switchAuthBusiness(selected.id, selected.role);
            }
        } finally {
            setLoading(false);
        }
    }, [switchAuthBusiness, user?.businessId, user?.token]);

    useEffect(() => {
        loadBusinesses();
    }, [loadBusinesses]);

    const switchBusiness = useCallback((businessId) => {
        const selected = businesses.find((business) => business.id === businessId);
        if (!selected) {
            switchAuthBusiness(businessId, "OWNER");
            setCurrentBusiness({ id: businessId, role: "OWNER" });
            return;
        }

        setCurrentBusiness(selected);
        switchAuthBusiness(selected.id, selected.role);
    }, [businesses, switchAuthBusiness]);

    const value = useMemo(() => ({
        currentBusiness,
        businesses,
        loading,
        reloadBusinesses: loadBusinesses,
        switchBusiness,
    }), [businesses, currentBusiness, loadBusinesses, loading, switchBusiness]);

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    );
};

export const useBusiness = () => useContext(BusinessContext);
