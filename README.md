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
$ export KAGURA_DIR=$HOME/Pictures/kagura
$ flask --app kagura/app.py run --debug
```

and open http://localhost:5000

## Environment Variables

- KAGURA_DIR: 画像が保存されているディレクトリを指定
