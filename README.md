# mycroquis

## Install

```
$ git clone https://github.com/yamamoto-tgz/mycroquis.git
$ cd myqroquis

$ python3 -m venv venv
$ source ./venv/bin/activate

$ pip install -r requirements.txt
```

# Run

```
$ mkdir ~/Pictures/mycroquis
$ ln -s ~/Pictures/mycroquis ./mycroquis/static/img
$ flask --app mycroquis/app.py run --debug
```

and open http://localhost:5000
