"use strict";

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        addToCartUrl: '/addToBasket.json',
        delFromCartUrl: '/deleteFromBasket.json',
        products: [],
        cartProducts: [],
        imgCatalog: 'https://placehold.it/200x150',
        imgCart: 'https://placehold.it/50x100',
        searchLine: '',
        filtered: [],
        isVisible: false,
        isEmpty: false
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        filterGoods() {
            const regExp = new RegExp(this.searchLine, 'i');
            this.filtered = this.products.filter(product => regExp.test(product.product_name));
            this.products.forEach(el => {
                const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
                if (!this.filtered.includes(el)) {
                    block.classList.add('invisible');
                } else {
                    block.classList.remove('invisible');
                }
            })
        },
        addProduct(element) {
            this.getJson(`${API + this.addToCartUrl}`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = +element.id_product;
                        let find = this.cartProducts.find(product => product.id_product === productId);
                        if (find) {
                            find.quantity++;
                        } else {
                            element.quantity = 1;
                            this.cartProducts.push(element);
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
        removeProduct(element) {
            this.getJson(`${API + this.delFromCartUrl}`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = +element.id_product;
                        let find = this.cartProducts.find(product => product.id_product === productId);
                        if (find.quantity > 1) {
                            find.quantity--;
                        } else {
                            this.cartProducts.splice(this.cartProducts.indexOf(find), 1);
                            document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
    },
    mounted(){
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                }
            });
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                console.log(this);
                for(let el of data.contents){
                    this.cartProducts.push(el);
                }
            });
    }
});

/**
 * Описываем базовые классы
 */
// class List {
//     constructor (url, container, list = listContext) {
//         this.container = container;
//         this.list = list;
//         this.url = url;
//         this.goods = [];
//         this.allProducts = [];
//         this.filtered = [];
//         this._init();
//     }

//     /**
//      * Получение данных с сервера
//      * @param {*} url 
//      */
//     getJson(url) {
//         return fetch(url ? url : `${API + this.url}`)
//             .then(result => result.json())
//             .catch(error => {
//                 console.log(error);
//             })
//     }

//     /**
//      * Обработка полученных данных
//      * @param {*} data 
//      */
//     handleData(data) {
//         this.goods = [...data];
//         this.render();
//     }

//     /**
//      * Подсчет стоимости всех товаров
//      * @returns {number}
//      */
//     calcSum() {
//         return this.allProducts.reduce((accum, item) => accum += item.price, 0);
//     }

//     render() {
//         const block = document.querySelector(this.container);
//         for (let product of this.goods) {
//             console.log(this.constructor.name);
//             const productObj = new this.list[this.constructor.name](product);
//             console.log(productObj);
//             this.allProducts.push(productObj);
//             block.insertAdjacentHTML('beforeend', productObj.render());
//         }
//     }

//     /**
//      * Метод поиска товаров
//      * @param {*} value - поисковый запрос
//      */
//     filter(value) {
//         const regExp = new RegExp(value, 'i');
//         this.filtered = this.allProducts.filter(product => regExp.test(product.product_name));
//         this.allProducts.forEach(el => {
//             const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
//             if (!this.filtered.includes(el)) {
//                 block.classList.add('invisible');
//             } else {
//                 block.classList.remove('invisible');
//             }
//         })
//     }

//     _init() {
//         return false;
//     }
// }

// class Item {
//     constructor (el, img = 'https://placehold.it/200x150') {
//         this.product_name = el.product_name;
//         this.price = el.price;
//         this.id_product = el.id_product;
//         this.img = img;
//     }

//     render() {
//         return `<div class="product-item" data-id="${this.id_product}">
//                     <img src="${this.img}" alt="Some img">
//                     <div class="desc">
//                         <h3>${this.product_name}</h3>
//                         <p>${this.price} \u20bd</p>
//                         <button class="buy-btn"
//                         data-id="${this.id_product}"
//                         data-name="${this.product_name}"
//                         data-price="${this.price}">Купить</button>
//                     </div>
//                 </div>`;
//     }
// }

// /**
//  * Наследуемся от базовых классов
//  */
// class ProductList extends List {
//     constructor (cart, container = '.products', url = '/catalogData.json') {
//         super(url, container);
//         this.cart = cart;
//         this.getJson()
//             .then(data => this.handleData(data));
//     }

//     _init() {
//         document.querySelector(this.container).addEventListener('click', e => {
//             if(e.target.classList.contains('buy-btn')) {
//                 this.cart.addProduct(e.target);
//             }
//         });
//         document.querySelector('.search-form').addEventListener('submit', e => {
//             e.preventDefault();
//             this.filter(document.querySelector('.search-field').value);
//         })
//     }
// }

// class ProductItem extends Item {};

// class Cart extends List {
//     constructor (container = '.cart-block', url = '/getBasket.json') {
//         super(url, container);
//         this.getJson()
//             .then(data => {
//                 this.handleData(data.contents);
//             });
//     }

//     /**
//      * Добавление товара
//      * @param {*} element 
//      */
//     addProduct(element) {
//         this.getJson(`${API}/addToBasket.json`)
//             .then(data => {
//                 if (data.result === 1) {
//                     let productId = +element.dataset['id'];
//                     let find = this.allProducts.find(product => product.id_product === productId);
//                     if (find) {
//                         find.quantity++;
//                         this._updateCart(find);
//                     } else {
//                         let product = {
//                             id_product: productId,
//                             price: +element.dataset['price'],
//                             product_name: element.dataset['name'],
//                             quantity: 1
//                         };
//                         this.goods = [product];
//                         this.render();
//                     }
//                 } else {
//                     alert('Error');
//                 }
//             })
//     }

//     /**
//      * Удаление товаров
//      * @param {*} element 
//      */
//     removeProduct(element) {
//         this.getJson(`${API}/deleteFromBasket.json`)
//             .then(data => {
//                 if (data.result === 1) {
//                     let productId = +element.dataset['id'];
//                     let find = this.allProducts.find(product => product.id_product === productId);
//                     if (find.quantity > 1) {
//                         find.quantity--;
//                         this._updateCart(find);
//                     } else {
//                         this.allProducts.splice(this.allProducts.indexOf(find), 1);
//                         document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
//                     }
//                 } else {
//                     alert('Error');
//                 }
//             })
//     }

//     /**
//      * Обновляем данные корзины
//      * @param {*} product 
//      */
//     _updateCart(product) {
//         let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
//         block.querySelector('.product-quantity').textContent = `Количество: ${product.quantity}`;
//         block.querySelector('.product-price').textContent = `${product.quantity * product.price} \u20bd`;
//     }

//     _init() {
//         document.querySelector('.btn-cart').addEventListener('click', e => {
//             document.querySelector(this.container).classList.toggle('invisible');
//         });
//         document.querySelector(this.container).addEventListener('click', e => {
//             if (e.target.classList.contains('del-btn')) {
//                 this.removeProduct(e.target);
//             }
//         })
//     }
// }

// class CartItem extends Item {
//     constructor (el, img = 'https://placehold.it/50x100') {
//         super(el, img);
//         this.quantity = el.quantity;
//     }

//     render() {
//         return `<div class="cart-item" data-id="${this.id_product}">
//                     <div class="product-bio">
//                     <img src="${this.img}" alt="Some image">
//                     <div class="product-desc">
//                     <p class="product-title">${this.product_name}</p>
//                     <p class="product-quantity">Количество: ${this.quantity}</p>
//                     <p class="product-single-price">${this.price} за ед.</p>
//                 </div>
//                 </div>
//                 <div class="right-block">
//                     <p class="product-price">${this.quantity * this.price} \u20bd</p>
//                     <button class="del-btn" data-id="${this.id_product}">x</button>
//                 </div>
//                 </div>`
//     }
// }

// const listContext = {
//     ProductList: ProductItem,
//     Cart: CartItem
// };

// let cart = new Cart();
// let products = new ProductList(cart);
