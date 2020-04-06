


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
      $('#alert').empty();
      tokenUser = user.access_token
      localStorage.setItem('access_token', tokenUser)
      console.log(token)
      checkUser();
    })
    .catch(err => {
      $('#alert').appen(`
      <div class="alert alert-primary" role="alert">
        ${err.message}
      </div>
      `);
    })
  })

  // LOGOUT FUNCTIONS
  $('#logout').click(function(e) {
    e.preventDefault();
    localStorage.removeItem('access_token');
    // $('.container').hide();
    $('#alert').empty();
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
      $('#alert').empty();
      checkUser();
      $('#tag').val('');
      $('#price').val('');
      $('#food-name').val('');
      $('#ingredients').val('');
    })
    .catch(err => {
      $('#alert').appen(`
      <div class="alert alert-primary" role="alert">
        ${err.message}
      </div>
      `);
    })
  })

  // DELETE FOOD
  $('#list-food').on('click', '#delete', function(e) {
    e.preventDefault();
    const id = e.currentTarget.value
    $.ajax({
      method: 'DELETE',
      url: 'http://localhost:3000/foods/' + id,
      headers: {'access_token': token}
    })
    .done(msg => {
      let message = msg.message
      $('#alert').append(`
      <div class="alert alert-primary" role="alert">
        ${message}
      </div>
      `)
      checkUser();
    })
    .catch(err => {
      $('#alert').appen(`
      <div class="alert alert-primary" role="alert">
        ${err.message}
      </div>
      `);
    })
  })
})


function checkUser() {
  $('.container').hide();
  $('#alert').show();
  token = localStorage.getItem('access_token');
  if (token) {
    $('#login-form').hide();
    $('#full-app').show();
    $('#list-food').empty();
    // get foods
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/foods',
      headers: {'access_token': token}
    })
    .done(foods => {
      foods.foods.forEach(el => {
        $('#list-food').append(`
        <div class="card">
            <div class="card-body pb-0">
              <div class="d-flex justify-content-between mb-0">
                <div class="col-9">
                  <h5 class="font-weight-bold">${el.title}</h5>
                  <p>${el.price}</p>
                </div>
                <div class="col-3 d-flex align-items-baseline">
                  <i class="fas fa-tag text-grey mr-2"></i>
                  <p class="text-grey">${el.tag}</p>
                  <button value=${el.id} id="delete" class="fas fa-trash text-danger ml-auto cursor-pointer">
                  </button>
                </div>
              </div>
              <div class="card-body border-bottom">
                ${el.ingredients}
              </div>
            </div>
          </div>
        `)
      })
    })
    .catch(err => {
      $('#alert').appen(`
      <div class="alert alert-primary" role="alert">
        ${err.message}
      </div>
      `);
    })

  } else {
    $('#login-form').show();
    console.log('not login')
  }
}