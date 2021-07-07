document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/getAll")
        .then(response => response.json())
        .then(data => loadHtmlTable(data));
});

document.querySelector("table tbody").addEventListener("click", (event) => {
    if (event.target.className === "delete-row-btn")
        deleteNameById(event.target.dataset.id);

    if (event.target.className === "edit-row-btn")
        handleEditRow(event.target.dataset.id);        
});

const searchNameBtn = document.querySelector(".search-name-btn");
searchNameBtn.onclick = () => {
    const searchNameInput = document.querySelector(".search-name-input");
    const name = searchNameInput.value;

    fetch("http://localhost:3000/search/" + name)
    .then(response => response.json())
    .then(data => loadHtmlTable(data));
}

function deleteNameById(id) {
    fetch("http://localhost:3000/delete/" + id, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data);
                location.reload();
            }
        });
}

function handleEditRow(id) {
    document.querySelector(".update-name-section").hidden = false;
    document.querySelector(".update-name-input").dataset.id = id;   
}

const updateNameBtn = document.querySelector(".update-name-btn");
updateNameBtn.onclick = () => {
    const updateNameInput = document.querySelector(".update-name-input");
    
    fetch("http://localhost:3000/update", {
        headers: {
            "Content-type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data);
            location.reload();
        }
    });
}

// Add name to db
const addNameBtn = document.querySelector(".add-name-btn");
addNameBtn.onclick = () => {
    const addNameInput = document.querySelector(".add-name-input");
    const name = addNameInput.value;
    addNameInput.value = "";

    if (name !== "") {

        fetch("http://localhost:3000/insert", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ name: name })
        })
            .then(response => response.json())
            .then(data => insertRowIntoHTMTable(data));
    }
}

// Insert row into html table
function insertRowIntoHTMTable(data) {
    const table = document.querySelector("table tbody");
    const isHtmlTableEmpty = document.querySelector(".no-data");
    let newRowHtml = createHtmlTableRow(data);

    if (isHtmlTableEmpty) {
        table.innerHTML = newRowHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = newRowHtml;
    }
}

// Load the html table with data from db
function loadHtmlTable(data) {
    const table = document.querySelector("table tbody");

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan=5>No Data</td></tr>";
        return;
    }

    let tempHtml = "";
    data.forEach(e => {
        tempHtml += createHtmlTableRow(e);
    });

    table.innerHTML = tempHtml;
}

// return a table row html
function createHtmlTableRow(data) {
    var rowHtml = "<tr>";
    for (key in data) {
        if (data.hasOwnProperty(key)) {
            if (key == "dateAdded") {
                data[key] = new Date(data[key]).toLocaleString();
            }
            rowHtml += `<td>${data[key]}</td>`;
        }
    }

    rowHtml += `<td><button class='delete-row-btn' data-id=${data.id}>Delete</button></td>`;
    rowHtml += `<td><button class='edit-row-btn' data-id=${data.id}>EDIT</button></td>`;
    rowHtml += "</tr>";

    return rowHtml;
}