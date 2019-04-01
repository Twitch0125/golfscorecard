//global variables to store courses
var courses = new Array();
var selectedCourse = {};

function main() {
  //code to run that depends on API generated content
  getCourses().then(coursesAPI => {
    console.log(coursesAPI);
    courses = coursesAPI.courses;
    console.log("courses", courses);

    for (let i = 0; i < courses.length; i++) {
      $(".course-card-container").append(`
        <div id="mdl-card-${i}" onclick='showPlayers(${
        courses[i].id
      })' class="mdl-card-image mdl-card mdl-shadow--6dp">
        <div class="mdl-card__title mdl-card--expand"></div>
        <div class="mdl-card__actions mdl-card--border">
        <span class="mdl-card-image__filename">${courses[i].name}</span>
        </div>
        </div>
        `);
      $(`#mdl-card-${i}`).css("background", `url(${courses[i].image})`);
      $(`#mdl-card-${i}`).on("click", function(e = courses[i]) {
        console.log(e);
      });
    }
  });

  $(".player-creation").hide();
}

//function that will show the player creation area after a course is selected
function showPlayers(courseId) {
  selectedCourse.id = courseId;
  $(".course-selection-title").effect(
    "drop",
    {
      direction: "left"
    },
    450
  );
  $(".course-card-container").effect("drop", {}, 450, function() {
    $(".player-creation").show(
      "drop",
      {
        direction: "right"
      },
      450
    );
  });
}

//returns a promise with the Courses object
function getCourses() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://golf-courses-api.herokuapp.com/courses/`);
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(JSON.parse(this.responseText));
      }
    };
    xhr.setRequestHeader("ContentType", "application/json");
    xhr.send();
  });
}

//function to get a specific course given an ID
//returns a promise with the course
function getCourse(id) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`);
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        resolve(JSON.parse(this.responseText));
      }
    };
    xhr.setRequestHeader("ContentType", "application/json");
    xhr.send();
  });
}

//will add a player to the player-list element
//gets player name from the #player-textfield element
function addPlayer() {
  $(".player-list").append(`
<li class="mdl-list__item">
  <span class="mdl-list__item-primary-content">
    <i class="material-icons mdl-list__item-avatar">
      person
    </i>
    <span class="player">${$('#player-textfield').val()}</span>
    <a class="mdl-list__item-secondary-action" href='#'><i class="material-icons mdl-list__item-icon">
        delete_outline
      </i></a>
  </span>
</li>
`);
}

//function to check the keyUp event that was passed to it
//also is given the element of where it was called just so we can be extra specific
function checkKey(event, id) {
  switch (event.key) {
    case "Enter":
      // if Enter was hit on the #player-textfield element
      // call addPlayer() which will add a player to the player-list element
      if (id === "player-textfield") {
        addPlayer();
      }
      break;
  }
}

main();
