function createThemedGrid(selector, tableData, tableColumns, fileName = "Export", enableColumnSearch = false) {

    // Clear old grid content
    $(selector).html("");

    // Remove old toolbar if exists
    const existingToolbar = document.getElementById(`${selector.replace("#", "")}-toolbar`);
    if (existingToolbar) existingToolbar.remove();

    // Enable column search if required
    if (enableColumnSearch) {
        tableColumns = tableColumns.map(col => ({ ...col, headerFilter: "input" }));
    }

    // Initialize Tabulator
    const table = new Tabulator(selector, {
        data: tableData,
        layout: "fitColumns",   // horizontal scroll
        height: "false",            // vertical scroll       
        pagination: "local",
        paginationSize: 100,
        paginationSizeSelector: [10, 25, 50, 100],
        movableColumns: true,
        columns: tableColumns,

        // ⭐ Row formatting applied every time Tabulator draws rows ⭐
        rowFormatter: function (row) {
            const el = row.getElement();
            const index = row.getPosition(true);

            el.style.background = (index % 2 === 0) ? "#fffff" : "#fffff"; // striping
            el.style.color = "black";
            el.style.transition = "0.2s";

            el.addEventListener("mouseenter", () => {
                el.style.background = "#fffff";
            });

            el.addEventListener("mouseleave", () => {
                el.style.background = (index % 2 === 0) ? "#fffff" : "#fffff";
            });
        }
    });

    // Header Theme (after render)
    setTimeout(() => {
        const header = document.querySelector(`${selector} .tabulator-header`);
        if (header) {
            header.style.background = "linear-gradient(to right, #2563EB, #3b82f6)";
            header.style.color = "white";
            header.style.fontWeight = "600";
            header.style.fontFamily = "'Inter', sans-serif";
        }

        // Column Hover Style
        document.querySelectorAll(`${selector} .tabulator-col`).forEach(col => {
            col.style.background = "linear-gradient(to right, #2563EB, #3b82f6)";
            col.style.color = "white";
            col.style.fontWeight = "600";

            col.addEventListener("mouseenter", () => {
                col.style.background = "linear-gradient(to right, #2563EB, #60a5fa)";
            });
            col.addEventListener("mouseleave", () => {
                col.style.background = "linear-gradient(to right, #2563EB, #3b82f6)";
            });
        });

    }, 300);

    // Toolbar (Search + Download)
    let toolbar = document.createElement("div");
    toolbar.id = `${selector.replace("#", "")}-toolbar`;
    toolbar.style.display = "flex";
    toolbar.style.justifyContent = "space-between";
    toolbar.style.marginBottom = "5px";
    toolbar.style.alignItems = "center";

    // Search input
    let searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.className = "border border-gray-400 px-3 py-1 rounded outline-none";
    searchInput.style.width = "200px";
    searchInput.addEventListener("keyup", function () {
        table.setFilter((data) => JSON.stringify(data).toLowerCase().includes(this.value.toLowerCase()));
    });

    // Export button
    let btn = document.createElement("button");
    btn.innerText = "Export Excel";
    btn.className = "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold";
    btn.onclick = () => table.download("xlsx", `${fileName}.xlsx`, { sheetName: fileName });

    toolbar.appendChild(searchInput);
    toolbar.appendChild(btn);

    document.querySelector(selector).parentNode.insertBefore(toolbar, document.querySelector(selector));

    return table;
}


