const t = (x) => +x.toFixed(1);

export function makePlan({ days, hours, subjects }) {
  const q = [];
  const max = Math.max(...subjects.map((s) => s.chapters.length));
  for (let i = 0; i < max; i++) subjects.forEach((s) => s.chapters[i] && q.push({ s: s.name, c: s.chapters[i] }));
  const rev = days >= 4 ? Math.max(1, Math.round(days * 0.2)) : 0;
  const study = days - rev, out = [];
  let idx = 0;
  for (let d = 1; d <= study; d++) {
    const take = Math.round((q.length * d) / study) - idx;
    const items = q.slice(idx, idx + take); idx += take;
    out.push({
      day: d, kind: "study", items,
      study: t(hours * 0.6), practice: t(hours * 0.25), revision: t(hours * 0.15),
      note: !items.length ? "Practice questions from earlier chapters" : d % 7 === 0 ? "Light day: revise this week's chapters. Take a 10 min break every 50 min." : "Take a 10 min break every 50 min.",
    });
  }
  for (let r = 0; r < rev; r++) {
    const last = r === rev - 1;
    const s = subjects[r % subjects.length].name;
    out.push({
      day: study + r + 1, kind: last ? "final" : "revision",
      items: [{ s: last ? "All subjects" : s, c: last ? "Final revision + full mock test" : "Quick revision of all chapters" }],
      study: t(hours * 0.3), practice: t(hours * 0.5), revision: t(hours * 0.2),
      note: last ? "Sleep well. Do not start anything new today." : "Solve previous questions and note weak topics.",
    });
  }
  return out;
}
