const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600" };

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url") || "";

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return new Response(JSON.stringify({ cover: "" }), { status: 400, headers: jsonHeaders });
  }

  const youtubeId = target.href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/)?.[1];
  if (youtubeId) {
    return new Response(JSON.stringify({ cover: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` }), { headers: jsonHeaders });
  }

  if (target.hostname === "bilibili.com" || target.hostname.endsWith(".bilibili.com") || target.hostname === "b23.tv") {
    let bvid = target.href.match(/BV[\w]+/i)?.[0];
    if (!bvid && target.hostname === "b23.tv") {
      try {
        const resolved = await fetch(target.href, { redirect: "follow" });
        bvid = resolved.url.match(/BV[\w]+/i)?.[0];
      } catch { /* Use the designed fallback cover. */ }
    }
    if (bvid) {
      try {
        const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`, {
          headers: { "user-agent": "Mozilla/5.0" },
        });
        const payload = await response.json() as { data?: { pic?: string } };
        const cover = payload.data?.pic?.replace(/^http:/, "https:") || "";
        return new Response(JSON.stringify({ cover }), { headers: jsonHeaders });
      } catch { /* Use the designed fallback cover. */ }
    }
  }

  return new Response(JSON.stringify({ cover: "" }), { headers: jsonHeaders });
}
