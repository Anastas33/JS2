'use strict';

class Feedback {
    constructor() {
        this._init();
    }

    _init() {
        document.querySelector('.feedback-form').addEventListener('submit', e => {
            e.preventDefault();
            this.checkForm(e.target);
        })
    }

    checkForm(element) {
        let arg = null;
        let block = null;
        for (let i = 0; i < 4; i++) {
            arg = document.querySelector(`.${element[i].classList.value}`).value;
            block = document.querySelector(`.${element[i].classList.value}`);
            function showError() {
                block.classList.add('redBorder');
                alert('Вы неправильно заполнили форму');
            }

            switch (element[i].classList.value) {
                case 'feedback-name':
                    if (/[а-яёa-z]/i.test(arg)) {
                        block.classList.remove('redBorder');
                    } else {
                        showError();
                    }
                    break;
                case 'feedback-tel':
                    if (/\+7\(\d{3}\)\d{3}-\d{4}$/.test(arg)) {
                        block.classList.remove('redBorder');
                    } else {
                        showError();
                    }
                    break;
                case 'feedback-email':
                    if (/([\w\.-]+)@\w+\.ru/.test(arg)) {
                        block.classList.remove('redBorder');
                    } else {
                        showError();
                    }
                    break;
                case 'feedback-text':
                    if (/[а-яёa-z]/i.test(arg)) {
                        block.classList.remove('redBorder');
                    } else {
                        showError();
                    }
                    break;
                default:
                    break;
            }
        }
    }
}

const feedback = new Feedback();
