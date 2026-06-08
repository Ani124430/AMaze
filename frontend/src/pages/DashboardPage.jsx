import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import HabitCard from "../components/HabitCard";
import HabitModal from "../components/HabitModal";
import StatsCard from "../components/StatsCard";

const P = "#9E48AD";
const P_GLOW = "rgba(158,72,173,0.25)";

function GlassMetric({ label, value, accent }) {
  return (
    <div style={{
      background: accent ? "rgba(158,72,173,0.12)" : "rgba(255,255,255,0.03)",
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
      border:`1px solid ${accent ? "rgba(158,72,173,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius:"16px", padding:"1rem 1.25rem", flex:1, minWidth:0,
      boxShadow: accent ? `0 0 20px rgba(158,72,173,0.12)` : "none",
    }}>
      <div style={{ fontSize:"10px", color:"rgba(240,234,245,0.4)", textTransform:"uppercase",
        letterSpacing:"0.07em", marginBottom:"8px" }}>{label}</div>
      <div style={{ fontSize:"24px", fontWeight:600, letterSpacing:"-0.5px",
        color: accent ? "#C084D4" : "#F0EAF5" }}>{value}</div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position:"fixed", bottom:"1.5rem", left:"50%", transform:"translateX(-50%)",
      background:"rgba(20,10,35,0.9)", backdropFilter:"blur(12px)",
      border:"1px solid rgba(158,72,173,0.3)", borderRadius:"20px",
      padding:"10px 20px", color:"#F0EAF5", fontSize:"13px",
      boxShadow:`0 4px 24px rgba(158,72,173,0.2)`, zIndex:200, whiteSpace:"nowrap",
    }}>{message}</div>
  );
}

export default function DashboardPage() {
  const { user, token, logout } = useContext(AuthContext);
  const [tab, setTab] = useState("habits");
  const [habits, setHabits] = useState([]);
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (m) => setToast(m);

  const loadHabits = useCallback(async () => {
    try { const d = await api.getHabits(token); setHabits(d); }
    catch { showToast("Грешка при зареждане"); }
    finally { setLoading(false); }
  }, [token]);

  const loadStats = useCallback(async () => {
    try { const d = await api.getAllStats(token); setAllStats(d.habits ?? []); }
    catch { showToast("Грешка при статистики"); }
  }, [token]);

  useEffect(() => { loadHabits(); }, [loadHabits]);
  useEffect(() => { if (tab === "stats") loadStats(); }, [tab, loadStats]);

  const handleToggle = async (id) => {
    try { const r = await api.logHabit(token, id); showToast(r?.message ?? "Записано!"); loadHabits(); }
    catch (e) { showToast(e.message); }
  };
  const handleDelete = async (id) => {
    try { await api.deleteHabit(token, id); setHabits(p => p.filter(h => h.id !== id)); showToast("Навикът е изтрит"); }
    catch (e) { showToast(e.message); }
  };
  const handleSave = async ({ name, description }, editId) => {
    if (editId) { await api.updateHabit(token, editId, { name, description }); showToast("Обновен!"); }
    else { await api.createHabit(token, name, description); showToast("Навикът е създаден!"); }
    loadHabits();
  };

  const doneToday = habits.filter(h => h.completed_today).length;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.current_streak ?? 0), 0);
  const pct = habits.length ? Math.round((doneToday / habits.length) * 100) : 0;
  const initials = user?.username?.slice(0,2).toUpperCase() ?? "АМ";

  const tabBtn = (id, lbl) => (
    <button onClick={() => setTab(id)} style={{
      background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit",
      color: tab===id ? "#C084D4" : "rgba(240,234,245,0.4)",
      fontSize:"14px", padding:"10px 0",
      borderBottom:`2px solid ${tab===id ? P : "transparent"}`,
      fontWeight: tab===id ? 500 : 400, transition:"all 0.15s",
    }}>{lbl}</button>
  );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Добро утро";
    if (h < 18) return "Добър ден";
    return "Добър вечер";
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse 100% 50% at 50% 0%, rgba(100,30,140,0.3) 0%, #0A0512 55%)",
    }}>
      {/* Background orbs */}
      <div style={{ position:"fixed", top:"5%", right:"5%", width:"350px", height:"350px", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(120,40,180,0.12) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"10%", left:"0%", width:"280px", height:"280px", borderRadius:"50%",
        background:"radial-gradient(circle, rgba(158,72,173,0.08) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      {/* Topbar */}
      <div style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(10,5,18,0.7)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"14px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:"20px", color:"#C084D4", letterSpacing:"-0.5px" }}>
          ✦ AMaze
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:"20px", padding:"4px 12px 4px 4px" }}>
            <div style={{ width:"26px", height:"26px", borderRadius:"50%",
              background:"linear-gradient(135deg, rgba(158,72,173,0.4), rgba(123,47,190,0.4))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"11px", fontWeight:600, color:"#C084D4" }}>{initials}</div>
            <span style={{ fontSize:"13px", color:"rgba(240,234,245,0.5)" }}>{user?.username}</span>
          </div>
          <button onClick={logout} style={{
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"8px", padding:"6px 12px", color:"rgba(240,234,245,0.45)",
            fontSize:"12px", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color="#F0EAF5"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="rgba(240,234,245,0.45)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}
          >Изход</button>
        </div>
      </div>

      <div style={{ maxWidth:"740px", margin:"0 auto", padding:"2rem 1.25rem", position:"relative", zIndex:1 }}>

        {/* Hero greeting */}
        <div style={{ marginBottom:"2rem" }}>
          <div style={{ fontSize:"13px", color:"rgba(240,234,245,0.45)", marginBottom:"4px" }}>
            {greeting()}, {user?.username}! 👋
          </div>
          <div style={{ fontSize:"28px", fontWeight:700, color:"#F0EAF5", letterSpacing:"-0.5px" }}>
            {pct === 100 ? "Всичко е изпълнено! 🎉" : pct > 50 ? "Продължавай напред!" : "Да започваме!"}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"1.5rem", borderBottom:"1px solid rgba(255,255,255,0.07)", marginBottom:"1.75rem" }}>
          {tabBtn("habits","Навици")}
          {tabBtn("stats","Статистики")}
        </div>

        {tab === "habits" && (<>
          {/* Metrics */}
          <div style={{ display:"flex", gap:"10px", marginBottom:"1.75rem", flexWrap:"wrap" }}>
            <GlassMetric label="Общо навици" value={habits.length} accent />
            <GlassMetric label="Днес" value={`${doneToday}/${habits.length}`} />
            <GlassMetric label="Топ стрийк" value={`${bestStreak} 🔥`} />
            <GlassMetric label="Изпълнение" value={`${pct}%`} />
          </div>

          {/* Section header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <div style={{ fontSize:"16px", fontWeight:500, color:"#F0EAF5" }}>Моите навици</div>
            <button onClick={() => setModal({})} style={{
              display:"flex", alignItems:"center", gap:"6px",
              background:`linear-gradient(135deg, ${P}, #7B2FBE)`,
              border:"none", borderRadius:"10px", padding:"8px 16px",
              color:"white", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"inherit",
              boxShadow:`0 4px 20px ${P_GLOW}`, transition:"opacity 0.2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >+ Добави</button>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"3rem", color:"rgba(240,234,245,0.35)", fontSize:"14px" }}>
              Зареждане...
            </div>
          ) : habits.length === 0 ? (
            <div style={{
              textAlign:"center", padding:"3.5rem 1rem",
              border:"1.5px dashed rgba(158,72,173,0.2)", borderRadius:"20px",
            }}>
              <div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>🌱</div>
              <div style={{ fontSize:"16px", fontWeight:500, color:"#F0EAF5", marginBottom:"6px" }}>
                Все още нямаш навици
              </div>
              <div style={{ fontSize:"13px", color:"rgba(240,234,245,0.35)" }}>
                Натисни "+ Добави" за да започнеш
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {habits.map(h => (
                <HabitCard key={h.id} habit={h}
                  onToggle={handleToggle} onDelete={handleDelete} onEdit={setModal} />
              ))}
            </div>
          )}
        </>)}

        {tab === "stats" && (<>
          <div style={{ fontSize:"16px", fontWeight:500, color:"#F0EAF5", marginBottom:"1.25rem" }}>
            Преглед на седмицата
          </div>
          {allStats.length === 0 ? (
            <div style={{ color:"rgba(240,234,245,0.35)", fontSize:"14px", textAlign:"center", padding:"3rem" }}>
              Все още няма данни
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {allStats.map(s => <StatsCard key={s.id} stat={s} />)}
            </div>
          )}
        </>)}
      </div>

      {modal !== null && (
        <HabitModal habit={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}