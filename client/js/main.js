


let token = localStorage.getItem('access_token')

$(document).ready(function() {
  // $('.container').hide();
  checkUser();

  // LOGIN FUNCTIONS
  $('#login').submit(function(e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/login',
      data: {
        email, password
      }
    })
    .done(user => {
      console.log(user, 'user')
      tokenUser = user.access_token
      localStorage.setItem('access_token', tokenUser)
      console.log(token)
      checkUser();
    })
    .catch(err => {
      console.log(err)
    })
  })

  // LOGOUT FUNCTIONS
  $('#logout').click(function(e) {
    e.preventDefault();
    localStorage.removeItem('access_token');
    // $('.container').hide();
    checkUser();
  })

  // ADD FOOD FUNCTIONS
  $('#add-food').submit(function(e) {
    e.preventDefault();
    const title = $('#food-name').val();
    const price = $('#price').val();
    const tag = $('#tag').val();
    const ingredients = $('#ingredients').val();
    console.log(token, 'token')
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/foods',
      data: {title, price, ingredients, tag},
      headers: {'access_token': token}
    })
    .done(result => {
      console.log(result)
    })
    .catch(err => {
      console.log(result)
    })
  })
})


function checkUser() {
  $('.container').hide();
  token = localStorage.getItem('access_token');
  if (token) {
    console.log('Login')
    $('#login-form').hide();
    $('#full-app').show();
  } else {
    $('#login-form').show();
    console.log('not login')
  }
}