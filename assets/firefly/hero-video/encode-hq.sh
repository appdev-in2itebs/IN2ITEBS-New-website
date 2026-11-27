#!/bin/sh
# encode-hq.sh <slide-id> [version] : sharp hero video, a 10 s forward-and-back loop.
#   web/public/video/hero/<id>-1920.{webm,mp4}  laptop / desktop (Full HD)
#   web/public/video/hero/<id>-1080.{webm,mp4}  phone
# WebM (VP9) for Chrome, Edge, Firefox, Android; MP4 (H.264) for Safari and iPhone.
set -e
cd /d/IN2ITEBS-Website-deployment
FF=web/node_modules/ffmpeg-static/ffmpeg.exe
IN=assets/firefly/hero-video/ff-hero-$1-${2:-v1}.mp4
OUT=web/public/video/hero/$1
for W in 1920 1080; do
  CRF264=23; CRFVP9=31; [ "$W" = 1080 ] && CRF264=24 && CRFVP9=33
  $FF -v error -y -i "$IN" -filter_complex "[0:v]scale=$W:-2:flags=lanczos,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]" \
    -map "[v]" -an -c:v libx264 -preset slow -crf $CRF264 -tune film -profile:v high -movflags +faststart "$OUT-$W.mp4"
  $FF -v error -y -i "$OUT-$W.mp4" -c:v libvpx-vp9 -b:v 0 -crf $CRFVP9 -row-mt 1 -deadline good -cpu-used 2 -an "$OUT-$W.webm"
done
ls -la "$OUT"-1920.* "$OUT"-1080.*
