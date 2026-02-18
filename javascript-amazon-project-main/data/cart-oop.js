function Cart(localStorageKey) {
    const cart={
    cartItems: undefined,

    loadFromStorage(){
    this.cartItems= JSON.parse(localStorage.getItem(localStorageKey));

    if (!this.cartItems) {
        this.cartItems = [{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1',
    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2',
    }];
}
},

saveToStorage () {
    localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
},

 addToCart(productId) {
    let matchingItem;
        
        this.cartItems.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });

    if (matchingItem) {
        matchingItem.quantity+=1;
    }else {
        this.cartItems .push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: "1",
        });
    }
    this.saveToStorage();
},

 removeFromCart(productId) {
    const newCart =[];
    
    this.cartItems.forEach((item) => {
        if (item.productId !== productId) {
            newCart.push(item);
        }
    });
    this.cartItems = newCart;
    this.saveToStorage();
},

  updateDeliveryOption(productId, deliveryOptionId){
    let matchingItem;
        
        this.cartItems.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
}

};

return cart;
}

const cart=Cart('cart-oop');
const businessCart=Cart('cart-business');


cart.loadFromStorage();

businessCart.loadFromStorage();

console.log(cart);
console.log(businessCart);