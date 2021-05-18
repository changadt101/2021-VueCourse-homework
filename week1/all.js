const productTitleInput = document.getElementById('productTitle');
const originalPriceInput = document.getElementById('originalPrice');
const salePriceInput = document.getElementById('salePrice');
const addProductButton = document.getElementById('addProduct');
const clearAllProductsButton = document.getElementById('clearAllProducts');
const productsList = document.getElementById('productsList');
const productsCount = document.getElementById('productsCount');

let productsListData = [];

let addProduct = () => {
  let productTitle = productTitleInput.value,
    originalPriceText = originalPriceInput.value,
    salePriceText = salePriceInput.value,
    originalPrice = valueConvert(originalPriceText) || 0,
    salePrice = valueConvert(salePriceText) || 0;

  if (productTitle !== '') {
    productsListData.push({
      id: Math.floor(Date.now()),
      title: productTitle.trim(),
      originalPrice,
      salePrice,
      isEnable: false,
    });

    renderProductsList(productsListData);

    clearProductInputValue(productTitleInput);
    clearProductInputValue(originalPriceInput);
    clearProductInputValue(salePriceInput);
  }
};

let valueConvert = (value) => parseInt(value, 10);

let clearProductInputValue = (element) => {
  element.value = '';
};

let renderProductsList = (data) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  let listResult = '',
    dataCount = data.length,
    dataConvert = [];

  dataConvert = data.map((item) => {
    return `
      <tr>
        <td>${item.title}</td>
        <td width="120">${item.originalPrice}</td>
        <td width="120">${item.salePrice}</td>
        <td width="100">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="${item.id}" ${item.isEnable ? 'checked' : ''} data-action="switch" data-id="${item.id}">
            <label class="form-check-label" for="${item.id}">${item.isEnable ? '啟用' : '未啟用'}</label>
          </div>
        </td>
        <td width="120">
          <button type="button" class="btn btn-sm btn-outline-danger move" data-action="remove" data-id="${item.id}">刪除</button>
        </td>
      </tr>`;
  });

  listResult = dataConvert.reduce(reducer, listResult);

  productsList.innerHTML = listResult;
  productsCount.textContent = dataCount;
};

let clearAllProducts = (e) => {
  e.preventDefault();
  productsListData = [];
  renderProductsList(productsListData);
};

let switchProductsListItemStatus = (id) => {
  let idNumber = valueConvert(id);

  productsListData.forEach((item) => {
    if (item.id === idNumber) {
      item.isEnable = !item.isEnable;
    }
  });

  renderProductsList(productsListData);
};

let removeProductsListItem = (id) => {
  let index = 0,
    idNumber = valueConvert(id);

  productsListData.forEach((item, key) => {
    if (item.id === idNumber) {
      index = key;
    }
  });

  productsListData.splice(index, 1);
  renderProductsList(productsListData);
};

let handleProductsListItemAction = (e) => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;

  if (action === 'switch') {
    switchProductsListItemStatus(id);
  } else if (action === 'remove') {
    removeProductsListItem(id);
  }
};

addProductButton.addEventListener('click', addProduct);
clearAllProductsButton.addEventListener('click', clearAllProducts);
productsList.addEventListener('click', handleProductsListItemAction);

renderProductsList(productsListData);