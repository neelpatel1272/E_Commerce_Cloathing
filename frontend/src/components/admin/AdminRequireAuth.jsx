    import {  useContext } from "react"
    import { AdminAuthContext } from "../context/AdminAuth"
    import { Navigate, Outlet } from "react-router-dom";

    export const AdminRequireAuth = () =>{
        const {user} = useContext(AdminAuthContext);

        if(!user){
            return <Navigate to={'/admin/login'} replace></Navigate>
        }

        return <Outlet />
    }