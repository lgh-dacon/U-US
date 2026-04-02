#!/bin/bash
# 빌드된 index.html에 아이콘 폰트 @font-face를 주입

DIST_DIR="dist"
HTML_FILE="$DIST_DIR/index.html"

# dist에서 Ionicons ttf 경로 찾기
IONICONS_PATH=$(find "$DIST_DIR/assets" -name "Ionicons*.ttf" | head -1 | sed "s|$DIST_DIR/||")

if [ -z "$IONICONS_PATH" ]; then
  echo "Ionicons font not found!"
  exit 1
fi

echo "Found Ionicons at: $IONICONS_PATH"

# @font-face CSS를 </head> 앞에 주입
FONT_CSS="<style>@font-face{font-family:'Ionicons';src:url('/$IONICONS_PATH') format('truetype');font-display:swap;}</style>"

sed -i '' "s|</head>|$FONT_CSS</head>|" "$HTML_FILE"

echo "Patched index.html with Ionicons font-face"
