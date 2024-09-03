const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"products.json"
);

const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]);
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			if (this.id) {
				console.log(this);
				const existingProduct = products.findIndex(
					(prod) => prod.id === this.id
				);
				console.log(existingProduct);
				products[existingProduct] = this;
			} else {
				this.id = Math.random().toString();
				products.push(this);
			}
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(prodId, callback) {
		getProductsFromFile((products) => {
			console.log(prodId === products.at(0).id);
			const product = products.filter((p) => p.id == prodId).at(0);
			callback(product);
		});
	}

	static deleteById(prodId, callback) {
		getProductsFromFile((products) => {
			const productPrice = products.find((p) => p.id === prodId).price;
			const updatedProducts = products.filter((p) => prodId !== p.id);
			fs.writeFile(
				p,
				JSON.stringify(updatedProducts),
				(err) => {
					console.log(err);
				},
				(err) => {
					if (!err) {
						// remove from cart
						Cart.getCart((cart) => {
							const isProductInCart =
								cart.products.findIndex((p) => p.id === prodId) !== -1;
							if (isProductInCart) {
								Cart.deleteProduct(prodId, productPrice, callback);
							} else callback();
						});
					}
				}
			);
		});
	}
};
