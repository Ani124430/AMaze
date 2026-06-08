import { useState } from "react";

const P = "#9E48AD";
const P_GLOW = "rgba(158,72,173,0.25)";

const glass = (done, hover) => ({
  background: done
    ? "rgba(158,72,173,0.12)"
    : hover ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${done ? "rgba(158,72,173,0.4)" : hover ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
  borderRadius: "16px",
  padding: "14px 18px",
  display: "flex", alignItems: "center", gap: "14px",
  transition: "all 0.2s",
  boxShadow: done ? `0 0 24px rgba(158,72,173,0.15)` : "none",
});

function WeekDots({ done }) {
  const days = [1,1,1,0,1,0,0];
  return (
    <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
      {days.map((d, i) => (
        <div key={i} style={{
          width:"6px", height:"6px", borderRadius:"50%",
          background: d ? P : "rgba(255,255,255,0.12)",
          boxShadow: d ? `0 0 6px ${P_GLOW}` : "none",
        }} />
      ))}
    </div>
  );
}

export default function HabitCard({ habit, onToggle, onDelete, onEdit }) {
  const [hover, setHover] = useState(false);
  const [delHov, setDelHov] = useState(false);
  const done = habit.completed_today ?? false;
  const streak = habit.current_streak ?? 0;

  return (
    <div
      style={glass(done, hover)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(habit.id)}
        style={{
          width:"38px", height:"38px", borderRadius:"50%", flexShrink:0,
          border:`2px solid ${done ? P : "rgba(255,255,255,0.15)"}`,
          background: done ? `linear-gradient(135deg, ${P}, #7B2FBE)` : "rgba(0,0,0,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", transition:"all 0.2s",
          boxShadow: done ? `0 0 16px ${P_GLOW}` : "none",
        }}
      >
        {done && <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7l3.5 3.5 5.5-5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}
      </button>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:"14px", fontWeight:500, color:"#F0EAF5", marginBottom:"2px",
          display:"flex", alignItems:"center", gap:"8px" }}>
          {habit.name}
          {done && <span style={{ fontSize:"10px", background:"rgba(52,211,153,0.15)",
            color:"#34D399", padding:"2px 8px", borderRadius:"20px" }}>✓ виза</span>}
        </div>
        {habit.description && (
          <div style={{ fontSize:"12px", color:"rgba(240,234,245,0.4)",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {habit.description}
          </div>
        )}
      </div>

      {/* Week dots */}
      <WeekDots done={done} />

      {/* Streak badge */}
      <div style={{
        display:"flex", alignItems:"center", gap:"4px", flexShrink:0,
        background: streak > 0 ? "rgba(158,72,173,0.2)" : "rgba(255,255,255,0.05)",
        border:`1px solid ${streak > 0 ? "rgba(158,72,173,0.3)" : "rgba(255,255,255,0.08)"}`,
        color: streak > 0 ? "#C084D4" : "rgba(240,234,245,0.3)",
        padding:"4px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:500,
        boxShadow: streak > 0 ? `0 0 10px rgba(158,72,173,0.2)` : "none",
      }}>
        🔥 {streak}
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
        {[
          { label:"✎", onClick:() => onEdit(habit), danger:false },
          { label:"✕", onClick:() => onDelete(habit.id), danger:true },
        ].map(({ label, onClick, danger }) => (
          <button key={label} onClick={onClick}
            onMouseEnter={e => { if(danger) setDelHov(true); }}
            onMouseLeave={e => { if(danger) setDelHov(false); }}
            style={{
              width:"28px", height:"28px", borderRadius:"8px",
              border:`1px solid ${danger && delHov ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`,
              background: danger && delHov ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.04)",
              color: danger && delHov ? "#F87171" : "rgba(240,234,245,0.4)",
              cursor:"pointer", fontSize:"12px", transition:"all 0.15s",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >{label}</button>
        ))}
      </div>
    </div>
  );
}