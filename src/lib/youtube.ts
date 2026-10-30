export const YOUTUBE_CHANNEL_ID = "UC5Od8j7DxMtUqbc68WBflQg";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@VermontAvenueRecords";

export type Video = {
  id: string;
  title: string;
  artist: string;
  published: string;
  thumbnail: string;
};

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function getVideos(limit = 12): Promise<Video[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)).map((m) => m[1]);

    return entries
      .slice(0, limit)
      .map((entry) => {
        const id = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(entry)?.[1] ?? "";
        const rawTitle = decode(/<title>([^<]*)<\/title>/.exec(entry)?.[1] ?? "");
        const published = /<published>([^<]+)<\/published>/.exec(entry)?.[1] ?? "";
        const split = rawTitle.lastIndexOf(" - ");
        const title = split > -1 ? rawTitle.slice(0, split) : rawTitle;
        const artist = split > -1 ? rawTitle.slice(split + 3) : "Vermont Avenue Records";
        return {
          id,
          title,
          artist,
          published,
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      })
      .filter((video) => video.id);
  } catch {
    return [];
  }
}
