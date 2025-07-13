import os
import random

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

CROQUIS_DIR = "./mycroquis/static/img"
CROQUIS_LEN = 10
CROQUIS_INTERVAL_SECONDS = 120


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/images")
def images():
    size = int(request.args.get("size"))

    filenames = [f"img/{filename}" for filename in os.listdir(CROQUIS_DIR)]
    random.shuffle(filenames)

    return jsonify(filenames[:size])
