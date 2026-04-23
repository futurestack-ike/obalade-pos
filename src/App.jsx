import { useState, useEffect, useCallback, useRef } from "react";

const SUPABASE_URL = "https://srcmohssomlkngvdkyxp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyY21vaHNzb21sa25ndmRreXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTI4MTcsImV4cCI6MjA5MjUyODgxN30.kDrYINdJVzeMR3n6861mAcIbyG55EIygrs2b3_gCWf8";
const OWNER_PIN = "1234";
const MENU_CATEGORIES = ["Suya","Main","Soup","Fried","Standalone","Beans","Sides","Kids","Drinks"];
const STAGE_LABEL = { "not-started": "Not Started", "busy": "Busy", "ready": "Ready" };
const STAGE_NEXT  = { "not-started": "busy", "busy": "ready" };
const STAGE_BTN   = { "not-started": "Start Cooking →", "busy": "Mark Ready ✓" };
const STAGE_COLOR = { "not-started": "#c0392b", "busy": "#c9922a", "ready": "#1a6b3c" };
const STAGE_BG    = { "not-started": "#fdecea", "busy": "#fff8e6", "ready": "#eaf5ef" };

const DEFAULT_MENU = [
  { name: "Chicken Suya", category: "Suya", price: 0, available: true },
  { name: "Beef Suya", category: "Suya", price: 0, available: true },
  { name: "Roasted and Smoked Fish", category: "Suya", price: 0, available: true },
  { name: "Amala", category: "Main", price: 0, available: true },
  { name: "Attiekke with Fish", category: "Main", price: 0, available: true },
  { name: "Griesmeel / Semolina", category: "Main", price: 0, available: true },
  { name: "Pounded Yam", category: "Main", price: 0, available: true },
  { name: "Boiled Yam", category: "Main", price: 0, available: true },
  { name: "Garri / Eba", category: "Main", price: 0, available: true },
  { name: "Jollof Rice", category: "Main", price: 0, available: true },
  { name: "Fried Rice", category: "Main", price: 0, available: true },
  { name: "White Rice", category: "Main", price: 0, available: true },
  { name: "Banga", category: "Soup", price: 0, available: true },
  { name: "Seafood Okra", category: "Soup", price: 0, available: true },
  { name: "Eggs Sauce", category: "Soup", price: 0, available: true },
  { name: "Vegetable with Stockfish Soup", category: "Soup", price: 0, available: true },
  { name: "Egusi Soup", category: "Soup", price: 0, available: true },
  { name: "Bitterleaf Soup", category: "Soup", price: 0, available: true },
  { name: "Ewedu", category: "Soup", price: 0, available: true },
  { name: "Gbegiri", category: "Soup", price: 0, available: true },
  { name: "Ogbono", category: "Soup", price: 0, available: true },
  { name: "Okro / Okra", category: "Soup", price: 0, available: true },
  { name: "Assorted Meat", category: "Soup", price: 0, available: true },
  { name: "Fresh Fish Stew", category: "Soup", price: 0, available: true },
  { name: "Beef Stew", category: "Soup", price: 0, available: true },
  { name: "Chicken Stew", category: "Soup", price: 0, available: true },
  { name: "Turkey Stew", category: "Soup", price: 0, available: true },
  { name: "Ayamase Ofada with White Rice", category: "Soup", price: 0, available: true },
  { name: "Goat Pepper Soup", category: "Soup", price: 0, available: true },
  { name: "Nkwobi", category: "Soup", price: 0, available: true },
  { name: "Catfish Pepper Soup", category: "Soup", price: 0, available: true },
  { name: "Fried Fish with Plantain", category: "Fried", price: 0, available: true },
  { name: "Mackerel Fried", category: "Fried", price: 0, available: true },
  { name: "Normal Fried Tilapia", category: "Fried", price: 0, available: true },
  { name: "Merluza Fish per Piece", category: "Fried", price: 0, available: true },
  { name: "Asoro Yam Porridge", category: "Standalone", price: 0, available: true },
  { name: "Gizdodo Gizzard Plantain", category: "Standalone", price: 0, available: true },
  { name: "Normal Beans with Meat/Chicken", category: "Beans", price: 0, available: true },
  { name: "Jollof Beans", category: "Beans", price: 0, available: true },
  { name: "Normal Beans", category: "Beans", price: 0, available: true },
  { name: "Jollof Beans with Fried Yam", category: "Beans", price: 0, available: true },
  { name: "Normal Beans with Fried Yam/Plantain", category: "Beans", price: 0, available: true },
  { name: "Plantain with Jollof Beans", category: "Beans", price: 0, available: true },
  { name: "Plantain with Normal Beans", category: "Beans", price: 0, available: true },
  { name: "Small Fried Plantain", category: "Sides", price: 0, available: true },
  { name: "Big Fried Plantain", category: "Sides", price: 0, available: true },
  { name: "Big Fried Yam", category: "Sides", price: 0, available: true },
  { name: "Moi Moi", category: "Sides", price: 0, available: true },
  { name: "Fried Goat Meat", category: "Sides", price: 0, available: true },
  { name: "Extra Assorted Meat", category: "Sides", price: 0, available: true },
  { name: "Extra Stew", category: "Sides", price: 0, available: true },
  { name: "Patat (Fries) with Nuggets/Frikandel", category: "Kids", price: 0, available: true },
  { name: "Rice with Plantain and Chicken/Beef", category: "Kids", price: 0, available: true },
  { name: "Rice with Chicken/Beef", category: "Kids", price: 0, available: true },
  { name: "Super Malt", category: "Drinks", price: 4.0, available: true },
  { name: "Vita Malt", category: "Drinks", price: 4.0, available: true },
  { name: "Malta Guinness", category: "Drinks", price: 4.0, available: true },
  { name: "Alomo", category: "Drinks", price: 7.5, available: true },
  { name: "Star", category: "Drinks", price: 7.5, available: true },
  { name: "Gulder", category: "Drinks", price: 7.5, available: true },
  { name: "Small Heineken", category: "Drinks", price: 2.5, available: true },
  { name: "Big Heineken", category: "Drinks", price: 3.5, available: true },
  { name: "Guinness", category: "Drinks", price: 5.0, available: true },
  { name: "Orijin", category: "Drinks", price: 3.5, available: true },
  { name: "Big Red Wine", category: "Drinks", price: 15.0, available: true },
  { name: "Small Red Wine", category: "Drinks", price: 7.5, available: true },
  { name: "Big White Wine", category: "Drinks", price: 15.0, available: true },
  { name: "Small White Wine", category: "Drinks", price: 7.5, available: true },
  { name: "Spa Water", category: "Drinks", price: 2.5, available: true },
  { name: "Spa Intense", category: "Drinks", price: 3.0, available: true },
  { name: "African Fanta", category: "Drinks", price: 4.0, available: true },
  { name: "Aloe Vera", category: "Drinks", price: 4.0, available: true },
  { name: "RedBull", category: "Drinks", price: 4.0, available: true },
  { name: "Sprite", category: "Drinks", price: 2.5, available: true },
  { name: "Fanta", category: "Drinks", price: 2.5, available: true },
  { name: "Cola", category: "Drinks", price: 2.5, available: true },
];

// ── Supabase ──────────────────────────────────────────────────────
const H = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, "Content-Type": "application/json" };
const authH = (token) => ({ apikey: SUPABASE_ANON, Authorization: `Bearer ${token}`, "Content-Type": "application/json" });

const sbAuth = async (email, password) => {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error_description || d.msg || "Login failed");
  return d;
};

const sbRefresh = async (refresh_token) => {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error("Session expired");
  return d;
};

const dbGet    = async p => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${p}`,{headers:H}); if(!r.ok) throw new Error(await r.text()); return r.json(); };
const dbPost   = async (p,b) => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${p}`,{method:"POST",headers:{...H,Prefer:"return=representation"},body:JSON.stringify(b)}); if(!r.ok) throw new Error(await r.text()); const t=await r.text(); return t?JSON.parse(t):null; };
const dbPatch  = async (p,b) => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${p}`,{method:"PATCH",headers:{...H,Prefer:"return=representation"},body:JSON.stringify(b)}); if(!r.ok) throw new Error(await r.text()); const t=await r.text(); return t?JSON.parse(t):null; };
const dbDelete = async p => { const r=await fetch(`${SUPABASE_URL}/rest/v1/${p}`,{method:"DELETE",headers:H}); if(!r.ok) throw new Error(await r.text()); };

// ── Helpers ───────────────────────────────────────────────────────
const timeAgo = ts => { const s=Math.floor((Date.now()-new Date(ts))/1000); if(s<60) return `${s}s`; if(s<3600) return `${Math.floor(s/60)}m`; return `${Math.floor(s/3600)}h`; };
const getStartOf = p => { const d=new Date(); if(p==="today"){d.setHours(0,0,0,0);return d;} if(p==="week"){d.setDate(d.getDate()-7);d.setHours(0,0,0,0);return d;} if(p==="month"){d.setMonth(d.getMonth()-1);d.setHours(0,0,0,0);return d;} d.setFullYear(d.getFullYear()-1);d.setHours(0,0,0,0);return d; };
const orderLabel = o => o.type==="dine-in" ? `Table ${o.table_number}` : o.table_number||"Takeaway";

const safeNotif = {
  supported: () => { try { return "Notification" in window; } catch(e) { return false; } },
  permission: () => { try { return typeof Notification !== "undefined" ? Notification.permission : "denied"; } catch(e) { return "denied"; } },
  request: async () => { try { if(!safeNotif.supported()) return false; if(safeNotif.permission()==="granted") return true; const p=await Notification.requestPermission(); return p==="granted"; } catch(e) { return false; } },
  send: (title, body) => { try { if(safeNotif.permission()==="granted") new Notification(title,{body,icon:"/favicon.ico"}); } catch(e) {} },
};

// ── Logo ──────────────────────────────────────────────────────────
const ObaladeLogo = ({size=44, white=false}) => (
  <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
    <rect width="110" height="110" rx="12" fill={white?"rgba(255,255,255,0.15)":"#1a6b3c"}/>
    <rect x="8" y="50" width="94" height="7" rx="3.5" fill="#c9922a"/>
    <rect x="12" y="34" width="18" height="24" rx="5" fill="#f0c060"/>
    <rect x="36" y="30" width="18" height="28" rx="5" fill="#e8b84b"/>
    <rect x="60" y="34" width="18" height="24" rx="5" fill="#f0c060"/>
    <rect x="84" y="36" width="14" height="20" rx="5" fill="#e8b84b"/>
    <text x="55" y="78" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="13" fill="white" letterSpacing="1.5">OBALADE</text>
    <text x="55" y="92" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="13" fill="#c9922a" letterSpacing="2">SUYA</text>
    <text x="55" y="104" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fill="rgba(255,255,255,0.7)" letterSpacing="0.8">AMSTERDAM</text>
  </svg>
);

// ── CSS ───────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
:root{
  --g:#1a6b3c;--gl:#2d8a52;--gp:#eaf5ef;--gd:#0f4024;
  --gold:#c9922a;--red:#c0392b;--redf:#fdecea;
  --bg:#f4f2ed;--card:#fff;--text:#1a1a10;--muted:#8a8a7a;
  --border:#e4e0d8;--sh:0 2px 10px rgba(0,0,0,.06);
  --r:16px;--rS:10px;
  --sidebar:260px;
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);}

/* ── Layout ── */
.app{display:flex;flex-direction:column;min-height:100vh;}

/* Mobile */
.mobile-shell{display:flex;flex-direction:column;min-height:100vh;max-width:480px;margin:0 auto;}

/* Desktop shell */
.desktop-shell{display:flex;height:100vh;overflow:hidden;}

/* Sidebar */
.sidebar{width:var(--sidebar);background:var(--g);display:flex;flex-direction:column;height:100vh;position:fixed;left:0;top:0;z-index:100;}
.sidebar-logo{padding:24px 20px;border-bottom:1px solid rgba(255,255,255,.1);}
.sidebar-logo-name{font-family:'Playfair Display',serif;font-weight:900;font-size:17px;color:#fff;margin-top:10px;line-height:1.2;}
.sidebar-logo-sub{font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.8px;text-transform:uppercase;margin-top:2px;}
.sidebar-nav{flex:1;padding:16px 12px;}
.snav-btn{width:100%;background:none;border:none;color:rgba(255,255,255,.7);font-family:'Inter',sans-serif;font-size:14px;font-weight:600;padding:12px 16px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:12px;margin-bottom:4px;transition:all .15s;text-align:left;}
.snav-btn:hover{background:rgba(255,255,255,.1);color:#fff;}
.snav-btn.on{background:rgba(255,255,255,.18);color:#fff;}
.snav-btn svg{width:20px;height:20px;flex-shrink:0;}
.snav-badge{background:var(--red);color:#fff;border-radius:10px;font-size:10px;font-weight:700;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;padding:0 4px;margin-left:auto;}
.sidebar-footer{padding:16px 12px;border-top:1px solid rgba(255,255,255,.1);}
.sidebar-footer-btn{width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);font-family:'Inter',sans-serif;font-size:13px;font-weight:600;padding:10px 16px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.sidebar-footer-btn:hover{background:rgba(255,255,255,.18);color:#fff;}

/* Desktop main */
.desktop-main{margin-left:var(--sidebar);flex:1;display:flex;height:100vh;overflow:hidden;}
.desktop-panel{flex:1;overflow-y:auto;padding:28px;height:100vh;}
.desktop-panel+.desktop-panel{border-left:1px solid var(--border);}
.desktop-panel-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;margin-bottom:4px;}
.desktop-panel-sub{color:var(--muted);font-size:13px;margin-bottom:24px;}

/* Mobile header */
.hdr{background:var(--g);height:66px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 3px 18px rgba(15,64,36,.3);}
.hdr-brand{display:flex;align-items:center;gap:11px;}
.hdr-name{font-family:'Playfair Display',serif;font-weight:900;font-size:16px;color:#fff;line-height:1.15;}
.hdr-sub{font-size:10px;color:rgba(255,255,255,.55);margin-top:1px;letter-spacing:.6px;text-transform:uppercase;}
.hdr-actions{display:flex;gap:7px;}
.hdr-btn{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:7px 13px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;}

/* Mobile nav */
.nav{position:fixed;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;background:var(--card);border-top:1px solid var(--border);display:flex;z-index:50;padding-bottom:env(safe-area-inset-bottom,0px);box-shadow:0 -2px 16px rgba(0,0,0,.07);}
.nt{flex:1;background:none;border:none;padding:10px 4px 13px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;color:var(--muted);font-size:10px;font-weight:600;font-family:'Inter',sans-serif;position:relative;transition:color .15s;}
.nt.on{color:var(--g);}
.nt svg{width:22px;height:22px;}
.ndot{position:absolute;top:7px;right:calc(50% - 20px);background:var(--red);color:#fff;border-radius:10px;font-size:9px;font-weight:700;min-width:16px;height:16px;display:flex;align-items:center;justify-content:center;padding:0 3px;}

.pg{flex:1;padding:18px 16px 92px;}
.sh{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;margin-bottom:2px;}
.ss{color:var(--muted);font-size:13px;margin-bottom:20px;}
.slabel{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:9px;}
.card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.btn{border:none;border-radius:var(--rS);padding:14px 20px;font-family:'Inter',sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;line-height:1;}
.bp{background:var(--g);color:#fff;} .bp:active{transform:scale(.97);}
.bg2{background:var(--gold);color:#fff;}
.bo{background:transparent;border:1.5px solid var(--border);color:var(--text);}
.bd{background:var(--redf);color:var(--red);border:none;}
.bsm{padding:9px 14px;font-size:13px;border-radius:8px;}
.bw{width:100%;} .btn:disabled{opacity:.4;cursor:not-allowed;}
.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px;}
.ttile{background:var(--card);border:2px solid var(--border);border-radius:var(--r);padding:26px 14px;display:flex;flex-direction:column;align-items:center;gap:11px;cursor:pointer;transition:all .15s;font-family:'Playfair Display',serif;font-weight:700;font-size:16px;}
.ttile svg{width:38px;height:38px;} .ttile.on{border-color:var(--g);background:var(--gp);color:var(--g);}
.cats{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;scrollbar-width:none;}
.cats::-webkit-scrollbar{display:none;}
.cp{flex-shrink:0;padding:9px 18px;border-radius:24px;border:1.5px solid var(--border);background:var(--card);font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s;}
.cp.on{background:var(--g);border-color:var(--g);color:#fff;}
.mi{background:var(--card);border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--sh);margin-bottom:8px;}
.mn{font-weight:500;font-size:14px;margin-bottom:3px;line-height:1.3;}
.mp{color:var(--g);font-weight:700;font-size:15px;}
.qc{display:flex;align-items:center;gap:10px;}
.qb{width:34px;height:34px;border-radius:50%;border:none;background:var(--gp);color:var(--g);font-size:22px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:all .12s;}
.qb:active{transform:scale(.88);} .qb.rm{background:var(--redf);color:var(--red);}
.qn{font-weight:700;font-size:17px;min-width:22px;text-align:center;}
.cbar{position:fixed;bottom:65px;left:16px;right:16px;max-width:448px;margin:0 auto;background:var(--g);color:#fff;border-radius:14px;padding:15px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 24px rgba(15,64,36,.4);cursor:pointer;z-index:40;}
.cbar-desktop{position:sticky;bottom:0;background:var(--g);color:#fff;border-radius:14px;padding:15px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 24px rgba(15,64,36,.4);cursor:pointer;margin-top:16px;}
.cbl{font-size:12px;opacity:.7;} .cbt{font-family:'Playfair Display',serif;font-weight:900;font-size:22px;}
.cbb{background:#fff;color:var(--g);border-radius:9px;padding:10px 16px;font-weight:700;font-size:13px;}
.kc{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:12px;overflow:hidden;border-left:4px solid #ccc;}
.kch{padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--border);}
.kct{font-family:'Playfair Display',serif;font-weight:700;font-size:17px;}
.kctm{font-size:12px;color:var(--muted);margin-top:2px;}
.kcb{padding:12px 16px;}
.ki{font-size:14px;padding:5px 0;display:flex;gap:8px;align-items:baseline;}
.kiq{font-weight:700;color:var(--g);font-size:15px;}
.kin{font-size:12px;color:var(--muted);}
.kcf{padding:12px 16px;border-top:1px solid var(--border);}
.sbadge{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.oc{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:10px;overflow:hidden;cursor:pointer;}
.ocr{padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.ocn{font-family:'Playfair Display',serif;font-weight:700;font-size:16px;margin-bottom:5px;}
.ocm{display:flex;gap:6px;flex-wrap:wrap;}
.detail-item{padding:12px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.detail-item:last-child{border-bottom:none;}
.detail-item-name{font-size:14px;font-weight:500;}
.detail-item-note{font-size:12px;color:var(--muted);margin-top:2px;}
.action-bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;}
.pmethods{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;}
.ptile{background:var(--card);border:2px solid var(--border);border-radius:var(--r);padding:22px 16px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:all .15s;font-weight:700;font-size:15px;}
.ptile svg{width:32px;height:32px;} .ptile.on{border-color:var(--g);background:var(--gp);color:var(--g);}
.periods{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.pb{padding:9px 18px;border-radius:24px;border:1.5px solid var(--border);background:var(--card);font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;}
.pb.on{background:var(--g);border-color:var(--g);color:#fff;}
.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
.sc{background:var(--card);border-radius:var(--r);padding:16px;box-shadow:var(--sh);}
.sl{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;}
.sv{font-family:'Playfair Display',serif;font-weight:900;font-size:26px;color:var(--g);}
.ss2{font-size:12px;color:var(--muted);margin-top:2px;}
.tlist{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.tr{padding:13px 16px;display:flex;align-items:center;border-bottom:1px solid var(--border);}
.tr:last-child{border-bottom:none;}
.trk{width:26px;height:26px;border-radius:50%;background:var(--gp);color:var(--g);font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;margin-right:12px;flex-shrink:0;}
.trn{flex:1;font-size:14px;font-weight:500;}
.trc{font-weight:700;color:var(--muted);font-size:13px;}
.ai{background:var(--card);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:var(--sh);margin-bottom:8px;}
.ain{font-weight:500;font-size:14px;} .aic{font-size:12px;color:var(--muted);}
.pinp{width:82px;border:1.5px solid var(--border);border-radius:8px;padding:8px 10px;font-size:14px;font-weight:700;font-family:'Inter',sans-serif;text-align:right;color:var(--g);}
.pinp:focus{outline:none;border-color:var(--g);}
.tog{position:relative;width:44px;height:24px;flex-shrink:0;}
.tog input{opacity:0;width:0;height:0;}
.tsl{position:absolute;cursor:pointer;inset:0;background:var(--border);border-radius:24px;transition:.2s;}
.tsl:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s;}
input:checked+.tsl{background:var(--g);} input:checked+.tsl:before{transform:translateX(20px);}
.pinwrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;gap:26px;}
.pindots{display:flex;gap:14px;}
.pindot{width:14px;height:14px;border-radius:50%;border:2px solid var(--g);transition:background .15s;}
.pindot.on{background:var(--g);}
.pingrid{display:grid;grid-template-columns:repeat(3,76px);gap:12px;}
.pinkey{width:76px;height:76px;border-radius:50%;border:none;background:var(--card);box-shadow:var(--sh);font-family:'Playfair Display',serif;font-size:26px;font-weight:700;cursor:pointer;transition:all .15s;}
.pinkey:active{transform:scale(.88);background:var(--gp);}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-end;}
.modal{background:var(--card);border-radius:20px 20px 0 0;padding:24px 20px;width:100%;}
.modalt{font-family:'Playfair Display',serif;font-weight:700;font-size:19px;margin-bottom:16px;}
.confirm-wrap{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:250;display:flex;align-items:center;justify-content:center;padding:20px;}
.confirm-box{background:var(--card);border-radius:16px;padding:24px;width:100%;max-width:320px;}
.nbanner{background:var(--gp);border:1.5px solid var(--g);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:10px;margin-bottom:16px;cursor:pointer;}

/* Login */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--g);padding:24px;}
.login-box{background:var(--card);border-radius:24px;padding:40px 32px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.2);}
.login-logo{display:flex;justify-content:center;margin-bottom:24px;}
.login-title{font-family:'Playfair Display',serif;font-weight:900;font-size:26px;text-align:center;margin-bottom:4px;}
.login-sub{color:var(--muted);font-size:14px;text-align:center;margin-bottom:32px;}
.login-err{background:var(--redf);color:var(--red);border-radius:10px;padding:12px 16px;font-size:13px;font-weight:600;margin-bottom:16px;text-align:center;}

/* Misc */
.divider{height:1px;background:var(--border);margin:13px 0;}
.row{display:flex;align-items:center;justify-content:space-between;}
.empty{text-align:center;padding:48px 24px;color:var(--muted);}
.emico{font-size:46px;margin-bottom:12px;}
.inp{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:14px 16px;font-size:15px;font-family:'Inter',sans-serif;background:var(--card);color:var(--text);margin-bottom:12px;}
.inp:focus{outline:none;border-color:var(--g);}
.lbl{font-size:13px;font-weight:600;color:var(--muted);margin-bottom:6px;display:block;}
.setup{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:72vh;gap:20px;padding:32px 24px;text-align:center;}
.toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a1a10;color:#fff;padding:11px 20px;border-radius:10px;font-size:14px;font-weight:500;z-index:400;animation:fio 2.5s ease forwards;white-space:nowrap;pointer-events:none;}
@keyframes fio{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}78%{opacity:1}100%{opacity:0}}
`;

// ── Icons ─────────────────────────────────────────────────────────
const Ic = {
  New:      ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Kitchen:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Orders:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
  Back:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  DineIn:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2s-5 3-5 9v6"/><path d="M21 21H16"/></svg>,
  Takeaway: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Cash:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
  Card:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Refresh:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  Edit:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  Bell:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Arrow:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Reports:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Admin:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Lock:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Logout:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const Toast = ({msg}) => msg ? <div className="toast">{msg}</div> : null;
const StageBadge = ({status}) => (
  <span className="sbadge" style={{background:STAGE_BG[status]||"#f0f0ec",color:STAGE_COLOR[status]||"#888"}}>
    {status==="not-started"?"🔴":status==="busy"?"🟡":"🟢"} {STAGE_LABEL[status]||status}
  </span>
);
const Confirm = ({title,msg,onOk,onCancel,danger}) => (
  <div className="confirm-wrap" onClick={onCancel}>
    <div className="confirm-box" onClick={e=>e.stopPropagation()}>
      <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,marginBottom:8}}>{title}</div>
      <div style={{color:"var(--muted)",fontSize:14,marginBottom:20}}>{msg}</div>
      <div style={{display:"flex",gap:10}}>
        <button className="btn bo bsm" style={{flex:1}} onClick={onCancel}>Cancel</button>
        <button className={`btn bsm ${danger?"bd":"bp"}`} style={{flex:1}} onClick={onOk}>{danger?"Delete":"Confirm"}</button>
      </div>
    </div>
  </div>
);

// ── Login Screen ──────────────────────────────────────────────────
const LoginScreen = ({onLogin}) => {
  const [email,setEmail]=useState("shop@obaladesuya.nl");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);

  const login = async () => {
    setBusy(true); setErr("");
    try {
      const d = await sbAuth(email, pw);
      localStorage.setItem("sb_access", d.access_token);
      localStorage.setItem("sb_refresh", d.refresh_token);
      onLogin(d);
    } catch(e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <div className="login-wrap">
      <style>{S}</style>
      <div className="login-box">
        <div className="login-logo"><ObaladeLogo size={80}/></div>
        <div className="login-title">Obalade Suya</div>
        <div className="login-sub">POS System · Amsterdam</div>
        {err && <div className="login-err">{err}</div>}
        <label className="lbl">Email</label>
        <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/>
        <label className="lbl">Password</label>
        <input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"
          onKeyDown={e=>e.key==="Enter"&&login()}/>
        <button className="btn bp bw" onClick={login} disabled={busy||!pw}>
          {busy?"Signing in…":"Sign In"}
        </button>
      </div>
    </div>
  );
};

// ── PIN Screen ────────────────────────────────────────────────────
const PinScreen = ({title,onSuccess,onCancel}) => {
  const [pin,setPin]=useState(""); const [err,setErr]=useState(false);
  const press = k => {
    if(pin.length>=4) return;
    const next=pin+k; setPin(next); setErr(false);
    if(next.length===4){ if(next===OWNER_PIN) onSuccess(); else setTimeout(()=>{setPin("");setErr(true);},300); }
  };
  return (
    <div className="pg"><div className="pinwrap">
      <div style={{textAlign:"center"}}><div className="sh">{title}</div><div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>Enter 4-digit PIN</div></div>
      <div className="pindots">{[0,1,2,3].map(i=><div key={i} className={`pindot${pin.length>i?" on":""}`}/>)}</div>
      {err&&<div style={{color:"var(--red)",fontWeight:600,fontSize:14}}>Incorrect PIN</div>}
      <div className="pingrid">
        {[1,2,3,4,5,6,7,8,9].map(n=><button key={n} className="pinkey" onClick={()=>press(String(n))}>{n}</button>)}
        <div/><button className="pinkey" onClick={()=>press("0")}>0</button>
        <button className="pinkey" style={{fontSize:18}} onClick={()=>setPin(p=>p.slice(0,-1))}>⌫</button>
      </div>
      {onCancel&&<button className="btn bo bsm" onClick={onCancel}>Cancel</button>}
    </div></div>
  );
};

const SetupScreen = ({onSeed,seeding}) => (
  <div className="pg"><div className="setup">
    <ObaladeLogo size={96}/>
    <div><div className="sh" style={{textAlign:"center"}}>Welcome!</div><div style={{color:"var(--muted)",fontSize:13,marginTop:6,textAlign:"center",maxWidth:260}}>Load the full menu to get started.</div></div>
    <button className="btn bp bw" onClick={onSeed} disabled={seeding} style={{maxWidth:260}}>{seeding?"Loading menu…":"🍖  Load Full Menu"}</button>
  </div></div>
);

// ── New Order ─────────────────────────────────────────────────────
const NewOrderScreen = ({onStart}) => {
  const [type,setType]=useState(null); const [ref,setRef]=useState("");
  return (
    <div className="pg">
      <div className="sh">New Order</div><div className="ss">Choose order type to begin</div>
      <div className="tgrid">
        <div className={`ttile${type==="dine-in"?" on":""}`} onClick={()=>setType("dine-in")}><Ic.DineIn/> Dine In</div>
        <div className={`ttile${type==="takeaway"?" on":""}`} onClick={()=>setType("takeaway")}><Ic.Takeaway/> Takeaway</div>
      </div>
      {type&&<><label className="lbl">{type==="dine-in"?"Table number *":"Customer name (optional)"}</label>
        <input className="inp" placeholder={type==="dine-in"?"e.g. 4":"e.g. Ahmed"} value={ref} onChange={e=>setRef(e.target.value)} autoFocus/></>}
      <button className="btn bp bw" disabled={!type||(type==="dine-in"&&!ref.trim())} onClick={()=>onStart(type,ref.trim())}>Continue to Menu →</button>
    </div>
  );
};

// ── Menu Builder ──────────────────────────────────────────────────
const MenuScreen = ({menuItems,orderType,tableRef,onSend,onBack,existingItems=[],editMode=false,addMode=false,desktop=false}) => {
  const initCart=()=>{const c={};existingItems.forEach(i=>{c[i.menu_item_id||i.id]=i.quantity;});return c;};
  const initNotes=()=>{const n={};existingItems.forEach(i=>{if(i.note)n[i.menu_item_id||i.id]=i.note;});return n;};
  const [cart,setCart]=useState(initCart);
  const [cat,setCat]=useState(MENU_CATEGORIES[0]);
  const [noteItem,setNoteItem]=useState(null);
  const [noteText,setNoteText]=useState("");
  const [notes,setNotes]=useState(initNotes);
  const [sending,setSending]=useState(false);
  const catItems=menuItems.filter(i=>i.available&&i.category===cat);
  const qty=id=>cart[id]||0;
  const add=item=>setCart(c=>({...c,[item.id]:(c[item.id]||0)+1}));
  const rmv=item=>setCart(c=>{const n={...c};n[item.id]>1?n[item.id]--:delete n[item.id];return n;});
  const cartList=Object.entries(cart).map(([id,quantity])=>({...menuItems.find(i=>i.id===id),quantity,note:notes[id]||""}));
  const total=cartList.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
  const itemCount=cartList.reduce((s,i)=>s+i.quantity,0);
  const send=async()=>{if(!cartList.length||sending)return;setSending(true);await onSend(cartList,total);setSending(false);};
  const wrap = desktop ? "desktop-panel" : "pg";
  return (
    <div className={wrap}>
      <div className="row" style={{marginBottom:16}}>
        <button className="btn bo bsm" onClick={onBack}><Ic.Back/> Back</button>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15}}>{editMode?"Edit Order":(orderType==="dine-in"?`Table ${tableRef}`:tableRef||"Takeaway")}</div>
          {!editMode&&<div style={{fontSize:11,color:"var(--muted)",textTransform:"capitalize"}}>{orderType}</div>}
        </div>
      </div>
      <div className="cats">{MENU_CATEGORIES.map(c=><div key={c} className={`cp${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</div>)}</div>
      {catItems.length===0&&<div className="empty"><div className="emico">🍽️</div><div style={{fontSize:14}}>No items</div></div>}
      {catItems.map(item=>(
        <div key={item.id} className="mi">
          <div style={{flex:1,paddingRight:12}}><div className="mn">{item.name}</div><div className="mp">€{Number(item.price).toFixed(2)}</div></div>
          {qty(item.id)>0?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <div className="qc"><button className="qb rm" onClick={()=>rmv(item)}>−</button><span className="qn">{qty(item.id)}</span><button className="qb" onClick={()=>add(item)}>+</button></div>
              <button style={{fontSize:11,color:"var(--muted)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setNoteItem(item);setNoteText(notes[item.id]||"");}}>
                {notes[item.id]?"✏️ note":"+ note"}
              </button>
            </div>
          ):<button className="qb" onClick={()=>add(item)}>+</button>}
        </div>
      ))}
      {itemCount>0&&(
        desktop
          ? <div className="cbar-desktop" onClick={send} style={{cursor:sending?"wait":"pointer"}}>
              <div><div className="cbl">{itemCount} item{itemCount!==1?"s":""}</div><div className="cbt">€{total.toFixed(2)}</div></div>
              <div className="cbb">{sending?"Saving…":(addMode?"Add to Order →":editMode?"Save Changes →":"Send to Kitchen →")}</div>
            </div>
          : <div className="cbar" onClick={send} style={{cursor:sending?"wait":"pointer"}}>
              <div><div className="cbl">{itemCount} item{itemCount!==1?"s":""}</div><div className="cbt">€{total.toFixed(2)}</div></div>
              <div className="cbb">{sending?"Saving…":(addMode?"Add to Order →":editMode?"Save Changes →":"Send to Kitchen →")}</div>
            </div>
      )}
      {noteItem&&(
        <div className="overlay" onClick={()=>setNoteItem(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modalt">Note — {noteItem.name}</div>
            <input className="inp" placeholder="e.g. no pepper, extra sauce…" value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus/>
            <button className="btn bp bw" onClick={()=>{setNotes(n=>({...n,[noteItem.id]:noteText}));setNoteItem(null);}}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Kitchen Panel ─────────────────────────────────────────────────
const KitchenPanel = ({orders,orderItems,onAdvance,onRefresh,desktop=false}) => {
  const [notifEnabled,setNotifEnabled]=useState(safeNotif.permission()==="granted");
  const enableNotifs=async()=>{const ok=await safeNotif.request();setNotifEnabled(ok);};
  const grouped=[
    ...orders.filter(o=>o.status==="not-started"),
    ...orders.filter(o=>o.status==="busy"),
    ...orders.filter(o=>o.status==="ready"),
  ];
  const wrap = desktop ? "desktop-panel" : "pg";
  return (
    <div className={wrap}>
      {desktop
        ? <div><div className="desktop-panel-title">Kitchen</div><div className="desktop-panel-sub">{grouped.length} active order{grouped.length!==1?"s":""}</div></div>
        : <><div className="row" style={{marginBottom:4}}><div className="sh">Kitchen</div><button className="btn bo bsm" onClick={onRefresh}><Ic.Refresh/></button></div><div className="ss">{grouped.length} active order{grouped.length!==1?"s":""}</div></>
      }
      {!notifEnabled&&safeNotif.supported()&&(
        <div className="nbanner" onClick={enableNotifs}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span style={{flex:1,fontSize:13,color:"var(--g)",fontWeight:600}}>Tap to enable ready notifications</span>
          <span style={{fontSize:12,color:"var(--g)"}}>Enable →</span>
        </div>
      )}
      {grouped.length===0&&<div className="empty"><div className="emico">🍳</div><div style={{fontSize:14}}>No active orders</div></div>}
      {grouped.map(o=>{
        const items=orderItems.filter(i=>i.order_id===o.id);
        const nextStage=STAGE_NEXT[o.status];
        return (
          <div key={o.id} className="kc" style={{borderLeftColor:STAGE_COLOR[o.status]||"#ccc"}}>
            <div className="kch">
              <div><div className="kct">{orderLabel(o)}</div><div className="kctm">{timeAgo(o.created_at)} ago</div></div>
              <StageBadge status={o.status}/>
            </div>
            <div className="kcb">
              {items.map(i=>(
                <div key={i.id} className="ki">
                  <span className="kiq">{i.quantity}×</span><span>{i.item_name}</span>
                  {i.note&&<span className="kin"> — {i.note}</span>}
                </div>
              ))}
            </div>
            {nextStage&&(
              <div className="kcf">
                <button className="btn bw bsm" style={{background:STAGE_COLOR[nextStage],color:"#fff"}} onClick={()=>onAdvance(o.id,nextStage)}>
                  {STAGE_BTN[o.status]}
                </button>
              </div>
            )}
          </div>
        );
      })}
      {desktop&&<div style={{height:16}}/>}
    </div>
  );
};

// ── Orders Panel ──────────────────────────────────────────────────
const OrdersPanel = ({orders,onSelect,desktop=false}) => {
  const active=orders.filter(o=>o.status!=="paid").sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const done=orders.filter(o=>o.status==="paid").sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,20);
  const wrap = desktop ? "desktop-panel" : "pg";
  return (
    <div className={wrap}>
      {desktop
        ? <div><div className="desktop-panel-title">Orders</div><div className="desktop-panel-sub">Tap to view details & payment</div></div>
        : <><div className="sh">Orders</div><div className="ss">Tap to view details</div></>
      }
      {active.length===0&&done.length===0&&<div className="empty"><div className="emico">📋</div><div style={{fontSize:14}}>No orders yet today</div></div>}
      {active.length>0&&<>
        <div className="slabel">Active ({active.length})</div>
        {active.map(o=>(
          <div key={o.id} className="oc" onClick={()=>onSelect(o)}>
            <div className="ocr">
              <div style={{flex:1}}>
                <div className="ocn">{orderLabel(o)}</div>
                <div className="ocm">
                  <span className="sbadge" style={{background:o.type==="dine-in"?"#e8f0fe":"#fef3e8",color:o.type==="dine-in"?"#1a56db":"#b45309",fontSize:10}}>{o.type}</span>
                  <StageBadge status={o.status}/>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:20,color:"var(--g)"}}>€{Number(o.total).toFixed(2)}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{timeAgo(o.created_at)} ago</div>
                </div>
                <Ic.Arrow/>
              </div>
            </div>
          </div>
        ))}
      </>}
      {done.length>0&&<>
        <div className="slabel" style={{marginTop:20}}>Completed today</div>
        {done.map(o=>(
          <div key={o.id} className="oc" style={{opacity:.55}} onClick={()=>onSelect(o)}>
            <div className="ocr">
              <div style={{flex:1}}>
                <div className="ocn">{orderLabel(o)}</div>
                <div className="ocm"><span className="sbadge" style={{background:"#f0f0ec",color:"var(--muted)",fontSize:10}}>paid</span></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:18}}>€{Number(o.total).toFixed(2)}</div>
                <Ic.Arrow/>
              </div>
            </div>
          </div>
        ))}
      </>}
    </div>
  );
};

// ── Order Detail ──────────────────────────────────────────────────
const OrderDetailScreen = ({order,orderItems,isAdmin,onBack,onPay,onEdit,onDelete,onAddItems,desktop=false}) => {
  const [confirmDel,setConfirmDel]=useState(false);
  const items=orderItems.filter(i=>i.order_id===order.id);
  const wrap = desktop ? "desktop-panel" : "pg";
  return (
    <div className={wrap}>
      <button className="btn bo bsm" style={{marginBottom:16}} onClick={onBack}><Ic.Back/> Back</button>
      <div className="sh">{orderLabel(order)}</div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <span className="sbadge" style={{background:order.type==="dine-in"?"#e8f0fe":"#fef3e8",color:order.type==="dine-in"?"#1a56db":"#b45309"}}>{order.type}</span>
        <StageBadge status={order.status}/>
        <span style={{color:"var(--muted)",fontSize:13,alignSelf:"center"}}>{timeAgo(order.created_at)} ago</span>
      </div>
      <div className="card" style={{padding:"0 16px",marginBottom:20}}>
        {items.map(i=>(
          <div key={i.id} className="detail-item">
            <div style={{flex:1}}>
              <div className="detail-item-name">{i.quantity}× {i.item_name}</div>
              {i.note&&<div className="detail-item-note">Note: {i.note}</div>}
            </div>
            <div style={{fontWeight:700,color:"var(--g)",fontSize:14}}>€{(Number(i.price)*i.quantity).toFixed(2)}</div>
          </div>
        ))}
        <div className="row" style={{padding:"14px 0",borderTop:"2px solid var(--border)",marginTop:4}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18}}>Total</span>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:24,color:"var(--g)"}}>€{Number(order.total).toFixed(2)}</span>
        </div>
      </div>
      <div className="action-bar">
        {order.status==="ready"&&<button className="btn bg2 bsm" style={{flex:1}} onClick={()=>onPay(order)}>💳 Collect Payment</button>}
        {order.status!=="paid"&&order.status!=="ready"&&(
          <>
            <button className="btn bp bsm" style={{flex:1}} onClick={()=>onAddItems(order)}>+ Add Items</button>
            <button className="btn bo bsm" style={{flex:1}} onClick={()=>onEdit(order)}><Ic.Edit/> Edit</button>
          </>
        )}
        {isAdmin&&<button className="btn bd bsm" onClick={()=>setConfirmDel(true)}><Ic.Trash/></button>}
      </div>
      {confirmDel&&<Confirm title="Delete Order" msg={`Delete order for ${orderLabel(order)}? Cannot be undone.`} danger onOk={()=>{onDelete(order.id);setConfirmDel(false);}} onCancel={()=>setConfirmDel(false)}/>}
    </div>
  );
};

// ── Payment Screen ────────────────────────────────────────────────
const PaymentScreen = ({order,orderItems,onConfirm,onBack,desktop=false}) => {
  const [method,setMethod]=useState(null); const [busy,setBusy]=useState(false);
  const items=orderItems.filter(i=>i.order_id===order.id);
  const confirm=async()=>{setBusy(true);await onConfirm(order,method);setBusy(false);};
  const wrap = desktop ? "desktop-panel" : "pg";
  return (
    <div className={wrap}>
      <button className="btn bo bsm" style={{marginBottom:16}} onClick={onBack}><Ic.Back/> Back</button>
      <div className="sh">Payment</div><div className="ss">{orderLabel(order)}</div>
      <div className="card" style={{padding:16,marginBottom:16}}>
        {items.map(i=>(
          <div key={i.id} className="row" style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:14}}>{i.quantity}× {i.item_name}</span>
            <span style={{fontWeight:700,color:"var(--g)"}}>€{(Number(i.price)*i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="row" style={{paddingTop:14}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18}}>Total</span>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:26,color:"var(--g)"}}>€{Number(order.total).toFixed(2)}</span>
        </div>
      </div>
      <div style={{fontWeight:700,marginBottom:12}}>Payment method</div>
      <div className="pmethods">
        <div className={`ptile${method==="cash"?" on":""}`} onClick={()=>setMethod("cash")}><Ic.Cash/> Cash</div>
        <div className={`ptile${method==="card"?" on":""}`} onClick={()=>setMethod("card")}><Ic.Card/> Card</div>
      </div>
      <button className="btn bp bw" disabled={!method||busy} onClick={confirm}>
        <Ic.Check/> {busy?"Processing…":`Confirm — €${Number(order.total).toFixed(2)}`}
      </button>
    </div>
  );
};

// ── Reports Screen ────────────────────────────────────────────────
const ReportsScreen = ({orders,orderItems,payments,onLock,desktop=false}) => {
  const [period,setPeriod]=useState("today");
  const start=getStartOf(period);
  const paidOrders=orders.filter(o=>o.status==="paid"&&new Date(o.created_at)>=start);
  const filtPay=payments.filter(p=>new Date(p.paid_at)>=start);
  const revenue=filtPay.reduce((s,p)=>s+Number(p.amount),0);
  const avg=paidOrders.length?revenue/paidOrders.length:0;
  const dineIn=paidOrders.filter(o=>o.type==="dine-in").length;
  const takeaway=paidOrders.filter(o=>o.type==="takeaway").length;
  const cashT=filtPay.filter(p=>p.method==="cash").reduce((s,p)=>s+Number(p.amount),0);
  const cardT=filtPay.filter(p=>p.method==="card").reduce((s,p)=>s+Number(p.amount),0);
  const paidIds=new Set(paidOrders.map(o=>o.id));
  const counts={};
  orderItems.filter(i=>paidIds.has(i.order_id)).forEach(i=>{counts[i.item_name]=(counts[i.item_name]||0)+i.quantity;});
  const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const labels={today:"Today",week:"Last 7 days",month:"Last 30 days",year:"Last 12 months"};
  const wrap = desktop ? "desktop-panel" : "pg";
  return (
    <div className={wrap}>
      <div className="row" style={{marginBottom:20}}>
        <div>{desktop?<div className="desktop-panel-title">Reports</div>:<div className="sh">Reports</div>}</div>
        <button className="btn bo bsm" onClick={onLock}><Ic.Lock/> Lock</button>
      </div>
      <div className="periods">{["today","week","month","year"].map(p=><button key={p} className={`pb${period===p?" on":""}`} onClick={()=>setPeriod(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}</div>
      <div style={{color:"var(--muted)",fontSize:12,marginBottom:16}}>{labels[period]}</div>
      <div className="sgrid">
        <div className="sc"><div className="sl">Revenue</div><div className="sv">€{revenue.toFixed(2)}</div><div className="ss2">{paidOrders.length} orders</div></div>
        <div className="sc"><div className="sl">Avg Order</div><div className="sv">€{avg.toFixed(2)}</div><div className="ss2">per order</div></div>
        <div className="sc"><div className="sl">Dine In</div><div className="sv">{dineIn}</div><div className="ss2">orders</div></div>
        <div className="sc"><div className="sl">Takeaway</div><div className="sv">{takeaway}</div><div className="ss2">orders</div></div>
      </div>
      <div className="card" style={{padding:16,marginBottom:20}}>
        <div style={{fontWeight:700,marginBottom:12}}>Payment split</div>
        <div className="row" style={{marginBottom:8}}><span style={{color:"var(--muted)"}}>💵 Cash</span><span style={{fontWeight:700}}>€{cashT.toFixed(2)}</span></div>
        <div className="divider"/>
        <div className="row"><span style={{color:"var(--muted)"}}>💳 Card</span><span style={{fontWeight:700}}>€{cardT.toFixed(2)}</span></div>
      </div>
      {top.length>0&&<><div style={{fontWeight:700,marginBottom:12}}>Top selling items</div>
        <div className="tlist">{top.map(([name,ct],i)=><div key={name} className="tr"><div className="trk">{i+1}</div><div className="trn">{name}</div><div className="trc">{ct}×</div></div>)}</div></>}
      {top.length===0&&<div className="empty"><div className="emico">📊</div><div style={{fontSize:14}}>No sales data for this period</div></div>}
    </div>
  );
};

// ── Admin Screen ──────────────────────────────────────────────────
const AdminScreen = ({menuItems,onUpdate,onLock,desktop=false}) => {
  const [cat,setCat]=useState(MENU_CATEGORIES[0]); const [prices,setPrices]=useState({}); const [saved,setSaved]=useState({});
  const items=menuItems.filter(i=>i.category===cat);
  const savePrice=async item=>{const v=parseFloat(prices[item.id]);if(isNaN(v))return;await onUpdate(item.id,{price:v});setSaved(s=>({...s,[item.id]:true}));setTimeout(()=>setSaved(s=>({...s,[item.id]:false})),1500);setPrices(p=>{const n={...p};delete n[item.id];return n;});};
  const wrap = desktop ? "desktop-panel" : "pg";
  return (
    <div className={wrap}>
      <div className="row" style={{marginBottom:20}}>
        <div>{desktop?<div className="desktop-panel-title">Menu Admin</div>:<div className="sh">Menu Admin</div>}<div style={{color:"var(--muted)",fontSize:13,marginTop:2}}>Edit prices & availability</div></div>
        <button className="btn bo bsm" onClick={onLock}><Ic.Lock/> Lock</button>
      </div>
      <div className="cats" style={{marginBottom:20}}>{MENU_CATEGORIES.map(c=><div key={c} className={`cp${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</div>)}</div>
      {items.map(item=>(
        <div key={item.id} className="ai">
          <label className="tog"><input type="checkbox" checked={!!item.available} onChange={()=>onUpdate(item.id,{available:!item.available})}/><span className="tsl"/></label>
          <div style={{flex:1,opacity:item.available?1:.4}}><div className="ain">{item.name}</div><div className="aic">{item.category}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:"var(--muted)",fontSize:14}}>€</span>
            <input className="pinp" type="number" step="0.50" min="0"
              value={prices[item.id]!==undefined?prices[item.id]:Number(item.price).toFixed(2)}
              onChange={e=>setPrices(p=>({...p,[item.id]:e.target.value}))}
              onBlur={()=>{if(prices[item.id]!==undefined)savePrice(item);}}/>
            {saved[item.id]&&<span style={{color:"var(--g)",fontSize:14}}>✓</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const [session,setSession]         = useState(null);
  const [authLoading,setAuthLoading] = useState(true);
  const [tab,setTab]                 = useState("new");
  const [screen,setScreen]           = useState(null);
  const [orderCtx,setOrderCtx]       = useState(null);
  const [selectedOrder,setSelectedOrder] = useState(null);
  const [payOrder,setPayOrder]       = useState(null);
  const [editOrder,setEditOrder]     = useState(null);
  const [addItemsOrder,setAddItemsOrder] = useState(null);
  const [isAdmin,setIsAdmin]         = useState(false);
  const [isDesktop,setIsDesktop]     = useState(window.innerWidth>=768);

  const [menuItems,setMenuItems]   = useState([]);
  const [orders,setOrders]         = useState([]);
  const [orderItems,setOrderItems] = useState([]);
  const [payments,setPayments]     = useState([]);
  const [loading,setLoading]       = useState(true);
  const [seeding,setSeeding]       = useState(false);
  const [toast,setToast]           = useState("");

  const prevReadyIds = useRef(new Set());
  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  // Responsive detection
  useEffect(()=>{
    const fn=()=>setIsDesktop(window.innerWidth>=768);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);

  // Restore session
  useEffect(()=>{
    const tryRestore = async () => {
      const refresh = localStorage.getItem("sb_refresh");
      if(!refresh){ setAuthLoading(false); return; }
      try {
        const d = await sbRefresh(refresh);
        localStorage.setItem("sb_access", d.access_token);
        localStorage.setItem("sb_refresh", d.refresh_token);
        setSession(d);
      } catch(e) {
        localStorage.removeItem("sb_access");
        localStorage.removeItem("sb_refresh");
      }
      setAuthLoading(false);
    };
    tryRestore();
  },[]);

  const logout = () => {
    localStorage.removeItem("sb_access");
    localStorage.removeItem("sb_refresh");
    setSession(null);
    setIsAdmin(false);
  };

  const load = useCallback(async () => {
    try {
      const [m,o,oi,p] = await Promise.all([
        dbGet("menu_items?order=category,name"),
        dbGet("orders?order=created_at.desc&limit=200"),
        dbGet("order_items?order=created_at.asc"),
        dbGet("payments?order=paid_at.desc"),
      ]);
      setMenuItems(m||[]); setOrderItems(oi||[]); setPayments(p||[]);
      const newOrders=o||[];
      newOrders.filter(ord=>ord.status==="ready").forEach(ord=>{
        if(!prevReadyIds.current.has(ord.id)){
          safeNotif.send("🍽️ Order Ready!",`${orderLabel(ord)} is ready for collection`);
          prevReadyIds.current.add(ord.id);
        }
      });
      setOrders(newOrders);
      setSelectedOrder(prev=>prev?(newOrders.find(o=>o.id===prev.id)||prev):null);
    } catch(e){ showToast("⚠️ Connection error"); }
    setLoading(false);
  },[]);

  useEffect(()=>{ if(session){ load(); const t=setInterval(load,15000); return()=>clearInterval(t); } },[session,load]);

  const seedMenu=async()=>{ setSeeding(true); try{await dbPost("menu_items",DEFAULT_MENU);await load();showToast("✓ Menu loaded!");}catch(e){showToast("Seed failed");} setSeeding(false); };
  const createOrder=async(cartItems,total)=>{ try{ const[order]=await dbPost("orders",{type:orderCtx.type,table_number:orderCtx.ref||null,status:"not-started",total}); await dbPost("order_items",cartItems.map(i=>({order_id:order.id,item_name:i.name,category:i.category,quantity:i.quantity,price:Number(i.price),note:i.note||null}))); await load();showToast("✓ Sent to kitchen!");setScreen(null);setTab("kitchen"); }catch(e){showToast("Failed to send order");} };
  const updateOrder=async(cartItems,total)=>{ try{ await dbDelete(`order_items?order_id=eq.${editOrder.id}`); await dbPost("order_items",cartItems.map(i=>({order_id:editOrder.id,item_name:i.name,category:i.category,quantity:i.quantity,price:Number(i.price),note:i.note||null}))); await dbPatch(`orders?id=eq.${editOrder.id}`,{total}); await load();showToast("✓ Order updated!");setScreen(null);setEditOrder(null);setSelectedOrder(null);setTab("orders"); }catch(e){showToast("Failed to update");} };
  const addItemsToOrder = async (cartItems, _total) => {
    try {
      // Append new items to existing order_items
      await dbPost("order_items", cartItems.map(i=>({
        order_id: addItemsOrder.id,
        item_name: i.name,
        category: i.category,
        quantity: i.quantity,
        price: Number(i.price),
        note: i.note||null,
      })));
      // Recalculate total from all items
      const existing = orderItems.filter(i=>i.order_id===addItemsOrder.id);
      const existingTotal = existing.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
      const newTotal = existingTotal + cartItems.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
      await dbPatch(`orders?id=eq.${addItemsOrder.id}`,{total: newTotal});
      await load();
      showToast("✓ Items added!");
      setScreen("order-detail");
      setAddItemsOrder(null);
    } catch(e) { showToast("Failed to add items"); }
  };{ try{ await dbDelete(`order_items?order_id=eq.${id}`);await dbDelete(`payments?order_id=eq.${id}`);await dbDelete(`orders?id=eq.${id}`); await load();showToast("✓ Order deleted");setSelectedOrder(null);setScreen(null); }catch(e){showToast("Delete failed");} };
  const advanceStage=async(id,next)=>{ try{await dbPatch(`orders?id=eq.${id}`,{status:next});await load();showToast(`✓ ${STAGE_LABEL[next]}`);}catch(e){showToast("Error");} };
  const confirmPayment=async(order,method)=>{ try{ await dbPatch(`orders?id=eq.${order.id}`,{status:"paid"});await dbPost("payments",{order_id:order.id,method,amount:Number(order.total)}); await load();showToast("✓ Payment confirmed");setScreen(null);setPayOrder(null);setSelectedOrder(null);setTab("orders"); }catch(e){showToast("Payment failed");} };
  const updateMenuItem=async(id,fields)=>{ try{await dbPatch(`menu_items?id=eq.${id}`,fields);await load();}catch(e){showToast("Save failed");} };

  const kitchenCount=orders.filter(o=>o.status==="not-started").length;
  const readyCount=orders.filter(o=>o.status==="ready").length;
  const menuReady=menuItems.length>0;
  const activeOrders=orders.filter(o=>o.status!=="paid");

  // ── Auth loading ──────────────────────────────────────────────
  if(authLoading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"var(--g)"}}><style>{S}</style><ObaladeLogo size={80}/></div>;
  if(!session) return <LoginScreen onLogin={d=>{setSession(d);}}/>;

  // ── Shared logic for screens ──────────────────────────────────
  const handleSelectOrder = o => { setSelectedOrder(o); setScreen("order-detail"); };
  const handlePay = o => { setPayOrder(o); setScreen("payment"); };
  const handleAddItems = o => { setAddItemsOrder(o); setScreen("add-items"); };

  // ── Desktop Layout ────────────────────────────────────────────
  if(isDesktop) {
    const renderRight = () => {
      if(screen==="pin-reports") return <PinScreen title="Reports" onSuccess={()=>setScreen("reports")} onCancel={()=>setScreen(null)}/>;
      if(screen==="pin-admin")   return <PinScreen title="Admin" onSuccess={()=>{setIsAdmin(true);setScreen(null);showToast("Admin unlocked ✓");}} onCancel={()=>setScreen(null)}/>;
      if(screen==="reports")     return <ReportsScreen orders={orders} orderItems={orderItems} payments={payments} onLock={()=>setScreen(null)} desktop/>;
      if(screen==="admin")       return <AdminScreen menuItems={menuItems} onUpdate={updateMenuItem} onLock={()=>{setScreen(null);setIsAdmin(false);}} desktop/>;
      if(screen==="menu")        return <MenuScreen menuItems={menuItems} orderType={orderCtx?.type} tableRef={orderCtx?.ref} onSend={createOrder} onBack={()=>setScreen(null)} desktop/>;
      if(screen==="add-items"&&addItemsOrder) return <MenuScreen menuItems={menuItems} orderType={addItemsOrder?.type} tableRef={addItemsOrder?.table_number} onSend={addItemsToOrder} onBack={()=>{setScreen("order-detail");setAddItemsOrder(null);}} editMode desktop addMode/>;
      if(screen==="edit-order")  return <MenuScreen menuItems={menuItems} orderType={editOrder?.type} tableRef={editOrder?.table_number} existingItems={orderItems.filter(i=>i.order_id===editOrder?.id).map(i=>({...i,menu_item_id:menuItems.find(m=>m.name===i.item_name)?.id}))} onSend={updateOrder} onBack={()=>{setScreen(null);setEditOrder(null);}} editMode desktop/>;
      if(screen==="order-detail"&&selectedOrder) return <OrderDetailScreen order={selectedOrder} orderItems={orderItems} isAdmin={isAdmin} onBack={()=>{setScreen(null);setSelectedOrder(null);}} onPay={handlePay} onEdit={handleEdit} onDelete={deleteOrder} onAddItems={handleAddItems} desktop/>;
      if(screen==="payment"&&payOrder) return <PaymentScreen order={payOrder} orderItems={orderItems} onConfirm={confirmPayment} onBack={()=>{setScreen("order-detail");setPayOrder(null);}} desktop/>;

      if(tab==="new") return !menuReady ? <SetupScreen onSeed={seedMenu} seeding={seeding}/> : <NewOrderScreen onStart={(type,ref)=>{setOrderCtx({type,ref});setScreen("menu");}}/>;
      return null;
    };

    return (
      <div className="desktop-shell">
        <style>{S}</style>
        <Toast msg={toast}/>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <ObaladeLogo size={52}/>
            <div className="sidebar-logo-name">Obalade Suya</div>
            <div className="sidebar-logo-sub">POS · Amsterdam</div>
          </div>
          <div className="sidebar-nav">
            <button className={`snav-btn${tab==="new"&&!screen?" on":""}`} onClick={()=>{setTab("new");setScreen(null);}}>
              <Ic.New/> New Order
            </button>
            <button className={`snav-btn${tab==="kitchen"&&!screen?" on":""}`} onClick={()=>{setTab("kitchen");setScreen(null);}}>
              <Ic.Kitchen/> Kitchen
              {kitchenCount>0&&<span className="snav-badge">{kitchenCount}</span>}
            </button>
            <button className={`snav-btn${tab==="orders"&&!screen?" on":""}`} onClick={()=>{setTab("orders");setScreen(null);}}>
              <Ic.Orders/> Orders
              {readyCount>0&&<span className="snav-badge">{readyCount}</span>}
            </button>
            <div style={{height:1,background:"rgba(255,255,255,.1)",margin:"12px 0"}}/>
            {isAdmin
              ? <button className="snav-btn" onClick={()=>{setIsAdmin(false);showToast("Admin locked");setScreen(null);}}><Ic.Lock/> Lock Admin</button>
              : <button className="snav-btn" onClick={()=>setScreen("pin-admin")}><Ic.Admin/> Admin</button>}
            <button className={`snav-btn${screen==="reports"||screen==="pin-reports"?" on":""}`} onClick={()=>setScreen("pin-reports")}><Ic.Reports/> Reports</button>
            {isAdmin&&<button className="snav-btn" onClick={()=>setScreen("admin")}><Ic.Admin/> Menu Admin</button>}
          </div>
          <div className="sidebar-footer">
            <button className="sidebar-footer-btn" onClick={()=>{if(window.confirm("Sign out?")) logout();}}><Ic.Logout/> Sign Out</button>
          </div>
        </div>

        {/* Main content */}
        <div className="desktop-main">
          {/* Left: main screen */}
          <div style={{flex:1,overflowY:"auto"}}>
            {tab==="kitchen"&&!screen
              ? <KitchenPanel orders={activeOrders} orderItems={orderItems} onAdvance={advanceStage} onRefresh={load} desktop/>
              : renderRight()
            }
          </div>

          {/* Right: orders always visible on kitchen/orders tabs */}
          {(tab==="kitchen"||tab==="orders")&&!screen&&(
            <OrdersPanel orders={orders} onSelect={handleSelectOrder} desktop/>
          )}
          {tab==="orders"&&!screen&&(
            <div style={{display:"none"}}/>
          )}
        </div>
      </div>
    );
  }

  // ── Mobile Layout ─────────────────────────────────────────────
  const MobileHeader = ({sub}) => (
    <div className="hdr">
      <div className="hdr-brand"><ObaladeLogo size={38}/><div><div className="hdr-name">Obalade Suya</div><div className="hdr-sub">{sub||"POS · Amsterdam"}</div></div></div>
      {!sub&&<div className="hdr-actions">
        {isAdmin?<button className="hdr-btn" onClick={()=>{setIsAdmin(false);showToast("Admin locked");}}>🔒 Lock</button>:<button className="hdr-btn" onClick={()=>setScreen("pin-admin")}>Admin</button>}
        <button className="hdr-btn" onClick={()=>setScreen("pin-reports")}>Reports</button>
      </div>}
    </div>
  );

  if(screen==="pin-reports") return <div className="mobile-shell"><style>{S}</style><MobileHeader sub="Owner Access"/><PinScreen title="Reports" onSuccess={()=>setScreen("reports")} onCancel={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if(screen==="pin-admin")   return <div className="mobile-shell"><style>{S}</style><MobileHeader sub="Admin Access"/><PinScreen title="Admin" onSuccess={()=>{setIsAdmin(true);setScreen(null);showToast("Admin unlocked ✓");}} onCancel={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if(screen==="reports")     return <div className="mobile-shell"><style>{S}</style><MobileHeader sub="Reports"/><ReportsScreen orders={orders} orderItems={orderItems} payments={payments} onLock={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if(screen==="admin")       return <div className="mobile-shell"><style>{S}</style><MobileHeader sub="Menu Admin"/><AdminScreen menuItems={menuItems} onUpdate={updateMenuItem} onLock={()=>{setScreen(null);setIsAdmin(false);}}/><Toast msg={toast}/></div>;
  if(screen==="menu")        return <div className="mobile-shell"><style>{S}</style><MobileHeader sub={orderCtx?.type==="dine-in"?`Table ${orderCtx?.ref}`:"Takeaway"}/><MenuScreen menuItems={menuItems} orderType={orderCtx?.type} tableRef={orderCtx?.ref} onSend={createOrder} onBack={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if(screen==="edit-order")  return <div className="mobile-shell"><style>{S}</style><MobileHeader sub="Edit Order"/><MenuScreen menuItems={menuItems} orderType={editOrder?.type} tableRef={editOrder?.table_number} existingItems={orderItems.filter(i=>i.order_id===editOrder?.id).map(i=>({...i,menu_item_id:menuItems.find(m=>m.name===i.item_name)?.id}))} onSend={updateOrder} onBack={()=>{setScreen(null);setEditOrder(null);}} editMode/><Toast msg={toast}/></div>;
  if(screen==="add-items"&&addItemsOrder) return <div className="mobile-shell"><style>{S}</style><MobileHeader sub={`Add to ${orderLabel(addItemsOrder)}`}/><MenuScreen menuItems={menuItems} orderType={addItemsOrder?.type} tableRef={addItemsOrder?.table_number} onSend={addItemsToOrder} onBack={()=>{setScreen("order-detail");setAddItemsOrder(null);}} addMode/><Toast msg={toast}/></div>;
  if(screen==="order-detail"&&selectedOrder) return <div className="mobile-shell"><style>{S}</style><MobileHeader sub="Order Detail"/><OrderDetailScreen order={selectedOrder} orderItems={orderItems} isAdmin={isAdmin} onBack={()=>{setScreen(null);setSelectedOrder(null);}} onPay={handlePay} onEdit={handleEdit} onDelete={deleteOrder} onAddItems={handleAddItems}/><Toast msg={toast}/></div>;
  if(screen==="payment"&&payOrder) return <div className="mobile-shell"><style>{S}</style><MobileHeader sub="Payment"/><PaymentScreen order={payOrder} orderItems={orderItems} onConfirm={confirmPayment} onBack={()=>{setScreen("order-detail");setPayOrder(null);}}/><Toast msg={toast}/></div>;

  return (
    <div className="mobile-shell">
      <style>{S}</style><MobileHeader/><Toast msg={toast}/>
      {!loading&&!menuReady&&<SetupScreen onSeed={seedMenu} seeding={seeding}/>}
      {loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16}}><ObaladeLogo size={64}/><div style={{color:"var(--muted)",fontSize:14}}>Connecting…</div></div>}
      {!loading&&menuReady&&<>
        {tab==="new"&&<NewOrderScreen onStart={(type,ref)=>{setOrderCtx({type,ref});setScreen("menu");}}/>}
        {tab==="kitchen"&&<KitchenPanel orders={activeOrders} orderItems={orderItems} onAdvance={advanceStage} onRefresh={load}/>}
        {tab==="orders"&&<OrdersPanel orders={orders} onSelect={handleSelectOrder}/>}
        {isAdmin&&tab==="orders"&&<div style={{position:"fixed",bottom:72,right:16,zIndex:45}}><button className="btn bp bsm" onClick={()=>setScreen("admin")} style={{boxShadow:"0 4px 16px rgba(26,107,60,.4)"}}>⚙️ Menu Admin</button></div>}
        <nav className="nav">
          <button className={`nt${tab==="new"?" on":""}`} onClick={()=>{setTab("new");setScreen(null);}}><Ic.New/> New Order</button>
          <button className={`nt${tab==="kitchen"?" on":""}`} onClick={()=>setTab("kitchen")}><Ic.Kitchen/>{kitchenCount>0&&<span className="ndot">{kitchenCount}</span>}Kitchen</button>
          <button className={`nt${tab==="orders"?" on":""}`} onClick={()=>setTab("orders")}><Ic.Orders/>{readyCount>0&&<span className="ndot">{readyCount}</span>}Orders</button>
        </nav>
      </>}
    </div>
  );
}
