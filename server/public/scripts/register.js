const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPw = document.querySelector('#confirm');

document
  .querySelector('.needs-validation')
  .addEventListener('submit', async (e) => {
    e.target.querySelectorAll('input').forEach((input) => {
      if (input.classList.contains('is-invalid') || input.value.length === 0) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

username.addEventListener('change', (e) => {
  const specialChars = /[^a-zA-Z0-9 ]/g;
  e.preventDefault();
  if (
    username.value.length < 4 ||
    username.value.length > 10 ||
    username.value.match(specialChars)
  ) {
    username.classList.remove('is-valid');
    username.classList.add('is-invalid');
  } else {
    username.classList.remove('is-invalid');
    username.classList.add('is-valid');
  }
});

email.addEventListener('change', (e) => {
  e.preventDefault();
  if (email.value.length < 10 || email.value.length > 40) {
    email.classList.remove('is-valid');
    email.classList.add('is-invalid');
  } else {
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
  }
});

password.addEventListener('change', (e) => {
  e.preventDefault();

  const isAllPresent = (str) => {
    const pattern = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$'
    );
    if (pattern.test(str)) return true;
    return false;
  };

  if (
    password.value.length < 4 ||
    password.value.length > 12 ||
    !isAllPresent(password.value)
  ) {
    password.classList.remove('is-valid');
    password.classList.add('is-invalid');
  } else {
    password.classList.remove('is-invalid');
    password.classList.add('is-valid');
  }
});

confirmPw.addEventListener('change', (e) => {
  e.preventDefault();

  if (confirmPw.value !== password.value) {
    confirmPw.classList.remove('is-valid');
    confirmPw.classList.add('is-invalid');
  } else {
    confirmPw.classList.remove('is-invalid');
    confirmPw.classList.add('is-valid');
  }
});
