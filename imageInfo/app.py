from flask import Flask, render_template, request, jsonify
from PIL import Image
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_files():
    files = request.files.getlist("files[]")
    results = []

    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        try:
            with Image.open(file_path) as img:
                if img.mode == 'RGB':
                    color_depth = 8 * 3
                elif img.mode == 'RGBA':
                    color_depth = 8 * 4
                elif img.mode == 'L':
                    color_depth = 8
                else:
                    color_depth = "Unknown"
                metadata = {
                    "name": color_depth,
                    "size": img.info.get("compression", "Unknown"),
                    "dpi": f"{img.info['dpi']}",
                    "color_depth": os.path.basename(file_path),
                    "compression": f"{img.width} x {img.height}",
                }
                results.append(metadata)
        except Exception as e:
            results.append({"name": file.filename, "error": str(e)})

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
