import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type SegmenNarasi = {
  mulaiFrame: number;
  selesaiFrame: number;
  fase: string;
  teks: string;
};

// Ubah ke true setelah file public/naskah.mp3 tersedia
const AKTIFKAN_AUDIO_NASKAH = true;

const SEGMEN_BABAK_1: SegmenNarasi[] = [
  { mulaiFrame: 0, selesaiFrame: 600, fase: "PEMBUKA", teks: "Kabut turun pelan, dan langkah beratnya memecah sunyi." },
  { mulaiFrame: 600, selesaiFrame: 1500, fase: "JANJI", teks: "Di tangannya, kapak ini bukan besi biasa—ini janji yang harus lunas." },
  { mulaiFrame: 1500, selesaiFrame: 3150, fase: "UJIAN", teks: "Tiap tebasan mengoyak sunyi dan menguji batas bertahannya." },
  { mulaiFrame: 3150, selesaiFrame: 4650, fase: "JEJAK", teks: "Dingin malam tertinggal di belakang, dan jejaknya tak pernah mundur." },
  { mulaiFrame: 4650, selesaiFrame: 5910, fase: "BABAK I", teks: "Babak pertama usai—dan badai Pria Kapak baru saja dimulai." },
];

export const Babak1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const panX = interpolate(frame, [0, durationInFrames], [-36, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoomBg = interpolate(frame, [0, durationInFrames], [1.04, 1.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const intensitasGerak = interpolate(
    frame,
    [0, 1500, 3150, 3900, durationInFrames],
    [0.75, 1.0, 1.4, 1.05, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const napasY = Math.sin((frame / fps) * Math.PI * 1.1) * 7 * intensitasGerak;
  const masukSpring = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const ayunanDasar =
    interpolate(masukSpring, [0, 1], [-18, 0]) +
    Math.sin((frame / fps) * Math.PI * 0.75) * 5.2 * intensitasGerak;

  const tebasanUjian = interpolate(
    Math.sin(((frame - 1500) / fps) * Math.PI * 1.2),
    [0.75, 1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const aktifUjian = frame >= 1500 && frame <= 3150 ? 1 : 0;
  const ayunanKapak = ayunanDasar - tebasanUjian * aktifUjian * 16;
  const slashOpacity = aktifUjian * tebasanUjian * 0.75;

  const kilatan = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.45),
    [0.82, 1],
    [0.16, 0.65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const segmenAktif =
    SEGMEN_BABAK_1.find((s) => frame >= s.mulaiFrame && frame < s.selesaiFrame) ??
    SEGMEN_BABAK_1[SEGMEN_BABAK_1.length - 1];

  const opacitasTeks = interpolate(
    frame,
    [segmenAktif.mulaiFrame, segmenAktif.mulaiFrame + 18, segmenAktif.selesaiFrame - 18, segmenAktif.selesaiFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const partikel = Array.from({ length: 18 }, (_, idx) => {
    const baseX = ((idx * 173 + 90) % (width - 120)) + 60;
    const speedY = (0.35 + (idx % 4) * 0.14) * intensitasGerak;
    const rawY = (((idx * 240 - frame * speedY) % (height + 200)) + (height + 200)) % (height + 200) - 100;
    const driftX = Math.sin((frame + idx * 25) * 0.03) * 18;
    const ukuran = 4 + (idx % 3) * 3;
    return { idx, x: baseX + driftX, y: rawY, ukuran };
  });

  const detikBerjalan = Math.floor(frame / fps);
  const menit = String(Math.floor(detikBerjalan / 60)).padStart(2, "0");
  const detik = String(detikBerjalan % 60).padStart(2, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1017", overflow: "hidden", fontFamily: "sans-serif", color: "#f5f7fa" }}>
      <div style={{ position: "absolute", inset: -60, transform: `translate3d(${panX * 0.35}px, 0px, 0px) scale(${zoomBg})`, background: "radial-gradient(circle at 50% 24%, #273248 0%, #131824 52%, #090b10 100%)" }} />
      <div style={{ position: "absolute", top: 230, left: "50%", width: 240, height: 240, borderRadius: "50%", backgroundColor: "#cbd5e1", opacity: 0.08 + kilatan * 0.06, transform: `translate(-50%, 0px) translate3d(${panX * 0.25}px, 0px, 0px)` }} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, transform: `translate3d(${panX * 0.65}px, 12px, 0px)` }}>
        <path d="M0 1180 L210 980 L430 1090 L690 870 L920 1030 L1080 920 L1080 1920 L0 1920 Z" fill="#161d2b" />
        <path d="M0 1310 L290 1120 L560 1240 L840 1040 L1080 1170 L1080 1920 L0 1920 Z" fill="#101520" />
      </svg>
      <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%, -50%) translate3d(${panX * 1.1}px, ${napasY}px, 0px)` }}>
        <svg width={680} height={980} viewBox="0 0 680 980" style={{ overflow: "visible" }}>
          <ellipse cx="350" cy="885" rx="190" ry="34" fill="#050609" opacity={0.85} />
          <path d="M235 420 L445 420 L495 855 L185 855 Z" fill="#1b2232" stroke="#07090e" strokeWidth="8" />
          <path d="M340 420 L445 420 L495 855 L340 855 Z" fill="#273248" />
          <circle cx="340" cy="315" r="74" fill="#242e42" stroke="#07090e" strokeWidth="8" />
          <path d="M268 300 C275 225, 405 225, 412 305 C385 280, 305 280, 268 300 Z" fill="#0d1017" />
          <path d="M395 255 C418 280, 418 345, 388 378" fill="none" stroke="#7aa2f7" strokeWidth="5" opacity={kilatan} />
          <path d="M445 185 C585 185, 655 275, 645 415 C615 315, 545 245, 445 225 Z" fill="#cbd5e1" opacity={slashOpacity} />
          <g transform={`rotate(${ayunanKapak} 430 520)`}>
            <rect x="418" y="235" width="22" height="470" rx="6" fill="#5c3d28" stroke="#07090e" strokeWidth="7" />
            <path d="M428 245 C495 215, 575 230, 615 305 C565 355, 495 365, 428 335 Z" fill="#9aa5ce" stroke="#07090e" strokeWidth="8" />
            <path d="M445 258 C500 236, 562 248, 594 302" fill="none" stroke="#e0e7ff" strokeWidth="6" opacity={0.85} />
          </g>
        </svg>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {partikel.map((p) => (
          <circle key={p.idx} cx={p.x} cy={p.y} r={p.ukuran} fill="#cbd5e1" opacity={0.28} />
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 50% 48%, transparent 56%, rgba(5, 6, 9, 0.62) 100%)" }} />
      <div style={{ position: "absolute", top: 64, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, letterSpacing: 1.5, opacity: 0.78 }}>
        <span style={{ fontWeight: 700 }}>PRIA KAPAK • {segmenAktif.fase}</span>
        <span>{menit}:{detik} ({frame}/{durationInFrames})</span>
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, bottom: 150, opacity: opacitasTeks, textAlign: "center" }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(9, 11, 16, 0.78)", border: "2px solid rgba(148, 163, 184, 0.35)", borderRadius: 16, padding: "22px 34px", fontSize: 38, lineHeight: 1.38, fontWeight: 600 }}>
          {segmenAktif.teks}
        </div>
      </div>
      {AKTIFKAN_AUDIO_NASKAH && <Audio src={staticFile("naskah.mp3")} />}
    </AbsoluteFill>
  );
};
