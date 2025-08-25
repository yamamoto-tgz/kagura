# 神楽

ローカルに保存されている画像でクロッキーができます。

## Install

```
$ git clone https://github.com/yamamoto-tgz/kagura.git
$ cd kagura

$ python3 -m venv venv
$ source ./venv/bin/activate

$ pip install -r requirements.txt
```

## Run

```
$ mkdir ~/Pictures/kagura
$ ln -s ~/Pictures/kagura ./kagura/static/img
$ flask --app kagura/app.py run --debug
```

and open http://localhost:5000
