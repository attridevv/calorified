"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";

export default function CoachPage() {
  const [profile, setProfile] = useState<any>({});
  const [form, setForm] = useState({ age: 25, sex: "male", height: 175, weight: 75, activityLevel: "moderate", calorieTarget: 2500, proteinTarget: 150, carbsTarget: 250, fatTarget: 70, waterTarget: 2500 });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(p => {
      if (p) setForm(f => ({ ...f, calorieTarget: p.calorieTarget || 2500, proteinTarget: p.proteinTarget || 150, carbsTarget: p.carbsTarget || 250, fatTarget: p.fatTarget || 70, waterTarget: p.waterTarget || 2500 }));
    });
  }, []);

  const calculateTDEE = () => {
    const { sex, weight, height, age, activityLevel } = form;
    const bmr = sex === "male" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    return Math.round(bmr * (multipliers[activityLevel] || 1.55));
  };

  const saveProfile = async () => {
    const res = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) setMsg("Profile saved");
    setTimeout(() => setMsg(null), 2000);
  };

  const tdee = calculateTDEE();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-zinc-100">Coach</h1>
      <p className="text-zinc-500 text-sm">Setup your targets & get nutrition guidance</p>

      {msg && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{msg}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-zinc-300">TDEE Calculator</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="text-xs text-zinc-400 block mb-1">Age</label><input type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Sex</label><select value={form.sex} onChange={e => setForm(p => ({ ...p, sex: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2"><option value="male">Male</option><option value="female">Female</option></select></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Height (cm)</label><input type="number" value={form.height} onChange={e => setForm(p => ({ ...p, height: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Weight (kg)</label><input type="number" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          </div>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Activity Level</label>
            <select value={form.activityLevel} onChange={e => setForm(p => ({ ...p, activityLevel: e.target.value }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2">
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="very_active">Very Active (intense daily)</option>
            </select>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-amber-400">{tdee}</div>
            <div className="text-xs text-amber-500/70 mt-1">Estimated TDEE (kcal/day)</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-medium text-zinc-300">Daily Targets</h3>
          <div><label className="text-xs text-zinc-400 block mb-1">Calorie Goal (kcal)</label><input type="number" value={form.calorieTarget} onChange={e => setForm(p => ({ ...p, calorieTarget: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          <div><label className="text-xs text-zinc-400 block mb-1">Protein (g)</label><input type="number" value={form.proteinTarget} onChange={e => setForm(p => ({ ...p, proteinTarget: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          <div><label className="text-xs text-zinc-400 block mb-1">Carbs (g)</label><input type="number" value={form.carbsTarget} onChange={e => setForm(p => ({ ...p, carbsTarget: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          <div><label className="text-xs text-zinc-400 block mb-1">Fat (g)</label><input type="number" value={form.fatTarget} onChange={e => setForm(p => ({ ...p, fatTarget: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          <div><label className="text-xs text-zinc-400 block mb-1">Water (ml)</label><input type="number" value={form.waterTarget} onChange={e => setForm(p => ({ ...p, waterTarget: parseInt(e.target.value) || 0 }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm px-3 py-2" /></div>
          <button onClick={saveProfile} className="w-full py-2.5 rounded-lg bg-amber-500 text-zinc-900 font-bold text-sm hover:bg-amber-400">Save Targets</button>
        </div>
      </div>
    </div>
  );
}
