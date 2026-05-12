"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function WeeklyPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/food?days=7").then(r => r.json()).then(d => {
      const weekly = d.weekly || [];
      setData(weekly.map((w: any) => ({
        day: new Date(w.date).toLocaleDateString("en-US", { weekday: "short" }),
        calories: Math.round(w.calories || 0),
        protein: Math.round(w.protein || 0),
        carbs: Math.round(w.carbs || 0),
        fat: Math.round(w.fat || 0),
      })));
    });
  }, []);

  if (data.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-zinc-100">Weekly Trends</h1>
        <p className="text-zinc-500 mt-1 text-sm mb-6">Calorie & macro trends</p>
        <div className="text-center py-12 text-zinc-600">Log food for a few days to see trends.</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-zinc-100">Weekly Trends</h1>
      <p className="text-zinc-500 text-sm">Calorie & macro trends</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Daily Calories</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" stroke="#52525b" fontSize={11} />
            <YAxis stroke="#52525b" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 8 }} />
            <Bar dataKey="calories" fill="#fbbf24" radius={[6, 6, 0, 0]} name="Calories" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Macro Split</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" stroke="#52525b" fontSize={11} />
            <YAxis stroke="#52525b" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 8 }} />
            <Line type="monotone" dataKey="protein" stroke="#34d399" strokeWidth={2} dot={false} name="Protein" />
            <Line type="monotone" dataKey="carbs" stroke="#60a5fa" strokeWidth={2} dot={false} name="Carbs" />
            <Line type="monotone" dataKey="fat" stroke="#f87171" strokeWidth={2} dot={false} name="Fat" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
