document.querySelector('#lead-form').addEventListener('submit', function (e) {
  e.preventDefault();
  document.querySelector('#form-message').style.display = 'inline';
  this.reset();
});

