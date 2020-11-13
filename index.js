const apiUrl = "https://striveschool-api.herokuapp.com/api/movies/";
const authKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiY2U0ZDRiY2RlMTAwMTc2MTZhOTciLCJpYXQiOjE2MDUwOTQ5ODksImV4cCI6MTYwNjMwNDU4OX0.SAQHytYdg6VnAaNjFVSw_dxa0O28-Ini5uk6aRjkN1U";
let allGenres = [];

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
      console.log("done");
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
      console.log("doneb");
      return allGenres;
    }
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
    return data;
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
    return;
  } catch (error) {
    alert("Error, action did not complete successfully");
    console.error(`ERROR: ${error.message}`);
  }
};

/* Edit Data */
const updateShowData = async (id) => {
  try {
    const response = await fetch(apiUrl + `${id}`, {
      method: "PUT",
      headers: {
        Authorization: authKey,
      },
    });
    alert("Show successfully updated");
    return data;
  } catch (error) {
    alert("Error, action did not complete successfully");
    console.error(`ERROR: ${error.message}`);
  }
};

function dashboard_loadSummaryTable(array) {
  const tableContainer = document.querySelector("#summary-table-body");
  console.log(allGenres);

  array.forEach(async (e) => {
    const data = await fetchShowData(e);

    data.forEach((e) => {
      const newTableItem = document.createElement("tr");
      newTableItem.innerHTML = `
        <th scope="row">${e.name}</th>
            <td>${e._id}</td>
            <td class="text-right">
            <button class="btn-edit d-inline-block mr-2">Edit</button>
            <button class="btn-delete">Delete</button>
        </td>`;

      tableContainer.appendChild(newTableItem);
    });
  });
}

function postNewShow(e) {
  e.preventDefault();
  postShowData();
}

async function startDashboard() {
  await fetchShowData();
  dashboard_loadSummaryTable(allGenres);
}
