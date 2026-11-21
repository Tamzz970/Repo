#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/proyek-video/my-video
echo "=== CEK PROYEK PRIA KAPAK ==="
ls -lh src/index.ts src/Root.tsx src/Babak1.tsx
wc -l src/Babak1.tsx
grep -n "AKTIFKAN_AUDIO_NASKAH" src/Babak1.tsx || true
if [ -f public/naskah.mp3 ]; then
  echo "Audio: public/naskah.mp3 tersedia"
  ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public/naskah.mp3
else
  echo "Audio: public/naskah.mp3 belum ada"
fi
node -v
ffmpeg -version | head -n 1
