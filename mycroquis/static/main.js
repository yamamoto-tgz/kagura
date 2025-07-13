class Timer {
  constructor(startTime) {
    this.root = document.querySelector("#timer");
    this.startTime = startTime;
  }
  start() {
    let time = this.startTime;
    this.interval = setInterval(() => {
      this.root.textContent = time;
      time -= 1;
      if (time < 0) {
        clearInterval(this.interval);
        document.dispatchEvent(new Event("timeup"));
        this.root.textContent = "";
      }
    }, 1000);
  }
}

class Viewer {
  constructor(size) {
    this.size = size;
    this.root = document.querySelector("#viewer");
    this.images = [];
  }
  async load() {
    const res = await fetch(`/api/images?size=${this.size}`);
    const paths = await res.json();
    paths.forEach((path) => this.addImage(path));
  }

  addImage(path) {
    const img = document.createElement("img");
    img.src = `/static/${path}`;
    img.classList.add("invisible");

    this.images.push(img);
    this.root.appendChild(img);
  }

  switch(index) {
    for (let i = 0; i < this.images.length; i++) {
      if (i == index) {
        this.images[i].classList.remove("invisible");
      } else {
        this.images[i].classList.add("invisible");
      }
    }
  }

  showAll() {
    this.images.forEach((img) => img.classList.remove("invisible"));
  }
}

async function start(size, interval) {
  const viewer = new Viewer(size);
  await viewer.load();

  const timer = new Timer(interval);
  const counter = document.querySelector("#counter");

  let cursor = 0;

  function next() {
    timer.start();
    viewer.switch(cursor);
    counter.textContent = `${cursor + 1}/${viewer.images.length}`;
  }

  next();

  document.addEventListener("timeup", (e) => {
    if (cursor < viewer.images.length - 1) {
      cursor += 1;
      next();
    } else {
      const message = document.querySelector("#message");
      message.textContent = "Finish";
      viewer.showAll();
    }
  });
}

(() => {
  document.querySelector("#startButton").addEventListener("click", (e) => {
    const size = document.querySelector("#sizeInput").value;
    const interval = document.querySelector("#intervalInput").value;
    start(size, interval);
    document.querySelector("#forms").remove();
  });
})();
