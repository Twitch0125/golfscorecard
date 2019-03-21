function getCourse() {
  $.get(`https://golf-courses-api.herokuapp.com/courses
  `, data =>{
    console.log(data);
    
  })
}

getCourse();