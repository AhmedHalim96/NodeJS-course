const path = require("path");
const fs = require("fs");

const p = path.join(
	path.dirname(require.main.filename),
	"data",
	"products.json"
);

module.exports = class Product {
	constructor(title) {
		this.title = title;
	}

	save() {
		fs.readFile(p, (err, data) => {
			let products = [];
			if (!err) {
				products = JSON.parse(data);
			}
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (e) => {
				console.log(e);
			});
		});
	}

	static fetchAll(callback) {
		return fs.readFile(p, (err, data) => {
			if (err) callback([]);
			else callback(JSON.parse(data));
		});
	}
};
