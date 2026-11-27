#!/bin/sh
# encode-anim.sh <slide-id> [version] : Firefly clip -> animated WebP images that play like the video
# on every browser (no autoplay rules, no Low Power Mode block). A 10 s forward-and-back loop at
# 12 fps, in two sizes: web/public/video/hero/<id>-1280.webp (laptop/desktop) and <id>-768.webp (phone).
set -e
cd /d/IN2ITEBS-Website-deployment
FF=web/node_modules/ffmpeg-static/ffmpeg.exe
IN=assets/firefly/hero-video/ff-hero-$1-${2:-v1}.mp4
OUT=web/public/video/hero/$1
for W in 1280 768; do
  Q=55; [ "$W" = 768 ] && Q=58
  $FF -v error -y -i "$IN" -filter_complex "[0:v]fps=12,scale=$W:-2:flags=lanczos,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0" \
    -c:v libwebp_anim -quality $Q -compression_level 6 -loop 0 "$OUT-$W.webp"
done
ls -la "$OUT"-1280.webp "$OUT"-768.webp
