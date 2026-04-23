import { useState, useEffect, useCallback, useRef } from "react";

const SUPABASE_URL = "https://srcmohssomlkngvdkyxp.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyY21vaHNzb21sa25ndmRreXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTI4MTcsImV4cCI6MjA5MjUyODgxN30.kDrYINdJVzeMR3n6861mAcIbyG55EIygrs2b3_gCWf8";
const OWNER_PIN = "1234";
const MENU_CATEGORIES = ["Suya","Main","Soup","Fried","Standalone","Beans","Sides","Kids","Drinks"];

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
const H = {
  apikey: SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
  "Content-Type": "application/json",
};
const dbGet    = async p => { const r = await fetch(`${SUPABASE_URL}/rest/v1/${p}`, {headers:H}); if(!r.ok) throw new Error(await r.text()); return r.json(); };
const dbPost   = async (p,b) => { const r = await fetch(`${SUPABASE_URL}/rest/v1/${p}`, {method:"POST",headers:{...H,Prefer:"return=representation"},body:JSON.stringify(b)}); if(!r.ok) throw new Error(await r.text()); const t=await r.text(); return t?JSON.parse(t):null; };
const dbPatch  = async (p,b) => { const r = await fetch(`${SUPABASE_URL}/rest/v1/${p}`, {method:"PATCH",headers:{...H,Prefer:"return=representation"},body:JSON.stringify(b)}); if(!r.ok) throw new Error(await r.text()); const t=await r.text(); return t?JSON.parse(t):null; };
const dbDelete = async p => { const r = await fetch(`${SUPABASE_URL}/rest/v1/${p}`, {method:"DELETE",headers:H}); if(!r.ok) throw new Error(await r.text()); };

// ── Helpers ───────────────────────────────────────────────────────
const timeAgo = ts => { const s=Math.floor((Date.now()-new Date(ts))/1000); if(s<60) return `${s}s`; if(s<3600) return `${Math.floor(s/60)}m`; return `${Math.floor(s/3600)}h`; };

// Fixed date filter — strips time from comparison
const getStartOf = p => {
  const d = new Date();
  if (p === "today") { d.setHours(0,0,0,0); return d; }
  if (p === "week")  { d.setDate(d.getDate()-7); d.setHours(0,0,0,0); return d; }
  if (p === "month") { d.setMonth(d.getMonth()-1); d.setHours(0,0,0,0); return d; }
  d.setFullYear(d.getFullYear()-1); d.setHours(0,0,0,0); return d;
};

// ── Notifications ─────────────────────────────────────────────────
const requestNotifPermission = async () => {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const p = await Notification.requestPermission();
  return p === "granted";
};
const sendNotif = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
};

// ── CSS ───────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
:root{
  --g:#1a6b3c;--gl:#2d8a52;--gp:#eaf5ef;--gd:#0f4024;
  --gold:#c9922a;--goldf:#fdf3e3;
  --red:#c0392b;--redf:#fdecea;
  --bg:#f4f2ed;--card:#fff;--text:#1a1a10;--muted:#8a8a7a;
  --border:#e4e0d8;--sh:0 2px 10px rgba(0,0,0,.06);
  --r:16px;--rS:10px;
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);}
.app{display:flex;flex-direction:column;min-height:100vh;max-width:480px;margin:0 auto;}
.hdr{background:var(--g);height:66px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 3px 18px rgba(15,64,36,.3);}
.hdr-brand{display:flex;align-items:center;gap:11px;}
.hdr-name{font-family:'Playfair Display',serif;font-weight:900;font-size:16px;color:#fff;line-height:1.15;}
.hdr-sub{font-size:10px;color:rgba(255,255,255,.55);margin-top:1px;letter-spacing:.6px;text-transform:uppercase;}
.hdr-actions{display:flex;gap:7px;}
.hdr-btn{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:7px 13px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;}
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
.bp{background:var(--g);color:#fff;}
.bp:active{transform:scale(.97);}
.bg2{background:var(--gold);color:#fff;}
.bg2:active{opacity:.88;}
.bo{background:transparent;border:1.5px solid var(--border);color:var(--text);}
.bd{background:var(--redf);color:var(--red);border:none;}
.bsm{padding:9px 14px;font-size:13px;border-radius:8px;}
.bw{width:100%;}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px;}
.ttile{background:var(--card);border:2px solid var(--border);border-radius:var(--r);padding:26px 14px;display:flex;flex-direction:column;align-items:center;gap:11px;cursor:pointer;transition:all .15s;font-family:'Playfair Display',serif;font-weight:700;font-size:16px;}
.ttile svg{width:38px;height:38px;}
.ttile.on{border-color:var(--g);background:var(--gp);color:var(--g);}
.cats{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;scrollbar-width:none;}
.cats::-webkit-scrollbar{display:none;}
.cp{flex-shrink:0;padding:9px 18px;border-radius:24px;border:1.5px solid var(--border);background:var(--card);font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s;}
.cp.on{background:var(--g);border-color:var(--g);color:#fff;}
.mi{background:var(--card);border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--sh);margin-bottom:8px;}
.mn{font-weight:500;font-size:14px;margin-bottom:3px;line-height:1.3;}
.mp{color:var(--g);font-weight:700;font-size:15px;}
.qc{display:flex;align-items:center;gap:10px;}
.qb{width:34px;height:34px;border-radius:50%;border:none;background:var(--gp);color:var(--g);font-size:22px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:all .12s;}
.qb:active{transform:scale(.88);}
.qb.rm{background:var(--redf);color:var(--red);}
.qn{font-weight:700;font-size:17px;min-width:22px;text-align:center;}
.cbar{position:fixed;bottom:65px;left:16px;right:16px;max-width:448px;margin:0 auto;background:var(--g);color:#fff;border-radius:14px;padding:15px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 24px rgba(15,64,36,.4);cursor:pointer;z-index:40;}
.cbl{font-size:12px;opacity:.7;}
.cbt{font-family:'Playfair Display',serif;font-weight:900;font-size:22px;}
.cbb{background:#fff;color:var(--g);border-radius:9px;padding:10px 16px;font-weight:700;font-size:13px;}
.kc{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:12px;border-left:4px solid var(--gold);overflow:hidden;}
.kc.rdy{border-left-color:var(--g);}
.kch{padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--border);}
.kct{font-family:'Playfair Display',serif;font-weight:700;font-size:17px;}
.kctm{font-size:12px;color:var(--muted);margin-top:2px;}
.kcb{padding:12px 16px;}
.ki{font-size:14px;padding:5px 0;display:flex;gap:8px;align-items:baseline;}
.kiq{font-weight:700;color:var(--g);font-size:15px;}
.kin{font-size:12px;color:var(--muted);}
.kcf{padding:12px 16px;border-top:1px solid var(--border);display:flex;gap:8px;}
.badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.bkit{background:#fff8e6;color:var(--gold);}
.brdy{background:var(--gp);color:var(--g);}
.bpaid{background:#f0f0ec;color:var(--muted);}
.bdine{background:#e8f0fe;color:#1a56db;}
.btake{background:#fef3e8;color:#b45309;}
.oc{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:10px;overflow:hidden;}
.ocr{padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.ocn{font-family:'Playfair Display',serif;font-weight:700;font-size:16px;margin-bottom:5px;}
.ocm{display:flex;gap:6px;flex-wrap:wrap;}
.pmethods{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;}
.ptile{background:var(--card);border:2px solid var(--border);border-radius:var(--r);padding:22px 16px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:all .15s;font-weight:700;font-size:15px;}
.ptile svg{width:32px;height:32px;}
.ptile.on{border-color:var(--g);background:var(--gp);color:var(--g);}
.periods{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
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
.ain{font-weight:500;font-size:14px;}
.aic{font-size:12px;color:var(--muted);}
.pinp{width:82px;border:1.5px solid var(--border);border-radius:8px;padding:8px 10px;font-size:14px;font-weight:700;font-family:'Inter',sans-serif;text-align:right;color:var(--g);}
.pinp:focus{outline:none;border-color:var(--g);}
.tog{position:relative;width:44px;height:24px;flex-shrink:0;}
.tog input{opacity:0;width:0;height:0;}
.tsl{position:absolute;cursor:pointer;inset:0;background:var(--border);border-radius:24px;transition:.2s;}
.tsl:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s;}
input:checked+.tsl{background:var(--g);}
input:checked+.tsl:before{transform:translateX(20px);}
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
.confirm-modal{background:var(--card);border-radius:20px;padding:24px;margin:20px;width:calc(100% - 40px);}
.setup{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:72vh;gap:20px;padding:32px 24px;text-align:center;}
.divider{height:1px;background:var(--border);margin:13px 0;}
.row{display:flex;align-items:center;justify-content:space-between;}
.empty{text-align:center;padding:48px 24px;color:var(--muted);}
.emico{font-size:46px;margin-bottom:12px;}
.inp{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:14px 16px;font-size:15px;font-family:'Inter',sans-serif;background:var(--card);color:var(--text);margin-bottom:12px;}
.inp:focus{outline:none;border-color:var(--g);}
.lbl{font-size:13px;font-weight:600;color:var(--muted);margin-bottom:6px;display:block;}
.toast{position:fixed;top:74px;left:50%;transform:translateX(-50%);background:#1a1a10;color:#fff;padding:11px 20px;border-radius:10px;font-size:14px;font-weight:500;z-index:300;animation:fio 2.5s ease forwards;white-space:nowrap;pointer-events:none;}
@keyframes fio{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}78%{opacity:1}100%{opacity:0}}
/* Edit order items */
.edit-item{background:var(--bg);border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.edit-item-name{font-size:14px;font-weight:500;flex:1;}
.edit-item-price{font-size:13px;color:var(--g);font-weight:700;margin-right:12px;}
/* Notif banner */
.notif-banner{background:var(--gp);border:1.5px solid var(--g);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:10px;margin-bottom:16px;cursor:pointer;}
.notif-banner-text{flex:1;font-size:13px;color:var(--g);font-weight:600;}
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
};

const ObaladeLogo = ({ size=44 }) => (
  <svg width={size} height={size} viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="110" height="110" rx="12" fill="#1a6b3c"/>
    <rect x="8" y="50" width="94" height="7" rx="3.5" fill="#c9922a"/>
    <rect x="12" y="34" width="18" height="24" rx="5" fill="#f0c060"/>
    <rect x="36" y="30" width="18" height="28" rx="5" fill="#e8b84b"/>
    <rect x="60" y="34" width="18" height="24" rx="5" fill="#f0c060"/>
    <rect x="84" y="36" width="14" height="20" rx="5" fill="#e8b84b"/>
    <text x="55" y="78" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="13" fill="white" letterSpacing="1.5">OBALADE</text>
    <text x="55" y="92" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="13" fill="#c9922a" letterSpacing="2">SUYA</text>
    <text x="55" y="103" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fill="rgba(255,255,255,0.7)" letterSpacing="0.8">AMSTERDAM</text>
  </svg>
);

const Toast = ({ msg }) => msg ? <div className="toast">{msg}</div> : null;

// ── PIN Screen ────────────────────────────────────────────────────
const PinScreen = ({ title, onSuccess, onCancel }) => {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const press = k => {
    if (pin.length >= 4) return;
    const next = pin + k; setPin(next); setErr(false);
    if (next.length === 4) {
      if (next === OWNER_PIN) onSuccess();
      else setTimeout(() => { setPin(""); setErr(true); }, 300);
    }
  };
  return (
    <div className="pg">
      <div className="pinwrap">
        <div style={{textAlign:"center"}}>
          <div className="sh">{title}</div>
          <div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>Enter 4-digit PIN</div>
        </div>
        <div className="pindots">{[0,1,2,3].map(i=><div key={i} className={`pindot${pin.length>i?" on":""}`}/>)}</div>
        {err && <div style={{color:"var(--red)",fontWeight:600,fontSize:14}}>Incorrect PIN</div>}
        <div className="pingrid">
          {[1,2,3,4,5,6,7,8,9].map(n=><button key={n} className="pinkey" onClick={()=>press(String(n))}>{n}</button>)}
          <div/>
          <button className="pinkey" onClick={()=>press("0")}>0</button>
          <button className="pinkey" style={{fontSize:18}} onClick={()=>setPin(p=>p.slice(0,-1))}>⌫</button>
        </div>
        {onCancel && <button className="btn bo bsm" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
};

// ── Confirm Dialog ────────────────────────────────────────────────
const ConfirmDialog = ({ title, message, onConfirm, onCancel, danger }) => (
  <div className="overlay" onClick={onCancel}>
    <div style={{background:"rgba(0,0,0,.5)",position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:250}} onClick={onCancel}>
      <div className="confirm-modal" onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,marginBottom:8}}>{title}</div>
        <div style={{color:"var(--muted)",fontSize:14,marginBottom:20}}>{message}</div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn bo bsm" style={{flex:1}} onClick={onCancel}>Cancel</button>
          <button className={`btn bsm ${danger?"bd":"bp"}`} style={{flex:1}} onClick={onConfirm}>{danger?"Delete":"Confirm"}</button>
        </div>
      </div>
    </div>
  </div>
);

// ── Setup Screen ──────────────────────────────────────────────────
const SetupScreen = ({ onSeed, seeding }) => (
  <div className="pg">
    <div className="setup">
      <ObaladeLogo size={96}/>
      <div>
        <div className="sh" style={{textAlign:"center"}}>Welcome!</div>
        <div style={{color:"var(--muted)",fontSize:13,marginTop:6,textAlign:"center",maxWidth:260}}>Load the full menu to get started.</div>
      </div>
      <button className="btn bp bw" onClick={onSeed} disabled={seeding} style={{maxWidth:260}}>
        {seeding ? "Loading menu…" : "🍖  Load Full Menu"}
      </button>
    </div>
  </div>
);

// ── New Order ─────────────────────────────────────────────────────
const NewOrderScreen = ({ onStart }) => {
  const [type, setType] = useState(null);
  const [ref, setRef]   = useState("");
  return (
    <div className="pg">
      <div className="sh">New Order</div>
      <div className="ss">Choose order type to begin</div>
      <div className="tgrid">
        <div className={`ttile${type==="dine-in"?" on":""}`} onClick={()=>setType("dine-in")}><Ic.DineIn/> Dine In</div>
        <div className={`ttile${type==="takeaway"?" on":""}`} onClick={()=>setType("takeaway")}><Ic.Takeaway/> Takeaway</div>
      </div>
      {type && <>
        <label className="lbl">{type==="dine-in"?"Table number *":"Customer name (optional)"}</label>
        <input className="inp" placeholder={type==="dine-in"?"e.g. 4":"e.g. Ahmed"} value={ref} onChange={e=>setRef(e.target.value)} autoFocus/>
      </>}
      <button className="btn bp bw" disabled={!type||(type==="dine-in"&&!ref.trim())} onClick={()=>onStart(type,ref.trim())}>
        Continue to Menu →
      </button>
    </div>
  );
};

// ── Menu Builder ──────────────────────────────────────────────────
const MenuScreen = ({ menuItems, orderType, tableRef, onSend, onBack, existingItems=[], editMode=false }) => {
  const initCart = () => {
    const c = {};
    existingItems.forEach(i => { c[i.menu_item_id || i.id] = i.quantity; });
    return c;
  };
  const initNotes = () => {
    const n = {};
    existingItems.forEach(i => { if(i.note) n[i.menu_item_id || i.id] = i.note; });
    return n;
  };

  const [cart, setCart]         = useState(initCart);
  const [cat, setCat]           = useState(MENU_CATEGORIES[0]);
  const [noteItem, setNoteItem] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes]       = useState(initNotes);
  const [sending, setSending]   = useState(false);

  const catItems  = menuItems.filter(i=>i.available && i.category===cat);
  const qty       = id => cart[id]||0;
  const add       = item => setCart(c=>({...c,[item.id]:(c[item.id]||0)+1}));
  const rmv       = item => setCart(c=>{const n={...c};n[item.id]>1?n[item.id]--:delete n[item.id];return n;});
  const cartList  = Object.entries(cart).map(([id,quantity])=>({...menuItems.find(i=>i.id===id),quantity,note:notes[id]||""}));
  const total     = cartList.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
  const itemCount = cartList.reduce((s,i)=>s+i.quantity,0);

  const send = async () => {
    if(!cartList.length||sending) return;
    setSending(true);
    await onSend(cartList,total);
    setSending(false);
  };

  return (
    <div className="pg">
      <div className="row" style={{marginBottom:16}}>
        <button className="btn bo bsm" onClick={onBack}><Ic.Back/> Back</button>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15}}>
            {editMode ? "Edit Order" : (orderType==="dine-in"?`Table ${tableRef}`:tableRef||"Takeaway")}
          </div>
          {!editMode && <div style={{fontSize:11,color:"var(--muted)",textTransform:"capitalize"}}>{orderType}</div>}
        </div>
      </div>
      <div className="cats">
        {MENU_CATEGORIES.map(c=><div key={c} className={`cp${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</div>)}
      </div>
      {catItems.length===0 && <div className="empty"><div className="emico">🍽️</div><div style={{fontSize:14}}>No items in this category</div></div>}
      {catItems.map(item=>(
        <div key={item.id} className="mi">
          <div style={{flex:1,paddingRight:12}}>
            <div className="mn">{item.name}</div>
            <div className="mp">€{Number(item.price).toFixed(2)}</div>
          </div>
          {qty(item.id)>0?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <div className="qc">
                <button className="qb rm" onClick={()=>rmv(item)}>−</button>
                <span className="qn">{qty(item.id)}</span>
                <button className="qb" onClick={()=>add(item)}>+</button>
              </div>
              <button style={{fontSize:11,color:"var(--muted)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}
                onClick={()=>{setNoteItem(item);setNoteText(notes[item.id]||"");}}>
                {notes[item.id]?"✏️ note":"+ note"}
              </button>
            </div>
          ):(
            <button className="qb" onClick={()=>add(item)}>+</button>
          )}
        </div>
      ))}
      {itemCount>0&&(
        <div className="cbar" onClick={send} style={{cursor:sending?"wait":"pointer"}}>
          <div>
            <div className="cbl">{itemCount} item{itemCount!==1?"s":""}</div>
            <div className="cbt">€{total.toFixed(2)}</div>
          </div>
          <div className="cbb">{sending?"Saving…":(editMode?"Save Changes →":"Send to Kitchen →")}</div>
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

// ── Kitchen Screen ─────────────────────────────────────────────────
const KitchenScreen = ({ orders, orderItems, onReady, onRefresh, loading }) => {
  const active = orders.filter(o=>o.status==="in-kitchen"||o.status==="ready").sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));
  const [notifEnabled, setNotifEnabled] = useState(Notification?.permission==="granted");

  const enableNotifs = async () => {
    const ok = await requestNotifPermission();
    setNotifEnabled(ok);
  };

  return (
    <div className="pg">
      <div className="row" style={{marginBottom:4}}>
        <div className="sh">Kitchen</div>
        <button className="btn bo bsm" onClick={onRefresh}><Ic.Refresh/></button>
      </div>
      <div className="ss">{active.length} active order{active.length!==1?"s":""}</div>

      {!notifEnabled && "Notification" in window && (
        <div className="notif-banner" onClick={enableNotifs}>
          <Ic.Bell/>
          <div className="notif-banner-text">Tap to enable ready notifications</div>
          <span style={{fontSize:12,color:"var(--g)"}}>Enable →</span>
        </div>
      )}

      {loading && <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Loading…</div>}
      {!loading&&active.length===0&&<div className="empty"><div className="emico">🍳</div><div style={{fontSize:14}}>No active orders</div></div>}

      {active.map(o=>{
        const items = orderItems.filter(i=>i.order_id===o.id);
        return (
          <div key={o.id} className={`kc${o.status==="ready"?" rdy":""}`}>
            <div className="kch">
              <div>
                <div className="kct">{o.type==="dine-in"?`Table ${o.table_number}`:o.table_number||"Takeaway"}</div>
                <div className="kctm">{timeAgo(o.created_at)} ago</div>
              </div>
              <span className={`badge ${o.status==="ready"?"brdy":"bkit"}`}>{o.status==="ready"?"✓ Ready":"In Kitchen"}</span>
            </div>
            <div className="kcb">
              {items.map(i=>(
                <div key={i.id} className="ki">
                  <span className="kiq">{i.quantity}×</span>
                  <span>{i.item_name}</span>
                  {i.note&&<span className="kin"> — {i.note}</span>}
                </div>
              ))}
            </div>
            {o.status==="in-kitchen"&&(
              <div className="kcf">
                <button className="btn bp bw bsm" onClick={()=>onReady(o.id)}><Ic.Check/> Mark Ready</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Orders Overview ────────────────────────────────────────────────
const OrdersScreen = ({ orders, orderItems, menuItems, onPay, onEdit, onDelete, isAdmin }) => {
  const active = orders.filter(o=>o.status!=="paid").sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const done   = orders.filter(o=>o.status==="paid").sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,15);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div className="pg">
      <div className="sh">Orders</div>
      <div className="ss">Today's overview</div>

      {active.length===0&&done.length===0&&<div className="empty"><div className="emico">📋</div><div style={{fontSize:14}}>No orders yet today</div></div>}

      {active.length>0&&<>
        <div className="slabel">Active ({active.length})</div>
        {active.map(o=>(
          <div key={o.id} className="oc">
            <div className="ocr">
              <div style={{flex:1}}>
                <div className="ocn">{o.type==="dine-in"?`Table ${o.table_number}`:o.table_number||"Takeaway"}</div>
                <div className="ocm">
                  <span className={`badge ${o.type==="dine-in"?"bdine":"btake"}`}>{o.type}</span>
                  <span className={`badge ${o.status==="ready"?"brdy":"bkit"}`}>{o.status==="ready"?"Ready":"In Kitchen"}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:20,color:"var(--g)"}}>€{Number(o.total).toFixed(2)}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{timeAgo(o.created_at)} ago</div>
                <div style={{display:"flex",gap:6,marginTop:8,justifyContent:"flex-end",flexWrap:"wrap"}}>
                  {o.status==="in-kitchen"&&(
                    <button className="btn bo bsm" onClick={()=>onEdit(o)}><Ic.Edit/> Edit</button>
                  )}
                  {o.status==="ready"&&(
                    <button className="btn bg2 bsm" onClick={()=>onPay(o)}>Collect Payment</button>
                  )}
                  {isAdmin&&(
                    <button className="btn bd bsm" onClick={()=>setConfirmDelete(o)}><Ic.Trash/></button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </>}

      {done.length>0&&<>
        <div className="slabel" style={{marginTop:20}}>Completed today</div>
        {done.map(o=>(
          <div key={o.id} className="oc" style={{opacity:.5}}>
            <div className="ocr">
              <div style={{flex:1}}>
                <div className="ocn">{o.type==="dine-in"?`Table ${o.table_number}`:o.table_number||"Takeaway"}</div>
                <div className="ocm">
                  <span className={`badge ${o.type==="dine-in"?"bdine":"btake"}`}>{o.type}</span>
                  <span className="badge bpaid">Paid</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:18}}>€{Number(o.total).toFixed(2)}</div>
                {isAdmin&&(
                  <button className="btn bd bsm" onClick={()=>setConfirmDelete(o)}><Ic.Trash/></button>
                )}
              </div>
            </div>
          </div>
        ))}
      </>}

      {confirmDelete&&(
        <ConfirmDialog
          title="Delete Order"
          message={`Delete order for ${confirmDelete.type==="dine-in"?`Table ${confirmDelete.table_number}`:confirmDelete.table_number||"Takeaway"}? This cannot be undone.`}
          danger
          onConfirm={()=>{ onDelete(confirmDelete.id); setConfirmDelete(null); }}
          onCancel={()=>setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

// ── Payment Screen ─────────────────────────────────────────────────
const PaymentScreen = ({ order, orderItems, onConfirm, onBack }) => {
  const [method, setMethod] = useState(null);
  const [busy, setBusy]     = useState(false);
  const items = orderItems.filter(i=>i.order_id===order.id);
  const confirm = async () => { setBusy(true); await onConfirm(order,method); setBusy(false); };
  return (
    <div className="pg">
      <button className="btn bo bsm" style={{marginBottom:16}} onClick={onBack}><Ic.Back/> Back</button>
      <div className="sh">Payment</div>
      <div className="ss">{order.type==="dine-in"?`Table ${order.table_number}`:order.table_number||"Takeaway"}</div>
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

// ── Reports Screen ─────────────────────────────────────────────────
const ReportsScreen = ({ orders, orderItems, payments, onLock }) => {
  const [period, setPeriod] = useState("today");
  const start = getStartOf(period);

  // Fixed: compare ISO strings properly
  const paidOrders = orders.filter(o=>o.status==="paid" && new Date(o.created_at)>=start);
  const filtPay    = payments.filter(p=>new Date(p.paid_at)>=start);
  const revenue    = filtPay.reduce((s,p)=>s+Number(p.amount),0);
  const avg        = paidOrders.length?revenue/paidOrders.length:0;
  const dineIn     = paidOrders.filter(o=>o.type==="dine-in").length;
  const takeaway   = paidOrders.filter(o=>o.type==="takeaway").length;
  const cashT      = filtPay.filter(p=>p.method==="cash").reduce((s,p)=>s+Number(p.amount),0);
  const cardT      = filtPay.filter(p=>p.method==="card").reduce((s,p)=>s+Number(p.amount),0);

  const paidIds = new Set(paidOrders.map(o=>o.id));
  const counts  = {};
  orderItems.filter(i=>paidIds.has(i.order_id)).forEach(i=>{counts[i.item_name]=(counts[i.item_name]||0)+i.quantity;});
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);

  const periodLabel = { today:"Today", week:"Last 7 days", month:"Last 30 days", year:"Last 12 months" };

  return (
    <div className="pg">
      <div className="row" style={{marginBottom:20}}>
        <div className="sh">Reports</div>
        <button className="btn bo bsm" onClick={onLock}>🔒 Lock</button>
      </div>
      <div className="periods">
        {["today","week","month","year"].map(p=>(
          <button key={p} className={`pb${period===p?" on":""}`} onClick={()=>setPeriod(p)}>
            {p.charAt(0).toUpperCase()+p.slice(1)}
          </button>
        ))}
      </div>
      <div style={{color:"var(--muted)",fontSize:12,marginBottom:16}}>{periodLabel[period]}</div>
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
      {top.length>0&&<>
        <div style={{fontWeight:700,marginBottom:12}}>Top selling items</div>
        <div className="tlist">
          {top.map(([name,ct],i)=>(
            <div key={name} className="tr">
              <div className="trk">{i+1}</div>
              <div className="trn">{name}</div>
              <div className="trc">{ct}×</div>
            </div>
          ))}
        </div>
      </>}
      {top.length===0&&paidOrders.length===0&&<div className="empty"><div className="emico">📊</div><div style={{fontSize:14}}>No sales data for this period</div></div>}
    </div>
  );
};

// ── Admin Screen ───────────────────────────────────────────────────
const AdminScreen = ({ menuItems, onUpdate, onLock }) => {
  const [cat, setCat]       = useState(MENU_CATEGORIES[0]);
  const [prices, setPrices] = useState({});
  const [saved, setSaved]   = useState({});
  const items = menuItems.filter(i=>i.category===cat);
  const savePrice = async item => {
    const v = parseFloat(prices[item.id]);
    if(isNaN(v)) return;
    await onUpdate(item.id,{price:v});
    setSaved(s=>({...s,[item.id]:true}));
    setTimeout(()=>setSaved(s=>({...s,[item.id]:false})),1500);
    setPrices(p=>{const n={...p};delete n[item.id];return n;});
  };
  return (
    <div className="pg">
      <div className="row" style={{marginBottom:20}}>
        <div><div className="sh">Menu Admin</div><div style={{color:"var(--muted)",fontSize:13,marginTop:2}}>Edit prices & availability</div></div>
        <button className="btn bo bsm" onClick={onLock}>🔒 Lock</button>
      </div>
      <div className="cats" style={{marginBottom:20}}>
        {MENU_CATEGORIES.map(c=><div key={c} className={`cp${cat===c?" on":""}`} onClick={()=>setCat(c)}>{c}</div>)}
      </div>
      {items.map(item=>(
        <div key={item.id} className="ai">
          <label className="tog">
            <input type="checkbox" checked={!!item.available} onChange={()=>onUpdate(item.id,{available:!item.available})}/>
            <span className="tsl"/>
          </label>
          <div style={{flex:1,opacity:item.available?1:.4}}>
            <div className="ain">{item.name}</div>
            <div className="aic">{item.category}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:"var(--muted)",fontSize:14}}>€</span>
            <input className="pinp" type="number" step="0.50" min="0"
              value={prices[item.id]!==undefined?prices[item.id]:Number(item.price).toFixed(2)}
              onChange={e=>setPrices(p=>({...p,[item.id]:e.target.value}))}
              onBlur={()=>{if(prices[item.id]!==undefined)savePrice(item);}}
            />
            {saved[item.id]&&<span style={{color:"var(--g)",fontSize:14}}>✓</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("new");
  const [screen, setScreen]     = useState(null);
  const [orderCtx, setOrderCtx] = useState(null);
  const [payOrder, setPayOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [isAdmin, setIsAdmin]   = useState(false);

  const [menuItems, setMenuItems]   = useState([]);
  const [orders, setOrders]         = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [payments, setPayments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [seeding, setSeeding]       = useState(false);
  const [toast, setToast]           = useState("");

  // Track previously ready orders for notifications
  const prevReadyIds = useRef(new Set());

  const showToast = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  const load = useCallback(async () => {
    try {
      const [m,o,oi,p] = await Promise.all([
        dbGet("menu_items?order=category,name"),
        dbGet("orders?order=created_at.desc&limit=200"),
        dbGet("order_items?order=created_at.asc"),
        dbGet("payments?order=paid_at.desc"),
      ]);
      setMenuItems(m||[]);
      setOrderItems(oi||[]);
      setPayments(p||[]);

      // Check for newly ready orders → trigger notification
      const newOrders = o||[];
      newOrders.filter(ord=>ord.status==="ready").forEach(ord=>{
        if(!prevReadyIds.current.has(ord.id)) {
          const label = ord.type==="dine-in"?`Table ${ord.table_number}`:ord.table_number||"Takeaway";
          sendNotif("🍽️ Order Ready!", `${label} is ready for collection`);
          prevReadyIds.current.add(ord.id);
        }
      });
      setOrders(newOrders);
    } catch(e) { showToast("⚠️ Connection error"); }
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); const t=setInterval(load,15000); return()=>clearInterval(t); },[load]);

  const seedMenu = async () => {
    setSeeding(true);
    try { await dbPost("menu_items",DEFAULT_MENU); await load(); showToast("✓ Menu loaded!"); }
    catch(e) { showToast("Seed failed"); }
    setSeeding(false);
  };

  const createOrder = async (cartItems, total) => {
    try {
      const [order] = await dbPost("orders",{type:orderCtx.type,table_number:orderCtx.ref||null,status:"in-kitchen",total});
      await dbPost("order_items",cartItems.map(i=>({order_id:order.id,item_name:i.name,category:i.category,quantity:i.quantity,price:Number(i.price),note:i.note||null})));
      await load(); showToast("✓ Sent to kitchen!"); setScreen(null); setTab("kitchen");
    } catch(e) { showToast("Failed to send order"); }
  };

  const updateOrder = async (cartItems, total) => {
    try {
      // Delete existing items and re-insert
      await dbDelete(`order_items?order_id=eq.${editOrder.id}`);
      await dbPost("order_items",cartItems.map(i=>({order_id:editOrder.id,item_name:i.name,category:i.category,quantity:i.quantity,price:Number(i.price),note:i.note||null})));
      await dbPatch(`orders?id=eq.${editOrder.id}`,{total});
      await load(); showToast("✓ Order updated!"); setScreen(null); setEditOrder(null); setTab("orders");
    } catch(e) { showToast("Failed to update order"); }
  };

  const deleteOrder = async id => {
    try {
      await dbDelete(`order_items?order_id=eq.${id}`);
      await dbDelete(`payments?order_id=eq.${id}`);
      await dbDelete(`orders?id=eq.${id}`);
      await load(); showToast("✓ Order deleted");
    } catch(e) { showToast("Delete failed"); }
  };

  const markReady = async id => {
    try { await dbPatch(`orders?id=eq.${id}`,{status:"ready"}); await load(); showToast("✓ Marked ready"); }
    catch(e) { showToast("Error"); }
  };

  const confirmPayment = async (order, method) => {
    try {
      await dbPatch(`orders?id=eq.${order.id}`,{status:"paid"});
      await dbPost("payments",{order_id:order.id,method,amount:Number(order.total)});
      await load(); showToast("✓ Payment confirmed"); setScreen(null); setPayOrder(null); setTab("orders");
    } catch(e) { showToast("Payment failed"); }
  };

  const updateMenuItem = async (id, fields) => {
    try { await dbPatch(`menu_items?id=eq.${id}`,fields); await load(); }
    catch(e) { showToast("Save failed"); }
  };

  const kitchenCount = orders.filter(o=>o.status==="in-kitchen").length;
  const readyCount   = orders.filter(o=>o.status==="ready").length;
  const menuReady    = menuItems.length>0;

  const Header = ({ sub }) => (
    <div className="hdr">
      <div className="hdr-brand">
        <ObaladeLogo size={38}/>
        <div>
          <div className="hdr-name">Obalade Suya</div>
          <div className="hdr-sub">{sub||"POS · Amsterdam"}</div>
        </div>
      </div>
      {!sub&&(
        <div className="hdr-actions">
          {isAdmin
            ? <button className="hdr-btn" onClick={()=>{setIsAdmin(false);showToast("Admin locked");}}>🔒 Lock</button>
            : <button className="hdr-btn" onClick={()=>setScreen("pin-admin")}>Admin</button>
          }
          <button className="hdr-btn" onClick={()=>setScreen("pin-reports")}>Reports</button>
        </div>
      )}
    </div>
  );

  // ── Routes ─────────────────────────────────────────────────────
  if(screen==="pin-reports") return <div className="app"><style>{S}</style><Header sub="Owner Access"/><PinScreen title="Reports" onSuccess={()=>setScreen("reports")} onCancel={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if(screen==="pin-admin")   return <div className="app"><style>{S}</style><Header sub="Admin Access"/><PinScreen title="Admin" onSuccess={()=>{setIsAdmin(true);setScreen(null);showToast("Admin unlocked ✓");}} onCancel={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if(screen==="reports")     return <div className="app"><style>{S}</style><Header sub="Owner Reports"/><ReportsScreen orders={orders} orderItems={orderItems} payments={payments} onLock={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if(screen==="admin")       return <div className="app"><style>{S}</style><Header sub="Menu Admin"/><AdminScreen menuItems={menuItems} onUpdate={updateMenuItem} onLock={()=>{setScreen(null);setIsAdmin(false);}}/><Toast msg={toast}/></div>;

  if(screen==="menu") return (
    <div className="app"><style>{S}</style>
      <Header sub={orderCtx?.type==="dine-in"?`Table ${orderCtx?.ref}`:"Takeaway"}/>
      <MenuScreen menuItems={menuItems} orderType={orderCtx?.type} tableRef={orderCtx?.ref} onSend={createOrder} onBack={()=>setScreen(null)}/>
      <Toast msg={toast}/>
    </div>
  );

  if(screen==="edit-order") return (
    <div className="app"><style>{S}</style>
      <Header sub="Edit Order"/>
      <MenuScreen
        menuItems={menuItems}
        orderType={editOrder?.type}
        tableRef={editOrder?.table_number}
        existingItems={orderItems.filter(i=>i.order_id===editOrder?.id).map(i=>({...i,menu_item_id:menuItems.find(m=>m.name===i.item_name)?.id}))}
        onSend={updateOrder}
        onBack={()=>{setScreen(null);setEditOrder(null);}}
        editMode={true}
      />
      <Toast msg={toast}/>
    </div>
  );

  if(screen==="payment") return (
    <div className="app"><style>{S}</style>
      <Header sub="Payment"/>
      <PaymentScreen order={payOrder} orderItems={orderItems} onConfirm={confirmPayment} onBack={()=>{setScreen(null);setPayOrder(null);}}/>
      <Toast msg={toast}/>
    </div>
  );

  // ── Main shell ────────────────────────────────────────────────
  return (
    <div className="app">
      <style>{S}</style>
      <Header/>
      <Toast msg={toast}/>

      {!loading&&!menuReady&&<SetupScreen onSeed={seedMenu} seeding={seeding}/>}

      {loading&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16}}>
          <ObaladeLogo size={64}/>
          <div style={{color:"var(--muted)",fontSize:14}}>Connecting…</div>
        </div>
      )}

      {!loading&&menuReady&&<>
        {tab==="new"&&<NewOrderScreen onStart={(type,ref)=>{setOrderCtx({type,ref});setScreen("menu");}}/>}
        {tab==="kitchen"&&<KitchenScreen orders={orders} orderItems={orderItems} onReady={markReady} onRefresh={load} loading={false}/>}
        {tab==="orders"&&(
          <OrdersScreen
            orders={orders}
            orderItems={orderItems}
            menuItems={menuItems}
            isAdmin={isAdmin}
            onPay={o=>{setPayOrder(o);setScreen("payment");}}
            onEdit={o=>{setEditOrder(o);setScreen("edit-order");}}
            onDelete={deleteOrder}
          />
        )}

        {isAdmin&&tab==="orders"&&(
          <div style={{position:"fixed",bottom:72,right:16,zIndex:45}}>
            <button className="btn bp bsm" onClick={()=>setScreen("admin")} style={{boxShadow:"0 4px 16px rgba(26,107,60,.4)"}}>
              ⚙️ Menu Admin
            </button>
          </div>
        )}

        <nav className="nav">
          <button className={`nt${tab==="new"?" on":""}`} onClick={()=>{setTab("new");setScreen(null);}}><Ic.New/> New Order</button>
          <button className={`nt${tab==="kitchen"?" on":""}`} onClick={()=>setTab("kitchen")}>
            <Ic.Kitchen/>{kitchenCount>0&&<span className="ndot">{kitchenCount}</span>}Kitchen
          </button>
          <button className={`nt${tab==="orders"?" on":""}`} onClick={()=>setTab("orders")}>
            <Ic.Orders/>{readyCount>0&&<span className="ndot">{readyCount}</span>}Orders
          </button>
        </nav>
      </>}
    </div>
  );
}  { name: "Vita Malt", category: "Drinks", price: 4.0, available: true },
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

// ── Supabase helpers ──────────────────────────────────────────────
const BASE_HEADERS = {
  apikey: SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
  "Content-Type": "application/json",
};

const dbGet = async (path) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: BASE_HEADERS });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};

const dbPost = async (path, body) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: "POST",
    headers: { ...BASE_HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  const t = await r.text();
  return t ? JSON.parse(t) : null;
};

const dbPatch = async (path, body) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: "PATCH",
    headers: { ...BASE_HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  const t = await r.text();
  return t ? JSON.parse(t) : null;
};

// ── Helpers ───────────────────────────────────────────────────────
const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
};

const getStartOf = (p) => {
  const d = new Date();
  if (p === "today") { d.setHours(0, 0, 0, 0); return d; }
  if (p === "week")  { d.setDate(d.getDate() - 7); return d; }
  if (p === "month") { d.setDate(d.getDate() - 30); return d; }
  d.setFullYear(d.getFullYear() - 1); return d;
};

// ── Logo (SVG recreation of Obalade Suya brand) ───────────────────
const ObaladeLogo = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="110" height="110" rx="12" fill="#1a6b3c"/>
    {/* Skewer stick */}
    <rect x="8" y="50" width="94" height="7" rx="3.5" fill="#c9922a"/>
    {/* Meat chunks */}
    <rect x="12" y="34" width="18" height="24" rx="5" fill="#f0c060"/>
    <rect x="36" y="30" width="18" height="28" rx="5" fill="#e8b84b"/>
    <rect x="60" y="34" width="18" height="24" rx="5" fill="#f0c060"/>
    <rect x="84" y="36" width="14" height="20" rx="5" fill="#e8b84b"/>
    {/* Brand text */}
    <text x="55" y="78" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="13" fill="white" letterSpacing="1.5">OBALADE</text>
    <text x="55" y="92" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="900" fontSize="13" fill="#c9922a" letterSpacing="2">SUYA</text>
    <text x="55" y="103" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="5.5" fill="rgba(255,255,255,0.7)" letterSpacing="0.8">AMSTERDAM</text>
  </svg>
);

// ── CSS ───────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&display=swap');

*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
:root{
  --g:#1a6b3c;--gl:#2d8a52;--gp:#eaf5ef;--gd:#0f4024;
  --gold:#c9922a;--goldf:#fdf3e3;
  --red:#c0392b;--redf:#fdecea;
  --bg:#f4f2ed;--card:#fff;--text:#1a1a10;--muted:#8a8a7a;
  --border:#e4e0d8;--sh:0 2px 10px rgba(0,0,0,.06);
  --r:16px;--rS:10px;
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);}
.app{display:flex;flex-direction:column;min-height:100vh;max-width:480px;margin:0 auto;}

.hdr{background:var(--g);height:66px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 3px 18px rgba(15,64,36,.3);}
.hdr-brand{display:flex;align-items:center;gap:11px;}
.hdr-name{font-family:'Playfair Display',serif;font-weight:900;font-size:16px;color:#fff;line-height:1.15;}
.hdr-sub{font-size:10px;color:rgba(255,255,255,.55);margin-top:1px;letter-spacing:.6px;text-transform:uppercase;}
.hdr-actions{display:flex;gap:7px;}
.hdr-btn{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);color:#fff;border-radius:8px;padding:7px 13px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:background .15s;}
.hdr-btn:active{background:rgba(255,255,255,.25);}

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
.bp{background:var(--g);color:#fff;}
.bp:active{transform:scale(.97);background:var(--gl);}
.bg2{background:var(--gold);color:#fff;}
.bg2:active{opacity:.88;}
.bo{background:transparent;border:1.5px solid var(--border);color:var(--text);}
.bo:active{background:var(--bg);}
.bsm{padding:9px 14px;font-size:13px;border-radius:8px;}
.bw{width:100%;}
.btn:disabled{opacity:.4;cursor:not-allowed;}

.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px;}
.ttile{background:var(--card);border:2px solid var(--border);border-radius:var(--r);padding:26px 14px;display:flex;flex-direction:column;align-items:center;gap:11px;cursor:pointer;transition:all .15s;font-family:'Playfair Display',serif;font-weight:700;font-size:16px;}
.ttile svg{width:38px;height:38px;}
.ttile.on{border-color:var(--g);background:var(--gp);color:var(--g);}
.ttile:active{transform:scale(.97);}

.cats{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:16px;scrollbar-width:none;}
.cats::-webkit-scrollbar{display:none;}
.cp{flex-shrink:0;padding:9px 18px;border-radius:24px;border:1.5px solid var(--border);background:var(--card);font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s;}
.cp.on{background:var(--g);border-color:var(--g);color:#fff;}

.mi{background:var(--card);border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--sh);margin-bottom:8px;}
.mn{font-weight:500;font-size:14px;margin-bottom:3px;line-height:1.3;}
.mp{color:var(--g);font-weight:700;font-size:15px;}
.qc{display:flex;align-items:center;gap:10px;}
.qb{width:34px;height:34px;border-radius:50%;border:none;background:var(--gp);color:var(--g);font-size:22px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:all .12s;}
.qb:active{transform:scale(.88);}
.qb.rm{background:var(--redf);color:var(--red);}
.qn{font-weight:700;font-size:17px;min-width:22px;text-align:center;}

.cbar{position:fixed;bottom:65px;left:16px;right:16px;max-width:448px;margin:0 auto;background:var(--g);color:#fff;border-radius:14px;padding:15px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 24px rgba(15,64,36,.4);cursor:pointer;z-index:40;}
.cbl{font-size:12px;opacity:.7;}
.cbt{font-family:'Playfair Display',serif;font-weight:900;font-size:22px;}
.cbb{background:#fff;color:var(--g);border-radius:9px;padding:10px 16px;font-weight:700;font-size:13px;}

.kc{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:12px;border-left:4px solid var(--gold);overflow:hidden;}
.kc.rdy{border-left-color:var(--g);}
.kch{padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--border);}
.kct{font-family:'Playfair Display',serif;font-weight:700;font-size:17px;}
.kctm{font-size:12px;color:var(--muted);margin-top:2px;}
.kcb{padding:12px 16px;}
.ki{font-size:14px;padding:5px 0;display:flex;gap:8px;align-items:baseline;}
.kiq{font-weight:700;color:var(--g);font-size:15px;}
.kin{font-size:12px;color:var(--muted);}
.kcf{padding:12px 16px;border-top:1px solid var(--border);}

.badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.bkit{background:#fff8e6;color:var(--gold);}
.brdy{background:var(--gp);color:var(--g);}
.bpaid{background:#f0f0ec;color:var(--muted);}
.bdine{background:#e8f0fe;color:#1a56db;}
.btake{background:#fef3e8;color:#b45309;}

.oc{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);margin-bottom:10px;overflow:hidden;}
.ocr{padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.ocn{font-family:'Playfair Display',serif;font-weight:700;font-size:16px;margin-bottom:5px;}
.ocm{display:flex;gap:6px;flex-wrap:wrap;}

.pmethods{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;}
.ptile{background:var(--card);border:2px solid var(--border);border-radius:var(--r);padding:22px 16px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:all .15s;font-weight:700;font-size:15px;}
.ptile svg{width:32px;height:32px;}
.ptile.on{border-color:var(--g);background:var(--gp);color:var(--g);}
.ptile:active{transform:scale(.96);}

.periods{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
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
.ain{font-weight:500;font-size:14px;}
.aic{font-size:12px;color:var(--muted);}
.pinp{width:82px;border:1.5px solid var(--border);border-radius:8px;padding:8px 10px;font-size:14px;font-weight:700;font-family:'Inter',sans-serif;text-align:right;color:var(--g);}
.pinp:focus{outline:none;border-color:var(--g);}
.tog{position:relative;width:44px;height:24px;flex-shrink:0;}
.tog input{opacity:0;width:0;height:0;}
.tsl{position:absolute;cursor:pointer;inset:0;background:var(--border);border-radius:24px;transition:.2s;}
.tsl:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s;}
input:checked+.tsl{background:var(--g);}
input:checked+.tsl:before{transform:translateX(20px);}

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

.setup{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:72vh;gap:20px;padding:32px 24px;text-align:center;}

.divider{height:1px;background:var(--border);margin:13px 0;}
.row{display:flex;align-items:center;justify-content:space-between;}
.empty{text-align:center;padding:48px 24px;color:var(--muted);}
.emico{font-size:46px;margin-bottom:12px;}
.inp{width:100%;border:1.5px solid var(--border);border-radius:10px;padding:14px 16px;font-size:15px;font-family:'Inter',sans-serif;background:var(--card);color:var(--text);margin-bottom:12px;}
.inp:focus{outline:none;border-color:var(--g);}
.lbl{font-size:13px;font-weight:600;color:var(--muted);margin-bottom:6px;display:block;}
.toast{position:fixed;top:74px;left:50%;transform:translateX(-50%);background:#1a1a10;color:#fff;padding:11px 20px;border-radius:10px;font-size:14px;font-weight:500;z-index:300;animation:fio 2.5s ease forwards;white-space:nowrap;pointer-events:none;}
@keyframes fio{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}78%{opacity:1}100%{opacity:0}}
`;

// ── Icons ─────────────────────────────────────────────────────────
const Ic = {
  New:     ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Kitchen: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Orders:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
  Back:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  DineIn:  ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2s-5 3-5 9v6"/><path d="M21 21H16"/></svg>,
  Takeaway:()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Cash:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
  Card:    ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Refresh: ()=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
};

const Toast = ({ msg }) => msg ? <div className="toast">{msg}</div> : null;

// ── PIN Screen ────────────────────────────────────────────────────
const PinScreen = ({ title, onSuccess, onCancel }) => {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const press = (k) => {
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next); setErr(false);
    if (next.length === 4) {
      if (next === OWNER_PIN) onSuccess();
      else setTimeout(() => { setPin(""); setErr(true); }, 300);
    }
  };

  return (
    <div className="pg">
      <div className="pinwrap">
        <div style={{textAlign:"center"}}>
          <div className="sh">{title}</div>
          <div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>Enter 4-digit PIN</div>
        </div>
        <div className="pindots">
          {[0,1,2,3].map(i => <div key={i} className={`pindot${pin.length > i ? " on" : ""}`}/>)}
        </div>
        {err && <div style={{color:"var(--red)",fontWeight:600,fontSize:14}}>Incorrect PIN</div>}
        <div className="pingrid">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="pinkey" onClick={() => press(String(n))}>{n}</button>
          ))}
          <div/>
          <button className="pinkey" onClick={() => press("0")}>0</button>
          <button className="pinkey" style={{fontSize:18}} onClick={() => setPin(p => p.slice(0,-1))}>⌫</button>
        </div>
        {onCancel && <button className="btn bo bsm" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
};

// ── Setup Screen ──────────────────────────────────────────────────
const SetupScreen = ({ onSeed, seeding }) => (
  <div className="pg">
    <div className="setup">
      <ObaladeLogo size={96}/>
      <div>
        <div className="sh" style={{textAlign:"center"}}>Welcome!</div>
        <div style={{color:"var(--muted)",fontSize:13,marginTop:6,textAlign:"center",maxWidth:260}}>
          Load the full menu to get started. This takes just a second.
        </div>
      </div>
      <button className="btn bp bw" onClick={onSeed} disabled={seeding} style={{maxWidth:260}}>
        {seeding ? "Loading menu…" : "🍖  Load Full Menu"}
      </button>
    </div>
  </div>
);

// ── New Order ─────────────────────────────────────────────────────
const NewOrderScreen = ({ onStart }) => {
  const [type, setType] = useState(null);
  const [ref, setRef]   = useState("");

  return (
    <div className="pg">
      <div className="sh">New Order</div>
      <div className="ss">Choose order type to begin</div>
      <div className="tgrid">
        <div className={`ttile${type==="dine-in"?" on":""}`} onClick={() => setType("dine-in")}>
          <Ic.DineIn/> Dine In
        </div>
        <div className={`ttile${type==="takeaway"?" on":""}`} onClick={() => setType("takeaway")}>
          <Ic.Takeaway/> Takeaway
        </div>
      </div>
      {type && <>
        <label className="lbl">{type === "dine-in" ? "Table number *" : "Customer name (optional)"}</label>
        <input className="inp" placeholder={type === "dine-in" ? "e.g. 4" : "e.g. Ahmed"} value={ref} onChange={e => setRef(e.target.value)} autoFocus/>
      </>}
      <button className="btn bp bw" disabled={!type || (type==="dine-in" && !ref.trim())} onClick={() => onStart(type, ref.trim())}>
        Continue to Menu →
      </button>
    </div>
  );
};

// ── Menu Builder ──────────────────────────────────────────────────
const MenuScreen = ({ menuItems, orderType, tableRef, onSend, onBack }) => {
  const [cart, setCart]       = useState({});
  const [cat, setCat]         = useState(MENU_CATEGORIES[0]);
  const [noteItem, setNoteItem] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes]     = useState({});
  const [sending, setSending] = useState(false);

  const catItems = menuItems.filter(i => i.available && i.category === cat);
  const qty      = id => cart[id] || 0;
  const add      = item => setCart(c => ({...c, [item.id]: (c[item.id]||0)+1}));
  const rmv      = item => setCart(c => { const n={...c}; n[item.id]>1 ? n[item.id]-- : delete n[item.id]; return n; });

  const cartList  = Object.entries(cart).map(([id, quantity]) => ({...menuItems.find(i=>i.id===id), quantity, note: notes[id]||""}));
  const total     = cartList.reduce((s,i) => s + Number(i.price)*i.quantity, 0);
  const itemCount = cartList.reduce((s,i) => s + i.quantity, 0);

  const send = async () => {
    if (!cartList.length || sending) return;
    setSending(true);
    await onSend(cartList, total);
    setSending(false);
  };

  return (
    <div className="pg">
      <div className="row" style={{marginBottom:16}}>
        <button className="btn bo bsm" onClick={onBack}><Ic.Back/> Back</button>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15}}>
            {orderType==="dine-in" ? `Table ${tableRef}` : tableRef||"Takeaway"}
          </div>
          <div style={{fontSize:11,color:"var(--muted)",textTransform:"capitalize"}}>{orderType}</div>
        </div>
      </div>

      <div className="cats">
        {MENU_CATEGORIES.map(c => (
          <div key={c} className={`cp${cat===c?" on":""}`} onClick={() => setCat(c)}>{c}</div>
        ))}
      </div>

      {catItems.length === 0 && (
        <div className="empty"><div className="emico">🍽️</div><div style={{fontSize:14}}>No items in this category</div></div>
      )}

      {catItems.map(item => (
        <div key={item.id} className="mi">
          <div style={{flex:1,paddingRight:12}}>
            <div className="mn">{item.name}</div>
            <div className="mp">€{Number(item.price).toFixed(2)}</div>
          </div>
          {qty(item.id) > 0 ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <div className="qc">
                <button className="qb rm" onClick={() => rmv(item)}>−</button>
                <span className="qn">{qty(item.id)}</span>
                <button className="qb" onClick={() => add(item)}>+</button>
              </div>
              <button style={{fontSize:11,color:"var(--muted)",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}
                onClick={() => { setNoteItem(item); setNoteText(notes[item.id]||""); }}>
                {notes[item.id] ? "✏️ note" : "+ note"}
              </button>
            </div>
          ) : (
            <button className="qb" onClick={() => add(item)}>+</button>
          )}
        </div>
      ))}

      {itemCount > 0 && (
        <div className="cbar" onClick={send} style={{cursor: sending?"wait":"pointer"}}>
          <div>
            <div className="cbl">{itemCount} item{itemCount!==1?"s":""}</div>
            <div className="cbt">€{total.toFixed(2)}</div>
          </div>
          <div className="cbb">{sending ? "Sending…" : "Send to Kitchen →"}</div>
        </div>
      )}

      {noteItem && (
        <div className="overlay" onClick={() => setNoteItem(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modalt">Note — {noteItem.name}</div>
            <input className="inp" placeholder="e.g. no pepper, extra sauce…" value={noteText} onChange={e=>setNoteText(e.target.value)} autoFocus/>
            <button className="btn bp bw" onClick={() => { setNotes(n=>({...n,[noteItem.id]:noteText})); setNoteItem(null); }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Kitchen Screen ─────────────────────────────────────────────────
const KitchenScreen = ({ orders, orderItems, onReady, onRefresh, loading }) => {
  const active = orders
    .filter(o => o.status==="in-kitchen" || o.status==="ready")
    .sort((a,b) => new Date(a.created_at)-new Date(b.created_at));

  return (
    <div className="pg">
      <div className="row" style={{marginBottom:4}}>
        <div className="sh">Kitchen</div>
        <button className="btn bo bsm" onClick={onRefresh}><Ic.Refresh/></button>
      </div>
      <div className="ss">{active.length} active order{active.length!==1?"s":""}</div>

      {loading && <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Loading…</div>}
      {!loading && active.length===0 && (
        <div className="empty"><div className="emico">🍳</div><div style={{fontSize:14}}>No active orders</div></div>
      )}

      {active.map(o => {
        const items = orderItems.filter(i => i.order_id === o.id);
        return (
          <div key={o.id} className={`kc${o.status==="ready"?" rdy":""}`}>
            <div className="kch">
              <div>
                <div className="kct">{o.type==="dine-in" ? `Table ${o.table_number}` : o.table_number||"Takeaway"}</div>
                <div className="kctm">{timeAgo(o.created_at)} ago</div>
              </div>
              <span className={`badge ${o.status==="ready"?"brdy":"bkit"}`}>
                {o.status==="ready" ? "✓ Ready" : "In Kitchen"}
              </span>
            </div>
            <div className="kcb">
              {items.map(i => (
                <div key={i.id} className="ki">
                  <span className="kiq">{i.quantity}×</span>
                  <span>{i.item_name}</span>
                  {i.note && <span className="kin"> — {i.note}</span>}
                </div>
              ))}
            </div>
            {o.status==="in-kitchen" && (
              <div className="kcf">
                <button className="btn bp bw bsm" onClick={() => onReady(o.id)}>
                  <Ic.Check/> Mark Ready
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Orders Overview ────────────────────────────────────────────────
const OrdersScreen = ({ orders, onPay }) => {
  const active = orders.filter(o=>o.status!=="paid").sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const done   = orders.filter(o=>o.status==="paid").sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,15);

  return (
    <div className="pg">
      <div className="sh">Orders</div>
      <div className="ss">Today's overview</div>

      {active.length===0 && done.length===0 && (
        <div className="empty"><div className="emico">📋</div><div style={{fontSize:14}}>No orders yet today</div></div>
      )}

      {active.length>0 && <>
        <div className="slabel">Active ({active.length})</div>
        {active.map(o => (
          <div key={o.id} className="oc">
            <div className="ocr">
              <div style={{flex:1}}>
                <div className="ocn">{o.type==="dine-in" ? `Table ${o.table_number}` : o.table_number||"Takeaway"}</div>
                <div className="ocm">
                  <span className={`badge ${o.type==="dine-in"?"bdine":"btake"}`}>{o.type}</span>
                  <span className={`badge ${o.status==="ready"?"brdy":"bkit"}`}>{o.status==="ready"?"Ready":"In Kitchen"}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:20,color:"var(--g)"}}>€{Number(o.total).toFixed(2)}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{timeAgo(o.created_at)} ago</div>
                {o.status==="ready" && (
                  <button className="btn bg2 bsm" style={{marginTop:8}} onClick={() => onPay(o)}>Collect Payment</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </>}

      {done.length>0 && <>
        <div className="slabel" style={{marginTop:20}}>Completed today</div>
        {done.map(o => (
          <div key={o.id} className="oc" style={{opacity:.5}}>
            <div className="ocr">
              <div style={{flex:1}}>
                <div className="ocn">{o.type==="dine-in" ? `Table ${o.table_number}` : o.table_number||"Takeaway"}</div>
                <div className="ocm">
                  <span className={`badge ${o.type==="dine-in"?"bdine":"btake"}`}>{o.type}</span>
                  <span className="badge bpaid">Paid</span>
                </div>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:18}}>€{Number(o.total).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </>}
    </div>
  );
};

// ── Payment Screen ─────────────────────────────────────────────────
const PaymentScreen = ({ order, orderItems, onConfirm, onBack }) => {
  const [method, setMethod] = useState(null);
  const [busy, setBusy]     = useState(false);
  const items = orderItems.filter(i => i.order_id === order.id);

  const confirm = async () => {
    setBusy(true);
    await onConfirm(order, method);
    setBusy(false);
  };

  return (
    <div className="pg">
      <button className="btn bo bsm" style={{marginBottom:16}} onClick={onBack}><Ic.Back/> Back</button>
      <div className="sh">Payment</div>
      <div className="ss">{order.type==="dine-in" ? `Table ${order.table_number}` : order.table_number||"Takeaway"}</div>

      <div className="card" style={{padding:16,marginBottom:16}}>
        {items.map(i => (
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
        <div className={`ptile${method==="cash"?" on":""}`} onClick={() => setMethod("cash")}><Ic.Cash/> Cash</div>
        <div className={`ptile${method==="card"?" on":""}`} onClick={() => setMethod("card")}><Ic.Card/> Card</div>
      </div>

      <button className="btn bp bw" disabled={!method||busy} onClick={confirm}>
        <Ic.Check/> {busy ? "Processing…" : `Confirm — €${Number(order.total).toFixed(2)}`}
      </button>
    </div>
  );
};

// ── Reports Screen ─────────────────────────────────────────────────
const ReportsScreen = ({ orders, orderItems, payments, onLock }) => {
  const [period, setPeriod] = useState("today");
  const start = getStartOf(period);

  const paidOrders = orders.filter(o => o.status==="paid" && new Date(o.created_at)>=start);
  const filtPay    = payments.filter(p => new Date(p.paid_at)>=start);
  const revenue    = filtPay.reduce((s,p) => s+Number(p.amount), 0);
  const avg        = paidOrders.length ? revenue/paidOrders.length : 0;
  const dineIn     = paidOrders.filter(o=>o.type==="dine-in").length;
  const takeaway   = paidOrders.filter(o=>o.type==="takeaway").length;
  const cashT      = filtPay.filter(p=>p.method==="cash").reduce((s,p)=>s+Number(p.amount),0);
  const cardT      = filtPay.filter(p=>p.method==="card").reduce((s,p)=>s+Number(p.amount),0);

  const paidIds = new Set(paidOrders.map(o=>o.id));
  const counts  = {};
  orderItems.filter(i=>paidIds.has(i.order_id)).forEach(i=>{ counts[i.item_name]=(counts[i.item_name]||0)+i.quantity; });
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);

  return (
    <div className="pg">
      <div className="row" style={{marginBottom:20}}>
        <div className="sh">Reports</div>
        <button className="btn bo bsm" onClick={onLock}>🔒 Lock</button>
      </div>

      <div className="periods">
        {["today","week","month","year"].map(p => (
          <button key={p} className={`pb${period===p?" on":""}`} onClick={()=>setPeriod(p)}>
            {p.charAt(0).toUpperCase()+p.slice(1)}
          </button>
        ))}
      </div>

      <div className="sgrid">
        <div className="sc"><div className="sl">Revenue</div><div className="sv">€{revenue.toFixed(0)}</div><div className="ss2">{paidOrders.length} orders</div></div>
        <div className="sc"><div className="sl">Avg Order</div><div className="sv">€{avg.toFixed(0)}</div><div className="ss2">per order</div></div>
        <div className="sc"><div className="sl">Dine In</div><div className="sv">{dineIn}</div><div className="ss2">orders</div></div>
        <div className="sc"><div className="sl">Takeaway</div><div className="sv">{takeaway}</div><div className="ss2">orders</div></div>
      </div>

      <div className="card" style={{padding:16,marginBottom:20}}>
        <div style={{fontWeight:700,marginBottom:12}}>Payment split</div>
        <div className="row" style={{marginBottom:8}}><span style={{color:"var(--muted)"}}>💵 Cash</span><span style={{fontWeight:700}}>€{cashT.toFixed(2)}</span></div>
        <div className="divider"/>
        <div className="row"><span style={{color:"var(--muted)"}}>💳 Card</span><span style={{fontWeight:700}}>€{cardT.toFixed(2)}</span></div>
      </div>

      {top.length > 0 && <>
        <div style={{fontWeight:700,marginBottom:12}}>Top selling items</div>
        <div className="tlist">
          {top.map(([name,ct],i) => (
            <div key={name} className="tr">
              <div className="trk">{i+1}</div>
              <div className="trn">{name}</div>
              <div className="trc">{ct}×</div>
            </div>
          ))}
        </div>
      </>}

      {top.length===0 && <div className="empty"><div className="emico">📊</div><div style={{fontSize:14}}>No sales data for this period</div></div>}
    </div>
  );
};

// ── Admin Screen ───────────────────────────────────────────────────
const AdminScreen = ({ menuItems, onUpdate, onLock }) => {
  const [cat, setCat]     = useState(MENU_CATEGORIES[0]);
  const [prices, setPrices] = useState({});
  const [saved, setSaved]   = useState({});

  const items = menuItems.filter(i => i.category === cat);

  const savePrice = async (item) => {
    const v = parseFloat(prices[item.id]);
    if (isNaN(v)) return;
    await onUpdate(item.id, { price: v });
    setSaved(s => ({...s,[item.id]:true}));
    setTimeout(() => setSaved(s => ({...s,[item.id]:false})), 1500);
    setPrices(p => { const n={...p}; delete n[item.id]; return n; });
  };

  return (
    <div className="pg">
      <div className="row" style={{marginBottom:20}}>
        <div><div className="sh">Menu Admin</div><div style={{color:"var(--muted)",fontSize:13,marginTop:2}}>Edit prices & availability</div></div>
        <button className="btn bo bsm" onClick={onLock}>🔒 Lock</button>
      </div>

      <div className="cats" style={{marginBottom:20}}>
        {MENU_CATEGORIES.map(c => (
          <div key={c} className={`cp${cat===c?" on":""}`} onClick={() => setCat(c)}>{c}</div>
        ))}
      </div>

      {items.map(item => (
        <div key={item.id} className="ai">
          <label className="tog">
            <input type="checkbox" checked={!!item.available} onChange={() => onUpdate(item.id, {available:!item.available})}/>
            <span className="tsl"/>
          </label>
          <div style={{flex:1,opacity:item.available?1:.4}}>
            <div className="ain">{item.name}</div>
            <div className="aic">{item.category}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:"var(--muted)",fontSize:14}}>€</span>
            <input
              className="pinp"
              type="number" step="0.50" min="0"
              value={prices[item.id] !== undefined ? prices[item.id] : Number(item.price).toFixed(2)}
              onChange={e => setPrices(p => ({...p,[item.id]:e.target.value}))}
              onBlur={() => { if (prices[item.id] !== undefined) savePrice(item); }}
            />
            {saved[item.id] && <span style={{color:"var(--g)",fontSize:14}}>✓</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── App Shell ─────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("new");
  const [screen, setScreen]     = useState(null);
  const [orderCtx, setOrderCtx] = useState(null);
  const [payOrder, setPayOrder] = useState(null);

  const [menuItems, setMenuItems]   = useState([]);
  const [orders, setOrders]         = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [payments, setPayments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [seeding, setSeeding]       = useState(false);
  const [toast, setToast]           = useState("");

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const load = useCallback(async () => {
    try {
      const [m,o,oi,p] = await Promise.all([
        dbGet("menu_items?order=category,name"),
        dbGet("orders?order=created_at.desc&limit=200"),
        dbGet("order_items?order=created_at.asc"),
        dbGet("payments?order=paid_at.desc"),
      ]);
      setMenuItems(m||[]);
      setOrders(o||[]);
      setOrderItems(oi||[]);
      setPayments(p||[]);
    } catch(e) {
      showToast("⚠️ Connection error — check internet");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const seedMenu = async () => {
    setSeeding(true);
    try {
      await dbPost("menu_items", DEFAULT_MENU);
      await load();
      showToast("✓ Menu loaded successfully!");
    } catch(e) {
      console.error(e);
      showToast("Failed — check Supabase connection");
    }
    setSeeding(false);
  };

  const createOrder = async (cartItems, total) => {
    try {
      const [order] = await dbPost("orders", {
        type: orderCtx.type,
        table_number: orderCtx.ref || null,
        status: "in-kitchen",
        total,
      });
      await dbPost("order_items", cartItems.map(i => ({
        order_id: order.id,
        item_name: i.name,
        category: i.category,
        quantity: i.quantity,
        price: Number(i.price),
        note: i.note || null,
      })));
      await load();
      showToast("✓ Sent to kitchen!");
      setScreen(null);
      setTab("kitchen");
    } catch(e) {
      console.error(e);
      showToast("Failed to send order");
    }
  };

  const markReady = async (id) => {
    try {
      await dbPatch(`orders?id=eq.${id}`, { status: "ready" });
      await load();
      showToast("✓ Marked ready");
    } catch(e) { showToast("Error"); }
  };

  const confirmPayment = async (order, method) => {
    try {
      await dbPatch(`orders?id=eq.${order.id}`, { status: "paid" });
      await dbPost("payments", { order_id: order.id, method, amount: Number(order.total) });
      await load();
      showToast("✓ Payment confirmed");
      setScreen(null);
      setPayOrder(null);
      setTab("orders");
    } catch(e) { showToast("Payment failed"); }
  };

  const updateMenuItem = async (id, fields) => {
    try {
      await dbPatch(`menu_items?id=eq.${id}`, fields);
      await load();
    } catch(e) { showToast("Save failed"); }
  };

  const kitchenCount = orders.filter(o => o.status==="in-kitchen").length;
  const readyCount   = orders.filter(o => o.status==="ready").length;
  const menuReady    = menuItems.length > 0;

  // ── Header component ─────────────────────────────────────────────
  const Header = ({ sub }) => (
    <div className="hdr">
      <div className="hdr-brand">
        <ObaladeLogo size={38}/>
        <div>
          <div className="hdr-name">Obalade Suya</div>
          <div className="hdr-sub">{sub || "POS · Amsterdam"}</div>
        </div>
      </div>
      {!sub && (
        <div className="hdr-actions">
          <button className="hdr-btn" onClick={() => setScreen("pin-admin")}>Admin</button>
          <button className="hdr-btn" onClick={() => setScreen("pin-reports")}>Reports</button>
        </div>
      )}
    </div>
  );

  // ── Route ─────────────────────────────────────────────────────────
  if (screen === "pin-reports") return <div className="app"><style>{S}</style><Header sub="Owner Access"/><PinScreen title="Reports" onSuccess={()=>setScreen("reports")} onCancel={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if (screen === "pin-admin")   return <div className="app"><style>{S}</style><Header sub="Admin Access"/><PinScreen title="Menu Admin" onSuccess={()=>setScreen("admin")} onCancel={()=>setScreen(null)}/><Toast msg={toast}/></div>;

  if (screen === "reports") return <div className="app"><style>{S}</style><Header sub="Owner Reports"/><ReportsScreen orders={orders} orderItems={orderItems} payments={payments} onLock={()=>setScreen(null)}/><Toast msg={toast}/></div>;
  if (screen === "admin")   return <div className="app"><style>{S}</style><Header sub="Menu Admin"/><AdminScreen menuItems={menuItems} onUpdate={updateMenuItem} onLock={()=>setScreen(null)}/><Toast msg={toast}/></div>;

  if (screen === "menu") return (
    <div className="app"><style>{S}</style>
      <Header sub={orderCtx?.type==="dine-in" ? `Table ${orderCtx?.ref}` : "Takeaway"}/>
      <MenuScreen menuItems={menuItems} orderType={orderCtx?.type} tableRef={orderCtx?.ref} onSend={createOrder} onBack={()=>setScreen(null)}/>
      <Toast msg={toast}/>
    </div>
  );

  if (screen === "payment") return (
    <div className="app"><style>{S}</style>
      <Header sub="Payment"/>
      <PaymentScreen order={payOrder} orderItems={orderItems} onConfirm={confirmPayment} onBack={()=>{setScreen(null);setPayOrder(null);}}/>
      <Toast msg={toast}/>
    </div>
  );

  // ── Main shell ────────────────────────────────────────────────────
  return (
    <div className="app">
      <style>{S}</style>
      <Header/>
      <Toast msg={toast}/>

      {/* First launch: no menu yet */}
      {!loading && !menuReady && (
        <SetupScreen onSeed={seedMenu} seeding={seeding}/>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16}}>
          <ObaladeLogo size={64}/>
          <div style={{color:"var(--muted)",fontSize:14}}>Connecting…</div>
        </div>
      )}

      {/* Normal app */}
      {!loading && menuReady && <>
        {tab === "new"     && <NewOrderScreen onStart={(type,ref)=>{setOrderCtx({type,ref});setScreen("menu");}}/>}
        {tab === "kitchen" && <KitchenScreen orders={orders} orderItems={orderItems} onReady={markReady} onRefresh={load} loading={false}/>}
        {tab === "orders"  && <OrdersScreen orders={orders} onPay={(o)=>{setPayOrder(o);setScreen("payment");}}/>}

        <nav className="nav">
          <button className={`nt${tab==="new"?" on":""}`} onClick={()=>{setTab("new");setScreen(null);}}>
            <Ic.New/> New Order
          </button>
          <button className={`nt${tab==="kitchen"?" on":""}`} onClick={()=>setTab("kitchen")}>
            <Ic.Kitchen/>
            {kitchenCount>0 && <span className="ndot">{kitchenCount}</span>}
            Kitchen
          </button>
          <button className={`nt${tab==="orders"?" on":""}`} onClick={()=>setTab("orders")}>
            <Ic.Orders/>
            {readyCount>0 && <span className="ndot">{readyCount}</span>}
            Orders
          </button>
        </nav>
      </>}
    </div>
  );
}
