function main() {
  //global variable to store courses
  let courses = new Array();
  for (let i = 0; i < courses.length; i++) {
    $(".data").append(`<img src="${courses[i].image}"> </div>`);
  }
}

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
getCourses().then(element => {
  console.log(element);
  courses = element.courses;
  console.log("courses", courses);
  main();
});
