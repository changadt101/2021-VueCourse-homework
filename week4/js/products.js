import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';

import pagination from './pagination.js';

let productModal = {};
let deleteProductModal = {};

const app = createApp({
  components: {
    pagination,
  },
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/api',
      apiPath: 'harrykuo-vuecourseurl',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {},
    };
  },
  methods: {
    getProductsListData(page = 1) {
      const url = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            const { products, pagination } = res.data;

            this.products = products;
            this.pagination = pagination;
          } else {
            const { message } = res.data;

            alert(message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setProductData(tempProduct) {
      let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
      let requestType = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/${this.apiPath}/admin/product/${tempProduct.id}`;
        requestType = 'put';
      }

      axios[requestType](url, {data: tempProduct})
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
    deleteProduct(tempProduct) {
      const url = `${this.apiUrl}/${this.apiPath}/admin/product/${tempProduct.id}`;

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

app.component('productModal', {
  props: ['tempProduct', 'isNew'],
  template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalTitle" class="modal-title">
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>
          </h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label for="mainImageUrl">主要圖片</label>
                <input v-model="tempProduct.imageUrl" id="mainImageUrl" type="text" class="form-control" placeholder="請輸入圖片連結">
                <img class="img-fluid" :src="tempProduct.imageUrl">
              </div>

              <div class="mb-1">多圖新增</div>

              <div v-if="Array.isArray(tempProduct.imagesUrl)">
                <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                  <div class="form-group">
                    <label for="imageUrl">圖片網址</label>
                    <input v-model="tempProduct.imagesUrl[key]" type="text" class="form-control" placeholder="請輸入圖片連結">
                  </div>
                  <img class="img-fluid" :src="image">
                </div>

                <div v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
                  <button class="btn btn-outline-primary btn-sm d-block w-100" @click="tempProduct.imagesUrl.push('')">新增圖片</button>
                </div>
                <div v-else>
                  <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">刪除圖片</button>
                </div>
              </div>
              <div v-else>
                <button class="btn btn-outline-primary btn-sm d-block w-100" @click="createImages">新增圖片</button>
              </div>
            </div>

            <div class="col-sm-8">
              <div class="form-group">
                <label for="titie">標題</label>
                <input type="text" id="title" v-model="tempProduct.title" class="form-control" placeholder="請輸入標題">
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="category">分類</label>
                  <input type="text" id="category" v-model="tempProduct.category" class="form-control" placeholder="請輸入分類">
                </div>
                <div class="form-group col-md-6">
                  <label for="unit">單位</label>
                  <input type="text" id="unit" v-model="tempProduct.unit" class="form-control" placeholder="請輸入單位">
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="originalPrice">原價</label>
                  <input type="number" min="0" id="originalPrice" v-model.number="tempProduct.origin_price" class="form-control" placeholder="請輸入原價">
                </div>
                <div class="form-group col-md-6">
                  <label for="salePrice">售價</label>
                  <input type="number" min="0" id="salePrice" v-model.number="tempProduct.price" class="form-control" placeholder="請輸入售價">
                </div>
              </div>

              <hr>

              <div class="form-group">
                <label for="productDescription">產品描述</label>
                <textarea id="productDescription" type="text" v-model="tempProduct.description" class="form-control" placeholder="請輸入產品描述"></textarea>
              </div>

              <div class="form-group">
                <label for="productContent">說明內容</label>
                <textarea id="productContent" type="text" v-model="tempProduct.content" class="form-control" placeholder="請輸入說明內容"></textarea>
              </div>

              <div class="form-group">
                <div class="form-check">
                  <input id="productEnabled" type="checkbox" v-model="tempProduct.is_enabled" class="form-check-input" :true-value="1" :false-value="0">
                  <label for="productEnabled" class="form-check-label">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="$emit('set-product-data', tempProduct)">確認</button>
        </div>
      </div>
    </div>
  </div>`,
  methods: {
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
});

app.component('deleteProductModal', {
  props: ['tempProduct'],
  template: `<div id="deleteProductModal" ref="deleteProductModal" class="modal fade" tabindex="-1" aria-labelledby="deleteProductModalTitle" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="deleteProductModalTitle" class="modal-title">
            <span>刪除產品</span>
          </h5>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="$emit('delete-product', tempProduct)">確認刪除</button>
        </div>
      </div>
    </div>
  </div>`,
});

app.mount('#app');