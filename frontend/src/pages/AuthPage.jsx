import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";

const P = "#9E48AD";
const P_LIGHT = "#C084D4";
const P_GLOW = "rgba(158,72,173,0.35)";

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
};

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(null);

  const handleSubmit = async () => {
    setError("");
    if (!username.trim() || !password.trim()) { setError("Попълни всички полета"); return; }
    setLoading(true);
    try {
      const data = isLogin
        ? await api.signIn(username, password)
        : await api.signUp(username, password);
      login(data.user, data.token);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120,40,160,0.45) 0%, #0A0512 65%)",
      padding: "1rem", position: "relative", overflow: "hidden",
    }}>
      {/* Floating orbs */}
      <div style={{ position:"absolute", top:"10%", left:"15%", width:"220px", height:"220px", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(158,72,173,0.2) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"15%", right:"10%", width:"180px", height:"180px", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(120,40,200,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:"400px", position:"relative" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{
            display:"inline-flex", width:"56px", height:"56px", borderRadius:"16px",
            background:"linear-gradient(135deg, #9E48AD, #6B21A8)",
            alignItems:"center", justifyContent:"center", marginBottom:"12px",
            boxShadow:`0 0 30px ${P_GLOW}`,
          }}>
            <span style={{ fontSize:"24px" }}>✦</span>
          </div>
          <div style={{ fontFamily:"'Georgia',serif", fontSize:"26px", color:"#F0EAF5", letterSpacing:"-0.5px" }}>
            AMaze
          </div>
          <div style={{ fontSize:"13px", color:"rgba(240,234,245,0.45)", marginTop:"4px" }}>
            изгради навиците си, ден по ден
          </div>
        </div>

        {/* Glass card */}
        <div style={{ ...glass, padding:"2rem" }}>
          <div style={{ fontSize:"18px", fontWeight:600, color:"#F0EAF5", marginBottom:"1.5rem" }}>
            {isLogin ? "Добре дошъл обратно" : "Създай акаунт"}
          </div>

          {error && (
            <div style={{
              background:"rgba(220,50,50,0.1)", border:"1px solid rgba(220,50,50,0.25)",
              borderRadius:"10px", padding:"10px 14px", color:"#F87171",
              fontSize:"13px", marginBottom:"1rem",
            }}>{error}</div>
          )}

          {["user","pass"].map((f) => (
            <div key={f} style={{ marginBottom:"1rem" }}>
              <label style={{ display:"block", fontSize:"11px", color:"rgba(240,234,245,0.5)",
                textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"7px" }}>
                {f === "user" ? "Потребителско име" : "Парола"}
              </label>
              <input
                type={f === "pass" ? "password" : "text"}
                value={f === "user" ? username : password}
                onChange={e => f === "user" ? setUsername(e.target.value) : setPassword(e.target.value)}
                onFocus={() => setFocus(f)}
                onBlur={() => setFocus(null)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder={f === "user" ? "твоето_потребителско_име" : "••••••••"}
                style={{
                  width:"100%", background:"rgba(0,0,0,0.3)",
                  border:`1px solid ${focus === f ? "rgba(158,72,173,0.7)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius:"12px", padding:"12px 16px", color:"#F0EAF5",
                  fontSize:"14px", outline:"none", transition:"all 0.2s",
                  boxShadow: focus === f ? `0 0 0 3px rgba(158,72,173,0.15)` : "none",
                }}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width:"100%", padding:"13px",
              background:`linear-gradient(135deg, ${P}, #7B2FBE)`,
              border:"none", borderRadius:"12px", color:"white",
              fontSize:"15px", fontWeight:600, cursor:"pointer",
              marginTop:"8px", transition:"opacity 0.2s",
              opacity: loading ? 0.7 : 1,
              boxShadow:`0 4px 24px ${P_GLOW}`,
            }}
          >
            {loading ? "Зареждане..." : isLogin ? "Влез" : "Регистрирай се"}
          </button>

          <div style={{ textAlign:"center", marginTop:"1.25rem", fontSize:"13px", color:"rgba(240,234,245,0.45)" }}>
            {isLogin ? "Нямаш акаунт? " : "Вече имаш акаунт? "}
            <span
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ color:P_LIGHT, cursor:"pointer", fontWeight:500 }}
            >
              {isLogin ? "Регистрирай се" : "Влез"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}