const productName = document.querySelector("#productName");
const productPrice = document.querySelector("#productPrice");
const productCategory = document.querySelector("#productCategory");
const productDescription = document.querySelector("#productDescription");
const productImage = document.querySelector("#productImage");
const btnAdd = document.querySelector("#addProduct");
const btnUpdate = document.querySelector("#updateProduct");
const productsBox = document.querySelector(".products-box");
const ProductsFromLocalStorage = localStorage.getItem("products");

let selectedProductIndex = null;
let products = [];

if (ProductsFromLocalStorage) {
  products = JSON.parse(ProductsFromLocalStorage);
  displayProducts(products);
}

function addProduct() {
  const isValid =
    validationLength(productName, 3) &&
    validationLength(productCategory, 3) &&
    validationLength(productDescription, 10) &&
    validationLength(productPrice, 1) &&
    validationImage();

  if (isValid) {
    const file = productImage.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const product = {
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        description: productDescription.value,
        image: e.target.result,
      };
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));
      displayProducts(products);

      clearInputs();
    };

    reader.readAsDataURL(file);
  }
}

function displayProducts(productsList) {
  let productsCartoon = "";

  for (let i = 0; i < productsList.length; i++) {
    productsCartoon += `
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="card p-0">
          <img src="${productsList[i].image}" alt="${productsList[i].name}" class="card-img-top">
          <div class="card-body">
            <h4 class="card-title fw-bold">${productsList[i].name}</h4>
            <p class="card-text mb-2 clamp">${productsList[i].description}</p>
            <div class="d-flex gap-4 mb-4">
              <span class="fs-5 fw-bold text-success">${productsList[i].price}$</span>
              <span class="px-2 bg-warning rounded-3 d-flex justify-content-center align-items-center text-nowrap text-ellipsis">${productsList[i].category}</span>
            </div>
            <div class="d-flex gap-2">
            <button type="button" onclick="addItsDateToInputs(${i})" class="btn btn-success flex-grow-1">Update</button>
            <button type="button" class="btn btn-danger flex-grow-1" onclick="deleteProduct(${i})">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  productsBox.innerHTML = productsCartoon;
}

function addItsDateToInputs(index) {
  selectedProductIndex = index;
  const selectedProduct = products[index];
  productName.value = selectedProduct.name;
  productPrice.value = selectedProduct.price;
  productCategory.value = selectedProduct.category;
  productDescription.value = selectedProduct.description;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  btnAdd.classList.add("d-none");
  btnUpdate.classList.remove("d-none");
}

function updateProduct() {
  const updateImage = productImage.files[0];
  let isValid =
    validationLength(productName, 3) &&
    validationLength(productCategory, 3) &&
    validationLength(productDescription, 10) &&
    validationLength(productPrice, 1);

  if (updateImage) {
    isValid = isValid && validationImage();
  }

  if (isValid) {
    let product = {
      name: productName.value,
      price: productPrice.value,
      category: productCategory.value,
      description: productDescription.value,
      image: products[selectedProductIndex].image,
    };
    if (updateImage) {
      const reader = new FileReader();
      reader.onload = function (e) {
        product.image = e.target.result;
      };

      reader.readAsDataURL(updateImage);
    }

    products.splice(selectedProductIndex, 1, product);
    localStorage.setItem("products", JSON.stringify(products));

    displayProducts(products);

    btnAdd.classList.remove("d-none");
    btnUpdate.classList.add("d-none");
  }
}

btnUpdate.addEventListener("click", updateProduct);

btnAdd.addEventListener("click", addProduct);

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts(products);
}

function clearInputs() {
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productDescription.value = "";
  productImage.value = "";
}

function validationLength(input, numOfChar) {
  const nextSibling = input.nextElementSibling;
  const hasNextError =
    nextSibling && nextSibling.classList.contains("text-danger");
  const hasInputError = input.classList.contains("is-invalid");
  if (input.value.length < numOfChar) {
    if (!hasInputError) {
      const errorMessage = document.createElement("p");
      errorMessage.append(
        `Enter at least ${numOfChar} ${
          input === productPrice ? "number" : "characters"
        }.`
      );
      errorMessage.classList.add("text-danger", "mb-0");
      input.after(errorMessage);
    }
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  } else {
    if (hasNextError) {
      nextSibling.remove();
    }
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

productName.addEventListener("blur", () => validationLength(productName, 3));

productCategory.addEventListener("blur", () =>
  validationLength(productCategory, 3)
);
productDescription.addEventListener("blur", () =>
  validationLength(productDescription, 10)
);
productPrice.addEventListener("blur", () => validationLength(productPrice, 1));

inputEvent(productName, 3);
inputEvent(productCategory, 3);
inputEvent(productDescription, 10);
inputEvent(productPrice, 1);

function validationPrice() {
  productPrice.value = productPrice.value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\..*/g, "$1");
}

productPrice.addEventListener("input", validationPrice);

function inputEvent(input, length) {
  input.addEventListener("input", () => {
    const isContainError = input.classList.contains("is-invalid");
    if (isContainError) {
      validationLength(input, length);
    }
  });
}

function validationImage() {
  const image = productImage.files[0];
  const errorMessage = productImage.nextElementSibling;
  const regexImage = /^image\//;

  if (image) {
    if (regexImage.test(image.type)) {
      if (errorMessage) {
        errorMessage.remove();
      }
      productImage.classList.remove("is-invalid");
      productImage.classList.add("is-valid");
      return true;
    } else {
      if (!errorMessage) {
        const errorMessageElement = document.createElement("p");
        errorMessageElement.classList.add("text-danger", "mb-0");
        errorMessageElement.append(
          "Choose only An image for the product, not any file."
        );
        productImage.after(errorMessageElement);
      } else {
        errorMessage.innerHTML =
          "Choose only An image for the product, not any file.";
      }
      productImage.classList.remove("is-valid");
      productImage.classList.add("is-invalid");
      return false;
    }
  }
  if (!errorMessage) {
    const errorMessageElement = document.createElement("p");
    errorMessageElement.classList.add("text-danger", "mb-0");
    errorMessageElement.append("Choose An image for the product.");
    productImage.after(errorMessageElement);
  } else {
    errorMessage.innerHTML = "Choose An image for the product.";
  }
  productImage.classList.remove("is-valid");
  productImage.classList.add("is-invalid");

  return false;
}

productImage.addEventListener("change", validationImage);
