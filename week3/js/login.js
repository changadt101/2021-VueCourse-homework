import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const url = `${this.apiUrl}/admin/signin`;

      axios.post(url, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data;

            document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
            window.location = 'products.html';
          } else {
            const { message } = res.data;

            alert(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    const usernameInputElement = document.querySelector('#username');

    usernameInputElement.focus();
  },
});

app.mount('#app');