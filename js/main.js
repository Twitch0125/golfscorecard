//global variables to store courses
var courses = new Array();
var selectedCourse = {};
var players = [];

function main() {
  //load courses when API info is retrieved
  // $(".course-selection").hide();
  // $(".player-creation").hide();
  // $(".score-card").hide();
  hideElements(".mdl-spinner");
  //the timeout just keeps the spinner up for half a second... I think it feels nicer than the courses plopping into existance
  setTimeout(function() {
    showCourses();
  }, 500);
}

//function to hide the main elements: Course-selection, player-creation, score-card, and the mdl-spinner because I needed it
//optional exception parameter, exception is the jquery element
function hideElements(exception) {
  let modules = {
    courseSelection: ".course-selection",
    playerCreation: ".player-creation",
    scoreCard: ".score-card",
    mdlSpinner: ".mdl-spinner"
  };

  if (exception) {
    //find exception in our modules
    for (let item in modules) {
      if (modules[item] === exception) {
        continue;
      } else {
        $(modules[item]).hide();
      }
    }
  } else {
    for (let item in modules) {
      $(modules[item]).hide();
    }
  }
}

function showCourses() {
  //code to run that depends on API generated content
  $(".mdl-spinner").hide("fade", {}, 250);

  getCourses().then(coursesAPI => {
    console.log(coursesAPI);
    courses = coursesAPI.courses;
    console.log("courses", courses);
    $(".course-card-container").html("");

    for (let i = 0; i < courses.length; i++) {
      $(".course-card-container").append(`
      <div id="mdl-card-${i}" onclick='selectCourse(${
        courses[i].id
      }), showPlayers()' class="mdl-card-image mdl-card mdl-shadow--24dp">
      <div class="mdl-card__title mdl-card--expand"></div>
      <div class="mdl-card__actions mdl-card--border">
      <span class="mdl-card-image__filename">${courses[i].name}</span>
      </div>
      </div>
      `);
      //animate new courses
      $(`#mdl-card-${i}`).css("background", `url(${courses[i].image})`);
      $(`#mdl-card-${i}`).css("background-position", "center");

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

  $(".course-selection-title").show("fade", {}, 750);
  $(".course-card-container").show("fade", {}, 750);
}

function selectCourse(courseId) {
  //get the course that was selected
  getCourse(courseId).then(course => {
    selectedCourse = course;
  });
}

//function that will show the player creation area after a course is selected
function showPlayers(courseId) {
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
  $(".player-creation-container").effect("drop", {}, 450, function() {
    $(".score-card").show(
      "drop",
      {
        direction: "right"
      },
      450
    );
  });
  // reset table for when the table is selected again
  $(".table-body").html("");
  $(".table-head").html(`
    <th class="mdl-data-table__cell--non-numeric">Hole</th>
    <th class="mdl-data-table__cell--non-numeric">Yardage</th>
    <th class="mdl-data-table__cell--non-numeric">Handicap</th>
    <th class="mdl-data-table__cell--non-numeric">PAR</th>
    `);

  // load course name
  $(".score-card h1").html(`${selectedCourse.data.name}`);
  //load player names into the table
  if (players.length == 0) {
    $(".table-head").html(`
    <th class="mdl-data-table__cell--non-numeric">Hole</th>
    <th class="mdl-data-table__cell--non-numeric">Yardage</th>
    <th class="mdl-data-table__cell--non-numeric">Handicap</th>
    <th class="mdl-data-table__cell--non-numeric">PAR</th>
    `);
  } else {
    for (let i = 0; i < players.length; i++) {
      $(".table-head").append(`
  
      <th>${players[i]}'s score</th>
        `);
      $(".table-totals").append(`<th id="${players[i]}-total"></th>`);
    }
  }

  //load each hole's number, yardage, handicap, and PAR
  for (let i = 0; i < selectedCourse.data.holeCount; i++) {
    //var for current hole in loop
    let curHole = selectedCourse.data.holes[i];
    //variable for the hole number
    let holeNum = curHole.hole;
    //variable for the yardage. only going off the first teeBox...for now
    let holeYardage = curHole.teeBoxes[0].yards;
    //variable for handicap
    let holeHCP = curHole.teeBoxes[0].hcp;
    //variable for PAR
    let holePar = curHole.teeBoxes[0].par;

    //insert values into the table
    $(".table-body").append(`
    <tr>
      <td class="mdl-data-table__cell--non-numeric hole-total">${holeNum}</td>
      <td class="mdl-data-table__cell--non-numeric yardage-total">${holeYardage}</td>
      <td class="mdl-data-table__cell--non-numeric">${holeHCP}</td>
      <td class="mdl-data-table__cell--non-numeric par-total">${holePar}</td>
    </tr>
      `);
  }
  //add textfields for each player
  if (players.length == 0) {
    $(".player-cell").remove;
    componentHandler.upgradeDom();
  } else {
    for (let i = 0; i < players.length; i++) {
      $(".table-body tr").append(`
            <td class="mdl-data-table__cell--non-numeric player-cell">
              <div class="mdl-textfield mdl-js-textfield score-textfield">
                <input class="mdl-textfield__input ${
                  players[i]
                }Score" onblur="getPlayerTotal('${
        players[i]
      }')" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="${players[i]}Score">
                <label class="mdl-textfield__label" for="${
                  players[i]
                }Score">Score...</label>
                <span class="mdl-textfield__error">Input is not a number!</span>
              </div>
            </td>
              `);
    }
  }

  //total all scores
  getTotal();
  componentHandler.upgradeDom();
}

function getPlayerTotal(player) {
  let playerScore = 0;

  for (let i = 0; i < $(`.${player}Score`).length; i++) {
    let playerValue = $(`.${player}Score`)[i].value;
    console.log(playerValue, "playerValue");
    playerValue = parseInt(playerValue);
    console.log(playerValue, "playerValue parsed");
    if (playerValue == NaN || playerValue == undefined) {
      break;
    } else {
      playerScore += playerValue;
      console.log(playerScore, "playerScore End");
    }
  }
  $(`#${player}-total`).html(playerScore);
}

function getTotal(player, score) {
  let yardageTotal = 0;
  let parTotal = 0;

  // calculate yardage and par totals
  for (let i = 0; i < $(".yardage-total").length; i++) {
    yardageTotal += parseInt($(".yardage-total")[i].innerHTML);
  }

  for (let i = 0; i < $(".par-total").length; i++) {
    parTotal += parseInt($(".par-total")[i].innerHTML);
  }

  $("#hole-total").html($(".hole-total").length);
  $("#yardage-total").html(yardageTotal);
  $("#par-total").html(parTotal);
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
    players.push(textFieldValue);
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
    "bounce",
    {
      distance: 5,
      times: 1
    },
    450
  );
}

//function that takes a player from the player list and removes it
function deletePlayer(player) {
  $(`#${player}`).hide("drop", {}, 450, function() {
    //remove from players[]
    for (let i = 0; i < players.length; i++) {
      if (players[i] == player) {
        players.splice(i, 1);
      }
    }
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
