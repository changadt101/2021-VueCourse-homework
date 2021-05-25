const usernameInputField = document.querySelector('#username');
const passwordInputField = document.querySelector('#password');
const signinForm = document.querySelector('#signinForm');

let login = (e) => {
  e.preventDefault();

  const apiUrl = 'https://vue3-course-api.hexschool.io';
  const url = `${apiUrl}/admin/signin`;
  const userInfo = {
    username: usernameInputField.value,
    password: passwordInputField.value,
  };

  axios.post(url, userInfo)
    .then((res) => {
      if (res.data.success) {
        const {token, expired} = res.data;

        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
        window.location = 'products.html';
      } else {
        const {message} = res.data;
        
        alert(message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

signinForm.addEventListener('submit', login);