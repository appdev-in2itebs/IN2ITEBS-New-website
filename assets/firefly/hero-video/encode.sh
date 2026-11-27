#!/bin/sh
# encode.sh <slide-id> [version, default v1] : turns assets/firefly/hero-video/ff-hero-<id>-v1.mp4 (Firefly Video, 1080p, 5 s)
# into web/public/video/hero/<id>.{mp4,webm,jpg}: a 10-second forward-and-back loop at 1600 px.
set -e
cd /d/IN2ITEBS-Website-deployment
FF=web/node_modules/ffmpeg-static/ffmpeg.exe
IN=assets/firefly/hero-video/ff-hero-$1-${2:-v1}.mp4
OUT=web/public/video/hero/$1
$FF -v error -y -i "$IN" -filter_complex "[0:v]scale=1600:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]" -map "[v]" -an -c:v libx264 -preset slow -crf 27 -movflags +faststart "$OUT.mp4"
$FF -v error -y -i "$OUT.mp4" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 -an "$OUT.webm"
$FF -v error -y -ss 2.5 -i "$IN" -frames:v 1 -vf scale=1600:-2 -q:v 4 "$OUT.jpg"
ls -la "$OUT".*
