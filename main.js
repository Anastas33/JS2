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

class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._getProducts()
            .then(data => {
                this.goods = [...data];
                this._render();
                document.querySelectorAll('.buy-btn').forEach(function(button) {
                    button.addEventListener('click', function(event) {
                        const cardNode = event.target.parentNode;
                        const id = cardNode.parentNode.dataset.id;
                        //не удается получить дата атрибут блока
                        const elem = {};
                        for (let product of this.goods) {
                            if (product.id_product == id) {
                                elem = product;
                            }
                        }
                        const cartElement = new CartElement(elem);
                        console.log(cartElement);
                    });
                });
            });
    }

    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(response => response.json())
            .catch(error => {
                console.log(error);
            });
    }

    calcSum() {
        return this.goods.reduce((sum, good) => sum + good.price, 0);
    }

    _render() {
        const block = document.querySelector(this.container);

        for (let product of this.goods) {
            const productObject = new ProductItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        }
    }
}

class ProductItem {
    constructor(product, img = 'https://placehold.it/200x150') {
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }

    render() {
        return `<div class="product-item data-id="${this.id}">
                    <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.title}</h3>
                        <p>${this.price} \u20bd</p>
                        <button class="buy-btn">Купить</button>
                    </div>
                </div>`;
    }
}

const productList = new ProductList();

// class Cart {
//     constructor() {
//         this.addedProducts = [];
//         this._render();
//     }

    // _render() {
    //     const block = document.querySelector('.cart');
    
    //     const cartElement = new CartElement(product);
    //     this.addedProducts.push(cartElement);
    //     block.insertAdjacentHTML('beforeend', cartElement.render());
    // }

    // addtoCart(event) {
    //     fetch(`${API}/addToBasket.json`)
    //         .then(response = response.json())
    //         .then(data => {
    //             if (data.result === 1) {
    //                 console.log('ok');
    //             }
    //         })
    //         .catch(error => console.log(error));
    // }
// }

class CartElement extends ProductItem {
    constructor(product, container = '.added') {
        super(product);
        this.container = container;
    }

    remove() {
        document.querySelector(this.container).remove();
    }
}

// new Cart();

