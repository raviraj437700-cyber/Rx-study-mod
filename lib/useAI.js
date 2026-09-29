"use client";
import { useState } from "react";

export async function ai(type, payload) {
  const r = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, ...payload }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Something went wrong. Please try again.");
  return d;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const run = async (fn) => {
    setLoading(true); setError("");
    try { return await fn(); }
    catch (e) { setError(e.message || "Something went wrong. Please try again."); return null; }
    finally { setLoading(false); }
  };
  return { loading, error, setError, run };
}
