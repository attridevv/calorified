"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function LogPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    mealType: "snack",
    name: "",
    serving: 1,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    notes: "",
  });

  useEffect(() => {
    fetch("/api/food?today=1").then(r => r.json()).then(d => setEntries(d.entries || []));
  }, []);

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/food", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        setEntries(prev => [data, ...prev]);
        setShowForm(false);
        setForm(p => ({ ...p, name: "", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, notes: "" }));
        setMsg("Food logged");
        setTimeout(() => setMsg(null), 2000);
      } else {
        setMsg(data.error || "Failed");
      }
    } catch {
      setMsg("Network error");
    }
    setLoading(false);
  };

  const deleteEntry = async (id: string) => {
    await fetch(`/api/food?id=${id}`, { method: "DELETE" });
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const update = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Log Food</h1>
          <p className="text-zinc-500 mt-1 text-sm">Add & manage meals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-amber-500 text-zinc-900 font-bold text-sm hover:bg-amber-400 transition-colors">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Food"}
        </button>
      </div>

      {msg && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{msg}</div>}

      {showForm && (
        <form onSubmit={addEntry} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Meal Type</label>
              <select value={form.mealType} onChange={e => update("mealType", e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2">
                {MEAL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-zinc-400 block mb-1">Food Name</label>
              <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Chicken breast, rice..." required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Servings</label>
              <input type="number" step="0.5" value={form.serving} onChange={e => update("serving", parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" />
            </div>
            <div><label className="text-xs text-zinc-400 block mb-1">Calories</label><input type="number" value={form.calories} onChange={e => update("calories", parseInt(e.target.value) || 0)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Protein (g)</label><input type="number" value={form.protein} onChange={e => update("protein", parseInt(e.target.value) || 0)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Carbs (g)</label><input type="number" value={form.carbs} onChange={e => update("carbs", parseInt(e.target.value) || 0)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Fat (g)</label><input type="number" value={form.fat} onChange={e => update("fat", parseInt(e.target.value) || 0)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Fiber (g)</label><input type="number" value={form.fiber} onChange={e => update("fiber", parseInt(e.target.value) || 0)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-amber-500 text-zinc-900 font-bold text-sm hover:bg-amber-400 disabled:opacity-50">
            {loading ? "Saving..." : "Log Food"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {entries.length === 0 && !showForm && (
          <div className="text-center py-12 text-zinc-600">No foods logged today. Add your first meal.</div>
        )}
        {entries.map((e: any, i: number) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-100 font-medium">{e.name}</span>
                <span className="text-[10px] text-zinc-500 uppercase bg-zinc-800 px-2 py-0.5 rounded">{e.mealType}</span>
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                P: {Math.round(e.protein || 0)}g · C: {Math.round(e.carbs || 0)}g · F: {Math.round(e.fat || 0)}g · Fiber: {Math.round(e.fiber || 0)}g
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">{Math.round(e.calories || 0)} kcal</span>
              <button onClick={() => deleteEntry(e.id)} className="text-red-400 hover:text-red-300 text-lg">&times;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
