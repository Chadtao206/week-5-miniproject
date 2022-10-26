var timeEl = $(".date-time");
var closeModalBtn = $(".closeModalBtn");
var modalEl = $("#myModal");
var timerInterval;

var projectNameInput = $("#projectName");
var projectTypeInput = $("#projectType");
var hourlyRateInput = $("#hourlyRate");
var dateInput = $("#dueDate");
var formEl = $("#input-form");
var tbodyEl = $("#tbody");

var projects = JSON.parse(localStorage.getItem("projects")) || [];

var startTimer = function () {
  timerInterval = setInterval(function () {
    //this func gets called every second.
    //get the date time string every second and put on page
    var currentTime = moment().format("MMM Do, YYYY [at] hh:mm:ss a");
    timeEl.text(currentTime);
  }, 1000);
};

startTimer();

closeModalBtn.on("click", function () {
  var modalBackdrop = $(".modal-backdrop");
  modalEl.removeClass("show");
  document.body.classList.remove("modal-open");
  modalBackdrop.remove();
});

formEl.on("submit", function (event) {
  event.preventDefault();
  var name = projectNameInput.val();
  var type = projectTypeInput.val();
  var hourly = hourlyRateInput.val();
  var date = dateInput.val();
  //grab all the values from the inputs and display on page, store in localStorage;
  //need form validation first!
  if (!name || !type || !hourly || !date) return;

  var daysTillDue = moment(dateInput.val()).diff(moment(), "days"); //gets the diff in days
  var project = {
    name,
    type,
    hourly,
    date,
    daysTillDue,
    potentialEarnings: daysTillDue * 8 * hourlyRateInput.val(),
  };

  projects.push(project);
  localStorage.setItem("projects", JSON.stringify(projects));
  addRowsToTable();
});

//use the projects data to generate rows in the table
function addRowsToTable() {
  tbodyEl.empty();
  for (var i = 0; i < projects.length; i++) {
    var projectData = projects[i];
    tbodyEl.append(`<tr>
        <td>${projectData.name}</th>
        <td>${projectData.type}</td>
        <td>${projectData.hourly}</td>
        <td>${projectData.date}</td>
        <td>${projectData.daysTillDue}</td>
        <td>${projectData.potentialEarnings}</td>
        <td><button class="btn btn-danger removeProjectBtn" id=${i}>x</button</td>
        </tr>`);
  }
}

addRowsToTable();

tbodyEl.on("click", ".removeProjectBtn", function () {
  console.log($(this).attr("id"), "btn was clicked");
  projects.splice($(this).attr("id"), 1);
  localStorage.setItem("projects", JSON.stringify(projects));
  addRowsToTable();
});
