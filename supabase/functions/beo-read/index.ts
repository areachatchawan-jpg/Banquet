// Supabase Edge Function : beo-read
// อ่านใบ BEO จากรูปด้วย Claude แล้วส่งกลับเป็น JSON
// คีย์ Anthropic อยู่ฝั่งเซิร์ฟเวอร์ ไม่หลุดออกหน้าเว็บ
//
// ติดตั้ง (ทำครั้งเดียว):
//   1) Supabase -> Edge Functions -> Deploy a new function -> ชื่อ beo-read
//      วางโค้ดไฟล์นี้ลงไป
//   2) Edge Functions -> Secrets -> เพิ่ม ANTHROPIC_API_KEY = sk-ant-...
//   3) คัดลอก URL ของฟังก์ชันไปใส่ beoFunctionUrl ใน config.js

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) throw new Error("ยังไม่ได้ตั้ง ANTHROPIC_API_KEY ใน Secrets");

    const form = await req.formData();
    const prompt = String(form.get("prompt") || "");
    const content: unknown[] = [];

    for (const [k, v] of form.entries()) {
      if (!k.startsWith("image") || !(v instanceof File)) continue;
      const buf = new Uint8Array(await v.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      content.push({
        type: "image",
        source: { type: "base64", media_type: v.type || "image/jpeg", data: btoa(bin) },
      });
    }
    content.push({ type: "text", text: prompt });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content }],
      }),
    });

    if (!r.ok) throw new Error("Anthropic error " + r.status + ": " + (await r.text()).slice(0, 300));

    const data = await r.json();
    const text = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");

    // ดึงเฉพาะส่วน JSON
    let json = text.trim();
    const fence = json.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) json = fence[1].trim();
    else {
      const a = json.indexOf("{"), b = json.lastIndexOf("}");
      if (a >= 0 && b > a) json = json.slice(a, b + 1);
    }

    return new Response(json, { headers: { ...CORS, "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e && (e as Error).message || e) }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }
});
