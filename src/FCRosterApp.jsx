import { useState, useRef, useEffect, useCallback } from "react";
import { supabase, signInGoogle, signInEmail, signUpEmail, signOut, onAuthChange, saveFormation, updateFormation, loadFormations, deleteFormation } from "./supabase.js";

var FORMATIONS = {
  "11v11":{
    "4-3-3":  [{id:1,n:"GK",x:32,y:88},{id:2,n:"RB",x:52,y:73},{id:3,n:"CB",x:41,y:76},{id:4,n:"CB",x:24,y:76},{id:5,n:"LB",x:13,y:73},{id:6,n:"CM",x:43,y:55},{id:7,n:"CM",x:32,y:52},{id:8,n:"CM",x:22,y:55},{id:9,n:"RW",x:49,y:30},{id:10,n:"ST",x:32,y:24},{id:11,n:"LW",x:16,y:30}],
    "4-4-2":  [{id:1,n:"GK",x:32,y:88},{id:2,n:"RB",x:52,y:73},{id:3,n:"CB",x:41,y:76},{id:4,n:"CB",x:24,y:76},{id:5,n:"LB",x:13,y:73},{id:6,n:"RM",x:51,y:52},{id:7,n:"CM",x:39,y:55},{id:8,n:"CM",x:26,y:55},{id:9,n:"LM",x:14,y:52},{id:10,n:"ST",x:40,y:27},{id:11,n:"ST",x:25,y:27}],
    "4-2-3-1":[{id:1,n:"GK",x:32,y:88},{id:2,n:"RB",x:52,y:73},{id:3,n:"CB",x:41,y:77},{id:4,n:"CB",x:24,y:77},{id:5,n:"LB",x:13,y:73},{id:6,n:"DM",x:40,y:61},{id:7,n:"DM",x:25,y:61},{id:8,n:"RW",x:47,y:42},{id:9,n:"AM",x:32,y:40},{id:10,n:"LW",x:18,y:42},{id:11,n:"ST",x:32,y:21}],
    "3-5-2":  [{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:44,y:77},{id:3,n:"CB",x:32,y:79},{id:4,n:"CB",x:21,y:77},{id:5,n:"RM",x:53,y:54},{id:6,n:"CM",x:42,y:57},{id:7,n:"CM",x:32,y:59},{id:8,n:"CM",x:23,y:57},{id:9,n:"LM",x:12,y:54},{id:10,n:"ST",x:40,y:27},{id:11,n:"ST",x:25,y:27}],
    "4-5-1":  [{id:1,n:"GK",x:32,y:88},{id:2,n:"RB",x:52,y:73},{id:3,n:"CB",x:41,y:76},{id:4,n:"CB",x:24,y:76},{id:5,n:"LB",x:13,y:73},{id:6,n:"RM",x:53,y:54},{id:7,n:"CM",x:42,y:57},{id:8,n:"CM",x:32,y:59},{id:9,n:"CM",x:23,y:57},{id:10,n:"LM",x:12,y:54},{id:11,n:"ST",x:32,y:22}],
    "5-3-2":  [{id:1,n:"GK",x:32,y:88},{id:2,n:"RWB",x:55,y:70},{id:3,n:"CB",x:44,y:77},{id:4,n:"CB",x:32,y:79},{id:5,n:"CB",x:21,y:77},{id:6,n:"LWB",x:10,y:70},{id:7,n:"CM",x:42,y:54},{id:8,n:"CM",x:32,y:56},{id:9,n:"CM",x:23,y:54},{id:10,n:"ST",x:40,y:27},{id:11,n:"ST",x:25,y:27}],
  },
  "9v9":{
    "3-3-2":  [{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:44,y:75},{id:3,n:"CB",x:32,y:77},{id:4,n:"CB",x:21,y:75},{id:5,n:"CM",x:44,y:54},{id:6,n:"CM",x:32,y:52},{id:7,n:"CM",x:21,y:54},{id:8,n:"ST",x:62,y:28},{id:9,n:"ST",x:38,y:28}],
    "2-3-2-1":[{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:41,y:76},{id:3,n:"CB",x:24,y:76},{id:4,n:"RM",x:49,y:58},{id:5,n:"CM",x:32,y:60},{id:6,n:"LM",x:16,y:58},{id:7,n:"RW",x:46,y:38},{id:8,n:"LW",x:20,y:38},{id:9,n:"ST",x:32,y:24}],
    "3-4-1":  [{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:44,y:75},{id:3,n:"CB",x:32,y:78},{id:4,n:"CB",x:21,y:75},{id:5,n:"RM",x:51,y:53},{id:6,n:"CM",x:40,y:56},{id:7,n:"CM",x:25,y:56},{id:8,n:"LM",x:14,y:53},{id:9,n:"ST",x:32,y:25}],
  },
  "7v7":{
    "2-3-1":[{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:42,y:73},{id:3,n:"CB",x:23,y:73},{id:4,n:"RM",x:49,y:52},{id:5,n:"CM",x:32,y:50},{id:6,n:"LM",x:16,y:52},{id:7,n:"ST",x:32,y:25}],
    "3-2-1":[{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:46,y:73},{id:3,n:"CB",x:32,y:75},{id:4,n:"CB",x:20,y:73},{id:5,n:"CM",x:40,y:52},{id:6,n:"CM",x:25,y:52},{id:7,n:"ST",x:32,y:25}],
  },
  "5v5":{
    "2-1-1":[{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:42,y:72},{id:3,n:"CB",x:23,y:72},{id:4,n:"CM",x:32,y:50},{id:5,n:"ST",x:32,y:25}],
    "1-2-1":[{id:1,n:"GK",x:32,y:88},{id:2,n:"CB",x:32,y:74},{id:3,n:"CM",x:42,y:54},{id:4,n:"CM",x:23,y:54},{id:5,n:"ST",x:32,y:25}],
  },
};

var SURFACES = {
  grass:  {label:"Grass",  base:"#2d7a3a",light:"#357d40",line:"rgba(255,255,255,0.78)"},
  turf:   {label:"Turf",   base:"#123616",light:"#163d1a",line:"rgba(255,255,255,0.82)"},
  asphalt:{label:"Asphalt",base:"#2a2a2a",light:"#323232",line:"rgba(255,255,255,0.45)"},
  sand:   {label:"Sand",   base:"#C4A265",light:"#D4B87A",line:"rgba(255,255,255,0.65)"},
  futsal: {label:"Futsal", base:"#C8860A",light:"#D4920C",line:"rgba(255,255,255,0.7)"},
  herrema:{label:"Herrema",base:"#4a5c2a",light:"#5a6e36",line:"rgba(255,255,255,0.55)"},
};

var UC = {GK:"#F0B429",DEF:"#1E3A8A",MID:"#3B82F6",ATT:"#93C5FD"};
function unitCol(n){ if(n==="GK")return UC.GK; if(["CB","RB","LB","RWB","LWB"].includes(n))return UC.DEF; if(["ST","RW","LW","CF"].includes(n))return UC.ATT; return UC.MID; }
function txtOnFill(f){ return ["#F0B429","#93C5FD","#DEDEDE","#C4920A","#E8C200","#D4B87A","#C4A265","#C8860A","#D4920C"].includes(f)?"rgba(0,0,0,0.88)":"#fff"; }


var PALETTES = [
  {id:"unit",    name:"Team",    primary:null,       secondary:null},
  {id:"white",   name:"White",   primary:"#DEDEDE",  secondary:"#111"},
  {id:"black",   name:"Black",   primary:"#1E1E1E",  secondary:"#DDD"},
  {id:"blue",    name:"Blue",    primary:"#1050C4",  secondary:"#FFF"},
  {id:"green",   name:"Green",   primary:"#166638",  secondary:"#FFF"},
  {id:"red",     name:"Red",     primary:"#C42200",  secondary:"#FFF"},
  {id:"yellow",  name:"Yellow",  primary:"#E8C200",  secondary:"#111"},
  {id:"orange",  name:"Orange",  primary:"#CC5A00",  secondary:"#FFF"},
  {id:"grey",    name:"Grey",    primary:"#6B7280",  secondary:"#FFF"},
  {id:"purple",  name:"Purple",  primary:"#7C3AED",  secondary:"#FFF"},
  {id:"pink",    name:"Pink",    primary:"#DB2777",  secondary:"#FFF"},
  {id:"sky",     name:"Sky",     primary:"#38BDF8",  secondary:"#111"},
];

var OPP_COLORS = ["#EE2244","#FF7700","#BB0030","#EEEEEE","#222222","#6600BB","#0040BB","#BB5500"];
var TC = {pass:"#F5BE00",run:"#22CC44",shot:"#F02040"};
var VOLT = "#C8FF00";
var SNAP = 2.5;
var DRAG_T = 8;

var POSTS = [
  {id:1,cat:"Formations",title:"Mastering the 4-3-3",   body:"How the 4-3-3 creates numerical superiority through overlapping fullbacks and inverted wingers."},
  {id:2,cat:"Tactics",   title:"High Press vs Low Block",body:"When to defend high and when to sit deep."},
  {id:3,cat:"Roles",     title:"The Sweeper-Keeper",     body:"Modern goalkeepers are the first outfield player."},
  {id:4,cat:"Youth",     title:"7v7 Development",        body:"Which formations give young players the most touches."},
  {id:5,cat:"Set Pieces",title:"Designing Set Pieces",   body:"Corner routines and free kick shapes that create clear chances."},
  {id:6,cat:"Tactics",   title:"Gegenpressing Science",  body:"Principles that make instant counter-pressing work."},
];

var T = {
  bg:"#1A1A1A", nav:"#111111", surface:"#1E1E1E", raised:"#252525",
  b:"rgba(255,255,255,0.08)", bhi:"rgba(255,255,255,0.15)",
  text:"rgba(255,255,255,0.92)", sub:"rgba(255,255,255,0.52)",
  ghost:"rgba(255,255,255,0.28)", faint:"rgba(255,255,255,0.10)",
  volt:"#C8FF00", voltBg:"rgba(200,255,0,0.08)", voltBd:"rgba(200,255,0,0.30)",
  red:"rgba(240,50,50,0.80)", redBd:"rgba(240,50,50,0.25)",
};

var CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Poppins:wght@400;500&display=swap');",
  "*{box-sizing:border-box;margin:0;padding:0}",
  "::-webkit-scrollbar{width:0;height:0}",
  "body{overscroll-behavior:none}",
  "input,select,textarea{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:5px;color:rgba(255,255,255,0.9);padding:9px 11px;font-family:'Poppins',sans-serif;font-size:13px;width:100%;outline:none;transition:border-color .16s;}",
  "input:focus,select:focus,textarea:focus{border-color:rgba(200,255,0,0.4);}",
  "label{font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.24);margin-bottom:5px;display:block;font-family:'Rajdhani',sans-serif;}",
  "@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}",
  "@keyframes moz1{0%{transform:translate(0px,0px) rotate(-15deg)}25%{transform:translate(1.2px,-0.8px) rotate(-22deg)}50%{transform:translate(0.4px,-1.4px) rotate(-10deg)}75%{transform:translate(-0.8px,-0.6px) rotate(-20deg)}100%{transform:translate(0px,0px) rotate(-15deg)}}",
  "@keyframes moz2{0%{transform:translate(0px,0px) rotate(25deg)}20%{transform:translate(-1.5px,0.6px) rotate(18deg)}45%{transform:translate(-0.5px,1.2px) rotate(32deg)}70%{transform:translate(1.0px,0.4px) rotate(20deg)}100%{transform:translate(0px,0px) rotate(25deg)}}",
  "@keyframes moz3{0%{transform:translate(0px,0px) rotate(8deg)}30%{transform:translate(1.8px,-0.4px) rotate(15deg)}55%{transform:translate(0.6px,1.0px) rotate(2deg)}80%{transform:translate(-1.2px,0.2px) rotate(12deg)}100%{transform:translate(0px,0px) rotate(8deg)}}",
  "@keyframes moz4{0%{transform:translate(0px,0px) rotate(-40deg)}15%{transform:translate(-1.0px,-1.2px) rotate(-50deg)}40%{transform:translate(0.8px,-0.8px) rotate(-32deg)}65%{transform:translate(1.2px,0.6px) rotate(-44deg)}85%{transform:translate(-0.4px,1.0px) rotate(-36deg)}100%{transform:translate(0px,0px) rotate(-40deg)}}",
  "@keyframes moz5{0%{transform:translate(0px,0px) rotate(55deg)}35%{transform:translate(-0.6px,1.4px) rotate(62deg)}60%{transform:translate(1.4px,0.8px) rotate(48deg)}100%{transform:translate(0px,0px) rotate(55deg)}}",
  ".fu{animation:fadeUp .24s ease both}",
  ".ps{flex:1;display:grid;grid-template-columns:200px 1fr 196px;overflow:hidden;min-height:0;}",
  ".lp,.rp{overflow-y:auto;overflow-x:hidden;background:#1E1E1E;}",
  ".lp{border-right:1px solid rgba(255,255,255,0.08);}",
  ".rp{border-left:1px solid rgba(255,255,255,0.08);}",
  ".pc{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 4px;overflow:hidden;min-width:0;background:#131313;}",
  ".pw{flex:1;min-height:0;aspect-ratio:65/100;max-width:100%;}",
  ".d-hdr{display:flex;align-items:center;justify-content:center;padding:5px 16px;border-bottom:1px solid rgba(255,255,255,0.06);background:#131313;flex-shrink:0;gap:10;}",
  ".d-bar{width:100%;flex-shrink:0;padding:7px 8px;background:#0e0e0e;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;}",
  ".nav-sec{display:flex;}",
  ".nav-more{display:none;}",
  ".mob-ctrl{display:none;}",
  "@media(max-width:767px){",
  "  .ps{grid-template-columns:1fr;height:100%;display:flex;flex-direction:column;overflow:hidden;min-height:0;flex:1;}",
  "  .lp,.rp{display:none!important}",
  "  .pc{flex:1;min-height:0;padding:0;background:#131313;align-items:stretch;justify-content:flex-start;overflow:hidden;}",
  "  .pw{flex:1;min-height:0;width:auto;aspect-ratio:65/100;max-width:100%;margin:0 auto;max-height:100%;}",
  "  .d-hdr,.d-bar{display:none!important;}",
  "  .mob-ctrl{display:flex;flex-direction:column;flex-shrink:0;background:#1E1E1E;border-top:1px solid rgba(255,255,255,0.08);}",
  "  .mob-tabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.08);background:#111111;}",
  "  .mob-panel{display:flex;align-items:flex-start;justify-content:center;min-height:90px;overflow-y:auto;-webkit-overflow-scrolling:touch;transition:max-height 0.3s ease;overscroll-behavior:contain;}",
  "}",
  "@media(max-width:639px){.nav-sec{display:none!important}.nav-more{display:flex!important}}",
  "@media(min-width:768px) and (max-width:1099px){.ps{grid-template-columns:172px 1fr 168px}}",
  /* Button system */
  ".btn{display:inline-flex;align-items:center;justify-content:center;border-radius:6px;font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.14s;border:none;outline:none;}",
  ".btn:active{transform:scale(0.96);}",
  ".btn-primary{background:#C8FF00;color:#000;border:none;box-shadow:0 2px 12px rgba(200,255,0,0.25);}",
  ".btn-primary:hover{background:#d4ff33;box-shadow:0 4px 18px rgba(200,255,0,0.35);}",
  ".btn-secondary{background:transparent;color:rgba(255,255,255,0.52);border:1px solid rgba(255,255,255,0.12);}",
  ".btn-secondary:hover{border-color:rgba(255,255,255,0.28);color:rgba(255,255,255,0.82);}",
  ".btn-danger{background:transparent;color:rgba(240,50,50,0.8);border:1px solid rgba(240,50,50,0.25);}",
  ".btn-danger:hover{background:rgba(240,50,50,0.08);border-color:rgba(240,50,50,0.5);}",
  ".btn-volt-outline{background:rgba(200,255,0,0.08);color:#C8FF00;border:1px solid rgba(200,255,0,0.3);}",
  ".btn-volt-outline:hover{background:rgba(200,255,0,0.14);border-color:rgba(200,255,0,0.55);}",
  ".btn-sm{padding:5px 12px;font-size:10px;}",
  ".btn-md{padding:8px 16px;font-size:11px;}",
  ".btn-lg{padding:12px 24px;font-size:14px;}",
  /* Tab system */
  ".mob-tab-btn{flex:1;padding:11px 0;background:none;border:none;cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.28);border-bottom:2px solid transparent;transition:color .13s,border-color .13s,background .13s;}",
  ".mob-tab-btn.active{color:#C8FF00;border-bottom-color:#C8FF00;background:rgba(200,255,0,0.04);}",
  /* Phase pills */
  ".phase-pill{display:flex;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:11px;transition:all 0.13s;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(255,255,255,0.28);width:32px;height:32px;}",
  ".phase-pill:active{transform:scale(0.92);}",
  ".phase-pill.saved{border-color:rgba(255,255,255,0.3);color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.06);}",
  ".phase-pill.active-phase{border-color:#C8FF00;background:#C8FF00;color:#000;box-shadow:0 2px 10px rgba(200,255,0,0.3);}",
].join("\n");

function useOutside(ref, cb, active) {
  useEffect(function() {
    if (!active) return;
    function fn(e) { if (ref.current && !ref.current.contains(e.target)) cb(); }
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn, {passive:true});
    return function() { document.removeEventListener("mousedown",fn); document.removeEventListener("touchstart",fn); };
  }, [active, cb]);
}

function Seg({ options, value, onChange, sm }) {
  return (
    <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:7,padding:3,gap:2,overflowX:"auto",scrollbarWidth:"none"}}>
      {options.map(function(o) {
        var v = o.value != null ? o.value : o;
        var l = o.label != null ? o.label : o;
        var act = v === value;
        return (
          <button key={String(v)} onClick={function() { onChange(v); }} style={{
            flex:"none", padding:sm?"4px 10px":"6px 13px", borderRadius:5, border:"none",
            cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontSize:sm?12:13,
            fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",
            whiteSpace:"nowrap", transition:"all 0.15s",
            background:act?VOLT:"transparent",
            color:act?"#000":"rgba(255,255,255,0.42)",
          }}>{l}</button>
        );
      })}
    </div>
  );
}

function DD({ value, options, onChange, accent, bg, up }) {
  var [open, setOpen] = useState(false);
  var [rect, setRect] = useState(null);
  var ref = useRef(null);
  var btnRef = useRef(null);
  var ac = accent || VOLT;
  useOutside(ref, useCallback(function() { setOpen(false); }, []), open);
  var found = options.find(function(o) { return (o.value != null ? o.value : o) === value; });
  var label = found ? (found.label || found) : value;
  var chip = found && found.color ? found.color : null;

  function handleOpen() {
    if (up && btnRef.current) {
      var r = btnRef.current.getBoundingClientRect();
      setRect(r);
    }
    setOpen(function(v) { return !v; });
  }

  function renderOptions(opts) {
    return opts.map(function(opt) {
      var v = opt.value != null ? opt.value : opt;
      var l = opt.label != null ? opt.label : opt;
      var c = opt.color || null;
      var active = v === value;
      return (
        <div key={String(v)} onClick={function() { onChange(v); setOpen(false); }}
          style={{padding:"9px 12px",cursor:"pointer",fontSize:14,fontFamily:"'Rajdhani',sans-serif",fontWeight:active?700:500,letterSpacing:"0.04em",color:active?ac:T.sub,background:active?"rgba(200,255,0,0.06)":"transparent",borderLeft:"2px solid "+(active?ac:"transparent"),display:"flex",alignItems:"center",gap:8,transition:"background 0.1s"}}
          onMouseEnter={function(e){if(!active){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color=T.text;}}}
          onMouseLeave={function(e){if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.sub;}}}>
          {c && <div style={{width:14,height:14,borderRadius:"50%",background:c,flexShrink:0,border:"1px solid rgba(255,255,255,0.18)"}}/>}
          <span style={{flex:1}}>{l}</span>
          {active && <span style={{color:ac,fontSize:12}}>v</span>}
        </div>
      );
    });
  }

  return (
    <div ref={ref} style={{position:"relative",width:"100%"}}>
      <button ref={btnRef} onClick={handleOpen} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:8, padding:"9px 12px", borderRadius:6,
        background:open ? T.raised : (bg || T.surface),
        border:"1px solid " + (open ? T.bhi : T.b),
        color:T.text, cursor:"pointer", fontFamily:"'Rajdhani',sans-serif",
        fontSize:14, fontWeight:600, letterSpacing:"0.04em", transition:"all 0.13s",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
          {chip && <div style={{width:16,height:16,borderRadius:"50%",background:chip,flexShrink:0,border:"1px solid rgba(255,255,255,0.2)"}}/>}
          <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span>
        </div>
        <span style={{opacity:0.3,fontSize:10,marginLeft:4,flexShrink:0}}>{open?"^":"v"}</span>
      </button>
      {open && !up && (
        <div style={{position:"absolute",top:"calc(100% + 3px)",left:0,right:0,zIndex:600,background:"#222",border:"1px solid " + T.bhi,borderRadius:6,overflow:"hidden",boxShadow:"0 16px 40px rgba(0,0,0,0.75)"}}>
          {renderOptions(options)}
        </div>
      )}
      {open && up && rect && (
        <div style={{position:"fixed",bottom:window.innerHeight - rect.top + 4,left:rect.left,width:rect.width,zIndex:2000,background:"#222",border:"1px solid " + T.bhi,borderRadius:6,overflow:"hidden",boxShadow:"0 -8px 28px rgba(0,0,0,0.85)"}}>
          {renderOptions(options)}
        </div>
      )}
    </div>
  );
}

function PalChip({ pal, sz }) {
  var s = sz || 22;
  if (pal.primary === null) {
    return <div style={{width:s,height:s,borderRadius:"50%",background:"conic-gradient(#F0B429 0 25%,#1E3A8A 25% 50%,#3B82F6 50% 75%,#93C5FD 75%)"}}/>;
  }
  return <div style={{width:s,height:s,borderRadius:"50%",background:pal.primary}}/>;
}

function KitPicker({ value, onChange, bg, up }) {
  var [open, setOpen] = useState(false);
  var [rect, setRect] = useState(null);
  var ref = useRef(null);
  var btnRef = useRef(null);
  useOutside(ref, useCallback(function() { setOpen(false); }, []), open);
  var pal = PALETTES.find(function(p) { return p.id === value; }) || PALETTES[0];
  function handleOpen() {
    if (up && btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen(function(v) { return !v; });
  }
  var grid = (
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",rowGap:10,columnGap:6}}>
      {PALETTES.map(function(p) {
        var sel = p.id === value;
        return (
          <div key={p.id} onClick={function() { onChange(p.id); setOpen(false); }}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
            <div style={{width:26,height:26,borderRadius:"50%",overflow:"hidden",outline:sel?"2px solid rgba(255,255,255,0.8)":"1px solid rgba(255,255,255,0.12)",outlineOffset:sel?2:0,transform:sel?"scale(1.1)":"scale(1)",transition:"all 0.12s"}}>
              <PalChip pal={p} sz={26}/>
            </div>
            <span style={{fontSize:7,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:sel?T.text:T.ghost,fontFamily:"'Rajdhani',sans-serif",whiteSpace:"nowrap"}}>{p.name}</span>
          </div>
        );
      })}
    </div>
  );
  return (
    <div ref={ref} style={{position:"relative",width:"100%"}}>
      <button ref={btnRef} onClick={handleOpen} style={{
        width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
        borderRadius:6, border:"1px solid " + (open ? T.bhi : T.b),
        background:open ? T.raised : (bg || T.surface), cursor:"pointer", transition:"all 0.13s",
      }}>
        <PalChip pal={pal} sz={20}/>
        <span style={{flex:1,fontSize:14,fontWeight:600,color:T.text,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.04em",textAlign:"left"}}>{pal.name}</span>
        <span style={{opacity:0.5,fontSize:12,color:"rgba(255,255,255,0.7)",flexShrink:0,marginLeft:4}}>{open?"▲":"▼"}</span>
      </button>
      {open && !up && (
        <div style={{position:"absolute",top:"calc(100% + 3px)",left:0,right:0,zIndex:600,background:"#222",border:"1px solid " + T.bhi,borderRadius:6,padding:14,boxShadow:"0 14px 36px rgba(0,0,0,0.72)"}}>
          {grid}
        </div>
      )}
      {open && up && rect && (
        <div style={{position:"fixed",bottom:window.innerHeight - rect.top + 4,left:rect.left,width:rect.width,zIndex:2000,background:"#222",border:"1px solid " + T.bhi,borderRadius:6,padding:14,boxShadow:"0 -8px 28px rgba(0,0,0,0.85)"}}>
          {grid}
        </div>
      )}
    </div>
  );
}

function Toggle({ on, toggle, ac }) {
  var color = ac || "#F02040";
  return (
    <div onClick={toggle} style={{width:36,height:20,borderRadius:10,cursor:"pointer",flexShrink:0,position:"relative",transition:"all 0.2s",background:on?"rgba(61,221,106,0.15)":T.faint,border:"1px solid " + (on ? color+"55" : T.b)}}>
      <div style={{position:"absolute",top:3,left:on?17:3,width:12,height:12,borderRadius:"50%",transition:"left 0.2s",background:on?color:"rgba(255,255,255,0.3)"}}/>
    </div>
  );
}

function SL({ c }) { return <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",color:T.ghost,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",marginBottom:8}}>{c}</div>; }
function HR() { return <div style={{height:1,background:T.b,margin:"8px 0"}}/>; }

export default function FCRoster() {
  var [tab,       setTab]       = useState("pitch");
  var [gameFmt,   setGameFmt]   = useState("11v11");
  var [formation, setFormation] = useState("4-3-3");
  var [surface,   setSurface]   = useState("grass");
  var [players,   setPlayers]   = useState(function() { return FORMATIONS["11v11"]["4-3-3"].map(function(p){return Object.assign({},p);}); });
  var [paletteId, setPaletteId] = useState("unit");
  var [tool,      setTool]      = useState(null);
  var [lines,     setLines]     = useState([]);
  var [curLine,   setCurLine]   = useState(null);
  var [historyLen, setHistoryLen] = useState(0);
  var historyRef = useRef([]);
  var [ballPos,   setBallPos]   = useState(null);
  var [title,     setTitle]     = useState("My FCRoster");
  var [editTitle, setEditTitle] = useState(false);
  var [showOpp,   setShowOpp]   = useState(false);
  var [oppFmt,    setOppFmt]    = useState("4-4-2");
  var [oppList,   setOppList]   = useState([]);
  var [oppColor,  setOppColor]  = useState("#EE2244");
  var [user,      setUser]      = useState(null);
  var [showAuth,  setShowAuth]  = useState(false);
  var [authMode,  setAuthMode]  = useState("signin");
  var [aEmail,    setAEmail]    = useState("");
  var [aPass,     setAPass]     = useState("");
  var [aName,     setAName]     = useState("");
  var [authErr,   setAuthErr]   = useState("");
  var [authBusy,  setAuthBusy]  = useState(false);
  var [savedFormations, setSavedFormations] = useState([]);
  var [savedId,   setSavedId]   = useState(null);


  // Real Supabase auth listener -- event-aware to prevent OAuth loop
  useEffect(function() {
    var { data: { subscription } } = supabase.auth.onAuthStateChange(function(event, session) {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (session && session.user) {
          var u = session.user;
          setUser({ id: u.id, name: (u.user_metadata && u.user_metadata.full_name) || u.email.split("@")[0], email: u.email });
          setPlayers(FORMATIONS["11v11"]["4-3-3"].map(function(p){return Object.assign({},p);}));
          setLines([]);
          setBallPos(null);
          setTitle("My FCRoster");
          loadFormations().then(setSavedFormations).catch(function(){});
        }
      } else if (event === "TOKEN_REFRESHED") {
        // Silent token refresh on window focus — only update user, never touch pitch
        if (session && session.user) {
          var u = session.user;
          setUser({ id: u.id, name: (u.user_metadata && u.user_metadata.full_name) || u.email.split("@")[0], email: u.email });
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSavedFormations([]);
        setSavedId(null);
        setPlayers(FORMATIONS["11v11"]["4-3-3"].map(function(p){return Object.assign({},p);}));
        setLines([]);
        setBallPos(null);
        setTitle("My FCRoster");
      }
    });
    return function() { subscription.unsubscribe(); };
  }, []);
  // Mount: clean default pitch for all users
  useEffect(function() {
    setPlayers(FORMATIONS["11v11"]["4-3-3"].map(function(p){return Object.assign({},p);}));
    setLines([]);
    setBallPos(null);
    setTitle("My FCRoster");
  }, []);


  var [dragId,    setDragId]    = useState(null);
  var [editP,     setEditP]     = useState(null);
  var [inlineName,setInlineName]= useState(null);
  var [subs,      setSubs]      = useState([]);
  var [phases,    setPhases]    = useState([null,null,null,null,null]);
  var [activePhase, setActivePhase] = useState(null);
  var [playing,   setPlaying]   = useState(false);
  var playRef = useRef(null);
  var [toast,     setToast]     = useState(null);
  var [moreOpen,  setMoreOpen]  = useState(false);
  var [sheetTab,  setSheetTab]  = useState("lineup");
  var [mobMenu,   setMobMenu]   = useState(function(){
    try { return localStorage.getItem("fcr_panel") || "pitch"; } catch(e){ return "pitch"; }
  });
  var [showHint,  setShowHint]  = useState(true);

  // Hint auto-hides after 3s on first load
  useEffect(function() {
    if (!showHint) return;
    var t = setTimeout(function(){setShowHint(false);}, 3000);
    return function(){clearTimeout(t);};
  }, []);

  // Persist panel state
  function setPanel(v) {
    setMobMenu(v);
    try { localStorage.setItem("fcr_panel", v); } catch(e){}
  }

  var svgRef      = useRef(null);
  var moreRef     = useRef(null);
  var dIdRef      = useRef(null);
  var dPosRef     = useRef(null);
  var dCandRef    = useRef(null);
  var moveFnRef   = useRef(null);
  var playersRef  = useRef(players);
  var setEditPRef = useRef(null);

  useOutside(moreRef, useCallback(function(){setMoreOpen(false);}, []), moreOpen);

  // Keep refs current so native listeners always see latest values
  var toolRef   = useRef(tool);
  var userRef   = useRef(user);
  var notifyRef = useRef(notify);
  useEffect(function() { toolRef.current = tool; }, [tool]);
  useEffect(function() { userRef.current = user; }, [user]);
  playersRef.current  = players;
  notifyRef.current   = notify;
  setEditPRef.current = setEditP;

  useEffect(function() {
    var el = svgRef.current; if (!el) return;

    // Walk up from touch target to find a token <g> by id="tkn-N"
    function findTokenId(node) {
      while (node && node !== el) {
        var id = node.id || "";
        if (id.indexOf("tkn-") === 0) return parseInt(id.slice(4), 10);
        node = node.parentNode;
      }
      return null;
    }

    function onStart(e) {
      var t = e.touches && e.touches[0]; if (!t) return;
      var currentTool = toolRef.current;

      // Name edit modal only fires when NO tool is selected
      // Every active tool owns its touch completely -- no modal interruption
      if (currentTool === null) {
        var target = e.target;
        var isText = target && target.tagName && target.tagName.toLowerCase() === "text";
        var targetY = isText ? parseFloat(target.getAttribute("y") || "0") : 0;
        if (isText && targetY > 5) {
          e.preventDefault(); // block synthetic click + scroll
          if (!userRef.current) { if(notifyRef.current) notifyRef.current("Sign in to name your players"); return; }
          var node = target;
          var pid2 = null;
          while (node) {
            if (node.id && node.id.indexOf("tkn-") === 0) { pid2 = parseInt(node.id.slice(4), 10); break; }
            node = node.parentNode;
          }
          if (pid2 !== null && playersRef.current && svgRef.current) {
            var plr2 = playersRef.current.find(function(x){return x.id===pid2;});
            if (plr2) {
              var rect2 = svgRef.current.getBoundingClientRect();
              setInlineName({id:plr2.id, name:plr2.name||"", screenX:rect2.left+plr2.x*(rect2.width/65), screenY:rect2.top+plr2.y*(rect2.height/100)});
            }
          }
          return;
        }
      }

      // All other SVG touches: prevent default (stops scroll/zoom)
      e.preventDefault();

      var pid = findTokenId(e.target);
      if (pid !== null && currentTool === "drag") {
        dCandRef.current = {id:pid, startX:t.clientX, startY:t.clientY};
      } else if (pid === null || currentTool !== "drag") {
        var c = getXY(e);
        if (currentTool === "ball") { setBallPos(c); }
        else if (currentTool === "pass" || currentTool === "run" || currentTool === "shot") {
          setCurLine({tool:currentTool, pts:[c]});
        }
      }
    }

    function onMove(e) { if (moveFnRef.current) moveFnRef.current(e); }

    el.addEventListener("touchstart", onStart, {passive:false});
    el.addEventListener("touchmove",  onMove,  {passive:false});
    return function() {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
    };
  }, []);

  function notify(msg) { setToast(msg); setTimeout(function(){setToast(null);},2000); }

  var pal = PALETTES.find(function(p){return p.id===paletteId;}) || PALETTES[0];
  function tFill(n) { return pal.primary !== null ? pal.primary : unitCol(n); }
  function tTxt(n) { return txtOnFill(tFill(n)); }

  var loadTeam = useCallback(function(fo, gf) {
    var g=gf||gameFmt, fs=FORMATIONS[g], k=(fo&&fs[fo])?fo:Object.keys(fs)[0];
    setPlayers(fs[k].map(function(p){return Object.assign({},p);}));
    setFormation(k); setLines([]); setBallPos(null);
  }, [gameFmt]);

  var loadOpp = useCallback(function(fo, gf) {
    var g=gf||gameFmt, fs=FORMATIONS[g], k=(fo&&fs[fo])?fo:Object.keys(fs)[0];
    setOppFmt(k); setOppList(fs[k].map(function(p){return Object.assign({},p,{y:100-p.y});}));
  }, [gameFmt]);

  function changeFmt(gf) {
    setGameFmt(gf);
    var fs=FORMATIONS[gf], k=Object.keys(fs)[0];
    setPlayers(fs[k].map(function(p){return Object.assign({},p);}));
    setFormation(k); setLines([]); setBallPos(null);
    if (showOpp) { setOppFmt(k); setOppList(fs[k].map(function(p){return Object.assign({},p,{y:100-p.y});})); }
  }

  useEffect(function(){if(showOpp)loadOpp(oppFmt);},[showOpp]);

  function getXY(e) {
    if (!svgRef.current) return {x:32,y:50};
    var r=svgRef.current.getBoundingClientRect();
    var cx=(e.touches&&e.touches[0])?e.touches[0].clientX:e.clientX;
    var cy=(e.touches&&e.touches[0])?e.touches[0].clientY:e.clientY;
    return {x:Math.max(2,Math.min(63,((cx-r.left)/r.width)*65)), y:Math.max(2,Math.min(98,((cy-r.top)/r.height)*100))};
  }

  var svgMove = useCallback(function(e) {
    if (dCandRef.current !== null && dIdRef.current === null) {
      var t=e.touches&&e.touches[0]; if (!t) return;
      var dx=t.clientX-dCandRef.current.startX, dy=t.clientY-dCandRef.current.startY;
      if (Math.sqrt(dx*dx+dy*dy)>DRAG_T) {
        e.preventDefault();
        dIdRef.current=dCandRef.current.id;
        dCandRef.current=null;
      }
      return;
    }
    if (dIdRef.current !== null) {
      e.preventDefault();
      var c=getXY(e); dPosRef.current=c;
      var el=svgRef.current&&svgRef.current.querySelector("#tkn-"+dIdRef.current);
      if (el) el.setAttribute("transform","translate("+c.x+","+c.y+")");
      return;
    }
    setCurLine(function(v){
      if (!v) return v;
      e.preventDefault();
      var c2=getXY(e);
      return {tool:v.tool,pts:v.pts.concat([c2])};
    });
  }, []);

  moveFnRef.current = svgMove;

  function svgDown(e) {
    var c=getXY(e);
    if (tool==="ball"){pushHistory();setBallPos(c);return;}
    if (tool==="pass"||tool==="run"||tool==="shot") setCurLine({tool:tool,pts:[c]});
  }

  function svgUp() {
    dCandRef.current=null;
    var id=dIdRef.current, pos=dPosRef.current;
    dIdRef.current=null; dPosRef.current=null;
    if (id!==null) {
      setDragId(null);
      if (pos) {
        pushHistory();
        setPlayers(function(prev){return prev.map(function(x){return x.id===id?Object.assign({},x,{x:Math.round(pos.x/SNAP)*SNAP,y:Math.round(pos.y/SNAP)*SNAP}):x;});});
      }
      return;
    }
    if (curLine&&curLine.pts.length>2) {
      pushHistory();
      setLines(function(v){return v.concat([curLine]);});
    }
    setCurLine(null);
  }

  function pMD(e,id){
    if(tool!=="drag") return; // let event bubble to SVG for draw tools
    e.stopPropagation();
    dIdRef.current=id;
    setDragId(id);
  }


  function pts2d(pts){if(pts.length<2)return"";return pts.map(function(p,i){return(i===0?"M":"L")+" "+p.x+" "+p.y;}).join(" ");}
  // History -- push before any destructive pitch change
  function pushHistory() {
    var snap = {
      players: players.map(function(p){return Object.assign({},p);}),
      lines:   lines.slice(),
      ballPos: ballPos ? Object.assign({},ballPos) : null,
    };
    var next = historyRef.current.slice(-19).concat([snap]);
    historyRef.current = next;
    setHistoryLen(next.length);
  }

  function doUndo() {
    var hist = historyRef.current;
    if (hist.length === 0) { notify("Nothing to undo."); return; }
    var snap = hist[hist.length - 1];
    var next = hist.slice(0, -1);
    historyRef.current = next;
    setHistoryLen(next.length);
    setPlayers(snap.players.map(function(p){return Object.assign({},p);}));
    setLines(snap.lines.slice());
    setBallPos(snap.ballPos ? Object.assign({},snap.ballPos) : null);
    notify("Undone.");
  }

  function doClear(){
    pushHistory();
    setLines([]);setBallPos(null);
    notify("Pitch reset.");
  }

  function savePhase(idx) {
    var snapshot = {
      players: players.map(function(p){return Object.assign({},p);}),
      lines:   lines.slice(),
      ballPos: ballPos ? Object.assign({},ballPos) : null,
    };
    setPhases(function(prev){
      var next = prev.slice();
      next[idx] = snapshot;
      return next;
    });
    setActivePhase(idx);
    notify("Phase "+(idx+1)+" saved.");
  }

  function applySnapshot(ph) {
    setPlayers(ph.players.map(function(p){return Object.assign({},p);}));
    setLines(ph.lines.slice());
    setBallPos(ph.ballPos ? Object.assign({},ph.ballPos) : null);
  }

  function loadPhase(idx) {
    var ph = phases[idx];
    if (!ph) return;
    applySnapshot(ph);
    setActivePhase(idx);
  }

  function clearPhase(idx) {
    setPhases(function(prev){
      var next = prev.slice();
      next[idx] = null;
      return next;
    });
    if (activePhase === idx) setActivePhase(null);
  }

  function playPhases() {
    // Auto-save current pitch as active phase (or next empty) before playing
    var curPhase = activePhase;
    if (curPhase !== null) { savePhase(curPhase); }
    else { var nxt = phases.findIndex(function(p){return p===null;}); if(nxt!==-1) savePhase(nxt); }
    var saved = phases.map(function(p,i){return {ph:p,i:i};}).filter(function(x){return x.ph!==null;});
    if (saved.length < 2) { notify("Save at least 2 phases to play."); return; }
    setPlaying(true);
    var step = 0;
    applySnapshot(saved[step].ph);
    setActivePhase(saved[step].i);
    playRef.current = setInterval(function(){
      step++;
      if (step >= saved.length) {
        clearInterval(playRef.current);
        setPlaying(false);
        return;
      }
      applySnapshot(saved[step].ph);
      setActivePhase(saved[step].i);
    }, 1200);
  }

  function stopPlay() {
    clearInterval(playRef.current);
    setPlaying(false);
  }

  function doExport(){
    var svgEl=svgRef.current;
    if(!svgEl){notify("Nothing to export.");return;}

    var clone=svgEl.cloneNode(true);
    clone.setAttribute("xmlns","http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
    clone.style.cursor="default";
    clone.querySelectorAll("[style]").forEach(function(el){
      el.style.cursor="default";
      el.style.userSelect="";
      el.style.pointerEvents="";
    });
    var styleEl=document.createElementNS("http://www.w3.org/2000/svg","style");
    styleEl.textContent="text{font-family:Rajdhani,'Arial Narrow',Arial,sans-serif}";
    clone.insertBefore(styleEl,clone.firstChild);

    var SCALE=2;
    var PAD=24*SCALE;
    var HDR=56*SCALE;
    var FTR=28*SCALE;
    var ROW=26*SCALE;
    var activeSubs=subs.filter(function(s){return s.subName&&s.subName.trim();});
    var SUBTBL=activeSubs.length>0?(20*SCALE + activeSubs.length*ROW + 14*SCALE):0;

    var bbox=svgEl.getBoundingClientRect();
    var PW=Math.round(bbox.width*SCALE);
    var PH=Math.round(bbox.height*SCALE);
    clone.setAttribute("width",PW);
    clone.setAttribute("height",PH);

    var svgStr=new XMLSerializer().serializeToString(clone);
    var blob=new Blob([svgStr],{type:"image/svg+xml;charset=utf-8"});
    var url=URL.createObjectURL(blob);

    var img=new Image();
    img.onload=function(){
      var CW=PW+PAD*2;
      var CH=HDR+PH+SUBTBL+FTR+PAD*2;

      var canvas=document.createElement("canvas");
      canvas.width=CW; canvas.height=CH;
      var ctx=canvas.getContext("2d");

      // Background
      ctx.fillStyle="#111111";
      ctx.fillRect(0,0,CW,CH);

      // Header
      ctx.fillStyle="#1A1A1A";
      ctx.fillRect(0,0,CW,HDR+PAD);
      ctx.textAlign="center";
      ctx.fillStyle="rgba(255,255,255,0.92)";
      ctx.font="bold "+(18*SCALE)+"px 'Arial Narrow',Arial,sans-serif";
      ctx.fillText(title.toUpperCase(),CW/2,PAD+20*SCALE);
      ctx.fillStyle="rgba(255,255,255,0.38)";
      ctx.font=(10*SCALE)+"px Arial,sans-serif";
      ctx.fillText(gameFmt+" - "+formation,CW/2,PAD+36*SCALE);

      // Pitch
      ctx.drawImage(img,PAD,PAD+HDR,PW,PH);

      // Substitution table
      if(activeSubs.length>0){
        var ty=PAD+HDR+PH+14*SCALE;
        // Section header
        ctx.fillStyle="#1A1A1A";
        ctx.fillRect(PAD,ty,PW,18*SCALE);
        ctx.fillStyle="rgba(200,255,0,0.7)";
        ctx.font="bold "+(8*SCALE)+"px 'Arial Narrow',Arial,sans-serif";
        ctx.textAlign="left";
        ctx.fillText("SUBSTITUTIONS",PAD+8*SCALE,ty+12*SCALE);
        ty+=20*SCALE;

        // Column widths
        var C0=PAD,
            C1=PAD+40*SCALE,
            C2=PAD+140*SCALE,
            C3=PAD+190*SCALE,
            C4=PAD+290*SCALE,
            C5=PAD+340*SCALE;

        // Column headers
        ctx.fillStyle="rgba(255,255,255,0.28)";
        ctx.font=(7*SCALE)+"px Arial,sans-serif";
        ctx.textAlign="left";
        ["#","POS","STARTER","","SUB","MIN"].forEach(function(h,i){
          var cx=[C0,C1,C2,C3,C4,C5][i];
          ctx.fillText(h,cx,ty+8*SCALE);
        });
        ty+=12*SCALE;

        activeSubs.forEach(function(s,idx){
          var pl=players.find(function(p){return p.id===s.playerId;});
          var pos=pl?pl.n:s.pos;
          var starterName=pl?(pl.name||pl.n):s.pos;
          // Row bg alternating
          ctx.fillStyle=idx%2===0?"rgba(255,255,255,0.03)":"transparent";
          ctx.fillRect(PAD,ty,PW,ROW-2*SCALE);
          // Number
          ctx.fillStyle="rgba(255,255,255,0.28)";
          ctx.font=(8*SCALE)+"px Arial,sans-serif";
          ctx.textAlign="left";
          ctx.fillText(String(idx+1),C0+4*SCALE,ty+16*SCALE);
          // Pos chip
          var chipFill=tFill(pos);
          ctx.fillStyle=chipFill;
          ctx.beginPath();
          ctx.roundRect(C1,ty+4*SCALE,30*SCALE,16*SCALE,3*SCALE);
          ctx.fill();
          ctx.fillStyle=txtOnFill(chipFill);
          ctx.font="bold "+(7*SCALE)+"px Arial,sans-serif";
          ctx.textAlign="center";
          ctx.fillText(pos.slice(0,4),C1+15*SCALE,ty+15*SCALE);
          // Starter
          ctx.fillStyle="rgba(255,255,255,0.75)";
          ctx.font=(9*SCALE)+"px 'Arial Narrow',Arial,sans-serif";
          ctx.textAlign="left";
          ctx.fillText(starterName.toUpperCase(),C2,ty+16*SCALE);
          // Arrow
          ctx.fillStyle="rgba(255,255,255,0.3)";
          ctx.font=(10*SCALE)+"px Arial,sans-serif";
          ctx.textAlign="center";
          ctx.fillText("\u2192",C3+10*SCALE,ty+16*SCALE);
          // Sub name
          ctx.fillStyle="rgba(200,255,0,0.9)";
          ctx.font="bold "+(9*SCALE)+"px 'Arial Narrow',Arial,sans-serif";
          ctx.textAlign="left";
          ctx.fillText(s.subName.toUpperCase(),C4,ty+16*SCALE);
          // Minute
          if(s.minute){
            ctx.fillStyle="rgba(255,255,255,0.4)";
            ctx.font=(8*SCALE)+"px Arial,sans-serif";
            ctx.textAlign="left";
            ctx.fillText(s.minute+"'",C5,ty+16*SCALE);
          }
          ty+=ROW;
        });
      }

      // Footer
      var footerY=PAD+HDR+PH+SUBTBL+(SUBTBL>0?4*SCALE:0)+16*SCALE;
      ctx.fillStyle="rgba(200,255,0,0.75)";
      ctx.font="bold "+(9*SCALE)+"px Arial,sans-serif";
      ctx.textAlign="center";
      ctx.fillText("FCROSTER.COM",CW/2,footerY);

      URL.revokeObjectURL(url);
      var link=document.createElement("a");
      link.download=(title.replace(/\s+/g,"_")||"formation")+".png";
      link.href=canvas.toDataURL("image/png");
      link.click();
      notify("Saved: "+link.download);
    };
    img.onerror=function(){URL.revokeObjectURL(url);notify("Export failed.");};
    img.src=url;
  }

  var sf=SURFACES[surface];
  var avF=Object.keys(FORMATIONS[gameFmt]);
  var fmtOpts=["11v11","9v9","7v7","5v5"].map(function(v){return {value:v,label:v};});
  var formOpts=avF.map(function(v){return {value:v,label:v};});
  var surfOpts=Object.entries(SURFACES).map(function(e){return {value:e[0],label:e[1].label,color:e[1].base};});

  function ToolRow() {
    var move = [{t:"drag",lb:"Move\nPlayer"},{t:"ball",lb:"Drop\nBall"}];
    var draw = [
      {t:"pass",lb:"Pass",  ac:TC.pass, locked:!user},
      {t:"run", lb:"Run",   ac:TC.run,  locked:!user},
      {t:"shot",lb:"Shot",  ac:TC.shot, locked:!user},
    ];
    function ToolBtn(item) {
      var act = tool===item.t;
      var color = item.ac||VOLT;
      var lines = item.lb.split("\n");
      return (
        <button key={item.t}
          onClick={function(){
            if(item.locked){setShowAuth(true);return;}
            setTool(act ? null : item.t);
          }}
          style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",gap:2,padding:"9px 4px",borderRadius:6,
            position:"relative",cursor:"pointer",transition:"all 0.13s",
            lineHeight:1.3,border:"1px solid",
            fontFamily:"'Rajdhani',sans-serif",fontSize:9,fontWeight:700,
            letterSpacing:"0.08em",textTransform:"uppercase",
            borderColor: item.locked ? "rgba(255,255,255,0.07)"
                       : act ? color+"99" : "rgba(255,255,255,0.1)",
            background:  item.locked ? "rgba(255,255,255,0.03)"
                       : act ? color+"1a" : "rgba(255,255,255,0.04)",
            color:       item.locked ? "rgba(255,255,255,0.22)"
                       : act ? color : "rgba(255,255,255,0.55)",
          }}
          onMouseEnter={function(e){if(!item.locked&&!act){e.currentTarget.style.borderColor="rgba(255,255,255,0.22)";e.currentTarget.style.color="rgba(255,255,255,0.82)";}}}
          onMouseLeave={function(e){if(!item.locked&&!act){e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}}
          onPointerDown={function(e){e.currentTarget.style.transform="scale(0.95)";}}
          onPointerUp={function(e){e.currentTarget.style.transform="scale(1)";}}
          onPointerLeave={function(e){e.currentTarget.style.transform="scale(1)";}}>
          {act && <div style={{position:"absolute",top:0,left:0,right:0,height:2,borderRadius:"6px 6px 0 0",background:color}}/>}
          {item.locked && (
            <div style={{position:"absolute",top:4,right:4,width:12,height:12,borderRadius:"50%",background:"rgba(200,255,0,0.15)",border:"1px solid rgba(200,255,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:6,color:VOLT,lineHeight:1}}>&#9733;</span>
            </div>
          )}
          {lines.map(function(l,i){return <span key={i} style={{fontSize:i===0&&lines.length>1?7:9}}>{l}</span>;})}
        </button>
      );
    }
    return (
      <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
        {tool===null&&(
          <div style={{fontSize:10,color:T.ghost,fontFamily:"'Poppins',sans-serif",textAlign:"center",letterSpacing:"0.02em",padding:"2px 0"}}>
            Select a tool to interact with the pitch
          </div>
        )}
        {/* Movement group */}
        <div>
          <div style={{fontSize:8,fontWeight:700,color:T.faint,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",marginBottom:4}}>Movement</div>
          <div style={{display:"flex",gap:4}}>{move.map(ToolBtn)}</div>
        </div>
        {/* Drawing group */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <div style={{fontSize:8,fontWeight:700,color:T.faint,letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>Drawing</div>
            {!user&&<div style={{fontSize:8,color:VOLT,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:"0.1em",opacity:0.7}}>&#9733; PRO</div>}
          </div>
          <div style={{display:"flex",gap:4}}>{draw.map(ToolBtn)}</div>
        </div>
        {/* Sign in nudge - volt themed, not amber */}
        {!user&&(
          <button onClick={function(){setShowAuth(true);}} className="btn btn-volt-outline btn-sm" style={{width:"100%",gap:6}}>
            <span style={{fontSize:10}}>&#9733;</span> Unlock Drawing Tools
          </button>
        )}
      </div>
    );
  }

  function ActionBar({ compact }) {
    var canUndo = historyLen > 0;
    var sz = "btn-md";
    return (
      <div style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:compact?"5px 0":"0"}}>
        <button onClick={doUndo} className={"btn btn-secondary "+sz}
          style={{flex:1,opacity:canUndo?1:0.28,gap:5,border:canUndo?"1px solid rgba(255,255,255,0.18)":"1px solid rgba(255,255,255,0.06)",fontWeight:canUndo?700:400}} title="Undo" disabled={!canUndo}>
          <span style={{fontSize:14,fontWeight:700}}>&#x21BA;</span>
          <span>Undo</span>
        </button>
        <button onClick={doClear} className={"btn btn-danger "+sz}
          style={{flex:1,gap:5}} title="Reset pitch">
          <span style={{fontSize:14}}>&#x21BA;</span>
          <span>Reset</span>
        </button>
        <button onClick={doExport} className={"btn btn-primary "+sz}
          style={{flex:2,gap:5,fontWeight:800}} title="Export as PNG">
          <span style={{fontSize:12}}>&#x2913;</span>
          <span>Export PNG</span>
        </button>
      </div>
    );
  }

  function PhaseStrip() {
    return (
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 10px",flexShrink:0,background:"#0e0e0e",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>

        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          <span style={{fontSize:9,fontWeight:700,color:T.ghost,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>Format</span>
          <select value={gameFmt} onChange={function(e){changeFmt(e.target.value);}}
            style={{background:"#1a1a1a",border:"1px solid "+T.b,borderRadius:4,color:T.text,padding:"3px 8px",fontFamily:"'Rajdhani',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",outline:"none",letterSpacing:"0.04em"}}>
            {fmtOpts.map(function(o){return <option key={o.value} value={o.value}>{o.label}</option>;})}
          </select>
        </div>

        <div style={{width:1,height:14,background:T.b,flexShrink:0}}/>

        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          <span style={{fontSize:9,fontWeight:700,color:T.ghost,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>Shape</span>
          <select value={formation} onChange={function(e){loadTeam(e.target.value);}}
            style={{background:"#1a1a1a",border:"1px solid "+T.b,borderRadius:4,color:T.text,padding:"3px 8px",fontFamily:"'Rajdhani',sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",outline:"none",letterSpacing:"0.04em"}}>
            {formOpts.map(function(o){return <option key={o.value} value={o.value}>{o.label}</option>;})}
          </select>
        </div>

      </div>
    );
  }

  // Compact phase-only strip for top of mobile bottom menu
  function MobPhaseBar() {
    return (
      <div style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",flexShrink:0,borderBottom:"1px solid rgba(255,255,255,0.08)",background:"#0e0e0e"}}>
        <span style={{fontSize:9,fontWeight:700,color:T.ghost,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",flexShrink:0}}>Phase</span>
        {phases.map(function(ph,i){
          var saved = ph !== null;
          var active = activePhase === i;
          return (
            <button key={i}
              onClick={function(){
                if (saved) { loadPhase(i); } else { savePhase(i); }
                setSheetTab("tools");
              }}
              title={saved ? "Load phase "+(i+1) : "Save current pitch as phase "+(i+1)}
              className={"phase-pill"+(saved?" saved":"")+(active?" active-phase":"")} style={{flexShrink:0}}>
              {i+1}
            </button>
          );
        })}
        <div style={{flex:1}}/>
        {playing ? (
          <button onClick={stopPlay} className="btn btn-danger btn-sm">Stop</button>
        ) : (
          <button onClick={playPhases} className="btn btn-volt-outline btn-sm">Play</button>
        )}
        <button onClick={function(){
          if(activePhase!==null) savePhase(activePhase);
          else { var next=phases.findIndex(function(p){return p===null;}); if(next!==-1) savePhase(next); else notify("All 5 phases used."); }
        }} className="btn btn-secondary btn-sm">Save</button>
      </div>
    );
  }

  function PitchSVG() {
    return (
      <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 65 100"
        style={{display:"block",borderRadius:8,touchAction:"none",cursor:dragId!==null?"grabbing":tool==="drag"?"grab":tool?"crosshair":"default"}}
        onMouseDown={function(e){if(inlineName)setInlineName(null);svgDown(e);}} onMouseMove={svgMove} onMouseUp={svgUp} onMouseLeave={svgUp}
        onTouchEnd={svgUp}>
        <defs>
          

          <filter id="tsh" x="-40%" y="-40%" width="180%" height="220%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.5)" floodOpacity="1"/>
          </filter>
        </defs>

        <rect width="65" height="100" fill={sf.base}/>

        {surface==="herrema"&&(
          <g>
            {/* Top keeper zone worn patches */}
            <ellipse cx="32" cy="7"  rx="12" ry="5"   fill="#5c3d1a" opacity="0.55"/>
            <ellipse cx="28" cy="5"  rx="7"  ry="3.5" fill="#7a4e22" opacity="0.45"/>
            <ellipse cx="37" cy="6"  rx="6"  ry="3"   fill="#6b4218" opacity="0.4"/>
            <ellipse cx="32" cy="9"  rx="9"  ry="4"   fill="#4a3010" opacity="0.5"/>
            <ellipse cx="25" cy="8"  rx="4"  ry="2.5" fill="#8a5a28" opacity="0.35"/>
            <ellipse cx="40" cy="8"  rx="4"  ry="2"   fill="#5c3d1a" opacity="0.3"/>
            <ellipse cx="32" cy="11" rx="6"  ry="2.5" fill="#4a3010" opacity="0.35"/>
            <ellipse cx="29" cy="4"  rx="5"  ry="2"   fill="#9a6a30" opacity="0.3"/>
            {/* Bottom keeper zone worn patches */}
            <ellipse cx="32" cy="93" rx="12" ry="5"   fill="#5c3d1a" opacity="0.55"/>
            <ellipse cx="28" cy="95" rx="7"  ry="3.5" fill="#7a4e22" opacity="0.45"/>
            <ellipse cx="37" cy="94" rx="6"  ry="3"   fill="#6b4218" opacity="0.4"/>
            <ellipse cx="32" cy="91" rx="9"  ry="4"   fill="#4a3010" opacity="0.5"/>
            <ellipse cx="25" cy="92" rx="4"  ry="2.5" fill="#8a5a28" opacity="0.35"/>
            <ellipse cx="40" cy="92" rx="4"  ry="2"   fill="#5c3d1a" opacity="0.3"/>
            <ellipse cx="32" cy="89" rx="6"  ry="2.5" fill="#4a3010" opacity="0.35"/>
            <ellipse cx="29" cy="96" rx="5"  ry="2"   fill="#9a6a30" opacity="0.3"/>
            {/* Scattered lighter patches across both zones for realism */}
            <ellipse cx="34" cy="6"  rx="3"  ry="1.5" fill="#a07840" opacity="0.2"/>
            <ellipse cx="30" cy="10" rx="3"  ry="1.5" fill="#a07840" opacity="0.2"/>
            <ellipse cx="34" cy="94" rx="3"  ry="1.5" fill="#a07840" opacity="0.2"/>
            <ellipse cx="30" cy="90" rx="3"  ry="1.5" fill="#a07840" opacity="0.2"/>
            {/* Herrema wildlife — 5 resident mosquitos, individually animated */}
            <defs>
              <clipPath id="moz-clip-1"><rect x="0" y="0" width="340" height="300"/></clipPath>
              <clipPath id="moz-clip-2"><rect x="340" y="0" width="340" height="300"/></clipPath>
              <clipPath id="moz-clip-3"><rect x="680" y="0" width="340" height="300"/></clipPath>
              <clipPath id="moz-clip-4"><rect x="85" y="300" width="340" height="300"/></clipPath>
              <clipPath id="moz-clip-5"><rect x="510" y="300" width="340" height="300"/></clipPath>
            </defs>
            {/* Moz 1 — left midfield, slow hover, large, close up */}
            <g style={{animation:"moz1 3.8s ease-in-out infinite",pointerEvents:"none"}}>
              <image href="/mosquito.png" x="6" y="38" width="6" height="3"
                style={{mixBlendMode:"multiply",opacity:0.9,pointerEvents:"none"}}/>
            </g>
            {/* Moz 2 — right side, medium drift */}
            <g style={{animation:"moz2 4.6s ease-in-out infinite 0.7s",pointerEvents:"none"}}>
              <image href="/mosquito.png" x="46" y="56" width="5" height="2.5"
                style={{mixBlendMode:"multiply",opacity:0.85,pointerEvents:"none"}}/>
            </g>
            {/* Moz 3 — centre circle area, erratic */}
            <g style={{animation:"moz3 2.9s ease-in-out infinite 1.3s",pointerEvents:"none"}}>
              <image href="/mosquito.png" x="26" y="46" width="4.5" height="2.2"
                style={{mixBlendMode:"multiply",opacity:0.8,pointerEvents:"none"}}/>
            </g>
            {/* Moz 4 — top right corner, small/distant, fast */}
            <g style={{animation:"moz4 2.4s ease-in-out infinite 0.3s",pointerEvents:"none"}}>
              <image href="/mosquito.png" x="52" y="18" width="3.5" height="1.8"
                style={{mixBlendMode:"multiply",opacity:0.75,pointerEvents:"none"}}/>
            </g>
            {/* Moz 5 — bottom near goal mud, tight circles */}
            <g style={{animation:"moz5 5.2s ease-in-out infinite 2.1s",pointerEvents:"none"}}>
              <image href="/mosquito.png" x="30" y="84" width="4" height="2"
                style={{mixBlendMode:"multiply",opacity:0.88,pointerEvents:"none"}}/>
            </g>
          </g>
        )}

        <g stroke={sf.line} fill="none" strokeWidth="0.28" opacity="0.9">
          <rect x="3" y="3" width="59" height="94"/>
          <line x1="3" y1="50" x2="62" y2="50"/>
          <circle cx="32" cy="50" r="6"/>
          <circle cx="32" cy="50" r="0.6" fill={sf.line} stroke="none"/>
          <rect x="14" y="3" width="37" height="16"/>
          <rect x="22" y="3" width="21" height="7"/>
          <rect x="26" y="1" width="13" height="2.5" strokeWidth="0.28" opacity="0.6"/>
          <circle cx="32" cy="13" r="0.6" fill={sf.line} stroke="none"/>
          <rect x="14" y="81" width="37" height="16"/>
          <rect x="22" y="90" width="21" height="7"/>
          <rect x="26" y="96.5" width="13" height="2.5" strokeWidth="0.28" opacity="0.6"/>
          <circle cx="32" cy="87" r="0.6" fill={sf.line} stroke="none"/>
        </g>

        {lines.map(function(ln,i){return(
          <path key={i} d={pts2d(ln.pts)} stroke={TC[ln.tool]} strokeWidth={ln.tool==="shot"?"0.65":"0.52"} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.92" strokeDasharray={ln.tool==="run"?"1.7,0.85":"none"}/>
        );})}
        {curLine && <path d={pts2d(curLine.pts)} stroke={TC[curLine.tool]} strokeWidth="0.52" fill="none" strokeLinecap="round" opacity="0.55" strokeDasharray={curLine.tool==="run"?"1.7,0.85":"none"}/>}
        {ballPos && (
          <g transform={"translate("+ballPos.x+","+ballPos.y+")"}
             style={{transition:"transform 0.7s ease",pointerEvents:"none"}}>
            <text textAnchor="middle" dominantBaseline="middle" fontSize="4" style={{userSelect:"none"}}>&#x26BD;</text>
          </g>
        )}

        {showOpp && oppList.map(function(p){return(
          <g key={"o"+p.id} transform={"translate("+p.x+","+p.y+")"} style={{pointerEvents:"none"}}>
            <circle r="2.9" fill={oppColor} opacity="0.1"/>
            <circle r="2.9" fill="none" stroke={oppColor} strokeWidth="0.5" opacity="0.7"/>
            <line x1="-1.6" y1="-1.6" x2="1.6" y2="1.6" stroke={oppColor} strokeWidth="0.85" strokeLinecap="round"/>
            <line x1="1.6" y1="-1.6" x2="-1.6" y2="1.6" stroke={oppColor} strokeWidth="0.85" strokeLinecap="round"/>
          </g>
        );})}

        {players.map(function(p){
          var fill=tFill(p.n), txt=tTxt(p.n);
          var hasName=p.name&&p.name.trim().length>0;
          return (
            <g key={p.id} id={"tkn-"+p.id}
              transform={"translate("+p.x+","+p.y+")"}
              onMouseDown={function(e){pMD(e,p.id);}}
              style={{cursor:tool==="drag"?"grab":tool?"crosshair":"default"}}>
              <circle r="3.1" fill="rgba(0,0,0,0.4)" cx="0.22" cy="0.58" filter="url(#tsh)"/>
              <circle r="3.1" fill={fill} strokeWidth="0.3" stroke="rgba(255,255,255,0.3)"/>
              <text y="0.6" textAnchor="middle" fontSize="1.6" fontWeight="700" fill={txt}
                style={{userSelect:"none",pointerEvents:"none",fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.04em"}}>
                {p.n.slice(0,4)}
              </text>
              <text y="5.5" textAnchor="middle" fontSize="1.8"
                fill={hasName?"rgba(255,255,255,0.93)":"rgba(255,255,255,0.38)"}
                onClick={function(e){
                  e.stopPropagation();
                  if (!user) { notify("Sign in to name your players"); return; }
                  var svg = svgRef.current; if (!svg) return;
                  var rect = svg.getBoundingClientRect();
                  setInlineName({id:p.id, name:p.name||"", screenX:rect.left+p.x*(rect.width/65), screenY:rect.top+p.y*(rect.height/100)});
                }}
                style={{userSelect:"none",pointerEvents:"all",cursor:user?"text":"default",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:"0.04em"}}>
                {hasName?p.name.slice(0,12):"STARTER"}
              </text>

            </g>
          );
        })}
      </svg>
    );
  }

  function LeftPanel() {
    return (
      <div style={{padding:"12px 13px",display:"flex",flexDirection:"column",height:"100%",overflowY:"auto"}}>

        <div style={{marginBottom:12}}><SL c="Format"/><DD value={gameFmt} options={fmtOpts} onChange={changeFmt}/></div>
        <div style={{marginBottom:12}}><SL c="Formation"/><DD value={formation} options={formOpts} onChange={function(f){loadTeam(f);}}/></div>
        <div><SL c="Surface"/><DD value={surface} options={surfOpts} onChange={setSurface}/></div>
        <HR/>
        <div><SL c="Kit Colour"/><KitPicker value={paletteId} onChange={setPaletteId}/></div>
        <HR/>
        <div style={{flex:1}}>
          <SL c={"Lineup - "+players.length}/>
          {players.map(function(p){
            var col=tFill(p.n);
            return (
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:9,fontWeight:900,color:txtOnFill(col),fontFamily:"'Rajdhani',sans-serif",lineHeight:1}}>{p.n.slice(0,3)}</span>
                </div>
                <input
                  value={p.name||""}
                  placeholder={p.n}
                  maxLength={14}
                  onChange={function(e){
                    var v=e.target.value;
                    setPlayers(function(prev){return prev.map(function(x){return x.id===p.id?Object.assign({},x,{name:v}):x;});});
                  }}
                  style={{
                    flex:1,background:"transparent",border:"none",
                    borderBottom:"1px solid rgba(255,255,255,0.08)",
                    color:T.text,fontSize:12,fontWeight:600,
                    fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.04em",
                    padding:"2px 0",outline:"none",
                    textTransform:"uppercase",
                  }}
                />
              </div>
            );
          })}
          <p style={{marginTop:8,fontSize:9,color:T.faint,fontFamily:"'Poppins',sans-serif"}}>Tap a name to edit. Double-click token for position.</p>
        </div>
        <HR/>
        {SubPlanner()}
      </div>
    );
  }

  function SubPlanner() {
    var posOpts = players.map(function(p){
      return {value:p.id, label:(p.name||p.n)+" ("+p.n+")", pos:p.n};
    });

    function addSub() {
      if(subs.length>=12) return;
      // Default to first unplanned player
      var usedIds = subs.map(function(s){return s.playerId;});
      var firstFree = players.find(function(p){return usedIds.indexOf(p.id)===-1;});
      setSubs(function(prev){
        return prev.concat([{
          id: Date.now(),
          playerId: firstFree ? firstFree.id : players[0].id,
          subName: "",
          minute: "",
        }]);
      });
    }

    function removeSub(sid){
      setSubs(function(prev){return prev.filter(function(s){return s.id!==sid;});});
    }

    function updateSub(sid, field, val){
      setSubs(function(prev){
        return prev.map(function(s){
          return s.id===sid ? Object.assign({},s,{[field]:val}) : s;
        });
      });
    }

    return (
      <div style={{marginTop:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <SL c={"Sub Planner"+(subs.length>0?" ("+subs.length+"/12)":"")}/>
          {subs.length<12&&(
            <button onClick={addSub} className="btn btn-volt-outline btn-sm">+ Add</button>
          )}
        </div>

        {subs.length===0&&(
          <div style={{fontSize:11,color:T.faint,fontFamily:"'Poppins',sans-serif",padding:"6px 0"}}>
            No substitutions planned.
          </div>
        )}

        {subs.map(function(s, idx){
          var pl = players.find(function(p){return p.id===s.playerId;});
          return (
            <div key={s.id} style={{
              display:"flex",flexDirection:"column",gap:5,
              padding:"8px 10px",marginBottom:6,borderRadius:6,
              background:T.raised,border:"1px solid "+T.b,
              position:"relative",
            }}>
              {/* Row header: number + remove */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:9,fontWeight:700,color:T.ghost,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.16em",textTransform:"uppercase"}}>Sub {idx+1}</span>
                <button onClick={function(){removeSub(s.id);}} style={{
                  background:"none",border:"none",cursor:"pointer",
                  color:T.ghost,fontSize:14,lineHeight:1,padding:"0 2px",
                  fontFamily:"monospace",
                }}>x</button>
              </div>

              {/* Player OUT picker */}
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:9,fontWeight:700,color:T.ghost,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase",width:22,flexShrink:0}}>OUT</span>
                <select value={s.playerId}
                  onChange={function(e){updateSub(s.id,"playerId",parseInt(e.target.value,10));}}
                  style={{flex:1,background:T.surface,border:"1px solid "+T.b,borderRadius:4,color:T.text,padding:"5px 8px",fontFamily:"'Rajdhani',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer",outline:"none"}}>
                  {posOpts.map(function(o){
                    return <option key={o.value} value={o.value}>{o.label}</option>;
                  })}
                </select>
              </div>

              {/* Sub IN + minute */}
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:9,fontWeight:700,color:"rgba(200,255,0,0.6)",fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase",width:22,flexShrink:0}}>IN</span>
                <input
                  value={s.subName}
                  onChange={function(e){updateSub(s.id,"subName",e.target.value);}}
                  placeholder="Sub player name"
                  maxLength={16}
                  style={{flex:1,background:T.surface,border:"1px solid "+T.b,borderRadius:4,color:"rgba(200,255,0,0.9)",padding:"5px 8px",fontFamily:"'Rajdhani',sans-serif",fontSize:12,fontWeight:600,outline:"none"}}
                />
                <input
                  value={s.minute}
                  onChange={function(e){updateSub(s.id,"minute",e.target.value.replace(/[^0-9+]/g,"").slice(0,4));}}
                  placeholder="Min"
                  style={{width:44,background:T.surface,border:"1px solid "+T.b,borderRadius:4,color:T.sub,padding:"5px 6px",fontFamily:"'Rajdhani',sans-serif",fontSize:12,fontWeight:600,outline:"none",textAlign:"center"}}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function RightPanel() {
    return (
      <div style={{padding:"12px 13px",display:"flex",flexDirection:"column",height:"100%",overflowY:"auto"}}>
        <div style={{marginBottom:6}}>
          <SL c="Active Tool"/>
          <div style={{padding:"10px 12px",borderRadius:6,
            background:tool?"rgba(200,255,0,0.06)":T.raised,
            border:"1px solid "+(tool?T.volt:T.b),
            boxShadow:tool?"0 0 12px rgba(200,255,0,0.18)":"none",
            marginBottom:10,transition:"all 0.2s"}}>
            <span style={{fontSize:13,fontWeight:700,color:tool?T.volt:T.ghost,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>{
              tool==="drag"?"Move Player":
              tool==="ball"?"Drop Ball":
              tool==="pass"?"Draw Pass":
              tool==="run"?"Draw Run":
              tool==="shot"?"Draw Shot":"No Tool Selected"
            }</span>
          </div>
        </div>
        <HR/>
        <SL c="Playmaker"/>
        {ToolRow()}
        <HR/>
        <div style={{marginBottom:0}}>
          <SL c="Drawing Key"/>
          {[["pass","#F5BE00","Pass"],["run","#22CC44","Run"],["shot","#F02040","Shot"]].map(function(item){return(
            <div key={item[0]} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
              <svg width="20" height="9" style={{flexShrink:0}}>
                <line x1="0" y1="4.5" x2="14" y2="4.5" stroke={item[1]} strokeWidth={item[0]==="shot"?"2.2":"1.7"} strokeDasharray={item[0]==="run"?"4,2":"none"} strokeLinecap="round"/>
                
              </svg>
              <span style={{fontSize:12,color:T.sub,fontFamily:"'Poppins',sans-serif",fontWeight:400}}>{item[2]}</span>
            </div>
          );})}
        </div>
        <HR/>
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showOpp?12:0}}>
            <SL c="Opposition"/>
            <Toggle on={showOpp} toggle={function(){setShowOpp(function(v){return !v;});}} ac="#F02040"/>
          </div>
          {showOpp && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {OPP_COLORS.map(function(c){return(<div key={c} onClick={function(){setOppColor(c);}} style={{width:20,height:20,borderRadius:"50%",background:c,cursor:"pointer",outline:oppColor===c?"2px solid rgba(255,255,255,0.75)":"1px solid rgba(255,255,255,0.12)",outlineOffset:oppColor===c?2:0,transition:"outline 0.1s"}}/>);})}
              </div>
              <DD value={oppFmt} options={avF.map(function(v){return {value:v,label:v};})} onChange={function(v){loadOpp(v);}} accent="#F02040"/>
            </div>
          )}
        </div>
        <HR/>
        {/* Phase Builder -- fills right panel space */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
          <SL c="Phase Builder"/>
          <div style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>
            {phases.map(function(ph,i){
              var saved=ph!==null, active=activePhase===i;
              return (
                <button key={i}
                  onClick={function(){saved?loadPhase(i):savePhase(i);}}
                  onDoubleClick={function(e){e.stopPropagation();if(saved)clearPhase(i);}}
                  title={saved?"Load phase "+(i+1)+" (dbl-click to clear)":"Save as phase "+(i+1)}
                  style={{
                    flex:1,width:"100%",padding:"10px 12px",borderRadius:6,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    border:"1px solid "+(active?T.volt:saved?"rgba(200,255,0,0.3)":"rgba(255,255,255,0.08)"),
                    background:active?"rgba(200,255,0,0.12)":saved?"rgba(200,255,0,0.05)":"rgba(255,255,255,0.03)",
                    transition:"all 0.13s",fontFamily:"'Rajdhani',sans-serif",
                    boxShadow:active?"0 0 10px rgba(200,255,0,0.2)":"none",
                    minHeight:38,
                  }}>
                  <span style={{fontSize:13,fontWeight:700,letterSpacing:"0.08em",color:active?T.volt:saved?"rgba(200,255,0,0.7)":"rgba(255,255,255,0.3)"}}>PHASE {i+1}</span>
                  <span style={{fontSize:10,color:active?T.volt:saved?"rgba(200,255,0,0.5)":"rgba(255,255,255,0.2)",fontFamily:"'Poppins',sans-serif"}}>
                    {active?"ACTIVE":saved?"SAVED":"EMPTY"}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{display:"flex",gap:6,marginTop:4}}>
            {playing?(
              <button onClick={stopPlay} className="btn btn-danger btn-sm" style={{flex:1}}>&#9632; Stop</button>
            ):(
              <button onClick={playPhases} className="btn btn-volt-outline btn-sm" style={{flex:1}}>&#9654; Play</button>
            )}
            <button onClick={function(){
              if(!user){setShowAuth(true);return;}
              var playTitle=title||"My Play";
              var state={title:playTitle,gameFmt,formation,surface,paletteId,players,lines,subs,phases,ballPos,showOpp,oppFmt,oppList,oppColor,type:"play"};
              saveFormation(state).then(function(){notify("Play saved to profile!");return loadFormations().then(setSavedFormations);}).catch(function(e){notify("Error: "+e.message);});
            }} className="btn btn-secondary btn-sm" style={{flex:1}}>Save to Profile</button>
          </div>
        </div>
        <HR/>
        {/* Load Squad / Load Play */}
        <div>
          <SL c="Load"/>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <button className="btn btn-secondary btn-sm" style={{width:"100%",gap:6,justifyContent:"flex-start"}}
              onClick={function(){if(user){setTab("profile");}else{setShowAuth(true);}}}>
              <span>&#x1F465;</span> Load Squad
            </button>
            <button className="btn btn-secondary btn-sm" style={{width:"100%",gap:6,justifyContent:"flex-start"}}
              onClick={function(){if(user){setTab("profile");}else{setShowAuth(true);}}}>
              <span>&#x2606;</span> Load Play
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'Rajdhani',sans-serif",background:T.bg,color:T.text,height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>

      <header style={{background:T.nav,borderBottom:"1px solid "+T.b,display:"flex",alignItems:"center",padding:"0 16px",height:50,flexShrink:0,zIndex:50}}>

        {/* Logo */}
        <div onClick={function(){setTab("pitch");}} style={{display:"flex",alignItems:"center",gap:7,flexShrink:0,cursor:"pointer",marginRight:20}}>
          <span style={{fontSize:20,lineHeight:1}}>&#x26BD;</span>
          <span style={{fontWeight:700,fontSize:16,letterSpacing:"0.08em",lineHeight:1,fontFamily:"'Rajdhani',sans-serif"}}>
            <span style={{color:T.volt}}>FC</span>
            <span style={{color:T.text}}>ROSTER</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{display:"flex",flex:1,alignItems:"center"}}>
          <button onClick={function(){setTab("pitch");}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:"0.16em",textTransform:"uppercase",padding:"0 14px",height:50,flexShrink:0,color:tab==="pitch"?T.text:T.ghost,borderBottom:"2px solid "+(tab==="pitch"?T.volt:"transparent"),transition:"color .13s,border-color .13s"}}>Pitch</button>
          <button onClick={function(){user ? setTab("profile") : setShowAuth(true);}}
            style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:"0.16em",textTransform:"uppercase",padding:"0 14px",height:50,flexShrink:0,transition:"color .13s,border-color .13s",
              color: user ? (tab==="profile"?T.text:T.ghost) : T.volt,
              borderBottom:"2px solid "+(tab==="profile"&&user ? T.volt : "transparent"),
            }}>
            {user ? "Profile" : "Sign In"}
          </button>
        </nav>

        {/* Right anchor -- avatar dropdown when signed in */}
        {user&&(
          <div ref={moreRef} style={{position:"relative",flexShrink:0}}>
            <button onClick={function(){setMoreOpen(function(v){return !v;});}}
              style={{width:32,height:32,borderRadius:"50%",background:T.voltBg,border:"1px solid "+T.voltBd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,color:T.volt,transition:"all 0.13s"}}
              onMouseEnter={function(e){e.currentTarget.style.background="rgba(200,255,0,0.18)";}}
              onMouseLeave={function(e){e.currentTarget.style.background=T.voltBg;}}>
              {user.name[0].toUpperCase()}
            </button>
            {moreOpen&&(
              <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:300,background:"#1e1e1e",border:"1px solid "+T.bhi,borderRadius:8,overflow:"hidden",boxShadow:"0 12px 32px rgba(0,0,0,0.8)",minWidth:160}}>
                <div style={{padding:"12px 14px 8px",borderBottom:"1px solid "+T.b}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.text,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.06em"}}>{user.name}</div>
                  <div style={{fontSize:10,color:T.ghost,fontFamily:"'Poppins',sans-serif",marginTop:2}}>{user.email}</div>
                </div>
                {[["pitch","Pitch"],["profile","Profile"],["playbook","Playbook"],["about","About"]].map(function(item){return(
                  <button key={item[0]} onClick={function(){setTab(item[0]);setMoreOpen(false);}}
                    style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",cursor:"pointer",padding:"10px 14px",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:tab===item[0]?T.volt:T.sub,transition:"color .13s"}}
                    onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
                    onMouseLeave={function(e){e.currentTarget.style.background="none";}}>
                    {item[1]}
                  </button>
                );})}
                <div style={{borderTop:"1px solid "+T.b,padding:"6px 8px"}}>
                  <button onClick={function(){signOut().then(function(){setMoreOpen(false);notify("Signed out.");}).catch(function(e){notify(e.message);});}} className="btn btn-danger btn-sm" style={{width:"100%"}}>Sign Out</button>
                </div>
              </div>
            )}
          </div>
        )}

      </header>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>

        {tab==="pitch"&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
            <div className="ps">
              <div className="lp">{LeftPanel()}</div>
              <div className="pc">
                {PhaseStrip()}
                {/* Squad name bar -- desktop only, above pitch */}
                <div className="d-hdr" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"6px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"#131313",flexShrink:0,gap:10}}>
                  {editTitle ? (
                    <input
                      value={title}
                      onChange={function(e){setTitle(e.target.value);}}
                      onBlur={function(){setEditTitle(false);}}
                      onKeyDown={function(e){if(e.key==="Enter")setEditTitle(false);}}
                      autoFocus
                      placeholder="Enter squad name..."
                      maxLength={32}
                      style={{fontSize:15,fontWeight:700,background:"transparent",border:"none",borderBottom:"1px solid "+T.volt,borderRadius:0,color:T.text,padding:"2px 6px",fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",outline:"none",textAlign:"center",minWidth:220}}
                    />
                  ) : (
                    <button onClick={function(e){e.stopPropagation();setEditTitle(true);}}
                      style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"5px 14px",borderRadius:5,border:"1px solid rgba(200,255,0,0.3)",background:"rgba(200,255,0,0.05)",transition:"all 0.15s",outline:"none",pointerEvents:"all"}}>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",color:"rgba(200,255,0,0.55)",flexShrink:0}}>SQUAD NAME</span>
                      <span style={{fontSize:14,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",color:title==="My FCRoster"?"rgba(255,255,255,0.25)":T.text,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {title==="My FCRoster"?"Click to name your squad":title}
                      </span>
                      <span style={{fontSize:12,color:"rgba(200,255,0,0.4)",flexShrink:0}}>&#x270E;</span>
                    </button>
                  )}
                </div>
                <div className="pw">{PitchSVG()}</div>
                <div className="d-bar">{ActionBar({compact:false})}</div>
              </div>
              <div className="rp">{RightPanel()}</div>
            </div>

            <div className="mob-ctrl">
              {/* 3-state handle: pitch → half → panel */}
              <div
                style={{position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  gap:3,minHeight:44,cursor:"pointer",flexShrink:0,
                  borderBottom:mobMenu!=="pitch"?"1px solid rgba(255,255,255,0.06)":"none",
                  background:"#131313",userSelect:"none",WebkitTapHighlightColor:"transparent"}}
                onClick={function(){
                  var next = mobMenu==="pitch"?"half":mobMenu==="half"?"panel":"pitch";
                  setPanel(next);
                  setShowHint(false);
                }}>
                {/* Drag handle bar */}
                <div style={{width:40,height:4,borderRadius:8,background:"rgba(255,255,255,0.22)"}}/>
                {/* State indicator row */}
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {mobMenu==="pitch"&&(
                    <span style={{fontSize:9,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.1em",
                      color:"rgba(255,255,255,0.35)"}}>
                      {gameFmt} · {formation} &nbsp;&#x2303;&#x2303;
                    </span>
                  )}
                  {mobMenu==="half"&&(
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:"0.06em",fontFamily:"'Rajdhani',sans-serif"}}>
                      &#x2013;&#x2013; EDITING &#x2013;&#x2013;
                    </span>
                  )}
                  {mobMenu==="panel"&&(
                    <span style={{fontSize:9,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.1em",
                      color:"rgba(255,255,255,0.35)"}}>
                      &#x2302;&#x2302; PITCH
                    </span>
                  )}
                </div>
                {/* First-load hint */}
                {showHint&&mobMenu==="pitch"&&(
                  <div style={{position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",
                    background:"rgba(0,0,0,0.75)",border:"1px solid rgba(200,255,0,0.25)",
                    borderRadius:20,padding:"4px 12px",whiteSpace:"nowrap",pointerEvents:"none",
                    animation:"fadeUp 0.3s ease"}}>
                    <span style={{fontSize:10,color:"rgba(200,255,0,0.8)",fontFamily:"'Poppins',sans-serif"}}>
                      &#x2191; swipe up to edit lineup
                    </span>
                  </div>
                )}
              </div>
              {mobMenu!=="pitch"&&(
                <div style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
                  {MobPhaseBar()}
                  <div className="mob-tabs">
                    {[["lineup","Lineup"],["tools","Tools"],["colors","Colors"]].map(function(item){return(
                      <button key={item[0]} onClick={function(){setSheetTab(item[0]);}} className={"mob-tab-btn"+(sheetTab===item[0]?" active":"")}>{item[1]}</button>
                    );})}
                  </div>
                  <div className="mob-panel" style={{maxHeight:mobMenu==="panel"?"52dvh":"32dvh"}}>

                {sheetTab==="lineup"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:6,padding:"10px 14px 12px",width:"100%"}}>
                    <SL c="Player Names"/>
                    {players.map(function(p){
                      var col=tFill(p.n);
                      return (
                        <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                          <div style={{width:24,height:24,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <span style={{fontSize:9,fontWeight:900,color:txtOnFill(col),fontFamily:"'Rajdhani',sans-serif"}}>{p.n.slice(0,3)}</span>
                          </div>
                          <input
                            value={p.name||""}
                            placeholder={p.n}
                            maxLength={14}
                            onChange={function(e){
                              var v=e.target.value;
                              setPlayers(function(prev){return prev.map(function(x){return x.id===p.id?Object.assign({},x,{name:v}):x;});});
                            }}
                            style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:5,color:T.text,fontSize:13,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.04em",padding:"6px 8px",outline:"none",textTransform:"uppercase"}}
                          />
                        </div>
                      );
                    })}
                    <HR/>
                    {SubPlanner()}
                  </div>
                )}

                {sheetTab==="tools"&&(
                  <div style={{display:"flex",flexDirection:"column",alignItems:"stretch",gap:10,padding:"10px 14px 12px",width:"100%"}}>
                    {ToolRow()}
                  </div>
                )}

                {sheetTab==="colors"&&(
                  <div style={{display:"flex",flexDirection:"column",gap:10,padding:"10px 14px 12px",width:"100%"}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:10,fontWeight:700,color:T.ghost,letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",flexShrink:0,width:70}}>Surface</span>
                      <div style={{flex:1}}><DD value={surface} options={surfOpts} onChange={setSurface} bg="#1A1A1A" up={true}/></div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:10,fontWeight:700,color:T.ghost,letterSpacing:"0.16em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",flexShrink:0,width:70}}>Kit</span>
                      <div style={{flex:1}}><KitPicker value={paletteId} onChange={setPaletteId} bg="#1A1A1A" up={true}/></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:2}}>
                      <span style={{fontSize:12,fontWeight:600,color:T.sub,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>Opposition</span>
                      <Toggle on={showOpp} toggle={function(){setShowOpp(function(v){return !v;});}} ac="#F02040"/>
                    </div>
                    {showOpp&&(
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <div style={{display:"flex",justifyContent:"flex-start",gap:7,flexWrap:"wrap"}}>
                          {OPP_COLORS.map(function(c){return(<div key={c} onClick={function(){setOppColor(c);}} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",outline:oppColor===c?"2px solid rgba(255,255,255,0.8)":"1px solid rgba(255,255,255,0.12)",outlineOffset:oppColor===c?2:0,transition:"outline 0.1s"}}/>);})}
                        </div>
                        <DD value={oppFmt} options={avF.map(function(v){return {value:v,label:v};})} onChange={function(v){loadOpp(v);}} accent="#F02040" bg="#1A1A1A" up={true}/>
                      </div>
                    )}
                  </div>
                )}

              </div>
              <div style={{padding:"8px 12px",borderTop:"1px solid rgba(255,255,255,0.08)",background:"#131313",flexShrink:0}}>
                {ActionBar({compact:true})}
              </div>
              </div>
              )}
            </div>
          </div>
        )}

        {tab==="profile"&&(
          <div style={{flex:1,overflow:"auto",padding:"36px 24px"}} className="fu">
            <div style={{maxWidth:440,margin:"0 auto",display:"flex",flexDirection:"column",gap:16,alignItems:"center",minHeight:"60vh",justifyContent:"center",textAlign:"center"}}>
              {!user ? (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
                  <div style={{fontSize:48,opacity:0.16}}>&#x1F464;</div>
                  <h2 style={{fontWeight:700,fontSize:24,letterSpacing:"0.06em"}}>Your Profile</h2>
                  <p style={{color:T.sub,maxWidth:260,lineHeight:1.75,fontSize:14,fontFamily:"'Poppins',sans-serif"}}>Sign in to save formations and build your player card.</p>
                  <button onClick={function(){setShowAuth(true);}} className="btn btn-primary btn-md" style={{marginTop:8}}>Sign In</button>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:14,width:"100%",textAlign:"left"}}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:48,height:48,borderRadius:"50%",border:"1px solid "+T.voltBd,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,fontWeight:700,color:T.volt,flexShrink:0,background:T.voltBg}}>{user.name[0].toUpperCase()}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:19}}>{user.name}</div>
                      <div style={{color:T.ghost,fontSize:12,marginTop:2,fontFamily:"'Poppins',sans-serif"}}>{user.email}</div>
                    </div>
                  </div>

                  {/* Squad Roster */}
                  <div style={{border:"1px solid "+T.b,borderRadius:6,overflow:"hidden"}}>
                    <div style={{padding:"10px 14px",borderBottom:"1px solid "+T.b,background:T.raised}}>
                      <div style={{fontWeight:700,fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",color:T.volt}}>{title}</div>
                      <div style={{fontSize:10,color:T.ghost,fontFamily:"'Poppins',sans-serif",marginTop:2}}>{gameFmt} &bull; {formation} &bull; {players.length} players</div>
                    </div>
                    {players.map(function(p){
                      var avail=p.availability||"available";
                      var availColor=avail==="available"?"#22CC44":avail==="doubtful"?"#F5BE00":"#F02040";
                      var footLabel={L:"Left",R:"Right",B:"Both"}[p.foot||"R"];
                      var skillLabel=["","Grassroots","Amateur","Semi-Pro","Club Pro","Elite"][p.skill||3];
                      return (
                        <div key={p.id} style={{padding:"10px 14px",borderBottom:"1px solid "+T.b,cursor:"pointer",transition:"background 0.1s"}}
                          onClick={function(){setEditP(Object.assign({},p));}}
                          onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.03)";}}
                          onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            {/* Availability dot */}
                            <div style={{width:8,height:8,borderRadius:"50%",background:availColor,flexShrink:0,boxShadow:"0 0 6px "+availColor+"88"}}/>
                            {/* Token */}
                            <div style={{width:28,height:28,borderRadius:"50%",background:tFill(p.n),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <span style={{fontSize:8,fontWeight:900,color:tTxt(p.n),fontFamily:"'Rajdhani',sans-serif"}}>{p.number||p.n.slice(0,4)}</span>
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <span style={{fontSize:13,fontWeight:700,color:T.text,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.04em"}}>{p.name||p.n}</span>
                                <span style={{fontSize:9,color:T.ghost,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>{p.n}</span>
                              </div>
                              <div style={{display:"flex",gap:8,marginTop:2,flexWrap:"wrap"}}>
                                {p.age&&<span style={{fontSize:9,color:T.faint,fontFamily:"'Poppins',sans-serif"}}>Age {p.age}</span>}
                                <span style={{fontSize:9,color:T.faint,fontFamily:"'Poppins',sans-serif"}}>{footLabel} foot</span>
                                <span style={{fontSize:9,color:T.faint,fontFamily:"'Poppins',sans-serif"}}>{skillLabel}</span>
                              </div>
                              {p.notes&&<div style={{fontSize:9,color:T.ghost,fontFamily:"'Poppins',sans-serif",marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:240}}>{p.notes}</div>}
                            </div>
                            <span style={{fontSize:11,opacity:0.25,flexShrink:0}}>&#x270E;</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Substitution Planner in Profile */}
                  {subs.length>0&&(
                    <div style={{border:"1px solid "+T.b,borderRadius:6,overflow:"hidden"}}>
                      <div style={{padding:"8px 14px",borderBottom:"1px solid "+T.b,background:T.raised}}>
                        <div style={{fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",color:T.ghost}}>Substitutions ({subs.length})</div>
                      </div>
                      {subs.map(function(s,i){
                        var outP=players.find(function(p){return p.id===s.playerId;});
                        return(
                          <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:"1px solid "+T.b}}>
                            <span style={{fontSize:10,color:T.ghost,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,flexShrink:0,width:20}}>#{i+1}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{outP?outP.name||outP.n:"?"} <span style={{color:T.ghost,fontWeight:400}}>&#x2192; {s.subName||"Sub"}</span></div>
                              {s.minute&&<div style={{fontSize:9,color:T.ghost,fontFamily:"'Poppins',sans-serif",marginTop:1}}>Min {s.minute}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Save buttons */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <button className="btn btn-primary btn-md" style={{gap:5}}
                      onClick={function(){
                        var state={title,gameFmt,formation,surface,paletteId,players,lines,subs,phases,ballPos,showOpp,oppFmt,oppList,oppColor,type:"roster"};
                        var fn = savedId ? updateFormation(savedId, state) : saveFormation(state);
                        fn.then(function(row){
                          setSavedId(row.id);
                          notify(savedId ? "Roster updated!" : "Roster saved!");
                          return loadFormations().then(setSavedFormations);
                        }).catch(function(e){notify("Error: "+e.message);});
                      }}>
                      <span>&#x2193;</span> {savedId?"Update":"Save Roster"}
                    </button>
                    <button className="btn btn-volt-outline btn-md" style={{gap:5}}
                      onClick={function(){
                        var playTitle=title+" (Play)";
                        var state={title:playTitle,gameFmt,formation,surface,paletteId,players,lines,subs,phases,ballPos,showOpp,oppFmt,oppList,oppColor,type:"play"};
                        saveFormation(state).then(function(){
                          notify("Play saved!");
                          return loadFormations().then(setSavedFormations);
                        }).catch(function(e){notify("Error: "+e.message);});
                      }}>
                      <span>&#x2606;</span> Save Play
                    </button>
                  </div>

                  {/* Saved list -- Rosters + Plays */}
                  {(function(){
                    var rosters=savedFormations.filter(function(f){return !f.type||f.type==="roster";});
                    var plays=savedFormations.filter(function(f){return f.type==="play";});
                    function SavedList(items, label) {
                      return (
                        <div style={{border:"1px solid "+T.b,borderRadius:6,overflow:"hidden"}}>
                          <div style={{padding:"8px 14px",borderBottom:"1px solid "+T.b,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.raised}}>
                            <SL c={label+(items.length>0?" ("+items.length+")":"")}/>
                            <button className="btn btn-secondary btn-sm" onClick={function(){loadFormations().then(setSavedFormations).catch(function(e){notify(e.message);});}}>&#x21BA;</button>
                          </div>
                          {items.length===0?(
                            <div style={{padding:"12px 14px"}}><p style={{color:T.ghost,fontSize:12,fontFamily:"'Poppins',sans-serif"}}>Nothing saved yet.</p></div>
                          ):(
                            <div style={{maxHeight:220,overflowY:"auto"}}>
                              {items.map(function(f){return(
                                <div key={f.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderBottom:"1px solid "+T.b}}>
                                  <div style={{flex:1,minWidth:0}}>
                                    <div style={{fontSize:12,fontWeight:700,color:T.text,fontFamily:"'Rajdhani',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.title}</div>
                                    <div style={{fontSize:9,color:T.ghost,fontFamily:"'Poppins',sans-serif",marginTop:1}}>{f.game_fmt} &bull; {f.formation}</div>
                                  </div>
                                  <button className="btn btn-volt-outline btn-sm" onClick={function(){
                                    setTitle(f.title); setGameFmt(f.game_fmt); setFormation(f.formation);
                                    setSurface(f.surface); setPaletteId(f.palette_id);
                                    setPlayers(f.players); setLines(f.lines||[]); setSubs(f.subs||[]);
                                    setPhases(f.phases||[null,null,null,null,null]); setBallPos(f.ball_pos||null);
                                    setShowOpp(f.show_opp||false); setOppFmt(f.opp_fmt||"4-4-2");
                                    setOppList(f.opp_list||[]); setOppColor(f.opp_color||"#EE2244");
                                    setSavedId(f.id); setTab("pitch");
                                    notify("Loaded: "+f.title);
                                  }}>Load</button>
                                  <button className="btn btn-danger btn-sm" onClick={function(){
                                    deleteFormation(f.id).then(function(){
                                      setSavedFormations(function(prev){return prev.filter(function(x){return x.id!==f.id;});});
                                      if(savedId===f.id) setSavedId(null);
                                      notify("Deleted.");
                                    }).catch(function(e){notify(e.message);});
                                  }}>&#x2715;</button>
                                </div>
                              );})}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {SavedList(rosters,"Saved Rosters")}
                        {SavedList(plays,"Saved Plays")}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {tab==="playbook"&&(
          <div style={{flex:1,overflow:"auto",padding:"36px 24px"}} className="fu">
            <div style={{maxWidth:780,margin:"0 auto"}}>
              <h1 style={{fontWeight:700,fontSize:26,letterSpacing:"0.06em",marginBottom:6}}>PLAYBOOK</h1>
              <p style={{color:T.ghost,fontSize:13,fontFamily:"'Poppins',sans-serif",marginBottom:24}}>Tactics, formations, and coaching insights.</p>
              <div style={{border:"1px solid "+T.voltBd,borderLeft:"2px solid "+T.volt,borderRadius:6,padding:22,marginBottom:16,cursor:"pointer",background:T.voltBg}}>
                <div style={{fontSize:9,color:"rgba(200,255,0,0.5)",fontWeight:800,letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:8,fontFamily:"'Rajdhani',sans-serif"}}>{"FEATURED - "+POSTS[0].cat.toUpperCase()}</div>
                <h2 style={{fontWeight:700,fontSize:17,marginBottom:7}}>{POSTS[0].title}</h2>
                <p style={{color:T.sub,lineHeight:1.7,fontSize:13,fontFamily:"'Poppins',sans-serif",marginBottom:12}}>{POSTS[0].body}</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10}}>
                {POSTS.slice(1).map(function(p){return(
                  <div key={p.id} style={{border:"1px solid "+T.b,borderRadius:6,padding:15,cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=T.bhi;e.currentTarget.style.background="rgba(255,255,255,0.02)";}} onMouseLeave={function(e){e.currentTarget.style.borderColor=T.b;e.currentTarget.style.background="transparent";}}>
                    <div style={{fontSize:8,color:"rgba(200,255,0,0.38)",fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>{p.cat}</div>
                    <h3 style={{fontWeight:700,fontSize:13,marginBottom:5,lineHeight:1.3}}>{p.title}</h3>
                    <p style={{color:T.ghost,fontSize:11,lineHeight:1.6,fontFamily:"'Poppins',sans-serif"}}>{p.body}</p>
                  </div>
                );})}
              </div>
            </div>
          </div>
        )}

        {tab==="about"&&(
          <div style={{flex:1,overflow:"auto",padding:"40px 24px 60px"}} className="fu">
            <div style={{maxWidth:640,margin:"0 auto",display:"flex",flexDirection:"column",gap:32}}>

              {/* Hero */}
              <div style={{textAlign:"center",padding:"10px 0 4px"}}>
                <div style={{fontSize:44,marginBottom:12}}>&#x26BD;</div>
                <h1 style={{fontWeight:700,fontSize:28,letterSpacing:"0.08em",marginBottom:10,fontFamily:"'Rajdhani',sans-serif"}}>
                  <span style={{color:T.volt}}>FC</span>ROSTER
                </h1>
                <p style={{color:T.ghost,fontSize:13,fontFamily:"'Poppins',sans-serif",letterSpacing:"0.06em",textTransform:"uppercase"}}>
                  For coaches at heart. Players who care. The beautiful game.
                </p>
              </div>

              {/* Story */}
              <div style={{borderLeft:"2px solid "+T.volt,paddingLeft:20}}>
                <h2 style={{fontWeight:700,fontSize:16,letterSpacing:"0.08em",marginBottom:12,fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase"}}>Our Story</h2>
                <div style={{display:"flex",flexDirection:"column",gap:12,fontFamily:"'Poppins',sans-serif",fontSize:14,lineHeight:1.85,color:"rgba(255,255,255,0.75)"}}>
                  <p>I came to football late. No grassroots academy, no Sunday league childhood -- just a genuine love for the game that arrived and refused to leave. The more I watched, the more I wanted to understand it. The shape of a press. The angles of a build-up. The way eleven individuals become something greater than themselves when the structure is right.</p>
                  <p>I built FCRoster because I couldn't find a tool that felt like it was made for people like me -- coaches running youth sides on weekends, players trying to understand their role, fans who want to go deeper than the scoreline. Most tools are either too complex or too shallow. FCRoster tries to sit exactly in between: powerful enough to be useful, simple enough to be picked up in seconds.</p>
                  <p>This is a living tool. Every feature on this platform came from real feedback, real frustration, and real curiosity about what football actually needs. If something doesn't work the way you'd expect, I want to know. If there's a feature missing that would change how you prepare, plan, or share -- tell me. This was built for the community and it will keep growing with it.</p>
                  <p style={{color:T.volt,fontWeight:600}}>Take the app. Use it. Break it. Ask for changes. That's exactly what it's here for.</p>
                </div>
              </div>

              {/* What it does */}
              <div>
                <h2 style={{fontWeight:700,fontSize:16,letterSpacing:"0.08em",marginBottom:14,fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase"}}>What FCRoster Does</h2>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[
                    ["&#x26BD;","Tactical Pitch","Build formations for 11v11, 9v9, 7v7, and 5v5 on an interactive pitch."],
                    ["&#x270D;","Play Designer","Draw passes, runs, and shots to design set pieces and movement patterns."],
                    ["&#x23F5;","Phase Builder","Save up to 5 phases of play and animate them in sequence."],
                    ["&#x1F465;","Squad Profiles","Assign names, numbers, foot, skill, age, availability, and notes to every player."],
                    ["&#x1F501;","Sub Planner","Plan your substitutions with minute-by-minute changes before matchday."],
                    ["&#x2193;","Save & Load","Save your formations and plays to your profile and recall them any time."],
                  ].map(function(item,i){return(
                    <div key={i} style={{padding:"14px",borderRadius:6,border:"1px solid "+T.b,background:"rgba(255,255,255,0.02)"}}>
                      <div style={{fontSize:20,marginBottom:6}} dangerouslySetInnerHTML={{__html:item[0]}}/>
                      <div style={{fontWeight:700,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",marginBottom:4,color:T.volt}}>{item[1]}</div>
                      <div style={{fontSize:11,color:T.ghost,fontFamily:"'Poppins',sans-serif",lineHeight:1.6}}>{item[2]}</div>
                    </div>
                  );})}
                </div>
              </div>

              {/* Contact */}
              <div style={{border:"1px solid "+T.b,borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"14px 18px",borderBottom:"1px solid "+T.b,background:T.raised}}>
                  <h2 style={{fontWeight:700,fontSize:15,letterSpacing:"0.08em",fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase"}}>Get in Touch</h2>
                  <p style={{fontSize:11,color:T.ghost,fontFamily:"'Poppins',sans-serif",marginTop:4}}>Feature requests, feedback, bug reports -- all welcome.</p>
                </div>
                <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
                  onSubmit={function(e){
                    e.preventDefault();
                    var form=e.target;
                    fetch("https://formspree.io/f/YOUR_FORM_ID",{
                      method:"POST",
                      headers:{"Content-Type":"application/json","Accept":"application/json"},
                      body:JSON.stringify({name:form.name.value,email:form.email.value,message:form.message.value})
                    }).then(function(r){
                      if(r.ok){notify("Message sent -- thank you!");form.reset();}
                      else{notify("Something went wrong. Please try again.");}
                    }).catch(function(){notify("Something went wrong. Please try again.");});
                  }}
                  style={{padding:"18px"}}>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div><label>Name</label><input name="name" placeholder="Alex Ferguson" required/></div>
                      <div><label>Email</label><input name="email" type="email" placeholder="coach@club.com" required/></div>
                    </div>
                    <div><label>Message</label><textarea name="message" rows={4} placeholder="Tell us what you think, what's missing, or what's broken..." required style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:5,color:T.text,fontSize:13,fontFamily:"'Poppins',sans-serif",padding:"9px 12px",outline:"none",resize:"vertical",lineHeight:1.6}}/></div>
                    <button type="submit" className="btn btn-volt-outline btn-md" style={{alignSelf:"flex-start",paddingLeft:24,paddingRight:24}}>Send Message</button>
                  </div>
                </form>
              </div>

              {/* Legal */}
              <div style={{borderTop:"1px solid "+T.b,paddingTop:24}}>
                <h2 style={{fontWeight:700,fontSize:15,letterSpacing:"0.08em",fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase",marginBottom:16}}>Legal</h2>
                <div style={{display:"flex",flexDirection:"column",gap:16,fontFamily:"'Poppins',sans-serif",fontSize:12,color:T.ghost,lineHeight:1.75}}>

                  <div>
                    <div style={{fontWeight:700,color:T.sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:11}}>Terms of Use</div>
                    <p>FCRoster.com is provided as-is for personal and coaching use. By using this platform you agree not to misuse, reverse engineer, or redistribute any part of the service. We reserve the right to modify or discontinue features at any time. Continued use of the platform constitutes acceptance of these terms.</p>
                  </div>

                  <div>
                    <div style={{fontWeight:700,color:T.sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:11}}>Privacy Policy</div>
                    <p>We collect only the information necessary to operate your account: your email address, display name, and the formations and player data you choose to save. We do not sell, share, or monetise your personal data. Saved formation data is stored securely via Supabase and is accessible only to your account. We may use anonymised, aggregated usage data to improve the platform.</p>
                    <p style={{marginTop:6}}>We use Supabase for authentication and data storage, and Formspree for contact form submissions. These third-party services have their own privacy policies which govern their handling of data.</p>
                  </div>

                  <div>
                    <div style={{fontWeight:700,color:T.sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:11}}>Cookie Policy</div>
                    <p>FCRoster.com uses only functional cookies and local storage required for authentication session management. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. No cookie consent banner is required as we only use strictly necessary cookies.</p>
                  </div>

                  <div>
                    <div style={{fontWeight:700,color:T.sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:11}}>GDPR & Your Rights</div>
                    <p>If you are located in the European Economic Area or the United Kingdom, you have the right to access, correct, or delete any personal data we hold about you. To exercise these rights, contact us using the form above. We will respond within 30 days. You may delete your account and all associated data at any time.</p>
                  </div>

                  <div>
                    <div style={{fontWeight:700,color:T.sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:11}}>Disclaimer</div>
                    <p>FCRoster.com is an independent platform and is not affiliated with, endorsed by, or associated with any football club, league, federation, or governing body. All tactical content and formations created on this platform belong to the user who created them.</p>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div style={{textAlign:"center",paddingTop:10,borderTop:"1px solid "+T.b}}>
                <div style={{fontSize:22,marginBottom:6}}>&#x26BD;</div>
                <p style={{fontSize:10,color:T.faint,fontFamily:"'Poppins',sans-serif",letterSpacing:"0.06em"}}>
                  &copy; {new Date().getFullYear()} FCRoster.com &mdash; Built for the beautiful game.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

      {showAuth&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(12px)"}} onClick={function(e){if(e.target===e.currentTarget){setShowAuth(false);setAuthErr("");}}}>
          <div style={{background:"#1A1A1A",border:"1px solid "+T.bhi,borderTop:"2px solid "+T.volt,borderRadius:10,padding:28,width:"100%",maxWidth:340,boxShadow:"0 36px 80px rgba(0,0,0,0.88)"}} className="fu">
            <h2 style={{fontWeight:700,fontSize:19,letterSpacing:"0.06em",marginBottom:4}}>{authMode==="signin"?"WELCOME BACK":"JOIN FCROSTER"}</h2>
            <p style={{color:T.ghost,fontSize:12,marginBottom:20,fontFamily:"'Poppins',sans-serif"}}>Unlock pass, run, and shot drawing tools.</p>
            <button onClick={function(){
              setAuthErr(""); setAuthBusy(true);
              signInGoogle().catch(function(err){setAuthErr(err.message);setAuthBusy(false);});
            }} className="btn btn-secondary btn-md" style={{width:"100%",marginBottom:12,gap:8,display:"flex",alignItems:"center",justifyContent:"center"}} disabled={authBusy}>
              <svg width="16" height="16" viewBox="0 0 48 48" style={{flexShrink:0}}><path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.08-6.08C34.46 3.1 29.5 1 24 1 14.82 1 7.07 6.48 3.88 14.18l7.07 5.49C12.6 13.36 17.87 9.5 24 9.5z"/><path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.97-2.22 5.48-4.72 7.17l7.24 5.62C43.46 37.3 46.52 31.36 46.52 24.5z"/><path fill="#FBBC05" d="M10.95 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.07-5.49A23.94 23.94 0 0 0 0 24c0 3.86.92 7.51 2.55 10.73l8.4-6.41z"/><path fill="#34A853" d="M24 47c6.48 0 11.93-2.15 15.9-5.83l-7.24-5.62C30.6 37.3 27.45 38.5 24 38.5c-6.13 0-11.4-3.86-13.05-9.18l-8.4 6.41C6.07 43.52 14.46 47 24 47z"/></svg>
              {authBusy?"Connecting...":"Continue with Google"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{flex:1,height:1,background:T.b}}/>
              <span style={{fontSize:9,color:T.ghost,fontWeight:700,letterSpacing:"0.16em",fontFamily:"'Rajdhani',sans-serif"}}>OR</span>
              <div style={{flex:1,height:1,background:T.b}}/>
            </div>
            {authErr&&<div style={{fontSize:11,color:"rgba(240,80,80,0.9)",fontFamily:"'Poppins',sans-serif",marginBottom:10,padding:"8px 10px",borderRadius:5,background:"rgba(240,50,50,0.08)",border:"1px solid rgba(240,50,50,0.2)"}}>{authErr}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {authMode==="signup"&&(<div><label htmlFor="auth-name">Full Name</label><input id="auth-name" name="name" autoComplete="name" placeholder="Lionel Messi" value={aName} onChange={function(e){setAName(e.target.value);}}/></div>)}
              <div><label htmlFor="auth-email">Email</label><input id="auth-email" name="email" type="email" autoComplete="email" placeholder="coach@club.com" value={aEmail} onChange={function(e){setAEmail(e.target.value);}}/></div>
              <div><label htmlFor="auth-pass">Password</label><input id="auth-pass" name="password" type="password" autoComplete="current-password" placeholder="Password" value={aPass} onChange={function(e){setAPass(e.target.value);}}/></div>
              <button disabled={authBusy} onClick={function(){
                setAuthErr(""); setAuthBusy(true);
                var fn = authMode==="signin"
                  ? signInEmail(aEmail, aPass)
                  : signUpEmail(aEmail, aPass, aName);
                fn.then(function(){
                  setShowAuth(false); setAuthBusy(false);
                  setAEmail(""); setAPass(""); setAName("");
                  notify(authMode==="signin"?"Signed in!":"Account created! Check your email.");
                }).catch(function(err){
                  setAuthErr(err.message); setAuthBusy(false);
                });
              }} className="btn btn-primary btn-lg" style={{width:"100%",marginTop:4}}>
                {authBusy?"Please wait...":(authMode==="signin"?"Sign In":"Create Account")}
              </button>
            </div>
            <p style={{textAlign:"center",marginTop:14,fontSize:11,color:T.ghost,fontFamily:"'Poppins',sans-serif"}}>
              {authMode==="signin"?"No account? ":"Have one? "}
              <span style={{color:"rgba(200,255,0,0.7)",cursor:"pointer",fontWeight:600}} onClick={function(){setAuthMode(function(m){return m==="signin"?"signup":"signin";});setAuthErr("");}}>
                {authMode==="signin"?"Sign Up":"Sign In"}
              </span>
            </p>
          </div>
        </div>
      )}

      {inlineName&&(
        <div
          style={{
            position:"fixed",
            left:Math.min(inlineName.screenX-80, window.innerWidth-180),
            top:Math.max(inlineName.screenY-78, 60),
            width:168,
            background:"#1A1A1A",
            border:"1px solid rgba(200,255,0,0.35)",
            borderRadius:8,
            padding:"10px 12px",
            zIndex:250,
            boxShadow:"0 8px 32px rgba(0,0,0,0.7)",
          }}
          onMouseDown={function(e){e.stopPropagation();}}
          onTouchStart={function(e){e.stopPropagation();}}>
          <div style={{position:"absolute",bottom:-7,left:"50%",transform:"translateX(-50%)",width:14,height:8,overflow:"hidden"}}>
            <div style={{width:10,height:10,background:"#1A1A1A",border:"1px solid rgba(200,255,0,0.35)",transform:"rotate(45deg)",margin:"1px 0 0 2px"}}/>
          </div>
          <label style={{fontSize:9,fontWeight:700,letterSpacing:"0.16em",color:"rgba(255,255,255,0.3)",fontFamily:"'Rajdhani',sans-serif",marginBottom:5,display:"block"}}>PLAYER NAME</label>
          <input
            autoFocus
            value={inlineName.name}
            maxLength={16}
            placeholder="e.g. De Gea"
            onChange={function(e){setInlineName(function(s){return Object.assign({},s,{name:e.target.value});});}}
            onKeyDown={function(e){
              if(e.key==="Enter"){
                setPlayers(function(prev){return prev.map(function(x){return x.id===inlineName.id?Object.assign({},x,{name:inlineName.name}):x;});});
                setInlineName(null);
              }
              if(e.key==="Escape"){setInlineName(null);}
            }}
            onBlur={function(){
              setPlayers(function(prev){return prev.map(function(x){return x.id===inlineName.id?Object.assign({},x,{name:inlineName.name}):x;});});
              setInlineName(null);
            }}
            style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(200,255,0,0.3)",borderRadius:5,color:"rgba(255,255,255,0.92)",padding:"6px 9px",fontSize:13,fontFamily:"'Poppins',sans-serif",outline:"none",marginBottom:8}}
          />
          <button
            onMouseDown={function(e){
              e.preventDefault();
              setPlayers(function(prev){return prev.map(function(x){return x.id===inlineName.id?Object.assign({},x,{name:inlineName.name}):x;});});
              var p = players.find(function(x){return x.id===inlineName.id;});
              if(p) setEditP(Object.assign({},p,{name:inlineName.name}));
              setInlineName(null);
            }}
            style={{width:"100%",background:"transparent",border:"none",color:"rgba(200,255,0,0.7)",fontSize:11,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",textAlign:"right",padding:0}}>
            FULL PROFILE →
          </button>
        </div>
      )}

      {editP&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(10px)"}}
          onClick={function(e){if(e.target===e.currentTarget)setEditP(null);}}
          onTouchStart={function(e){e.stopPropagation();}}>
          <div style={{background:"#1A1A1A",border:"1px solid "+T.bhi,borderTop:"2px solid "+T.volt,borderRadius:10,padding:22,width:"100%",maxWidth:320,maxHeight:"90vh",overflowY:"auto"}} className="fu">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:tFill(editP.n),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:11,fontWeight:900,color:tTxt(editP.n),fontFamily:"'Rajdhani',sans-serif"}}>{editP.n.slice(0,4)}</span>
              </div>
              <h3 style={{fontWeight:700,fontSize:16,letterSpacing:"0.05em",flex:1}}>PLAYER PROFILE</h3>
            </div>

            {/* Row 1: Position + Jersey # */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div><label>Position</label><input value={editP.n} onChange={function(e){setEditP(function(p){return Object.assign({},p,{n:e.target.value.slice(0,4).toUpperCase()});});}} maxLength={4} placeholder="GK"/></div>
              <div><label>Jersey #</label><input type="number" min="1" max="99" value={editP.number||""} onChange={function(e){setEditP(function(p){return Object.assign({},p,{number:e.target.value});});}} placeholder="1"/></div>
            </div>

            {/* Starter Name */}
            <div style={{marginBottom:10}}><label>Player Name</label><input autoFocus value={editP.name||""} onChange={function(e){setEditP(function(p){return Object.assign({},p,{name:e.target.value});});}} placeholder="e.g. De Gea" maxLength={16}/></div>

            {/* Row 2: Age + Foot */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div><label>Age</label><input type="number" min="1" max="99" value={editP.age||""} onChange={function(e){setEditP(function(p){return Object.assign({},p,{age:e.target.value});});}} placeholder="25"/></div>
              <div>
                <label>Foot</label>
                <div style={{display:"flex",gap:4,marginTop:4}}>
                  {["L","R","B"].map(function(f){
                    var labels={L:"Left",R:"Right",B:"Both"};
                    var active=(editP.foot||"R")===f;
                    return <button key={f} onClick={function(){setEditP(function(p){return Object.assign({},p,{foot:f});});}}
                      style={{flex:1,padding:"5px 0",borderRadius:4,border:"1px solid "+(active?T.volt:T.b),background:active?"rgba(200,255,0,0.1)":"transparent",color:active?T.volt:T.ghost,fontSize:11,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",cursor:"pointer",transition:"all 0.1s"}}
                      title={labels[f]}>{f}</button>;
                  })}
                </div>
              </div>
            </div>

            {/* Skill ranking */}
            <div style={{marginBottom:10}}>
              <label>Skill Level</label>
              <div style={{display:"flex",gap:5,marginTop:4,alignItems:"center"}}>
                {[1,2,3,4,5].map(function(s){
                  var active=(editP.skill||3)>=s;
                  return <div key={s} onClick={function(){setEditP(function(p){return Object.assign({},p,{skill:s});});}}
                    style={{flex:1,height:6,borderRadius:3,background:active?T.volt:"rgba(255,255,255,0.1)",cursor:"pointer",transition:"background 0.1s"}}/>;
                })}
                <span style={{fontSize:10,color:T.ghost,fontFamily:"'Poppins',sans-serif",marginLeft:6,flexShrink:0,width:60}}>
                  {["","Grassroots","Amateur","Semi-Pro","Club Pro","Elite"][(editP.skill||3)]}
                </span>
              </div>
            </div>

            {/* Availability */}
            <div style={{marginBottom:10}}>
              <label>Availability</label>
              <div style={{display:"flex",gap:6,marginTop:4}}>
                {[["available","#22CC44","Available"],["doubtful","#F5BE00","Doubtful"],["unavailable","#F02040","Unavailable"]].map(function(item){
                  var active=(editP.availability||"available")===item[0];
                  return <button key={item[0]} onClick={function(){setEditP(function(p){return Object.assign({},p,{availability:item[0]});});}}
                    style={{flex:1,padding:"5px 4px",borderRadius:4,border:"1px solid "+(active?item[1]:T.b),background:active?"rgba("+item[1].slice(1).match(/.{2}/g).map(function(x){return parseInt(x,16);}).join(",")+",0.12)":"transparent",color:active?item[1]:T.ghost,fontSize:9,fontWeight:700,fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.06em",cursor:"pointer",transition:"all 0.1s",textTransform:"uppercase"}}>
                    {item[2]}
                  </button>;
                })}
              </div>
            </div>

            {/* Notes */}
            <div style={{marginBottom:14}}>
              <label style={{display:"flex",justifyContent:"space-between"}}>
                <span>Notes</span>
                <span style={{fontSize:9,color:T.faint,fontWeight:400}}>{(editP.notes||"").length}/250</span>
              </label>
              <textarea value={editP.notes||""} onChange={function(e){setEditP(function(p){return Object.assign({},p,{notes:e.target.value.slice(0,250)});});}}
                placeholder="Injuries, role notes, availability details..."
                rows={3} maxLength={250}
                style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:5,color:T.text,fontSize:12,fontFamily:"'Poppins',sans-serif",padding:"7px 10px",outline:"none",resize:"vertical",lineHeight:1.5}}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button onClick={function(){
                setPlayers(function(prev){return prev.map(function(x){return x.id===editP.id?Object.assign({},x,editP):x;});});
                setEditP(null); notify("Player updated.");
              }} className="btn btn-primary btn-sm">Save</button>
              <button onClick={function(){setEditP(null);}} className="btn btn-danger btn-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast&&(
        <div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",zIndex:300,pointerEvents:"none",background:"#222",border:"1px solid "+T.bhi,borderRadius:5,padding:"9px 18px",fontSize:12,fontWeight:600,letterSpacing:"0.05em",whiteSpace:"nowrap",color:T.sub,boxShadow:"0 10px 36px rgba(0,0,0,0.6)",fontFamily:"'Poppins',sans-serif"}} className="fu">
          {toast}
        </div>
      )}
    </div>
  );
}