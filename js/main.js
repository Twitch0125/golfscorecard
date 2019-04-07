//global variables to store courses
var courses = new Array();
var selectedCourse = {};

function main() {
  //load courses when API info is retrieved
  showCourses();
}

function showCourses() {
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
      //animate new courses
      $(`#mdl-card-${i}`).css("background", `url(${courses[i].image})`);
      $(`#mdl-card-${i}`).on("click", function(e = courses[i]) {
        $(`#mdl-card-${i}`).effect(
          "drop",
          {
            direction: "right"
          },
          450
        );
        console.log(e);
      });
    }
  });

  $(".player-creation").hide();
  $(".score-card").hide();
}

//function that will show the player creation area after a course is selected
function showPlayers(courseId) {
  selectedCourse.id = courseId;
  $(".course-selection-title").effect("drop", {}, 450);
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

function showTable() {
  $(".player-creation-title").effect("drop", {}, 450);
  $(".player-creation-container").effect("drop", {}, 450, function(){
    $(".score-card").show(
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
//maximum of 4 players in the list
function addPlayer() {
  let textFieldValue = $("#player-textfield").val();
  //replace space characters with dashes
  //this is needed since the value is later used in an ID, and spaces are CSS selectors
  textFieldValue = textFieldValue.replace(/ /g, "-");

  //check for duplicate names
  if (textFieldValue == $(`.player-list #${textFieldValue}`).attr("id")) {
    //shake exisiting name
    $(`.player-list #${textFieldValue}`).effect(
      "shake",
      {
        distance: 13,
        times: 2
      },
      450
    );
    return 0;
  }

  //check if theres 4 players already
  if ($(".player-list li").length >= 4) {
    //shake #playerTotal
    $(`#playerTotal`).effect(
      "shake",
      {
        distance: 13,
        times: 2
      },
      450
    );
    return 0;
  } else {
    $(".player-list").append(`
<li id="${textFieldValue}" class="mdl-list__item mdl-shadow--2dp">
  <span class="mdl-list__item-primary-content">
    <i class="material-icons mdl-list__item-avatar">
      person
    </i>
    <span>${textFieldValue}</span>
  </span>
  <button onclick='deletePlayer("${textFieldValue}")'
  class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect mdl-button--colored mdl-list__item-secondary-action">
  <i class="material-icons">delete_outline</i>
</button>
</li>
`);
    //animate new list items
    $(`#${textFieldValue}`).hide();
    $(`#${textFieldValue}`).show(
      "drop",
      {
        direction: "right"
      },
      450
    );
    console.log(textFieldValue);

    //update #playerTotal
    updatePlayerTotal();

    $("#player-textfield").val("");
    $("#player-textfield").blur();
    $(".mdl-textfield").removeClass("is-focused");
    $(".mdl-textfield").removeClass("is-dirty");
  }
}

//function that updates the player total
function updatePlayerTotal() {
  //update #playerTotal element
  $("#playerTotal").html(`
  ${$(".player-list .mdl-list__item").length}/4 Players
  `);
  // do a little shake to show it was updated
  $("#playerTotal").effect(
    "shake",
    {
      direction: "up",
      distance: 1,
      times: 1
    },
    450
  );
}

//function that takes a player from the player list and removes it
function deletePlayer(player) {
  $(`#${player}`).hide("drop", {}, 450, function() {
    $(`#${player}`).remove();
    //update player total
    updatePlayerTotal();
  });
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
