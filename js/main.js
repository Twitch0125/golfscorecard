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
  $(".course-selection").hide();
  $(".player-creation").show();
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

main();
