"use strict";

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// ПЕРЕДЕЛАНО:

// let getRequest = (url) => {
//     return new Promise ((resolve, reject) => {
//         let xhr = new XMLHttpRequest();
//         xhr.open('GET', url, true);
//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 if (xhr.status !== 200) {
//                     reject('Error!');
//                 } else {
//                     resolve(xhr.responseText);
//                 }
//             }
//         };
//         xhr.send();
//     });
// }

// getRequest(`${API}/catalogData.json`).then((data) => {
//     productList.goods = JSON.parse(data);
//     productList._render();
// }).catch((error) => {
//     console.log(error);
// });

/**
 * Описываем базовые классы
 */
class List {
    constructor (url, container, list = listContext) {
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this.filtered = [];
        this._init();
    }

    /**
     * Получение данных с сервера
     * @param {*} url 
     */
    getJson(url) {
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    /**
     * Обработка полученных данных
     * @param {*} data 
     */
    handleData(data) {
        this.goods = [...data];
        this.render();
    }

    /**
     * Подсчет стоимости всех товаров
     * @returns {number}
     */
    calcSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            console.log(this.constructor.name);
            const productObj = new this.list[this.constructor.name](product);
            console.log(productObj);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }

    /**
     * Метод поиска товаров
     * @param {*} value - поисковый запрос
     */
    filter(value) {
        const regExp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter(product => regExp.test(product.product_name));
        this.allProducts.forEach(el => {
            const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
            if (!this.filtered.includes(el)) {
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        })
    }

    _init() {
        return false;
    }
}

class Item {
    constructor (el, img = 'https://placehold.it/200x150') {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }

    render() {
        return `<div class="product-item" data-id="${this.id_product}">
                    <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.product_name}</h3>
                        <p>${this.price} \u20bd</p>
                        <button class="buy-btn"
                        data-id="${this.id_product}"
                        data-name="${this.product_name}"
                        data-price="${this.price}">Купить</button>
                    </div>
                </div>`;
    }
}

/**
 * Наследуемся от базовых классов
 */
class ProductList extends List {
    constructor (cart, container = '.products', url = '/catalogData.json') {
        super(url, container);
        this.cart = cart;
        this.getJson()
            .then(data => this.handleData(data));
    }

    _init() {
        document.querySelector(this.container).addEventListener('click', e => {
            if(e.target.classList.contains('buy-btn')) {
                this.cart.addProduct(e.target);
            }
        });
        document.querySelector('.search-form').addEventListener('submit', e => {
            e.preventDefault();
            this.filter(document.querySelector('.search-field').value);
        })
    }
}

class ProductItem extends Item {};

class Cart extends List {
    constructor (container = '.cart-block', url = '/getBasket.json') {
        super(url, container);
        this.getJson()
            .then(data => {
                this.handleData(data.contents);
            });
    }

    /**
     * Добавление товара
     * @param {*} element 
     */
    addProduct(element) {
        this.getJson(`${API}/addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find) {
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    /**
     * Удаление товаров
     * @param {*} element 
     */
    removeProduct(element) {
        this.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    /**
     * Обновляем данные корзины
     * @param {*} product 
     */
    _updateCart(product) {
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Количество: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price} \u20bd`;
    }

    _init() {
        document.querySelector('.btn-cart').addEventListener('click', e => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('del-btn')) {
                this.removeProduct(e.target);
            }
        })
    }
}

class CartItem extends Item {
    constructor (el, img = 'https://placehold.it/50x100') {
        super(el, img);
        this.quantity = el.quantity;
    }

    render() {
        return `<div class="cart-item" data-id="${this.id_product}">
                    <div class="product-bio">
                    <img src="${this.img}" alt="Some image">
                    <div class="product-desc">
                    <p class="product-title">${this.product_name}</p>
                    <p class="product-quantity">Количество: ${this.quantity}</p>
                    <p class="product-single-price">${this.price} за ед.</p>
                </div>
                </div>
                <div class="right-block">
                    <p class="product-price">${this.quantity * this.price} \u20bd</p>
                    <button class="del-btn" data-id="${this.id_product}">x</button>
                </div>
                </div>`
    }
}

const listContext = {
    ProductList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductList(cart);

// class ProductList {
//     constructor(container = '.products') {
//         this.container = container;
//         this.goods = [];
//         this.allProducts = [];
//         this._getProducts()
//             .then(data => {
//                 this.goods = [...data];
//                 this._render();
//                 document.querySelectorAll('.buy-btn').forEach(function(button) {
//                     button.addEventListener('click', function(event) {
//                         const cardNode = event.target.parentNode;
//                         const id = cardNode.parentNode.dataset.id;
//                         //не удается получить дата атрибут блока
//                         const elem = {};
//                         for (let product of this.goods) {
//                             if (product.id_product == id) {
//                                 elem = product;
//                             }
//                         }
//                         const cartElement = new CartElement(elem);
//                         console.log(cartElement);
//                     });
//                 });
//             });
//     }

//     _getProducts() {
//         return fetch(`${API}/catalogData.json`)
//             .then(response => response.json())
//             .catch(error => {
//                 console.log(error);
//             });
//     }

    

    
// }

// class ProductItem {
//     constructor(product, img = 'https://placehold.it/200x150') {
//         this.title = product.product_name;
//         this.price = product.price;
//         this.id = product.id_product;
//         this.img = img;
//     }

//     render() {
//         return `<div class="product-item data-id="${this.id}">
//                     <img src="${this.img}" alt="Some img">
//                     <div class="desc">
//                         <h3>${this.title}</h3>
//                         <p>${this.price} \u20bd</p>
//                         <button class="buy-btn">Купить</button>
//                     </div>
//                 </div>`;
//     }
// }

// const productList = new ProductList();

// // class Cart {
// //     constructor() {
// //         this.addedProducts = [];
// //         this._render();
// //     }

//     // _render() {
//     //     const block = document.querySelector('.cart');
    
//     //     const cartElement = new CartElement(product);
//     //     this.addedProducts.push(cartElement);
//     //     block.insertAdjacentHTML('beforeend', cartElement.render());
//     // }

//     // addtoCart(event) {
//     //     fetch(`${API}/addToBasket.json`)
//     //         .then(response = response.json())
//     //         .then(data => {
//     //             if (data.result === 1) {
//     //                 console.log('ok');
//     //             }
//     //         })
//     //         .catch(error => console.log(error));
//     // }
// // }

// class CartElement extends ProductItem {
//     constructor(product, container = '.added') {
//         super(product);
//         this.container = container;
//     }

//     remove() {
//         document.querySelector(this.container).remove();
//     }
// }

// // new Cart();

