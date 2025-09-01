import os
import random

from flask import Flask, jsonify, render_template, request, send_from_directory

app = Flask(__name__)

KAGURA_DIR = os.getenv("KAGURA_DIR")
KAGURA_SIZE = 5
KAGURA_INTERVAL = 180


@app.route("/")
def index():
    folders = sorted(os.listdir(KAGURA_DIR))
    return render_template(
        "index.html", size=KAGURA_SIZE, interval=KAGURA_INTERVAL, folders=folders
    )


@app.route("/api/images")
def images():
    size = int(request.args.get("size"))
    folder = request.args.get("folder")

    filenames = os.listdir(os.path.join(KAGURA_DIR, folder))
    paths = [f"/images/{folder}/{filename}" for filename in filenames]

    random.shuffle(paths)

    return jsonify(paths[:size])


@app.route("/images/<path:filename>")
def static_images(filename):
    return send_from_directory(KAGURA_DIR, filename)
