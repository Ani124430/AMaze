import { useState } from "react";

const P = "#9E48AD";
const P_GLOW = "rgba(158,72,173,0.35)";

export default function HabitModal({ habit, onClose, onSave }) {
  const isEdit = !!habit?.id;
  const [name, setName] = useState(habit?.name ?? "");
  const [desc, setDesc] = useState(habit?.description ?? "");
  const [focus, setFocus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) { setError("Въведи наименование"); return; }
    setLoading(true);
    try {
      await onSave({ name: name.trim(), description: desc.trim() }, isEdit ? habit.id : null);
      onClose();
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const inputStyle = (f) => ({
    width:"100%", background:"rgba(0,0,0,0.3)",
    border:`1px solid ${focus===f ? "rgba(158,72,173,0.6)" : "rgba(255,255,255,0.08)"}`,
    borderRadius:"12px", padding:"11px 15px", color:"#F0EAF5",
    fontSize:"14px", outline:"none", transition:"all 0.2s",
    boxShadow: focus===f ? "0 0 0 3px rgba(158,72,173,0.12)" : "none",
    fontFamily:"inherit",
  });

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      background:"rgba(5,2,15,0.7)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem",
    }} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{
        background:"rgba(20,10,35,0.9)",
        backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
        border:"1px solid rgba(158,72,173,0.25)",
        borderRadius:"24px", padding:"2rem", width:"100%", maxWidth:"420px",
        boxShadow:`0 0 60px rgba(158,72,173,0.2)`,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
          <div style={{ fontSize:"18px", fontWeight:600, color:"#F0EAF5" }}>
            {isEdit ? "Редактирай навик" : "Нов навик"}
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"8px", width:"30px", height:"30px", color:"rgba(240,234,245,0.5)",
            fontSize:"16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ✕
          </button>
        </div>

        {error && <div style={{ background:"rgba(220,50,50,0.1)", border:"1px solid rgba(220,50,50,0.25)",
          borderRadius:"10px", padding:"9px 13px", color:"#F87171", fontSize:"13px", marginBottom:"1rem" }}>
          {error}
        </div>}

        <div style={{ marginBottom:"1rem" }}>
          <label style={{ display:"block", fontSize:"11px", color:"rgba(240,234,245,0.45)",
            textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"7px" }}>
            Наименование *
          </label>
          <input style={inputStyle("name")} value={name}
            onChange={e=>setName(e.target.value)}
            onFocus={()=>setFocus("name")} onBlur={()=>setFocus(null)}
            placeholder="напр. Медитация сутрин" />
        </div>

        <div style={{ marginBottom:"1.75rem" }}>
          <label style={{ display:"block", fontSize:"11px", color:"rgba(240,234,245,0.45)",
            textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"7px" }}>
            Описание
          </label>
          <textarea style={{ ...inputStyle("desc"), height:"80px", resize:"none" }} value={desc}
            onChange={e=>setDesc(e.target.value)}
            onFocus={()=>setFocus("desc")} onBlur={()=>setFocus(null)}
            placeholder="По желание..." />
        </div>

        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:"12px",
            border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)",
            color:"rgba(240,234,245,0.6)", fontSize:"14px", cursor:"pointer", fontFamily:"inherit" }}>
            Откажи
          </button>
          <button onClick={handleSave} disabled={loading} style={{ flex:1, padding:"12px", borderRadius:"12px",
            border:"none", background:`linear-gradient(135deg, ${P}, #7B2FBE)`,
            color:"white", fontSize:"14px", fontWeight:600, cursor:"pointer",
            fontFamily:"inherit", opacity:loading?0.7:1,
            boxShadow:`0 4px 20px ${P_GLOW}` }}>
            {loading ? "..." : isEdit ? "Запази" : "Създай"}
          </button>
        </div>
      </div>
    </div>
  );
}