import os
import random
import re
import sqlite3

from flask import Flask, jsonify, render_template, request, send_from_directory

app = Flask(__name__)

KAGURA_DIR = os.getenv("KAGURA_DIR")
KAGURA_SIZE = 5
KAGURA_INTERVAL = 180


def get_connection():
    return sqlite3.connect("./kagura.db")


# Create table
with get_connection() as conn:
    cur = conn.cursor()
    cur.execute(
        """
            CREATE TABLE IF NOT EXISTS kagura (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                size INTEGER NOT NULL,
                interval INTEGER NOT NULL,
                directory INTEGER NOT NULL
            )
        """
    )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/models")
def models():
    return render_template("models.html")


@app.route("/pictures")
def pictures():
    def count_files(dir):
        paths = [os.path.join(dir, filename) for filename in os.listdir(dir)]
        return sum([os.path.isfile(path) for path in paths])

    roots = [root for root, _, _ in os.walk(KAGURA_DIR, followlinks=True)]

    directories = [re.sub(f"^{KAGURA_DIR}/", "", root) for root in roots if count_files(root) > 0]

    return render_template(
        "pictures.html",
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


@app.route("/settings", methods=["POST"])
def add_setting():
    with get_connection() as conn:
        cur = conn.cursor()
        data = request.get_json()

        cur.execute(
            "INSERT INTO kagura (name, size, interval, directory) VALUES (?, ?, ?, ?)",
            (
                data.get("name"),
                data.get("size"),
                data.get("interval"),
                data.get("directory"),
            ),
        )
    return str(cur.lastrowid), 201


@app.route("/settings", methods=["GET"])
def get_settings():
    with get_connection() as conn:
        rows = conn.cursor().execute("SELECT * FROM kagura").fetchall()
        keys = ("id", "name", "size", "interval", "directory")
        return jsonify([dict(zip(keys, row)) for row in rows])


@app.route("/settings/<int:id>", methods=["DELETE"])
def delete_setting(id):
    with get_connection() as conn:
        conn.cursor().execute("DELETE FROM kagura WHERE id = ?", (id,))
        return "OK"
