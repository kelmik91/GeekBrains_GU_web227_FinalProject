$( function () {
    $( "#slider-range").slider({
        range:true,
        min: 0,
        max: 500,
        value: [75, 300],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.value[0] + " - $" + ui.value[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" +$("#slider-range").slider("values", 1));
});

const app = new Vue({
    el: '#app',
    data: {
        search: '',
        products: [],
        productsIndex: [],
        productsSing: [],
        filtered: [],
        showCart: false,
        cartItems: [],
        totalCart: 0,
    },
    methods: {
        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => console.log(error));
        },
        addProduct(product) {
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            if (find) {
                find.quantity++
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.cartItems.push(prod);
            }
            this.total();
        },
        remove(product) {
            if (product.quantity > 1) {
                product.quantity--
            } else {
                this.cartItems.splice(this.cartItems.indexOf(product), 1)
            }
            this.total();
        },
        clear() {
          this.cartItems = [];
          this.total();
        },
        filter(){
            let regexp = new RegExp(this.search, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        },
        total() {
            this.totalCart = 0;
            for (i = 0; i < this.cartItems.length; i++) {
                this.totalCart += this.cartItems[i].price * this.cartItems[i].quantity;
            }
        },
    },
    mounted(){
        this.getJson(`db/products.json`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                    this.filtered.push(el);
                }
                for (let i = 0; i < 8; i++) {
                    this.productsIndex.push(this.products[i]);
                }
                for (let i = 0; i < 4; i++) {
                    this.productsSing.push(this.products[i]);
                }
            });
        this.getJson(`db/userCart.json`)
            .then(data => {
                for (let el of data.contents) {
                    this.cartItems.push(el);
                }
                this.total();
            });
    },
});