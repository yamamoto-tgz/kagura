(async () => {
    function addRecord(table, data) {
        table.insertAdjacentHTML(
            "beforeend",
            `<tr>
            <td class="name">${data.name}</a></td>
            <td>${data.size}</td>
            <td>${data.interval}</td>
            <td>${data.directory}</td>
            <td><button data-id="${data.id}" class="deleteButton">削除</button></td>
            </tr>`
        );

        settingsTable.querySelectorAll(".name").forEach((el) => {
            el.addEventListener("click", (e) => {
                const size = el.nextElementSibling;
                const interval = size.nextElementSibling;
                const directory = interval.nextElementSibling;

                document.querySelector("#sizeInput").value = size.textContent;
                document.querySelector("#intervalInput").value = interval.textContent;
                document
                    .querySelector("#directorySelect")
                    .querySelectorAll("option")
                    .forEach((opt) => {
                        if (opt.value === directory.textContent) opt.selected = true;
                    });
            });
        });

        document.querySelectorAll(".deleteButton").forEach((el) => {
            el.addEventListener("click", async (e) => {
                const res = await fetch(`/settings/${e.target.dataset.id}`, { method: "DELETE" });
                if (res.status == 200) e.target.closest("tr").remove();
            });
        });
    }

    const res = await fetch("/settings");
    const json = await res.json();

    const settingsTable = document.querySelector("#settingsTable");
    json.forEach((data) => addRecord(settingsTable, data));

    document.querySelector("#saveButton").addEventListener("click", async (e) => {
        const nameInput = document.querySelector("#nameInput");

        const data = {
            name: nameInput.value == "" ? "無名" : nameInput.value,
            size: document.querySelector("#sizeInput").value,
            interval: document.querySelector("#intervalInput").value,
            directory: document.querySelector("#directorySelect").value,
        };

        const res = await fetch("/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.status == 201) {
            data.id = await res.text();
            addRecord(settingsTable, data);
            nameInput.value = "";
        }
    });
})();
