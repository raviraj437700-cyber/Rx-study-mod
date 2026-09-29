import { NextResponse } from "next/server";
export const maxDuration = 60;

const L = { Hindi: "Hindi (Devanagari script)", English: "English", Hinglish: "Hinglish (Hindi written in Roman script)" };
const bad = (m) => NextResponse.json({ error: m }, { status: 400 });

export async function POST(req) {
  try {
    const b = await req.json();
    const parts = [];
    let prompt;

    if (b.type === "flashcards" || b.type === "quiz") {
      if (!b.text || b.text.length < 50) return bad("Could not read enough text from the PDF.");
      const n = Number(b.count);
      if (!(n >= 5 && n <= 80)) return bad("Invalid number.");
      const lang = L[b.language];
      if (!lang) return bad("Please choose a language.");
      const src = `SOURCE TEXT:\n${String(b.text).slice(0, 45000)}`;
      prompt = b.type === "flashcards"
        ? `Make exactly ${n} study flashcards strictly from the source text. Language: ${lang}. Return JSON: {"cards":[{"q":"question or term","a":"short clear answer"}]}\n\n${src}`
        : `Make exactly ${n} MCQs strictly from the source text. Language: ${lang}. Each has exactly 4 plausible, topic-related options and exactly one correct option. Spread correct answers across positions. Return JSON: {"questions":[{"q":"","options":["","","",""],"answer":0}]} where answer is the 0-based index of the correct option.\n\n${src}`;
    } else if (b.type === "doubt") {
      if (!b.image) return bad("Please upload a question image.");
      const lang = L[b.language];
      if (!lang || !b.subject) return bad("Please choose subject and language.");
      parts.push({ inline_data: { mime_type: "image/jpeg", data: b.image } });
      prompt = `You are a friendly teacher. Solve the question in the image (subject: ${b.subject}). Language: ${lang}. Explain simply, do not only give the final answer. Return JSON: {"question":"the question written out","understanding":"what is being asked","steps":["step 1","step 2"],"explanation":"why this works","answer":"final answer"}`;
    } else if (b.type === "notes") {
      const cls = Number(b.cls);
      if (!b.topic || !b.subject || !(cls >= 6 && cls <= 12) || !b.board || !["Short Notes", "Long Notes"].includes(b.kind)) return bad("Please fill all fields.");
      prompt = `Write ${b.kind} for Class ${cls}, subject ${b.subject}, board ${b.board}, topic "${b.topic}". English. ${b.kind === "Short Notes" ? "Keep it concise (about one page)." : "Make it detailed (3-4 pages)."} Use sections for: Definitions, Key points, Examples, Formulas (only if relevant), Exam-important points. Return JSON: {"title":"","sections":[{"heading":"","points":["",""]}]}`;
    } else return bad("Unknown request.");

    const key = process.env.GEMINI_API_KEY;
    if (!key) return NextResponse.json({ error: "Server API key is missing." }, { status: 500 });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, ...parts] }], generationConfig: { responseMimeType: "application/json", maxOutputTokens: 16000 } }),
    });
    if (!r.ok) return NextResponse.json({ error: "AI is busy or the free limit is reached. Please try again in a minute." }, { status: 502 });
    const j = await r.json();
    return NextResponse.json(JSON.parse(j.candidates[0].content.parts[0].text));
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
    }
