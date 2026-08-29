import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/Auth";

const UserRequireAuth = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default UserRequireAuth;