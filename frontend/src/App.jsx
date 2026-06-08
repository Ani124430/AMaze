import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { AuthContext } from "./context/AuthContext";

export default function App() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = (userData, userToken) => {setUser(userData); setToken(userToken);};
    const logout = () => {setUser(null); setToken(null);};

    return (
        <AuthContext.Provider value = {{ user, token, login , logout}}>
            <div style={{ minHeight: "100vh", background: "#0A0512", fontFamily: "'Inter', sans-setif"}}>
                {!user ? <AuthPage/> : <DashboardPage/>}
            </div>
        </AuthContext.Provider>
    );
}
