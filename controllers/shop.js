const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([products]) => {
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products",
			});
		})
		.catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.then(([result]) => {
			const product = result[0];
			res.render("shop/product-detail", {
				product,
				pageTitle: product.title,
				path: `/products/${product.id}`,
			});
		})
		.catch((error) => {
			console.log(error);
			res.redirect("/");
		});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then(([products]) => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
			});
		})
		.catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			let cartProducts = {};
			cart.products.forEach((p) => {
				cartProducts[p.id] = {
					qty: p.qty,
				};
			});
			const cartProductIds = Object.keys(cartProducts);

			products.forEach((p) => {
				if (cartProductIds.includes(p.id)) {
					cartProducts[p.id] = {
						...cartProducts[p.id],
						...p,
					};
				}
			});

			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				cart: {
					totalPrice: cart.totalPrice ?? 0,
					products: Object.values(cartProducts) ?? [],
				},
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	const id = req.body.productId;

	Product.findById(id, (product) => {
		if (product) {
			Cart.addProduct(product.id, product.price, () => {
				Cart.getCart((cart) => console.log(cart));
			});
		}
	});

	res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
	res.render("shop/orders", {
		path: "/orders",
		pageTitle: "Your Orders",
	});
};

exports.getCheckout = (req, res, next) => {
	res.render("shop/checkout", {
		path: "/checkout",
		pageTitle: "Checkout",
	});
};

exports.removeFromCart = (req, res, next) => {
	const productId = req.params.productId;

	Product.findById(productId, (product) => {
		Cart.getCart((cart) => {
			const productQty = cart.products.find((i) => i.id === productId).qty;
			const totalPrice = cart.totalPrice - productQty * product.price;
			const updatedCartProduct = cart.products.filter(
				(product) => product.id !== productId
			);
			Cart.updateCart({ totalPrice, products: updatedCartProduct }, () => {
				res.redirect("/cart");
			});
		});
	});
};
