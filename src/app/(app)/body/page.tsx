"use client";

import { useEffect, useState } from "react";
import { Weight, TrendingUp, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BodyPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [form, setForm] = useState({ weight: 75, bodyFat: 15, waistCm: 0, notes: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/body").then(r => r.json()).then(setStats);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/body", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const data = await res.json();
      setStats(prev => [data, ...prev]);
      setMsg("Saved");
      setTimeout(() => setMsg(null), 2000);
    }
    setLoading(false);
  };

  const chartData = [...stats].reverse().map((s, i) => ({
    day: i + 1,
    weight: s.weight,
    bf: s.bodyFat,
  }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div><h1 className="text-3xl font-bold text-zinc-100">Body Stats</h1><p className="text-zinc-500 mt-1 text-sm">Track weight & measurements</p></div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Current Weight</div>
          <div className="text-3xl font-bold text-zinc-100">{stats[0]?.weight || "--"} <span className="text-lg text-zinc-500">kg</span></div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Body Fat</div>
          <div className="text-3xl font-bold text-zinc-100">{stats[0]?.bodyFat || "--"}%</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Entries</div>
          <div className="text-3xl font-bold text-zinc-100">{stats.length}</div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#52525b" fontSize={11} />
              <YAxis stroke="#52525b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 8 }} />
              <Line type="monotone" dataKey="weight" stroke="#fbbf24" strokeWidth={2} name="Weight (kg)" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {msg && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{msg}</div>}

      <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-medium text-zinc-300">Log Today</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div><label className="text-xs text-zinc-400 block mb-1">Weight (kg)</label><input type="number" step="0.1" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          <div><label className="text-xs text-zinc-400 block mb-1">Body Fat %</label><input type="number" step="0.1" value={form.bodyFat} onChange={e => setForm(p => ({ ...p, bodyFat: parseFloat(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          <div><label className="text-xs text-zinc-400 block mb-1">Waist (cm)</label><input type="number" step="0.1" value={form.waistCm} onChange={e => setForm(p => ({ ...p, waistCm: parseFloat(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-amber-500 text-zinc-900 font-bold text-sm hover:bg-amber-400 disabled:opacity-50">{loading ? "Saving..." : "Log Stats"}</button>
      </form>

      <div className="space-y-2">
        {stats.slice(0, 10).map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="text-zinc-100 font-medium">{s.weight} kg · {s.bodyFat}% BF</div>
              <div className="text-xs text-zinc-500">{new Date(s.date).toLocaleDateString()}</div>
            </div>
            {s.waistCm > 0 && <span className="text-xs text-zinc-400">{s.waistCm} cm waist</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
