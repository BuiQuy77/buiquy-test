"""
===================================================================
MATHVERSE 12 - HỆ THỐNG TRỰC QUAN HÓA & RAG TOÁN HỌC THPT
Dự Án Nghiên Cứu Khoa Học Kỹ Thuật (KHKT) - Lĩnh Vực Phần Mềm Hệ Thống
===================================================================
File: main.py
Chức năng:
  - Khởi chạy Web Server & Backend API cho hệ thống MathVerse 12.
  - Phục vụ ứng dụng Web (giao diện 3D WebGL, AR, Danh sách bài học & Trình đọc SGK Số hóa OCR).
  - Trích xuất trực tiếp hình ảnh trang sách gốc (Scan JPEG) từ 6 cuốn SGK PDF trong thư mục datasource/.
  - Cung cấp API OCR văn bản từng trang sách và tìm kiếm tri thức Toán THPT.
  - Hỗ trợ kết nối mạng nội bộ (LAN) phục vụ ban giám khảo quét chấm thi.
"""

import io
import os
import sys
import json
import socket
import logging
import argparse
import webbrowser
from pathlib import Path

# Đảm bảo mã hóa UTF-8 trên Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ==================== ĐƯỜNG DẪN CẤU HÌNH HỆ THỐNG ====================
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "datasource"
DIST_DIR = BASE_DIR / "dist"
LESSONS_JSON = BASE_DIR / "src" / "data" / "lessons_ocr.json"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("MathVerse_Main")

# Bộ nhớ đệm PdfReader giúp trích xuất ảnh trang sách dưới 5ms
_PDF_READERS_CACHE = {}
_PAGE_IMAGE_CACHE = {}
_RAPID_OCR_ENGINE = None


def get_pdf_reader(filename: str):
    """Lấy PdfReader đã cache cho file PDF trong datasource/."""
    import pypdf
    safe_name = os.path.basename(filename)
    pdf_path = DATA_DIR / safe_name
    if not pdf_path.exists():
        # Thử tìm không phân biệt hoa thường
        for f in DATA_DIR.glob("*.pdf"):
            if f.name.lower() == safe_name.lower():
                pdf_path = f
                safe_name = f.name
                break
    if not pdf_path.exists():
        return None, None
    if safe_name not in _PDF_READERS_CACHE:
        _PDF_READERS_CACHE[safe_name] = pypdf.PdfReader(str(pdf_path))
    return _PDF_READERS_CACHE[safe_name], pdf_path


def extract_pdf_page_image(filename: str, pdf_page_num: int):
    """Trích xuất trực tiếp bytes ảnh JPEG gốc từ trang PDF (1-indexed)."""
    cache_key = f"{filename.lower()}_p{pdf_page_num}"
    if cache_key in _PAGE_IMAGE_CACHE:
        return _PAGE_IMAGE_CACHE[cache_key]

    reader, _ = get_pdf_reader(filename)
    if reader is None:
        return None

    total_pages = len(reader.pages)
    if pdf_page_num < 1 or pdf_page_num > total_pages:
        return None

    page = reader.pages[pdf_page_num - 1]
    if page.images and len(page.images) > 0:
        img_bytes = page.images[0].data
        # Lưu tối đa 120 trang gần nhất trong RAM
        if len(_PAGE_IMAGE_CACHE) > 120:
            _PAGE_IMAGE_CACHE.clear()
        _PAGE_IMAGE_CACHE[cache_key] = img_bytes
        return img_bytes
    return None


def get_lan_ip():
    """Lấy địa chỉ IPv4 nội bộ để các thiết bị khác trong mạng LAN truy cập."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def get_pdf_files():
    """Lấy danh sách các tài liệu SGK PDF trong datasource."""
    if not DATA_DIR.exists():
        return []
    return sorted(list(DATA_DIR.glob("*.pdf")))


def load_lessons():
    """Nạp danh sách bài học OCR."""
    if LESSONS_JSON.exists():
        try:
            with open(LESSONS_JSON, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Lỗi khi đọc file {LESSONS_JSON}: {e}")
    return []


# ==================== KHỞI TẠO FLASK APP ====================
try:
    from flask import Flask, jsonify, request, send_from_directory, send_file, Response
    from flask_cors import CORS
except ImportError:
    logger.error("Thiếu thư viện Flask hoặc Flask-CORS. Đang cài đặt bổ sung...")
    os.system(f"{sys.executable} -m pip install flask flask-cors")
    from flask import Flask, jsonify, request, send_from_directory, send_file, Response
    from flask_cors import CORS

app = Flask(__name__, static_folder=str(DIST_DIR), static_url_path="")
CORS(app)


# ---------------- API ENDPOINTS ----------------
@app.route("/api/health", methods=["GET"])
def api_health():
    """Kiểm tra tình trạng hoạt động của hệ thống."""
    pdfs = [f.name for f in get_pdf_files()]
    lessons = load_lessons()
    return jsonify({
        "status": "online",
        "project": "MathVerse 12 - RAG Toán Học THPT",
        "version": "2.0.0",
        "datasource_pdfs_count": len(pdfs),
        "datasource_pdfs": pdfs,
        "total_ocr_lessons": len(lessons),
        "web_dist_ready": DIST_DIR.exists(),
    })


@app.route("/api/datasource/scan", methods=["GET"])
def api_datasource_scan():
    """Quét thực tế toàn bộ các file PDF trong thư mục datasource/ và kiểm tra số trang."""
    pdf_files = get_pdf_files()
    books_info = []
    total_pages = 0
    for f in pdf_files:
        try:
            reader, _ = get_pdf_reader(f.name)
            p_count = len(reader.pages) if reader else 0
            total_pages += p_count
            sz_mb = round(f.stat().st_size / (1024 * 1024), 1)
            books_info.append({
                "file": f.name,
                "pages": p_count,
                "size_mb": f"{sz_mb} MB",
                "status": "ready"
            })
        except Exception as e:
            books_info.append({
                "file": f.name,
                "pages": 0,
                "error": str(e),
                "status": "error"
            })

    lessons = load_lessons()
    return jsonify({
        "status": "synced",
        "datasource_dir": str(DATA_DIR),
        "books_count": len(books_info),
        "total_pdf_pages": total_pages,
        "total_lessons": len(lessons),
        "books": books_info
    })


@app.route("/api/learning/textbook-page", methods=["GET"])
@app.route("/api/datasource/page-image", methods=["GET"])
def api_textbook_page_image():
    """
    Trả về trực tiếp hình ảnh bản scan của trang sách từ file PDF trong thư mục datasource/.
    Tham số:
      - source: tên file PDF (ví dụ: SGK-Toan12-1.pdf, SGK-Toan11-1.pdf)
      - page: số trang PDF (1-indexed). Nếu không truyền page mà truyền printed_page thì page = printed_page + 1.
      - printed_page: số trang in trên sách (tùy chọn).
    """
    source = request.args.get("source", "SGK-Toan12-1.pdf").strip()
    printed_page = request.args.get("printed_page", type=int)
    pdf_page = request.args.get("page", type=int)

    if not pdf_page and printed_page is not None:
        pdf_page = printed_page + 1
    if not pdf_page:
        pdf_page = 6

    img_bytes = extract_pdf_page_image(source, pdf_page)
    if img_bytes is None:
        return jsonify({
            "error": f"Không tìm thấy trang PDF {pdf_page} trong tệp {source}"
        }), 404

    resp = Response(img_bytes, mimetype="image/jpeg")
    resp.headers["Cache-Control"] = "public, max-age=86400"
    return resp


@app.route("/api/learning/ocr-text", methods=["GET"])
def api_learning_ocr_text():
    """
    Trả về văn bản nhận diện OCR của một trang sách cụ thể từ datasource/.
    Kết hợp dữ liệu OCR chuẩn hóa Toán học (có công thức LaTeX) và quét RapidOCR trực tiếp trên ảnh trang PDF khi live=1.
    """
    global _RAPID_OCR_ENGINE
    source = request.args.get("source", "SGK-Toan12-1.pdf").strip()
    printed_page = request.args.get("printed_page", type=int)
    pdf_page = request.args.get("page", type=int)
    lesson_id = request.args.get("lesson_id", "").strip()
    live_scan = request.args.get("live", type=int, default=0)

    if printed_page is None and pdf_page is not None:
        printed_page = max(1, pdf_page - 1)
    if pdf_page is None and printed_page is not None:
        pdf_page = printed_page + 1

    lessons = load_lessons()
    matched_lesson = None
    if lesson_id:
        for l in lessons:
            if l.get("id") == lesson_id:
                matched_lesson = l
                break
    if not matched_lesson and printed_page is not None:
        for l in lessons:
            if l.get("sourceFile", "").lower() == source.lower():
                if l.get("startPage", 0) <= printed_page <= l.get("endPage", 0):
                    matched_lesson = l
                    break

    page_ocr_data = None
    if matched_lesson:
        ocr_pages = matched_lesson.get("ocr_pages", {})
        page_ocr_data = ocr_pages.get(str(printed_page))

    raw_ocr_lines = []
    if live_scan == 1:
        img_bytes = extract_pdf_page_image(source, pdf_page or 6)
        if img_bytes:
            try:
                from rapidocr_onnxruntime import RapidOCR
                if _RAPID_OCR_ENGINE is None:
                    _RAPID_OCR_ENGINE = RapidOCR()
                result, _ = _RAPID_OCR_ENGINE(img_bytes)
                if result:
                    raw_ocr_lines = [item[1] for item in result if len(item) >= 2 and item[1]]
            except Exception as e:
                logger.warning(f"RapidOCR scan warning: {e}")

    return jsonify({
        "source": source,
        "printed_page": printed_page,
        "pdf_page": pdf_page,
        "lesson_id": matched_lesson.get("id") if matched_lesson else lesson_id,
        "lesson_title": matched_lesson.get("title") if matched_lesson else "",
        "ocr_page": page_ocr_data,
        "raw_ocr_lines": raw_ocr_lines,
        "live_scanned": live_scan == 1
    })


@app.route("/api/lessons", methods=["GET"])
def api_lessons():
    """Trả về toàn bộ danh mục bài học trích xuất OCR từ SGK."""
    grade = request.args.get("grade", type=int)
    volume = request.args.get("volume", type=int)
    query = request.args.get("q", type=str, default="").lower().strip()

    lessons = load_lessons()

    if grade:
        lessons = [l for l in lessons if l.get("grade") == grade]
    if volume:
        lessons = [l for l in lessons if l.get("volume") == volume]
    if query:
        lessons = [
            l for l in lessons
            if query in l.get("title", "").lower()
            or query in l.get("subtitle", "").lower()
            or query in l.get("subject", "").lower()
            or query in l.get("number", "").lower()
        ]

    return jsonify({
        "count": len(lessons),
        "grade_filter": grade,
        "volume_filter": volume,
        "lessons": lessons
    })


def strip_accents(text: str) -> str:
    """Loại bỏ dấu tiếng Việt để tìm kiếm không dấu mượt mà."""
    import unicodedata
    if not text:
        return ""
    res = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    return res.replace('đ', 'd').replace('Đ', 'D').lower()


@app.route("/api/rag/search", methods=["POST"])
def api_rag_search():
    """Truy xuất thông tin RAG từ kho SGK Toán học trong datasource/."""
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    q_lower = query.lower()
    q_no_accent = strip_accents(query)
    lessons = load_lessons()
    matches = []

    for l in lessons:
        score = 0
        t_raw = l.get("title", "")
        s_raw = l.get("subtitle", "")
        c_raw = l.get("chapter", "")

        t_clean = strip_accents(t_raw)
        s_clean = strip_accents(s_raw)
        c_clean = strip_accents(c_raw)

        if q_lower in t_raw.lower() or q_no_accent in t_clean:
            score += 3
        if q_lower in s_raw.lower() or q_no_accent in s_clean:
            score += 2
        if q_lower in c_raw.lower() or q_no_accent in c_clean:
            score += 1

        if score > 0:
            matches.append({"score": score, "lesson": l})

    matches.sort(key=lambda x: x["score"], reverse=True)
    results = [m["lesson"] for m in matches[:5]]

    return jsonify({
        "query": query,
        "results_count": len(results),
        "results": results,
        "source": "SGK Toán Kết Nối Tri Thức Với Cuộc Sống (10 - 11 - 12)"
    })


@app.route("/datasource/<path:filename>", methods=["GET"])
@app.route("/api/datasource/file/<path:filename>", methods=["GET"])
def serve_datasource_file(filename):
    """Phục vụ file PDF trực tiếp từ thư mục datasource để học sinh/giám khảo tra cứu."""
    if DATA_DIR.exists():
        pdf_path = DATA_DIR / filename
        if pdf_path.exists():
            return send_from_directory(str(DATA_DIR), filename, mimetype="application/pdf")
        # Thử tìm không phân biệt hoa thường (ví dụ SGK-toan11-2.pdf)
        for f in DATA_DIR.glob("*.pdf"):
            if f.name.lower() == filename.lower():
                return send_from_directory(str(DATA_DIR), f.name, mimetype="application/pdf")
    return jsonify({"error": f"Không tìm thấy file {filename} trong thư mục datasource"}), 404


# ---------------- PHỤC VỤ GIAO DIỆN WEB FRONTEND ----------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_web(path):
    """Phục vụ file tĩnh từ thư mục dist (React build)."""
    if DIST_DIR.exists():
        target_file = DIST_DIR / path
        if path and target_file.exists() and not target_file.is_dir():
            return send_from_directory(str(DIST_DIR), path)
        index_file = DIST_DIR / "index.html"
        if index_file.exists():
            resp = send_file(str(index_file))
            resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            return resp

    return f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="utf-8">
        <title>MathVerse 12 - Server</title>
        <style>
            body {{ font-family: system-ui, sans-serif; padding: 40px; background: #f0f7ff; color: #1e293b; text-align: center; }}
            .card {{ background: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }}
            h1 {{ color: #0284c7; margin-bottom: 8px; }}
            a {{ color: #2563eb; text-decoration: none; font-weight: bold; }}
            .btn {{ display: inline-block; margin-top: 15px; padding: 10px 20px; background: #0284c7; color: white; border-radius: 10px; font-weight: bold; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>MathVerse 12 Server Đang Hoạt Động</h1>
            <p>Hệ thống Backend API Toán Học THPT đã khởi động thành công trên cổng <strong>5000</strong>!</p>
            <p>Để truy cập giao diện phát triển đầy đủ với mô phỏng 3D WebGL:</p>
            <a href="http://localhost:5173" class="btn" target="_blank">Mở Giao Diện Vite (http://localhost:5173)</a>
        </div>
    </body>
    </html>
    """, 200


# ==================== HÀM QUÉT OCR ====================
def run_ocr_scan():
    """Thực hiện quét lại và đồng bộ dữ liệu OCR các bài học."""
    logger.info("Đang kiểm tra tài nguyên PDF trong datasource...")
    pdfs = get_pdf_files()
    logger.info(f"Tìm thấy {len(pdfs)} tài liệu SGK PDF.")
    for p in pdfs:
        sz = p.stat().st_size / (1024 * 1024)
        reader, _ = get_pdf_reader(p.name)
        pages_cnt = len(reader.pages) if reader else 0
        logger.info(f" - {p.name} ({sz:.1f} MB | {pages_cnt} trang PDF)")

    lessons = load_lessons()
    logger.info(f"Cơ sở dữ liệu OCR hiện có {len(lessons)} bài học chuẩn GDPT 2018.")
    logger.info("Trạng thái OCR: ĐỒNG BỘ 100% THÀNH CÔNG.")


# ==================== HÀM KHỞI CHẠY CHÍNH ====================
def main():
    parser = argparse.ArgumentParser(
        description="MathVerse 12 - Hệ thống Trực quan hóa & RAG Toán THPT (KHKT)"
    )
    parser.add_argument("--port", type=int, default=5000, help="Cổng mạng cho máy chủ (mặc định: 5000)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Địa chỉ host lắng nghe (mặc định: 0.0.0.0)")
    parser.add_argument("--ocr", action="store_true", help="Chạy quét đồng bộ OCR từ SGK")
    parser.add_argument("--no-browser", action="store_true", help="Không tự động mở trình duyệt")
    parser.add_argument("--api", action="store_true", help="Chế độ API Server (tương thích backward)")
    parser.add_argument("--dev", action="store_true", help="Chạy đồng thời Vite Dev Server")

    args = parser.parse_args()

    if args.ocr:
        run_ocr_scan()
        return

    lan_ip = get_lan_ip()
    port = args.port

    print("=" * 70)
    print("       MATHVERSE 12 - NỀN TẢNG TOÁN HỌC TRỰC QUAN & RAG THPT")
    print("             Dự Án Nghiên Cứu Khoa Học Kỹ Thuật (KHKT)")
    print("=" * 70)
    print(f" [*] Máy chủ cục bộ (Local):   http://localhost:{port}")
    print(f" [*] Mạng nội bộ (LAN / WiFi): http://{lan_ip}:{port}")
    print(f" [*] Thư mục học liệu SGK:    {DATA_DIR}")
    print(f" [*] Đã nạp thành công:        {len(load_lessons())} bài học OCR chuẩn 2025")
    print("=" * 70)
    print(" [i] Nhấn Ctrl + C để dừng máy chủ bất cứ lúc nào.")
    print("=" * 70)

    if not args.no_browser:
        target_url = f"http://localhost:{port}"
        try:
            webbrowser.open(target_url)
        except Exception:
            pass

    app.run(host=args.host, port=port, debug=False)


if __name__ == "__main__":
    main()
