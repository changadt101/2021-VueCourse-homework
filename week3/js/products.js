import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

let productModal = {};
let deleteProductModal = {};

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/api',
      apiPath: 'harrykuo-vuecourseurl',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    getProductsListData(page = 1) {
      const url = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            const { products } = res.data;

            this.products = products;
          } else {
            const { message } = res.data;

            alert(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setProductData() {
      let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
      let requestType = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        requestType = 'put';
      }

      axios[requestType](url, {data: this.tempProduct})
        .then((res) => {
          if (res.data.success) {
            const { message } = res.data;

            alert(message);
            productModal.hide();
            this.getProductsListData();
          } else {
            const { message } = res.data;

            alert(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteProduct() {
      const url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            const { message } = res.data;

            alert(message);
            deleteProductModal.hide();
            this.getProductsListData();
          } else {
            const { message } = res.data;

            alert(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openModal(isNew, item) {
      this.tempProduct = {
        imagesUrl: [],
      };

      if (isNew === 'new') {
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        deleteProductModal.show();
      }
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

    if (token === '') {
      alert('您尚未登入，請重新登入。');
      window.location = 'index.html';
    }

    axios.defaults.headers.common.Authorization = token;

    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));

    this.getProductsListData();
  },
});

app.mount('#app');