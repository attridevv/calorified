"use client";

import { useEffect, useState } from "react";
import { Utensils, Droplets, Weight, Flame, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    async function load() {
      try {
        const res = await fetch("/api/food?today=1");
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        if (!c) setData(json);
      } catch (e: any) {
        if (!c) setError(e.message);
      } finally {
        if (!c) setLoading(false);
      }
    }
    load();
    return () => { c = true; };
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
              <div className="h-3 w-16 bg-zinc-800 rounded mb-3" />
              <div className="h-8 w-20 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-6">Dashboard</h1>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-xs text-zinc-400 hover:text-zinc-200 underline">Retry</button>
        </div>
      </div>
    );
  }

  const { summary, profile, entries, water } = data || {};
  const calPercent = profile?.calorieTarget ? Math.min(100, Math.round((summary?.calories || 0) / profile.calorieTarget * 100)) : 0;
  const waterPercent = profile?.waterTarget ? Math.min(100, Math.round((water?.totalMl || 0) / profile.waterTarget * 100)) : 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-500 mt-1 text-sm">Today at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2"><Flame className="h-3 w-3 text-amber-400" /> Calories</div>
          <div className="text-2xl font-bold text-zinc-100">{Math.round(summary?.calories || 0)}</div>
          <div className="text-xs text-zinc-500 mt-1">of {profile?.calorieTarget || "--"} kcal</div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${calPercent}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2"><Droplets className="h-3 w-3 text-blue-400" /> Water</div>
          <div className="text-2xl font-bold text-zinc-100">{water?.totalMl || 0} ml</div>
          <div className="text-xs text-zinc-500 mt-1">of {profile?.waterTarget || "--"} ml</div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${waterPercent}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2"><Utensils className="h-3 w-3 text-emerald-400" /> Protein</div>
          <div className="text-2xl font-bold text-zinc-100">{Math.round(summary?.protein || 0)}g</div>
          <div className="text-xs text-zinc-500 mt-1">of {profile?.proteinTarget || "--"}g</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2"><Weight className="h-3 w-3 text-purple-400" /> Entries</div>
          <div className="text-2xl font-bold text-zinc-100">{entries?.length || 0}</div>
          <div className="text-xs text-zinc-500 mt-1">foods logged today</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Carbs</h3>
          <div className="text-2xl font-bold text-zinc-100">{Math.round(summary?.carbs || 0)}g</div>
          <div className="text-xs text-zinc-500">of {profile?.carbsTarget || "--"}g</div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${profile?.carbsTarget ? Math.min(100, Math.round((summary?.carbs || 0) / profile.carbsTarget * 100)) : 0}%` }} />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Fat</h3>
          <div className="text-2xl font-bold text-zinc-100">{Math.round(summary?.fat || 0)}g</div>
          <div className="text-xs text-zinc-500">of {profile?.fatTarget || "--"}g</div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${profile?.fatTarget ? Math.min(100, Math.round((summary?.fat || 0) / profile.fatTarget * 100)) : 0}%` }} />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Fiber</h3>
          <div className="text-2xl font-bold text-zinc-100">{Math.round(summary?.fiber || 0)}g</div>
          <div className="text-xs text-zinc-500">daily intake</div>
        </div>
      </div>

      {entries?.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Today&rsquo;s Log</h3>
          <div className="space-y-2">
            {entries.map((e: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0 text-sm">
                <div>
                  <span className="text-zinc-100">{e.name}</span>
                  <span className="text-zinc-500 ml-2 text-xs capitalize">({e.mealType})</span>
                </div>
                <span className="text-amber-400 font-medium">{Math.round(e.calories || 0)} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
