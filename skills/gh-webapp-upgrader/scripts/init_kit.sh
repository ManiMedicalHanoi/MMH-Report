#!/usr/bin/env bash
# Cài "bộ khung phát hành" vào repo webapp: thông báo cập nhật, công cụ chụp ảnh / mock / PDF, kiểm tra cú pháp.
# Dùng: bash init_kit.sh <thư-mục-repo>      (không ghi đè file đã có)
set -euo pipefail
REPO="${1:?Cần đường dẫn repo}"; HERE="$(cd "$(dirname "$0")/.." && pwd)"
cp -Rn "$HERE/assets/kit/." "$REPO/" 2>/dev/null || true
mkdir -p "$REPO/tools" "$REPO/docs"
cp -n "$HERE/scripts/check_scripts.py" "$REPO/tools/check_scripts.py" 2>/dev/null || true
cp -n "$HERE/scripts/mock_gas.js" "$REPO/tools/guide/mock_gas.js" 2>/dev/null || true
cp -n "$HERE/scripts/recolor_css.py" "$REPO/tools/recolor_css.py" 2>/dev/null || true
printf 'shots/\nprev/\nout.pdf\n_v.html\n_c.html\ndeck.html\n' > "$REPO/tools/guide/.gitignore"
echo "✓ Đã chép: updates/notes.js, tools/guide/*, tools/check_scripts.py, tools/recolor_css.py"
echo "Việc tiếp theo (làm trong index.html):"
echo "  1. Dán $HERE/assets/update-notice.html trước </body>; thêm badge id=\"ver-badge\"; gọi UPD.start({user:…, ready:…})"
echo "  2. (tuỳ chọn) Dán $HERE/assets/theme-kit.html theo 3 phần ghi trong file"
echo "  3. (tuỳ chọn) Thêm <script src=\"…/outbox.js\"> hoặc dán nội dung $HERE/assets/outbox.js; cấu hình APP_OUTBOX.init(…)"
echo "  4. Viết quy tắc vào CLAUDE.md (mẫu: $HERE/references/claude-md-template.md)"
echo "  5. Sửa HANDLERS/DB trong tools/guide/cap.js cho khớp backend; chạy: NODE_PATH=\$(npm root -g) node tools/guide/cap.js main"
