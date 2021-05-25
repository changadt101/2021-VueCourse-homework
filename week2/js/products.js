const app = {
  data: {
    apiUrl: 'https://vue3-course-api.hexschool.io/api',
    apiPath: 'harrykuo-vuecourseurl',
    products: [],
  },
  getProductsListData(page = 1) {
    let vm = this;
    const url = `${vm.data.apiUrl}/${vm.data.apiPath}/admin/products?page=${page}`;

    axios.get(url)
      .then((res) => {
        if (res.data.success) {
          vm.data.products = res.data.products;
          vm.renderProductsList();
        } else {
          alert('您尚未登入成功，請重新登入。');
          window.location = 'index.html';
        }
      });
  },
  deleteProduct() {
    let vm = this;

    if (window.confirm('你確定要刪除嗎?')) {
      const {id} = vm.dataset;
      const url = `${app.data.apiUrl}/${app.data.apiPath}/admin/product/${id}`;

      axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            app.getProductsListData();
          }
        });
    }
  },
  renderProductsList() {
    let vm = this,
      productsList = vm.data.products,
      productsListContent = '',
      productsListData = [],
      productsCount = vm.data.products.length;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const productsListElement = document.querySelector('#productsList');
    const productsCountElement = document.querySelector('#productsCount');

    productsListData = productsList.map((item) => {
      return `
        <tr>
          <td>${item.title}</td>
          <td width="120">${item.origin_price}</td>
          <td width="120">${item.price}</td>
          <td width="100">
            <span class="${item.is_enabled ? 'text-success' : 'text-secondary'}">${item.is_enabled ? '啟用' : '未啟用'}</span>
          </td>
          <td width="120">
            <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove" data-id="${item.id}">刪除</button>
          </td>
        </tr>`;
    });

    productsListContent = productsListData.reduce(reducer, productsListContent);
    productsListElement.innerHTML = productsListContent;
    productsCountElement.textContent = productsCount;

    const deleteButtons = document.querySelectorAll('.deleteBtn');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', vm.deleteProduct);
    });
  },
  created() {
    let vm = this;
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

    axios.defaults.headers.common.Authorization = token;
    vm.getProductsListData();
  },
};

app.created();