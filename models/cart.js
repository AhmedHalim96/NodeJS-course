const fs = require("fs");
const path = require("path");
const Product = require("./product");

const cartPath = path.join(
	path.dirname(require.main.filename),
	"data",
	"cart.json"
);
module.exports = class Cart {
	static getCart(callback) {
		fs.readFile(cartPath, (err, data) => {
			if (err) callback({ products: [], totalPrice: 0 });
			else {
				try {
					const parsed = JSON.parse(data);
					callback(parsed);
				} catch (error) {
					callback({ products: [], totalPrice: 0 });
				}
			}
		});
	}

	static updateCart(newCart, callback) {
		fs.writeFile(
			cartPath,
			JSON.stringify(newCart),
			(err) => {
				console.log(err);
			},
			callback
		);
	}

	static addProduct(productId, productPrice, callback) {
		this.getCart((cart) => {
			const existingProductIndex = cart.products.findIndex(
				(i) => i.id === productId
			);

			console.log(existingProductIndex);
			if (existingProductIndex !== -1) {
				const prevQuantity = cart.products.at(existingProductIndex).qty;
				cart.products[existingProductIndex].qty = prevQuantity + 1;
			} else {
				console.log(cart.products);
				cart.products = [...cart.products, { id: productId, qty: 1 }];
			}

			cart.totalPrice = cart.totalPrice + +productPrice;

			this.updateCart(cart, callback);
		});
	}

	static deleteProduct(productId, productPrice, callback) {
		this.getCart(({ products, totalPrice }) => {
			const productQty = products.find((p) => p.id === productId).qty;
			const newTotalPrice = totalPrice - productPrice * productQty;
			const updatedCartProducts = products.filter((p) => p.id !== productId);

			this.updateCart(
				{
					products: updatedCartProducts,
					totalPrice: newTotalPrice,
				},
				callback
			);
		});
	}
};
