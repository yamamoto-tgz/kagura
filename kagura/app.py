import os
import random
import re

from flask import Flask, jsonify, render_template, request, send_from_directory

app = Flask(__name__)

KAGURA_DIR = os.getenv("KAGURA_DIR")
KAGURA_SIZE = 5
KAGURA_INTERVAL = 180


@app.route("/")
def index():
    def count_files(dir):
        paths = [os.path.join(dir, filename) for filename in os.listdir(dir)]
        return sum([os.path.isfile(path) for path in paths])

    roots = [root for root, _, _ in os.walk(KAGURA_DIR, followlinks=True)]

    directories = [
        re.sub(f"^{KAGURA_DIR}/", "", root) for root in roots if count_files(root) > 0
    ]

    return render_template(
        "index.html",
        size=KAGURA_SIZE,
        interval=KAGURA_INTERVAL,
        directories=sorted(directories),
    )


@app.route("/api/images")
def images():
    size = int(request.args.get("size"))
    directory = request.args.get("directory")

    filenames = os.listdir(os.path.join(KAGURA_DIR, directory))
    paths = [f"/images/{directory}/{filename}" for filename in filenames]

    random.shuffle(paths)

    return jsonify(paths[:size])


@app.route("/images/<path:filename>")
def static_images(filename):
    print(filename)
    return send_from_directory(KAGURA_DIR, filename)
