const apiUrl = "https://striveschool-api.herokuapp.com/api/movies/";
const authKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiY2U0ZDRiY2RlMTAwMTc2MTZhOTciLCJpYXQiOjE2MDUwOTQ5ODksImV4cCI6MTYwNjMwNDU4OX0.SAQHytYdg6VnAaNjFVSw_dxa0O28-Ini5uk6aRjkN1U";
let allGenres = [];
let allMovies = [];
let isFirstEdit = true;

/* Fetch Data */
const fetchShowData = async (endpoint) => {
  try {
    if (typeof endpoint === "string") {
      // On any other fetch fetch by genre
      const response = await fetch(apiUrl + endpoint, {
        method: "GET",
        headers: {
          Authorization: authKey,
        },
      });
      const data = await response.json();
      return data;
    } else {
      // On first load fetch all genres and place into an array.
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: authKey,
        },
      });
      const data = await response.json();
      allGenres = [...data];
      allGenres.sort().shift();
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

async function fetchAllMovies() {
  let promiseArray = [];

  allGenres.forEach((e) => {
    promiseArray.push(fetchShowData(e));
  });

  allMovies = (await Promise.all(promiseArray)).flat();
}

function resetAllFields() {
  console.log("fired");
  const allInputs = document.querySelectorAll("input");
  allInputs.forEach((e) => (e.value = ""));

  const allTextAreas = document.querySelectorAll("textarea");
  allTextAreas.forEach((e) => (e.value = ""));

  const allSelects = document.querySelectorAll("select");
  allSelects.forEach((e) => (e.value = ""));
}

function dashboard_loadSummaryTable(array = allMovies) {
  const tableContainer = document.querySelector("#summary-table-body");

  tableContainer.innerHTML = "";

  array.forEach((e) => {
    const newTableItem = document.createElement("tr");
    newTableItem.innerHTML = `
        <th scope="row">${e.name}</th>
            <td>${e.category}</td>
            <td>${e._id}</td>
            <td class="text-right">
            <button id="edit-this-element" class="btn btn-warning d-inline-block mr-2">Edit</button>
            <button id="delete-this-element" class="btn btn-danger">Delete</button>
        </td>`;
    tableContainer.appendChild(newTableItem);
    newTableItem.querySelector("#edit-this-element").addEventListener("click", () => setEditData(event));
    newTableItem.querySelector("#delete-this-element").addEventListener("click", () => removeShowData(e._id));
  });
}

function filterTable() {
  const filterSelect = document.querySelector("#filterBy-genre").value;

  filterSelect === "All Movies"
    ? dashboard_loadSummaryTable(allMovies)
    : dashboard_loadSummaryTable(allMovies.filter((e) => e.category === filterSelect));
}

function setModalData(show) {
  document.querySelector("#modal-show-name").value = show[0].name;
  document.querySelector("#modal-show-description").value = show[0].description;
  document.querySelector("#modal-show-genre").value = show[0].category;
  document.querySelector("#modal-show-img").value = show[0].imageUrl;
}

async function loadModal() {
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

function setEditData(event) {
  const target = event.currentTarget.parentNode.parentNode;
  const targetID = target.querySelector("td:nth-child(3)").innerText;
  const editIDBox = document.querySelector("#inputShowID-edit");

  editIDBox.value = targetID;

  findGenre();
  loadModal();
}

function findGenre() {
  const editIDBox = document.querySelector("#inputShowID-edit");
  const genreBox = document.querySelector("#inputShowGenre-edit");

  let holdIDValue = editIDBox.value.split("").filter(function (str) {
    return /\S/.test(str);
  });

  editIDBox.value = holdIDValue.join("");

  if (editIDBox.value.length > 0) {
    allMovies.forEach((e) => {
      if (editIDBox.value === e._id) {
        genreBox.value = e.category;
      }
    });
  } else {
    genreBox.value = "";
  }
}

/* Home functions */

function createShowCard(show) {
  const newShowCard = document.createElement("div");
  newShowCard.classList.add("show-wrapper", "mr-1");
  newShowCard.innerHTML = `
    <img class="show-img" src="${show.imageUrl}"/>
    <div class="show-content d-flex justify-content-center align-items-start flex-column px-4 py-2">
    <h5 class="mb-2">${show.name}</h5>
    <p class="mb-2">${show.description}?</p>
    <button><i class="fas fa-play pl-1 pr-2 py-2"></i>PLAY</button>
    </div>`;

  return newShowCard;
}

function home_loadGenreSelections() {
  const selector = document.querySelector("#genre-filter");
  allGenres.forEach((e) => {
    const newOption = document.createElement("option");
    newOption.setAttribute("value", `${e}`);
    newOption.innerText = e;
    selector.appendChild(newOption);
  });
}

function home_loadContent() {
  const contentWrapper = document.querySelector("#content-wrapper");
  allGenres.forEach(async (e) => {
    const newGenreRow = document.createElement("div");
    newGenreRow.classList.add("row", "pt-5");
    newGenreRow.innerHTML = `
    <h2 class="d-block w-100">${e}</h2>
    <div id="${e}-row" class="shows-row">
    </div>`;

    const genreRow = newGenreRow.querySelector(`#${e}-row`);
    const filteredMovieArray = allMovies.filter((movie) => movie.category === e);
    filteredMovieArray.forEach(async (e) => {
      const newShow = await createShowCard(e);
      genreRow.appendChild(newShow);
    });

    contentWrapper.appendChild(newGenreRow);
  });
}

function home_loadElements() {
  home_loadGenreSelections();
  home_loadContent();
}

const startHome = async () => {
  await fetchShowData();
  await fetchAllMovies();
  home_loadElements(allGenres);
};

/*---------------------------------------------------*/
/* Dashboard functions */

function postNewShow(e) {
  e.preventDefault();
  postShowData();
}

function editShow(e) {
  e.preventDefault();
  loadModal();
}

function deleteShow(e) {
  e.preventDefault();

  const id = document.querySelector("#inputShowID").value;
  removeShowData(id);
}

const startDashboard = async () => {
  resetAllFields();
  await fetchShowData();
  await fetchAllMovies();
  dashboard_loadSummaryTable();
};

/*---------------------------------------------------*/
