export default class Widget {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.onSubmit = this.onSubmit.bind(this);
        this.onInput = this.onInput.bind(this);
        this.numbers = /[0-9]/;
        this.regExp = /[0-9]{4}/;
    }

    static get markup() {
        return `
        <form class="innogrn-form-widget">
            <div class="icons">
                <div class="icon icon1 disabled"></div>
                <div class="icon icon2 disabled"></div>
                <div class="icon icon3 disabled"></div>
                <div class="icon icon4 disabled"></div>
                <div class="icon icon5 disabled"></div>
            </div>
            <div class="control">
                <input type="card" id="innogrn-input" class="input" placeholder="Введите номер карты">
                <button class="submit">Click to Validate</button>
            </div>
            
        </form>
        `;
    }

    static get submitSelector() {
        return '.submit';
    }

    static get inputSelector() {
        return '.input';
    }

    static get selector() {
        return '.innogrn-form-widget';
    }

    bindToDOM() {
        this.parentEl.innerHTML = Widget.markup;

        this.element = this.parentEl.querySelector(Widget.selector);
        this.submit = this.element.querySelector(Widget.submitSelector);
        this.input = this.element.querySelector(Widget.inputSelector);

        this.element.addEventListener('submit', this.onSubmit);
        this.input.addEventListener('input', this.onInput);
    }

    onInput(event) {
        event.preventDefault();
        // не позволяем ввести ничего, кроме цифр 0-9, ограничиваем размер поля 19-ю символами
        if (event.inputType === "insertText" && !this.numbers.test(event.data) || this.input.value.length > 19) {
            this.input.value = this.input.value.slice(0, this.input.value.length - 1);
            return;
        }

        // обеспечиваем работу клавиш "backspace","delete"
        let value = this.input.value
        if (event.inputType === "deleteContentBackward" && this.regExp.test(value.slice(-4))) {
            this.input.value = this.input.value.slice(0, this.input.value.length - 1);
            return;
        }

        // добавяем пробел после 4 цифр подряд
        if (this.regExp.test(value.slice(-4)) && value.length < 19) {
            this.input.value += " ";
        }

        // определяем банк
        this.redrawBank();
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.checkLuhn(this.input.value)) {
            this.input.classList.add('valid');
            this.input.classList.remove('invalid');
        } else {
            this.input.classList.add('invalid');
            this.input.classList.remove('valid');
        }
                
    }

    checkLuhn(ccn) {
        const ccnS = ccn.replace(/ /g,'').toString();
        let sum = 0;
        const parity = (ccnS.length) % 2;
        for (let i = 0; i < ccnS.length; i += 1) {
            let digit = Number(ccnS[i]);
            if (i % 2 === parity) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
        return Number(sum % 10) === 0;
    }

    getBankPay(ccn) {
        const ccnS = Array.from(ccn.replace(/ /g, '').toString());
        if(ccnS.length == 1) {
            if(ccnS[0] == '4') {
                return '.icon2';
            } else if (ccnS[0] == '5') {
                return '.icon3';
            }
        } else if (ccnS.length > 1) {
            if (ccnS[0] == '4') {
                return '.icon2';
            } else if (ccnS[0] == '5') {
                return '.icon3';
            }

            let sym = ccnS[0] + ccnS[1];

            if (sym == '60' || sym == '62' || sym == '81') {
                return '.icon5';
            }

            if (ccnS[0] == '6') {
                return '.icon4';
            }

            if(sym == '22') {
                return '.icon1';
            }
        }
        return null;
    }

    redrawBank() {
        const icons = Array.from(this.parentEl.querySelectorAll('.icon'));
        for(let icon of icons) {
            icon.classList.add('disabled');
        }
        let typeBank = this.getBankPay(this.input.value);
        if (typeBank === null) {
            return;
        }

        const iconBank = this.parentEl.querySelector(typeBank);
        iconBank.classList.remove('disabled');
    }

}