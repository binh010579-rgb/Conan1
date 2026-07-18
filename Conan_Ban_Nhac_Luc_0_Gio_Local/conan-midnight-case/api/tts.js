const { randomUUID } = require("node:crypto");
const { readFile, unlink } = require("node:fs/promises");
const path = require("node:path");
const { EdgeTTS } = require("node-edge-tts");

const VOICE_PROFILES = {
  narrator: { voice: "vi-VN-NamMinhNeural", rate: "-6%", pitch: "-3%" },
  conan: { voice: "vi-VN-NamMinhNeural", rate: "+7%", pitch: "+12%" },
  kogoro: { voice: "vi-VN-NamMinhNeural", rate: "-2%", pitch: "-9%" },
  megure: { voice: "vi-VN-NamMinhNeural", rate: "-5%", pitch: "-10%" },
  haru: { voice: "vi-VN-NamMinhNeural", rate: "+1%", pitch: "-3%" },
  yuto: { voice: "vi-VN-NamMinhNeural", rate: "-3%", pitch: "-6%" },
  ran: { voice: "vi-VN-HoaiMyNeural", rate: "+2%", pitch: "+5%" },
  rina: { voice: "vi-VN-HoaiMyNeural", rate: "+1%", pitch: "+4%" },
  misaki: { voice: "vi-VN-HoaiMyNeural", rate: "-3%", pitch: "+1%" },
};

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const text = String(request.query.text || "").trim();
  const profile = VOICE_PROFILES[String(request.query.who || "narrator")] || VOICE_PROFILES.narrator;
  if (!text || text.length > 420) return response.status(400).json({ error: "Invalid dialogue text" });

  const fileId = randomUUID();
  const audioPath = path.join("/tmp", `${fileId}.mp3`);
  const subtitlePath = `${audioPath}.json`;
  const tts = new EdgeTTS({
    voice: profile.voice,
    lang: "vi-VN",
    outputFormat: "audio-24khz-48kbitrate-mono-mp3",
    saveSubtitles: true,
    rate: profile.rate,
    pitch: profile.pitch,
    volume: "+0%",
    timeout: 18000,
  });

  try {
    await tts.ttsPromise(text, audioPath);
    const [audio, subtitleJson] = await Promise.all([
      readFile(audioPath),
      readFile(subtitlePath, "utf8"),
    ]);
    const timings = JSON.parse(subtitleJson);
    if (audio.length < 800) throw new Error("TTS returned an empty audio file");

    response.setHeader("Cache-Control", "public, s-maxage=31536000, stale-while-revalidate=86400");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    return response.status(200).json({
      audio: audio.toString("base64"),
      mime: "audio/mpeg",
      timings,
      voice: profile.voice,
    });
  } catch (error) {
    console.error("Vietnamese TTS failed", error);
    return response.status(502).json({ error: "Vietnamese voice is temporarily unavailable" });
  } finally {
    await Promise.allSettled([unlink(audioPath), unlink(subtitlePath)]);
  }
};
