"use strict";

const products = [
    {id: 1, title: "Notebook", price: 20000},
    {id: 2, title: "Mouse", price: 1500},
    {id: 3, title: "Keyboard", price: 5000},
    {id: 4, title: "Gamepad", price: 4500},
];

/* const renderProduct = (title, price, color = "white", img = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRVZwwnmI8ZtMX6gOgMH3N5pu1P84DNznv9ZD6zPDZwGJ7V3Fee&usqp=CAU") => {
    return `<div class="product-item">
                <h3>${title}</h3>
                <p>${price}</p>
                <p>${color}</p>
                <img src=${img} alt="img">
                <button class="by-btn">Добавить в корзину</button>
            </div>`;
}; */

// стрелочная функция в сокращенном написании
const renderProduct = (title, price, color = "white", img = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRVZwwnmI8ZtMX6gOgMH3N5pu1P84DNznv9ZD6zPDZwGJ7V3Fee&usqp=CAU") => `<div class="product-item"> <h3>${title}</h3> <p>${price}</p> <p>${color}</p> <img src=${img} alt="img"> <button class="by-btn">Добавить в корзину</button> </div>`;

/* const renderProducts = (list) => {
    const productList = list.map((good) => {
        return renderProduct(good.title, good.price);
    });
    document.querySelector(".products").innerHTML = productList;
} */

// чтобы продукты отображались без запятых
const renderProducts = (list) => {
    list.forEach(function(good) {
        document.querySelector(".products").insertAdjacentHTML('beforeend', renderProduct(good.title, good.price));
    });
}

renderProducts(products);

// Запятая выводится из-за того, что productList - это массив, элементы в нем отделяются ","
  