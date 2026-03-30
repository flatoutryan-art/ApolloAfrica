import { useState, useRef, useEffect } from "react";
import {
  Zap, Leaf, TrendingDown, ChevronRight, ChevronDown, ChevronUp,
  MapPin, Phone, Mail, User, Building2, CheckCircle2, AlertCircle,
  Calculator, ArrowRight, BarChart3, Shield, Sun, Wind, Info, X,
  Upload, Tag, Star, Activity, Target, Clock, Award, Gauge,
  TrendingUp, FileText, Percent, Bolt
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TARIFFS = {
  megaflex: { label: "Megaflex", description: "Large urban customers >1 MVA NMD", blendedEnergyRate: 315, networkFixed: 9800, gccFixed: 4200, eligibility: true, minNMD: 1000 },
  miniflex:  { label: "Miniflex",  description: "Urban customers 16 kVA – 5 MVA NMD", blendedEnergyRate: 295, networkFixed: 6500, gccFixed: 2800, eligibility: true, minNMD: 16 },
  ruraflex:  { label: "Ruraflex",  description: "Rural customers ≤22 kV supply voltage", blendedEnergyRate: 285, networkFixed: 7200, gccFixed: 3100, eligibility: true, minNMD: 16 },
  municipal: { label: "Municipal / Indirect", description: "Bill received from local municipality", blendedEnergyRate: 0, networkFixed: 0, gccFixed: 0, eligibility: false, minNMD: 0 },
};

const MUNICIPALITIES = [
  "City of Johannesburg","City of Cape Town","eThekwini (Durban)","Ekurhuleni",
  "City of Tshwane","Nelson Mandela Bay","Buffalo City (East London)",
  "Mangaung (Bloemfontein)","Sol Plaatje (Kimberley)","Drakenstein (Paarl)",
  "Stellenbosch","George","Polokwane","Mbombela (Nelspruit)",
  "Emfuleni (Vereeniging)","Rustenburg","Msunduzi (Pietermaritzburg)",
  "uMhlathuze (Richards Bay)","Matlosana (Klerksdorp)","Madibeng (Brits)","Other",
];

const APOLLO_PPA_RATE   = 165;
const WHEELING_CREDIT   = 195;
const ESKOM_ADMIN_FEE   = 3500;
const CO2_KG_PER_KWH    = 0.93;
const TREES_PER_TONNE   = 45;
const DISCOUNT_CENTS    = 2;
const LOAD_FACTOR_HIGH  = 0.80;
const LOAD_FACTOR_LOW   = 0.45;

const LOGO_SRC = "data:image/jpeg;base64,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";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function fmt(n, dec = 0) {
  return new Intl.NumberFormat("en-ZA", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
}
function fmtR(n) { return `R ${fmt(Math.abs(n))}`; }

function calcSavings({ tariffKey, monthlyMwh, peakPct }) {
  const tariff = TARIFFS[tariffKey];
  if (!tariff.eligibility || monthlyMwh === 0) return null;
  const monthlyKwh  = monthlyMwh * 1000;
  const peakFrac    = peakPct / 100;
  const peakRate    = tariff.blendedEnergyRate * 1.35;
  const offPeakRate = tariff.blendedEnergyRate * 0.68;
  const stdRate     = tariff.blendedEnergyRate;
  const weightedRate = peakFrac * peakRate + (1 - peakFrac) * 0.4 * offPeakRate + (1 - peakFrac) * 0.6 * stdRate;
  const eskomEnergy  = (weightedRate / 100) * monthlyKwh;
  const apolloCost   = (APOLLO_PPA_RATE / 100) * monthlyKwh;
  const wepsCredit   = (WHEELING_CREDIT / 100) * monthlyKwh;
  const netWheeling  = apolloCost + ESKOM_ADMIN_FEE - wepsCredit;
  const monthlySaving = eskomEnergy - netWheeling;
  const annualSaving  = monthlySaving * 12;
  const co2Tonnes     = (monthlyKwh * CO2_KG_PER_KWH) / 1000;
  const trees         = Math.round(co2Tonnes * 12 * TREES_PER_TONNE);
  const savingPct     = (monthlySaving / eskomEnergy) * 100;
  return { eskomEnergy, apolloCost, wepsCredit, monthlySaving, annualSaving, co2Tonnes, trees, savingPct, weightedRate, networkFixed: tariff.networkFixed, gccFixed: tariff.gccFixed };
}

// ── SCORECARD LOGIC ──────────────────────────────────────────────────────────

function calcScorecard({ tariffKey, nmd, monthlyMwh, peakPct }) {
  const tariff = TARIFFS[tariffKey];
  if (!tariff.eligibility) return null;
  const monthlyKwh = monthlyMwh * 1000;

  // 1. NMD Adequacy (min 500 kVA for strong wheeling case, 100 kVA marginal)
  let nmdScore = 0;
  let nmdLabel = "";
  let nmdNote  = "";
  if (nmd >= 2000) { nmdScore = 100; nmdLabel = "Excellent"; nmdNote = "Large NMD — ideal wheeling candidate. Priority grid-access pathway."; }
  else if (nmd >= 1000) { nmdScore = 85; nmdLabel = "Strong"; nmdNote = "High NMD indicates strong wheeling economics."; }
  else if (nmd >= 500)  { nmdScore = 70; nmdLabel = "Good"; nmdNote = "NMD supports a viable wheeling agreement."; }
  else if (nmd >= 100)  { nmdScore = 45; nmdLabel = "Marginal"; nmdNote = "NMD is workable but reduces wheeling margin. Discuss optimisation."; }
  else { nmdScore = 20; nmdLabel = "Low"; nmdNote = "NMD below threshold for standard wheeling. Capacity upgrade may be required."; }

  // 2. Load Factor = monthly kWh / (NMD kVA × 0.8pf × 730h)
  const theoreticalMax = nmd * 0.8 * 730;
  const loadFactor = theoreticalMax > 0 ? Math.min((monthlyKwh / theoreticalMax) * 100, 100) : 0;
  let lfScore = 0; let lfLabel = ""; let lfNote = "";
  if (loadFactor >= 65) { lfScore = 100; lfLabel = "High"; lfNote = "High load factor — wheeling credits maximised throughout the month."; }
  else if (loadFactor >= 45) { lfScore = 75; lfLabel = "Medium"; lfNote = "Healthy utilisation — good wheeling economics."; }
  else if (loadFactor >= 25) { lfScore = 50; lfLabel = "Low-Medium"; lfNote = "Moderate utilisation. Consider demand-side management to improve."; }
  else { lfScore = 25; lfLabel = "Low"; lfNote = "Low load factor reduces wheeling efficiency. Review operational hours."; }

  // 3. TOU Exposure — higher peak % = higher current Eskom bill = more to save
  let touScore = 0; let touLabel = ""; let touNote = "";
  if (peakPct >= 40) { touScore = 100; touLabel = "High Exposure"; touNote = "Significant peak usage — Apollo wheeling replaces the most expensive Eskom units."; }
  else if (peakPct >= 25) { touScore = 80; touLabel = "Moderate"; touNote = "Good TOU exposure. Strong savings potential during peak periods."; }
  else if (peakPct >= 15) { touScore = 55; touLabel = "Low-Moderate"; touNote = "Lower peak exposure still yields meaningful savings."; }
  else { touScore = 30; touLabel = "Off-Peak Heavy"; touNote = "Mostly off-peak usage. Savings are present but moderate."; }

  // 4. Tariff Fit
  let tariffScore = 0; let tariffLabel = ""; let tariffNote = "";
  if (tariffKey === "megaflex") { tariffScore = 100; tariffLabel = "Ideal"; tariffNote = "Megaflex is the primary wheeling target tariff — full WEPS credit applies."; }
  else if (tariffKey === "miniflex") { tariffScore = 80; tariffLabel = "Strong"; tariffNote = "Miniflex customers qualify for wheeling with excellent economics."; }
  else { tariffScore = 65; tariffLabel = "Good"; tariffNote = "Ruraflex is eligible — confirm grid connection type with Apollo."; }

  // 5. Savings Rate %
  const savings = calcSavings({ tariffKey, monthlyMwh, peakPct });
  const savingsPct = savings ? Math.max(savings.savingPct, 0) : 0;
  let savingsScore = Math.min(Math.round(savingsPct * 2.5), 100);
  let savingsLabel = savingsPct >= 20 ? "Excellent" : savingsPct >= 12 ? "Strong" : savingsPct >= 6 ? "Moderate" : "Marginal";

  // Overall weighted score
  const overall = Math.round(
    nmdScore    * 0.25 +
    lfScore     * 0.20 +
    touScore    * 0.20 +
    tariffScore * 0.15 +
    savingsScore * 0.20
  );

  let grade = ""; let gradeColor = ""; let gradeBg = ""; let recommendation = "";
  if (overall >= 80) {
    grade = "A"; gradeColor = "text-green-400"; gradeBg = "bg-green-500/20 border-green-500/40";
    recommendation = "Excellent wheeling candidate. Apollo recommends fast-tracking a site audit and grid-capacity confirmation. Expected payback under 6 months.";
  } else if (overall >= 65) {
    grade = "B"; gradeColor = "text-amber-300"; gradeBg = "bg-amber-500/20 border-amber-400/40";
    recommendation = "Strong business case for wheeling. Minor optimisations to load profile or NMD could push savings higher. Proceed to full audit.";
  } else if (overall >= 45) {
    grade = "C"; gradeColor = "text-yellow-500"; gradeBg = "bg-yellow-500/20 border-yellow-500/40";
    recommendation = "Viable wheeling candidate with room for improvement. Apollo will identify demand-side optimisations to enhance the savings case.";
  } else {
    grade = "D"; gradeColor = "text-red-400"; gradeBg = "bg-red-500/20 border-red-500/40";
    recommendation = "Marginal wheeling case at current parameters. Our team can explore alternative Apollo products — storage, offset, or demand management — to unlock value.";
  }

  return {
    overall, grade, gradeColor, gradeBg, recommendation,
    nmd:     { score: nmdScore,     label: nmdLabel,     note: nmdNote     },
    lf:      { score: lfScore,      label: lfLabel,      note: lfNote,     value: loadFactor },
    tou:     { score: touScore,     label: touLabel,     note: touNote     },
    tariff:  { score: tariffScore,  label: tariffLabel,  note: tariffNote  },
    savings: { score: savingsScore, label: savingsLabel, pct: savingsPct, monthly: savings?.monthlySaving ?? 0, annual: savings?.annualSaving ?? 0 },
  };
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1">
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)} className="text-amber-400 hover:text-amber-300 transition-colors"><Info size={13} /></button>
      {show && <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#061a16] border border-amber-500/30 text-stone-300 text-xs rounded-xl px-3 py-2.5 shadow-2xl leading-relaxed">{text}</span>}
    </span>
  );
}

function Slider({ label, min, max, value, onChange, step = 1, unit, tooltip, liveTag }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-stone-300 flex items-center gap-1">{label}{tooltip && <Tooltip text={tooltip} />}</label>
        <div className="flex items-center gap-1.5">
          {liveTag && <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-medium flex items-center gap-1"><Activity size={9} />LIVE</span>}
          <span className="text-amber-300 font-bold text-sm tabular-nums">{fmt(value)} {unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb"
        style={{ background: `linear-gradient(to right, #C9A84C 0%, #C9A84C ${pct}%, #0d2e29 ${pct}%, #0d2e29 100%)` }} />
      <div className="flex justify-between text-xs text-stone-600"><span>{fmt(min)}</span><span>{fmt(max)}</span></div>
    </div>
  );
}

function ScoreBar({ score, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(score), 100); return () => clearTimeout(t); }, [score]);
  const barColor = score >= 80 ? "#22c55e" : score >= 60 ? "#C9A84C" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="h-2 bg-[#0a2520] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${width}%`, backgroundColor: barColor }} />
    </div>
  );
}

function ScorecardRow({ icon: Icon, label, score, scoreLabel, note, value }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-amber-900/25 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3.5 bg-[#0a2520]/60 hover:bg-[#0d2e29]/80 transition-colors text-left">
        <div className="bg-amber-500/10 rounded-lg p-1.5 shrink-0"><Icon size={14} className="text-amber-400" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-stone-300">{label}</span>
            <div className="flex items-center gap-2">
              {value !== undefined && <span className="text-xs text-stone-500 tabular-nums">{fmt(value, 1)}%</span>}
              <span className={`text-xs font-bold ${score >= 80 ? "text-green-400" : score >= 60 ? "text-amber-300" : score >= 40 ? "text-yellow-500" : "text-red-400"}`}>{scoreLabel}</span>
            </div>
          </div>
          <ScoreBar score={score} />
        </div>
        {open ? <ChevronUp size={13} className="text-stone-500 shrink-0" /> : <ChevronDown size={13} className="text-stone-500 shrink-0" />}
      </button>
      {open && <div className="px-4 py-2.5 bg-[#061a16]/80 border-t border-amber-900/20"><p className="text-xs text-stone-400 leading-relaxed">{note}</p></div>}
    </div>
  );
}

function NMDInput({ value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-stone-300 flex items-center gap-1">
          Notified Maximum Demand (NMD)
          <Tooltip text="Your contracted maximum demand in kVA — found on your Eskom bill or supply agreement. This is the single most important variable for wheeling eligibility." />
        </label>
        <span className="text-amber-300 font-bold text-sm tabular-nums">{fmt(value)} kVA</span>
      </div>
      <input type="range" min={50} max={5000} step={50} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb"
        style={{ background: `linear-gradient(to right, #C9A84C 0%, #C9A84C ${((value - 50) / 4950) * 100}%, #0d2e29 ${((value - 50) / 4950) * 100}%, #0d2e29 100%)` }} />
      <div className="flex justify-between text-xs text-stone-600"><span>50</span><span>5 000 kVA</span></div>
      <div className="grid grid-cols-4 gap-1.5 mt-1">
        {[{ v: 100, l: "100" }, { v: 500, l: "500" }, { v: 1000, l: "1 MVA" }, { v: 2500, l: "2.5 MVA" }].map(({ v, l }) => (
          <button key={v} onClick={() => onChange(v)}
            className={`text-xs py-1.5 rounded-lg border transition-all ${value === v ? "bg-amber-500/20 border-amber-400/60 text-amber-300" : "bg-[#0d2e29] border-amber-900/30 text-stone-500 hover:border-amber-700/50"}`}>{l}</button>
        ))}
      </div>
    </div>
  );
}

function LiveDial({ value, max, label, color = "#C9A84C", unit = "%" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = display; const end = value;
    const step = (end - start) / 20;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setDisplay(prev => count >= 20 ? end : prev + step);
      if (count >= 20) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  const pct = Math.min((value / max) * 100, 100);
  const r = 36; const circ = 2 * Math.PI * r;
  const dashOffset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#0a2520" strokeWidth="8" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={dashOffset}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white" style={{ fontFamily: "Syne" }}>{fmt(display, unit === "%" ? 0 : 0)}</span>
          <span className="text-xs text-stone-400">{unit}</span>
        </div>
      </div>
      <span className="text-xs text-stone-400 mt-1 text-center">{label}</span>
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-500 flex-1 ${i < current ? "bg-amber-400" : i === current ? "bg-amber-400/60" : "bg-[#0a2520]"}`} />
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function WheelingCalculator() {
  // Step control
  const [step, setStep] = useState("hook"); // hook | data | scorecard | form | done

  // Scroll-to-top ref — attached to the very top of the page
  const topRef = useRef(null);

  // Always scroll to top when changing step
  const goTo = (nextStep) => {
    setStep(nextStep);
    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 0);
  };

  // Billing / tariff
  const [billingSource, setBillingSource] = useState(null);
  const [municipality, setMunicipality]   = useState("");
  const [tariffKey, setTariffKey]         = useState("megaflex");

  // Core inputs
  const [nmd, setNmd]               = useState(500);
  const [monthlyMwh, setMonthlyMwh] = useState(500);
  const [peakPct, setPeakPct]       = useState(30);
  const [eskomAccount, setEskomAccount] = useState("");

  // UI state
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", substation: "" });

  // Live calculations — recompute whenever inputs change
  const savings   = calcSavings({ tariffKey, monthlyMwh, peakPct });
  const scorecard = calcScorecard({ tariffKey, nmd, monthlyMwh, peakPct });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files].slice(0, 6));
  };
  const removeFile = (idx) => setUploadedFiles(f => f.filter((_, i) => i !== idx));
  const handleLeadSubmit = (e) => { e.preventDefault(); goTo("done"); };

  const isMunicipal = billingSource === "municipal";
  const tariff = TARIFFS[tariffKey];

  return (
    <div ref={topRef} className="min-h-screen text-white font-sans" style={{ backgroundColor: "#0B2B26" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1,h2,h3 { font-family: 'Syne', sans-serif; }
        .slider-thumb::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#C9A84C; border:3px solid #0B2B26; box-shadow:0 0 0 2px #C9A84C; cursor:pointer; }
        .slider-thumb::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:#C9A84C; border:3px solid #0B2B26; box-shadow:0 0 0 2px #C9A84C; cursor:pointer; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGold { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.4)} 50%{box-shadow:0 0 0 10px rgba(201,168,76,0)} }
        .fade-up { animation: fadeUp 0.45s ease forwards; }
        .pulse-gold { animation: pulseGold 2s ease infinite; }
        .glow-gold { box-shadow: 0 0 40px rgba(201,168,76,0.12); }
        .grid-bg { background-image: linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px); background-size:40px 40px; }
        select option { background-color:#0d2e29; color:white; }
      `}</style>

      {/* ── HEADER ── */}
      <div className="relative grid-bg overflow-hidden">
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(201,168,76,0.06),transparent,#0B2B26)" }} />
        <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <img src={LOGO_SRC} alt="Apollo Africa" className="h-14 w-14 rounded-2xl object-cover" />
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-900/20 border border-amber-500/25 rounded-full px-4 py-1.5 text-amber-300 text-xs font-medium mb-4 tracking-wide">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            Eskom-Direct Mini-Audit • 2025–2026 Tariffs
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3 tracking-tight" style={{ fontFamily:"Syne" }}>
            Your Facility.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#e8c96a]">Your Savings Score.</span>
          </h1>
          <p className="text-stone-400 text-sm max-w-sm mx-auto">Is your facility eligible for 20% lower energy costs? Check your Eskom-Direct eligibility in 60 seconds.</p>
        </div>
      </div>

      {/* ── MAIN CARD ── */}
      <div className="max-w-2xl mx-auto px-4 pb-24 -mt-2">
        <div className="bg-[#0d2e29]/90 backdrop-blur-sm border border-amber-900/40 rounded-3xl overflow-hidden glow-gold">

          {/* ════════════════════════════════════════
              STEP A — THE HOOK / ELIGIBILITY CHECK
          ════════════════════════════════════════ */}
          {step === "hook" && (
            <div className="p-6 fade-up">
              <StepIndicator current={0} total={3} />
              <div className="flex items-center gap-2 mb-1">
                <Target size={14} className="text-amber-400" />
                <p className="text-xs text-amber-400 font-medium uppercase tracking-widest">Step A — Eligibility</p>
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily:"Syne" }}>Who supplies your electricity?</h2>
              <p className="text-stone-400 text-xs mb-5">Your supply source determines your wheeling pathway and savings potential.</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { key:"eskom", label:"Eskom Direct", sub:"Bill from Eskom SOC", icon:Zap, badge:"Eligible" },
                  { key:"municipal", label:"Municipality", sub:"Bill from local council", icon:Building2, badge:"Also Eligible" },
                ].map(({ key, label, sub, icon:Icon, badge }) => (
                  <button key={key}
                    onClick={() => { setBillingSource(key); if (key==="municipal") setTariffKey("municipal"); else setTariffKey("megaflex"); }}
                    className={`relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left ${billingSource===key ? "border-amber-400 bg-amber-400/10" : "border-amber-900/40 bg-[#0a2520]/60 hover:border-amber-700/50"}`}>
                    {billingSource===key && <span className="absolute top-2 right-2 text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
                    <Icon size={20} className={billingSource===key ? "text-amber-300 mb-2" : "text-stone-500 mb-2"} />
                    <span className={`font-semibold text-sm ${billingSource===key ? "text-white" : "text-stone-300"}`}>{label}</span>
                    <span className="text-xs text-stone-500 mt-0.5">{sub}</span>
                  </button>
                ))}
              </div>

              {/* Eskom — tariff select */}
              {billingSource==="eskom" && (
                <div className="mb-5 fade-up">
                  <label className="text-sm font-medium text-stone-300 block mb-2">
                    Eskom Tariff <Tooltip text="Megaflex: large urban >1MVA. Miniflex: medium urban 16kVA–5MVA. Ruraflex: rural ≤22kV." />
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["megaflex","miniflex","ruraflex"].map(k => (
                      <button key={k} onClick={() => setTariffKey(k)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${tariffKey===k ? "bg-amber-500/20 border-amber-400/60 text-amber-300" : "bg-[#0d2e29] border-amber-900/30 text-stone-400 hover:border-amber-700/50"}`}>
                        {TARIFFS[k].label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 mt-1.5">{TARIFFS[tariffKey]?.description}</p>
                </div>
              )}

              {/* Municipal — municipality select */}
              {billingSource==="municipal" && (
                <div className="mb-5 fade-up">
                  <div className="flex items-start gap-3 bg-amber-900/15 border border-amber-500/25 rounded-xl p-3 mb-4">
                    <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-300 leading-relaxed">Municipal customers can still access structured wheeling through Apollo's municipal product. Select your municipality so our team can prepare a bespoke proposal.</p>
                  </div>
                  <label className="text-sm font-medium text-stone-300 block mb-2">Select Your Municipality</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                    <select value={municipality} onChange={e => setMunicipality(e.target.value)}
                      className="w-full bg-[#0d2e29] border border-amber-400/40 text-white rounded-xl py-3 pl-10 pr-8 text-sm focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer">
                      <option value="">— Choose your municipality —</option>
                      {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              )}

              <button disabled={!billingSource} onClick={() => goTo("data")}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-amber-500/20 text-sm disabled:opacity-40 disabled:cursor-not-allowed pulse-gold">
                <Clock size={16} />
                Continue — Takes ~60 seconds
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════
              STEP B — THE DATA
          ════════════════════════════════════════ */}
          {step === "data" && (
            <div className="p-6 fade-up">
              <StepIndicator current={1} total={3} />
              <div className="flex items-center gap-2 mb-1">
                <Gauge size={14} className="text-amber-400" />
                <p className="text-xs text-amber-400 font-medium uppercase tracking-widest">Step B — Facility Data</p>
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily:"Syne" }}>Tell us about your facility</h2>
              <p className="text-stone-400 text-xs mb-5">Your scorecard updates in real-time as you adjust these values.</p>

              {/* Account number (optional) */}
              <div className="relative mb-5">
                <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="text" placeholder="Eskom Account Number (optional)"
                  value={eskomAccount} onChange={e => setEskomAccount(e.target.value)}
                  className="w-full bg-[#0a2520]/60 border border-amber-900/30 text-white placeholder-stone-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-600 bg-[#0d2e29] px-2 py-0.5 rounded">Optional</span>
              </div>

              <div className="space-y-7">
                {/* NMD */}
                <NMDInput value={nmd} onChange={setNmd} />

                {/* Monthly Usage */}
                <Slider label="Monthly Energy Usage" min={50} max={5000} step={50} value={monthlyMwh} onChange={setMonthlyMwh}
                  unit="MWh/month" liveTag tooltip="Total electricity consumption per month in MWh. Found on your Eskom or municipal invoice." />

                {/* Peak TOU */}
                <Slider label="Peak TOU Exposure" min={5} max={70} step={5} value={peakPct} onChange={setPeakPct}
                  unit="% Peak" liveTag tooltip="% of your consumption during Eskom peak periods (07:00–09:00 & 17:00–20:00 weekdays). Drives your savings multiplier." />
              </div>

              {/* Live mini-preview dials */}
              {savings && (
                <div className="mt-6 bg-[#0a2520]/60 border border-amber-900/25 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity size={13} className="text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Live Preview</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <LiveDial value={Math.max(savings.savingPct, 0)} max={40} label="Savings %" color="#C9A84C" unit="%" />
                    <LiveDial value={Math.abs(savings.monthlySaving) / 1000} max={500} label="R'000 / mo" color="#22c55e" unit="k" />
                    <LiveDial value={scorecard?.overall ?? 0} max={100} label="Score" color={scorecard?.overall >= 80 ? "#22c55e" : scorecard?.overall >= 65 ? "#C9A84C" : "#eab308"} unit="pts" />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => goTo("hook")} className="px-5 py-3 rounded-2xl border border-amber-900/40 text-stone-400 hover:text-stone-200 hover:border-amber-700/50 transition-colors text-sm">← Back</button>
                <button onClick={() => goTo("scorecard")}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 text-sm">
                  <Award size={16} />
                  Generate My Feasibility Scorecard
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              STEP C — FEASIBILITY SCORECARD
          ════════════════════════════════════════ */}
          {step === "scorecard" && scorecard && (
            <div className="p-6 fade-up">
              <StepIndicator current={2} total={3} />
              <div className="flex items-center gap-2 mb-1">
                <Award size={14} className="text-amber-400" />
                <p className="text-xs text-amber-400 font-medium uppercase tracking-widest">Step C — Feasibility Scorecard</p>
              </div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily:"Syne" }}>Your Wheeling Feasibility Score</h2>

              {/* ── GRADE HERO ── */}
              <div className={`rounded-2xl border p-5 mb-5 relative overflow-hidden ${scorecard.gradeBg}`}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-8 translate-x-8" style={{ background:"rgba(201,168,76,0.06)" }} />
                <div className="flex items-start gap-4">
                  <div className={`text-6xl font-black leading-none ${scorecard.gradeColor}`} style={{ fontFamily:"Syne" }}>{scorecard.grade}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-lg" style={{ fontFamily:"Syne" }}>{scorecard.overall}/100</span>
                      <span className="text-xs text-stone-400">Wheeling Feasibility Score</span>
                    </div>
                    <div className="h-2.5 bg-[#0a2520] rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full" style={{ width:`${scorecard.overall}%`, background:"linear-gradient(to right,#C9A84C,#e8c96a)", transition:"width 1s ease" }} />
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{scorecard.recommendation}</p>
                  </div>
                </div>
              </div>

              {/* ── SAVINGS HIGHLIGHTS ── */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label:"Monthly Saving", value: fmtR(scorecard.savings.monthly), icon: TrendingDown, sub: `${fmt(scorecard.savings.pct,1)}% off bill` },
                  { label:"Annual Value",   value: fmtR(scorecard.savings.annual),  icon: TrendingUp,  sub: "projected" },
                  { label:"20-Year Value",  value: fmtR(scorecard.savings.annual * 20), icon: BarChart3, sub: "cumulative" },
                ].map(({ label, value, icon:Icon, sub }) => (
                  <div key={label} className="bg-[#0a2520]/70 border border-amber-900/25 rounded-xl p-3 text-center">
                    <Icon size={14} className="text-amber-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-white" style={{ fontFamily:"Syne" }}>{value}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{label}</div>
                    <div className="text-xs text-stone-600">{sub}</div>
                  </div>
                ))}
              </div>

              {/* ── LIVE SCORECARD ROWS ── */}
              <div className="space-y-2 mb-5">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-3">Scoring Breakdown — tap any row for detail</p>
                <ScorecardRow icon={Gauge} label="NMD Adequacy" score={scorecard.nmd.score} scoreLabel={scorecard.nmd.label} note={scorecard.nmd.note} />
                <ScorecardRow icon={Activity} label="Load Factor" score={scorecard.lf.score} scoreLabel={scorecard.lf.label} note={scorecard.lf.note} value={scorecard.lf.value} />
                <ScorecardRow icon={Percent} label="TOU Peak Exposure" score={scorecard.tou.score} scoreLabel={scorecard.tou.label} note={scorecard.tou.note} />
                <ScorecardRow icon={Zap} label="Tariff Fit" score={scorecard.tariff.score} scoreLabel={scorecard.tariff.label} note={scorecard.tariff.note} />
                <ScorecardRow icon={TrendingDown} label="Savings Rate" score={scorecard.savings.score} scoreLabel={scorecard.savings.label} note={`Apollo PPA at ${APOLLO_PPA_RATE}c/kWh vs your blended Eskom rate of ~${fmt(TARIFFS[tariffKey]?.blendedEnergyRate)}c/kWh.`} />
              </div>

              {/* ── LIVE ADJUST PANEL ── */}
              <div className="bg-[#0a2520]/60 border border-amber-900/25 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={13} className="text-amber-400" />
                  <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Adjust Variables — Score Updates Live</span>
                </div>
                <div className="space-y-5">
                  <NMDInput value={nmd} onChange={setNmd} />
                  <Slider label="Monthly Usage" min={50} max={5000} step={50} value={monthlyMwh} onChange={setMonthlyMwh} unit="MWh/month" liveTag />
                  <Slider label="Peak TOU Exposure" min={5} max={70} step={5} value={peakPct} onChange={setPeakPct} unit="% Peak" liveTag />
                </div>
              </div>

              {/* ── BREAKDOWN ── */}
              <button onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between py-3 px-4 bg-[#0a2520]/60 hover:bg-[#0d2e29]/80 rounded-xl text-sm text-stone-300 font-medium transition-colors mb-3">
                <span className="flex items-center gap-2"><Calculator size={13} />View Full Cost Breakdown</span>
                {showBreakdown ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              {showBreakdown && savings && (
                <div className="bg-[#0a2520]/60 border border-amber-900/20 rounded-2xl p-4 mb-4 fade-up">
                  <p className="text-xs text-stone-500 uppercase tracking-wider mb-3 font-medium">Monthly Cost Analysis</p>
                  {[
                    { label:"Eskom Variable Energy Cost", value: fmtR(savings.eskomEnergy), note:`${fmt(monthlyMwh*1000)} kWh × ~${fmt(savings.weightedRate,0)}c/kWh` },
                    { label:"Apollo PPA Cost", value:`(${fmtR(savings.apolloCost)})`, note:`× ${APOLLO_PPA_RATE}c/kWh` },
                    { label:"WEPS Wheeling Credit", value:`+ ${fmtR(savings.wepsCredit)}`, credit:true, note:`× ${WHEELING_CREDIT}c/kWh (Eskom refund)` },
                    { label:"Gen-Wheeling Admin Fee", value:`(${fmtR(ESKOM_ADMIN_FEE)})`, note:"Fixed R/month per POD" },
                  ].map(({ label, value, credit, note }) => (
                    <div key={label} className="flex justify-between items-start py-2.5 border-b border-amber-900/25 last:border-0">
                      <div><span className="text-xs text-stone-300">{label}</span><div className="text-xs text-stone-600 mt-0.5">{note}</div></div>
                      <span className={`text-xs font-semibold tabular-nums ml-3 shrink-0 ${credit ? "text-green-400":"text-stone-200"}`}>{value}</span>
                    </div>
                  ))}
                  <div className="pt-3 flex justify-between">
                    <span className="font-bold text-white text-sm">Net Monthly Saving</span>
                    <span className={`font-bold text-sm ${savings.monthlySaving > 0 ? "text-amber-300":"text-red-400"}`}>{savings.monthlySaving > 0 ? "+":""}{fmtR(savings.monthlySaving)}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-3 pt-3 border-t border-amber-900/20">
                    ⚠️ GCC R{fmt(tariff?.gccFixed)}/mo + Network R{fmt(tariff?.networkFixed)}/mo fixed charges are <em>not avoided</em> by wheeling.
                  </p>
                </div>
              )}

              <button onClick={() => goTo("form")}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 text-sm">
                <Shield size={16} />
                Lock In My Score — Get Full Site Audit
                <ChevronRight size={16} />
              </button>
              <button onClick={() => goTo("data")} className="w-full text-center text-xs text-stone-600 hover:text-stone-400 mt-3 transition-colors">← Adjust my inputs</button>
            </div>
          )}

          {/* ════════════════════════════════════════
              FORM — LEAD CAPTURE
          ════════════════════════════════════════ */}
          {step === "form" && (
            <div className="p-6 fade-up">

              {/* Discount Banner */}
              <div className="bg-gradient-to-r from-amber-500/25 to-yellow-600/15 border border-amber-400/50 rounded-2xl p-4 mb-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full -translate-y-4 translate-x-4" />
                <div className="flex items-start gap-3">
                  <div className="bg-amber-400/20 rounded-xl p-2 shrink-0"><Tag size={16} className="text-amber-300" /></div>
                  <div>
                    <p className="text-amber-300 font-bold text-sm" style={{ fontFamily:"Syne" }}>🎁 You've Unlocked a {DISCOUNT_CENTS}c/kWh Discount</p>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">By completing this Mini-Audit, Apollo Africa will apply a <strong className="text-amber-300">{DISCOUNT_CENTS}c/kWh reduction</strong> on your electricity audit analysis rate. Submit below to lock it in — survey completions only.</p>
                    <div className="mt-1.5 flex items-center gap-1">
                      {[0,1,2].map(i => <Star key={i} size={9} className="text-amber-400 fill-amber-400" />)}
                      <span className="text-xs text-amber-400 font-medium ml-1">Mini-Audit Completion Reward</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score badge carry-over */}
              {scorecard && (
                <div className="flex items-center justify-between bg-[#0a2520]/60 border border-amber-900/25 rounded-xl px-4 py-3 mb-5">
                  <span className="text-xs text-stone-400">Your Feasibility Score</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black ${scorecard.gradeColor}`} style={{ fontFamily:"Syne" }}>{scorecard.grade}</span>
                    <span className="text-sm font-bold text-white">{scorecard.overall}/100</span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-amber-400 font-medium uppercase tracking-widest mb-1">Free Full Audit</p>
                <h2 className="text-lg font-bold" style={{ fontFamily:"Syne" }}>Lock In Your Savings</h2>
                <p className="text-sm text-stone-400 mt-1">Our energy consultants will verify grid capacity and provide a binding PPA offer within 5 business days.</p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-3">
                {[
                  { name:"name",    placeholder:"Your Full Name",          icon:User,      type:"text"  },
                  { name:"company", placeholder:"Company / Entity Name",   icon:Building2, type:"text"  },
                  { name:"email",   placeholder:"Business Email Address",  icon:Mail,      type:"email" },
                  { name:"phone",   placeholder:"Contact Number",          icon:Phone,     type:"tel"   },
                ].map(({ name, placeholder, icon:Icon, type }) => (
                  <div key={name} className="relative">
                    <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input required type={type} placeholder={placeholder} value={form[name]}
                      onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                      className="w-full bg-[#0d2e29] border border-amber-900/40 text-white placeholder-stone-600 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
                  </div>
                ))}

                {/* Municipality badge if municipal flow */}
                {isMunicipal && municipality && (
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                    <input readOnly value={municipality} className="w-full bg-amber-900/10 border border-amber-400/20 text-amber-300 rounded-xl py-3 pl-10 pr-4 text-sm cursor-default" />
                  </div>
                )}

                {/* Substation pinpoint */}
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-3.5 text-amber-400" />
                  <input type="text" placeholder="Nearest Substation Name or Town (e.g. Eskom Rooiwal, Middelburg)"
                    value={form.substation} onChange={e => setForm(f => ({ ...f, substation: e.target.value }))}
                    className="w-full bg-amber-900/15 border border-amber-400/25 text-white placeholder-amber-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
                </div>
                <p className="text-xs text-stone-600 flex items-center gap-1.5 -mt-1"><Info size={9} />Grid capacity & transmission zone verified against your substation.</p>

                {/* Account upload */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-stone-300 flex items-center gap-1.5"><Upload size={12} className="text-amber-400" />Upload Electricity Accounts</label>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${uploadedFiles.length >= 3 ? "bg-green-500/20 text-green-400":"bg-amber-500/10 text-amber-400"}`}>{uploadedFiles.length}/3 min</span>
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-xl py-5 px-4 flex flex-col items-center gap-2 transition-all ${uploadedFiles.length >= 3 ? "border-green-500/40 bg-green-500/5":"border-amber-500/30 bg-amber-500/5 hover:border-amber-400/60 hover:bg-amber-500/10"}`}>
                    <Upload size={18} className={uploadedFiles.length >= 3 ? "text-green-400":"text-amber-400"} />
                    <span className="text-sm font-medium text-stone-300">{uploadedFiles.length === 0 ? "Tap to upload accounts":"Add more accounts"}</span>
                    <span className="text-xs text-stone-500 text-center">Upload your <strong className="text-stone-400">latest 3 months</strong> of electricity statements. PDF, JPG or PNG.</span>
                  </button>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-[#0a2520]/80 border border-amber-900/25 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0"><CheckCircle2 size={12} className="text-green-400 shrink-0" /><span className="text-xs text-stone-300 truncate">{file.name}</span></div>
                          <button type="button" onClick={() => removeFile(idx)} className="text-stone-600 hover:text-stone-400 ml-2 shrink-0"><X size={12} /></button>
                        </div>
                      ))}
                      {uploadedFiles.length < 3 && (
                        <p className="text-xs text-amber-400 flex items-center gap-1.5 pt-1"><AlertCircle size={9} />{3 - uploadedFiles.length} more month{3-uploadedFiles.length>1?"s":""} needed for a complete analysis</p>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 text-sm mt-1">
                  <Zap size={16} />
                  Submit — Get My Full Audit Report
                </button>
                <p className="text-xs text-stone-600 text-center">No commitment. Apollo Africa will contact you within 1–2 business days.</p>
              </form>
            </div>
          )}

          {/* ════════════════════════════════════════
              DONE — SUCCESS
          ════════════════════════════════════════ */}
          {step === "done" && (
            <div className="p-8 text-center fade-up">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-400/15 rounded-full mb-4 pulse-gold">
                <CheckCircle2 size={36} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily:"Syne" }}>Audit Submitted!</h2>
              <p className="text-stone-400 text-sm max-w-xs mx-auto mb-4">Your feasibility scorecard and site data have been received. Expect a call from our energy team within <strong className="text-white">1–2 business days</strong>.</p>

              {scorecard && (
                <div className={`inline-flex items-center gap-3 rounded-2xl border px-5 py-3 mb-4 ${scorecard.gradeBg}`}>
                  <span className={`text-3xl font-black ${scorecard.gradeColor}`} style={{ fontFamily:"Syne" }}>{scorecard.grade}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{scorecard.overall}/100 Feasibility Score</div>
                    <div className="text-xs text-stone-400">Logged with your audit request</div>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/35 rounded-xl px-4 py-2.5 text-xs text-amber-300">
                  <Tag size={11} /><span><strong>{DISCOUNT_CENTS}c/kWh survey discount</strong> applied to your audit</span>
                </div>
                {form.substation && (
                  <div className="inline-flex items-center gap-2 bg-[#0a2520] border border-amber-900/30 rounded-full px-4 py-2 text-xs text-stone-400">
                    <MapPin size={11} />Substation: {form.substation}
                  </div>
                )}
                {uploadedFiles.length > 0 && (
                  <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-full px-4 py-2 text-xs text-green-400">
                    <CheckCircle2 size={11} />{uploadedFiles.length} account{uploadedFiles.length>1?"s":""} uploaded
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── TRUST SIGNALS ── */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[
            { icon:Shield, label:"NERSA Compliant", sub:"Licensed IPP" },
            { icon:Wind,   label:"Clean Energy",    sub:"Zero-carbon supply" },
            { icon:Zap,    label:"Grid Connected",  sub:"No backup risk" },
          ].map(({ icon:Icon, label, sub }) => (
            <div key={label} className="bg-[#081e1a]/80 border border-amber-900/25 rounded-2xl p-3">
              <Icon size={14} className="text-amber-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-white">{label}</div>
              <div className="text-xs text-stone-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-stone-700 mt-4 px-4">
          Indicative calculations only. Based on 2025/26 Eskom tariffs (NERSA 11 March 2025). Actual savings depend on NMD, TOU profile, transmission zone and final PPA terms. Apollo Africa does not guarantee specific outcomes.
        </p>
      </div>
    </div>
  );
}
