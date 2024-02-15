//Hide banner at start of script
const errorBanner = document.getElementById("invalid-form");
const successBanner = document.getElementById("valid-form");
errorBanner.hidden = true;
successBanner.hidden = true;

let tableCreated = false;
let tableHead = `<table>
<thead>
<tr>
    <th>Movie Title</th>
    <th>Genre</th>
    <th>Rating</th>
    <th>Release Date</th>
    <th>Runtime</th>
    <th>Director</th>
    <th>Actors</th>
    <th>Summary</th>
    <th>Trailer</th>
    <th>Poster</th>
    <th>Video</th>
</tr>
</thead>
<tbody id="table-body">
<!-- Table body will be displayed here -->`;
let entries = "";
let footer = `</tbody>
</table>`;

//Click event handler
document.getElementById("submit").addEventListener("click", () => {
  const fileField = document.querySelectorAll('input[type="file"]');
  //console.log(fileField);
  const checkedChoiceButton = document.querySelector(
    'input[name="choice"]:checked'
  );

  //Build form data object to send in request to server
  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("genre", document.getElementById("genre").value);
  formData.append("rating", document.getElementById("rating").value);
  formData.append("date", document.getElementById("date").value);
  formData.append("runtime", document.getElementById("runtime").value);
  formData.append("director", document.getElementById("director").value);
  formData.append("actors", document.getElementById("actors").value);
  formData.append("summary", document.getElementById("summary").value);
  formData.append("trailer", document.getElementById("trailer").value);
  formData.append("poster", fileField[0].files[0]);
  formData.append("video", fileField[1].files[0]);

  //Settings for FETCH API request
  let fetchSettings = {
    method: "POST",
    body: formData,
  };

  //Send FETCH API request
  fetch("http://localhost/", fetchSettings)
    .then((response) => {
      return new Promise((resolve) =>
        response.json().then((json) =>
          resolve({
            status: response.status,
            json,
          })
        )
      );
    })
    //Logic to display errors on form
    .then(({ status, json }) => {
      const errorMessages = document.getElementsByClassName("text-danger");
      //console.log(errorMessages);
      errorBanner.hidden = true;
      for (htmlElement of errorMessages) {
        htmlElement.innerHTML = "&nbsp;";
      }
      if (status === 400) {
        errorBanner.innerText =
          "Form has errors. Please correct them and resubmit.";
        errorBanner.hidden = false;
        for (error of json.errors) {
          //console.log(error);
          const errorId = error.path + "-error";
          //console.log(errorId);
          document.getElementById(errorId).innerHTML = error.msg;
        }
      } else {
        successBanner.innerText = "Form is valid. Thank you for submitting.";
        successBanner.hidden = false;

        // If table has not been created, create it
        const display = document.getElementById("display");
        let table = "";

        // Select all rows, add them to the table.
        for (let i = 0; i < json.data.length; i++) {
          const row = json.data[i];

          entries += `<tr>`;
          entries += `<td>${row.title}</td>`;
          entries += `<td>${row.genre}</td>`;
          entries += `<td>${row.rating}</td>`;
          entries += `<td>${row.date}</td>`;
          entries += `<td>${row.runtime}</td>`;
          entries += `<td>${row.director}</td>`;
          entries += `<td>${row.actors}</td>`;
          entries += `<td>${row.summary}</td>`;
          entries += `<td>${row.trailer}</td>`;
          entries += `<td><img src="./Server/${json.files.poster[0].path}"/></td>`;
          entries += `<td><img src="./Server/${json.files.video[0].path}"/></td>`;
          entries += `</tr>`;
        }

        if (tableCreated) {
          table = "";
        }

        table += tableHead;
        table += entries;
        table += footer;

        tableCreated = true;
        display.innerHTML = table;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Display the error banner with the error message
      // errorBanner.hidden = false;
      // errorBanner.textContent = errorMessage.errors[0].msg;
    });
  return;
});
