// public/script.js
document.addEventListener("DOMContentLoaded", () => {
  const dataTable = document
    .getElementById("data-table")
    .querySelector("tbody");
  const addBtn = document.getElementById("add-btn");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      displayData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const displayData = (data) => {
    dataTable.innerHTML = "";

    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${item.id}</td>
          <td contenteditable="true">${item.busname}</td>
          <td contenteditable="true">${item.contact}</td>
          <td contenteditable="true">${item.time}</td>
          <td contenteditable="true">${item.returnTime}</td>
          <td>
          <a href="tel:${item.contact}"><image src="https://static-00.iconduck.com/assets.00/telephone-icon-2048x2048-whonq8z4.png" width="20px" height="20px"/></a>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        `;

      row
        .querySelector(".edit-btn")
        .addEventListener("click", () => handleEdit(item.id));
      row
        .querySelector(".delete-btn")
        .addEventListener("click", () => handleDelete(item.id));

      dataTable.appendChild(row);
    });
  };

  const handleEdit = (id) => {
    const updatedData = getDataFromTable();
    const updatedItem = updatedData.find((item) => item.id === id);

    fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((response) => response.json())
      .then((data) => displayData(data))
      .catch((error) => console.error("Error updating data:", error));
  };

  const handleDelete = (id) => {
    fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => displayData(data))
      .catch((error) => console.error("Error deleting data:", error));
  };

  const getDataFromTable = () => {
    const rows = Array.from(dataTable.children);
    return rows.map((row) => ({
      id: parseInt(row.children[0].textContent),
      busname: row.children[1].textContent,
      contact: row.children[2].textContent,
      time: row.children[3].textContent,
      returnTime: row.children[4].textContent,
    }));
  };

  addBtn.addEventListener("click", () => {
    const newId = Math.max(...getDataFromTable().map((item) => item.id), 0) + 1;
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${newId}</td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

    newRow
      .querySelector(".edit-btn")
      .addEventListener("click", () => handleEdit(newId));
    newRow
      .querySelector(".delete-btn")
      .addEventListener("click", () => handleDelete(newId));

    dataTable.appendChild(newRow);
  });

  fetchData();
});
