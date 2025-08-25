async function loadImages(size, folder) {
    const res = await fetch(`/api/images?size=${size}&folder=${folder}`);
    const paths = await res.json();

    for (let i = 0; i < paths.length; i++) {
        const img = document.createElement("img");
        img.id = i;
        img.src = paths[i];
        img.style = "display:none";
        document.body.appendChild(img);
    }
}

(() => {
    const timer = new Timer();

    let cursor = 0;
    let size = null;
    let interval = null;
    let folder = null;

    document.querySelector("#startButton").addEventListener("click", async (e) => {
        document.querySelector("#title").style = "display:none";
        document.querySelector("#forms").style = "display:none";
        document.querySelector("#controls").style = "display:flex";

        size = parseInt(document.querySelector("#sizeInput").value);
        interval = parseInt(document.querySelector("#intervalInput").value);
        folder = document.querySelector("#folderSelect").value;

        await loadImages(size, folder);

        timer.set(interval);
        timer.start();

        document.querySelector(`[id="${cursor}"]`).style = "display:block";
        document.querySelector("#cursor").textContent = `${cursor + 1}/${size}`;
    });

    document.querySelector("#pauseButton").addEventListener("click", async (e) => {
        timer.pause();
        e.target.style = "display:none";
        document.querySelector("#resumeButton").style = "display:inline";
    });

    document.querySelector("#resumeButton").addEventListener("click", async (e) => {
        timer.resume();
        e.target.style = "display:none";
        document.querySelector("#pauseButton").style = "display:inline";
    });

    document.addEventListener("timeup", (e) => {
        cursor += 1;

        if (cursor < size) {
            document.querySelector(`[id="${cursor - 1}"]`).style = "display:none";
            document.querySelector(`[id="${cursor}"]`).style = "display:block";

            document.querySelector("#cursor").textContent = `${cursor + 1}/${size}`;

            timer.set(interval);
            timer.start();
        } else {
            document.querySelectorAll("img").forEach((img) => (img.style = "display:block"));
            document.querySelector("#time").style = "visibility: hidden";
            document.querySelector("#cursor").textContent = "お疲れ様!";
            document.querySelector("#buttons").style = "visibility: hidden";
        }
    });

    document.addEventListener("countdown", (e) => {
        document.querySelector("#time").textContent = timer.time;
    });
})();
