// j-text, j-html, j-on, (j-if, j-else), j-for (будет выводить текст из массива?)

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

        console.log(attr)
    }

    jOn(node) {
        
    }

    jIfElse(node) {
        
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
        textMin: '',
        par: '<p>text</p>'
    },
    methods: {
        hello() {
            alert('hello')
        }
    }
});

app.log();

// document.querySelector('${node} [j-model]').addEventListener('input', (e) => {
//     app.data.textMin = e.target.value;
// })