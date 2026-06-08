const P = "#9E48AD";
const DAY_LABELS = ["П","В","С","Ч","П","С","Н"];

export default function StatsCard({ stat }) {
  const rate = stat.completion_rate_percent ?? 0;
  const lastWeek = stat.last_7_days ?? [];

  return (
    <div style={{
      background:"rgba(255,255,255,0.03)",
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
      border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:"18px", padding:"1.25rem",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
        <div>
          <div style={{ fontSize:"15px", fontWeight:500, color:"#F0EAF5", marginBottom:"2px" }}>{stat.name}</div>
          <div style={{ fontSize:"12px", color:"rgba(240,234,245,0.4)" }}>{stat.total_completions} изпълнения общо</div>
        </div>
        <div style={{ display:"flex", gap:"6px" }}>
          <div style={{ background:"rgba(158,72,173,0.2)", border:"1px solid rgba(158,72,173,0.3)",
            color:"#C084D4", padding:"4px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:500 }}>
            🔥 {stat.current_streak}
          </div>
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
            color:"rgba(240,234,245,0.4)", padding:"4px 10px", borderRadius:"20px", fontSize:"12px" }}>
            рекорд {stat.best_streak}
          </div>
        </div>
      </div>

      {/* 7-day grid */}
      <div style={{ display:"flex", gap:"6px", marginBottom:"1rem" }}>
        {(lastWeek.length > 0 ? lastWeek : DAY_LABELS.map(d=>({completed:false,date:d}))).map((day, i) => (
          <div key={i} style={{ flex:1, textAlign:"center" }}>
            <div style={{
              height:"30px", borderRadius:"8px", marginBottom:"5px",
              background: day.completed
                ? `linear-gradient(180deg, ${P}, rgba(123,47,190,0.7))`
                : "rgba(255,255,255,0.05)",
              border:`1px solid ${day.completed ? "rgba(158,72,173,0.5)" : "rgba(255,255,255,0.06)"}`,
              boxShadow: day.completed ? "0 0 10px rgba(158,72,173,0.3)" : "none",
              transition:"all 0.2s",
            }} />
            <div style={{ fontSize:"10px", color:"rgba(240,234,245,0.35)" }}>{DAY_LABELS[i]}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <div style={{ flex:1, height:"4px", background:"rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden" }}>
          <div style={{
            height:"100%", width:`${Math.min(100,rate)}%`,
            background: rate>=70
              ? "linear-gradient(90deg, #34D399, #059669)"
              : rate>=40
              ? `linear-gradient(90deg, ${P}, #7B2FBE)`
              : "linear-gradient(90deg, #F59E0B, #D97706)",
            borderRadius:"4px", transition:"width 0.6s ease",
          }} />
        </div>
        <div style={{ fontSize:"12px", color:"rgba(240,234,245,0.45)", minWidth:"32px", textAlign:"right" }}>
          {rate}%
        </div>
      </div>
    </div>
  );
}