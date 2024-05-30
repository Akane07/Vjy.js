// j-text, j-html, j-on, (j-if, j-else), j-for (будет выводить текст из массива?)
// глубокая волженность, j-model для инпутов

const signals = {};

class Vjy {
    error = false;

    constructor({ data, methods, el }) {

        const proxy = (param) => {
            const validate = {
                get(target, prop) {
                    return target[prop];
                },
                set(target, prop, value) {
                    target[prop] = value;

                    if (!signals[prop]) {
                        return true;
                    }
            
                    signals[prop].forEach(signal => signal());

                    return true;
                }
            }
            return new Proxy(param, validate);
        }

        this.data = proxy(data);
        for (let prop in data) {
            if (typeof data[prop] == 'function') {
                console.error('data не должна содержать function');
                this.error = true;
            }
        }


        
        this.methods = methods;
        for (let prop in methods) {
            if ((typeof methods[prop]) != 'function') {
                console.error('methods должны содержать только function')
                this.error = true;
            }
        }

        this.node = el;
        this.el = document.querySelector(el);
        if (!this.el) {
            console.error('el - не существует');
            this.error = true;
        }

        this.renderDOM();
    }

    renderDOM = () => {
        // здесь мы должны находить все атрибуты (директивы наши)
        // сохранять их в переменные (это будут массивы обьектов DOM)
        // и обрабатывать каждый массив в цикле, вызывая
        // для каждого обьекта DOM соответствующую функцию
        
        const jtext = document.querySelectorAll(`${this.node} [j-text]`);
        jtext.forEach(this.jText);

        const jhtml = document.querySelectorAll(`${this.node} [j-html]`);
        jhtml.forEach(this.jHTML)

        const jon = document.querySelectorAll(`${this.node} [j-on]`);
        jon.forEach(this.jOn)

        const jIfElse = document.querySelectorAll(`${this.node} [j-if]`);
        jIfElse.forEach(this.jIfElse)
    }    
    
    jText = (node) => {
        // у элемента который мы сюда передали, будем искать
        // значение атрибута j-text и тут же подставлять его

        const attr = node.attributes['j-text'].value; // это значение атрибута
        node.textContent = this.data[attr];

        this.observe(attr, () => {
            node.textContent = this.data[attr];
        })
    }

    jHTML = (node) => {
        const attr = node.attributes['j-html'].value;
        node.innerHTML = this.data[attr]

    }

    jOn = (node) => {
        const attr = node.attributes['j-on'].value.split(':');
        const attrEvent = attr[0].trim()
        const attrMethods = attr[1].trim()
        node.addEventListener(attrEvent, this.methods[attrMethods].bind(this.data))

        console.log(attrEvent);
        console.log(attrMethods);
    }

    jIfElse = (node) => {
        let attrNode = node
        let attrNodeElse = node.nextElementSibling

        const attrIf = this.data[node.attributes['j-if'].value]
        if (node.nextElementSibling.attributes['j-else'] && attrIf == false) {
            attrNode = node.style.display = 'none'
        } else {
            attrNodeElse = node.nextElementSibling.style.display = 'none'
        }
    }

    jFor(node) {
        
    }

    observe = (attr, signal) => {
        if (!signals[attr]) {
            signals[attr] = [];
        }

        signals[attr].push(signal);
    }

    log = () => {
        // if (this.error) return;
        console.log(this);

        // setInterval(() => {
        //     // this.data.textMin = this.data.textMin + 'a';
        //     console.log(this.data.textMin);
        // }, 4000)
    }
}

const app = new Vjy({
    el: '.app',
    data: {
        text: 'Hello World',
        textMin: 'gfd',
        par: '<p>text</p>',
        textBool: false

    },
    methods: {
        hello() {
            alert('hello')
        },
        reverseText() {
            console.log(this);
            this.textMin= this.textMin.split('').reverse().join('')
            
        }
    }
});

app.log();

// document.querySelector('${node} [j-model]').addEventListener('input', (e) => {
//     app.data.textMin = e.target.value;
// })