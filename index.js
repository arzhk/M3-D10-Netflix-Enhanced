const apiUrl = "https://striveschool-api.herokuapp.com/api/movies/";
const authKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiY2U0ZDRiY2RlMTAwMTc2MTZhOTciLCJpYXQiOjE2MDUwOTQ5ODksImV4cCI6MTYwNjMwNDU4OX0.SAQHytYdg6VnAaNjFVSw_dxa0O28-Ini5uk6aRjkN1U";
let allGenres = [];
let isFirstEdit = true;

/* Fetch Data */
const fetchShowData = async (endpoint) => {
  try {
    if (typeof endpoint === "string") {
      const response = await fetch(apiUrl + endpoint, {
        method: "GET",
        headers: {
          Authorization: authKey,
        },
      });
      const data = await response.json();
      return data;
    } else {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: authKey,
        },
      });
      const data = await response.json();
      allGenres = [...data];
      return allGenres;
    }
  } catch (error) {
    alert("Error, action did not complete successfully");
    console.error(`ERROR: ${error.message}`);
  }
};

const fetchShowDataByID = async (id, Genre) => {
  let idStore = id.split("").filter(function (str) {
    return /\S/.test(str);
  });

  idStore = idStore.join("");

  try {
    const response = await fetch(apiUrl + `${Genre}/`, {
      method: "GET",
      headers: {
        Authorization: authKey,
      },
    });
    const data = await response.json();
    const foundData = await data.filter((e) => {
      if (e._id === idStore) {
        return true;
      }
    });
    return foundData;
  } catch (error) {
    alert("Error, action did not complete successfully");
    console.error(`ERROR: ${error.message}`);
  }
};

/* Delete Data */
const removeShowData = async (id) => {
  try {
    const response = await fetch(apiUrl + `${id}`, {
      method: "DELETE",
      headers: new Headers({
        Authorization: authKey,
      }),
    });
    alert("Show successfully removed");
    startDashboard();
    return;
  } catch (error) {
    alert("Error, action did not complete successfully");
    console.error(`ERROR: ${error.message}`);
  }
};

/* Post Data */
const postShowData = async () => {
  const newShow = {
    name: document.querySelector("#inputShowName").value,
    description: document.querySelector("#inputShowDescription").value,
    category: document.querySelector("#inputGenre").value,
    imageUrl: document.querySelector("#inputShowImageUrl").value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(newShow),
      headers: new Headers({
        Authorization: authKey,
        "Content-Type": "application/json",
      }),
    });

    alert("Show successfully added");
    fetchShowData();
    startDashboard();
    return;
  } catch (error) {
    alert("Error, action did not complete successfully");
    console.error(`ERROR: ${error.message}`);
  }
};

/* Edit Data */
const updateShowData = async (id) => {
  const updatedShowData = {
    name: document.querySelector("#modal-show-name").value,
    description: document.querySelector("#modal-show-description").value,
    category: document.querySelector("#modal-show-genre").value,
    imageUrl: document.querySelector("#modal-show-img").value,
  };

  try {
    const response = await fetch(apiUrl + `${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedShowData),
      headers: {
        Authorization: authKey,
        "Content-Type": "application/json",
      },
    });
    alert("Show successfully updated");
    startDashboard();
    $("#exampleModal").modal("hide");
    return;
  } catch (error) {
    alert("Error, action did not complete successfully");
    console.error(`ERROR: ${error.message}`);
  }
};

function dashboard_loadSummaryTable(array) {
  const tableContainer = document.querySelector("#summary-table-body");

  tableContainer.innerHTML = "";

  array.forEach(async (e) => {
    const data = await fetchShowData(e);

    data.forEach((e) => {
      const newTableItem = document.createElement("tr");
      newTableItem.innerHTML = `
        <th scope="row">${e.name}</th>
            <td>${e.category}</td>
            <td>${e._id}</td>
            <td class="text-right">
            <button class="btn btn-warning d-inline-block mr-2">Edit</button>
            <button class="btn btn-danger">Delete</button>
        </td>`;

      tableContainer.appendChild(newTableItem);
    });
  });
}

function setModalData(show) {
  console.log(show);
  document.querySelector("#modal-show-name").value = show[0].name;
  document.querySelector("#modal-show-description").value = show[0].description;
  document.querySelector("#modal-show-genre").value = show[0].category;
  document.querySelector("#modal-show-img").value = show[0].imageUrl;
}

async function loadModal(e) {
  e.preventDefault();
  showId = document.querySelector("#inputShowID-edit").value;
  showGenre = document.querySelector("#inputShowGenre-edit").value;

  if (showId.length > 0 && showGenre.length > 0) {
    $("#exampleModal").modal("show");
    const showInfo = await fetchShowDataByID(showId, showGenre);

    setModalData(showInfo);

    if (isFirstEdit === true) {
      const saveChangesButton = document.querySelector("#save-changes");
      saveChangesButton.addEventListener("click", () => updateShowData(showId));
    }
  } else {
    alert("Please enter a Show ID and Show Genre");
  }

  isFirstEdit = false;
}

function postNewShow(e) {
  e.preventDefault();
  postShowData();
}

function deleteShow(e) {
  e.preventDefault();

  const id = document.querySelector("#inputShowID").value;
  removeShowData(id);
}

const startDashboard = async () => {
  await fetchShowData();
  dashboard_loadSummaryTable(allGenres);
};
