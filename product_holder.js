// base para hardcodear todos los productos que querramos

const Product = require('./product');

class ProductHolder {
	constructor(){
		this.products = [];
		this.products.push(new Product("Siu Guarani", ["1.0.0"]));
		this.products.push(new Product("Proyecto 2", ["2.0", "2.1", "2.1.1"]));
		this.products[0].addTicket(7);
		this.products[1].addTicket(3);
	}

	addProduct(product){
		this.products.push(product);
	}

	addTicket(name, version, ticket){
		let product = this.getByNameAndVersion(name, version);

		product.addTicket(ticket);
	}

	getByNameAndVersion(name, version){
		return this.products.find(product => 
			product.name === name && 
			product.versions.find(prodVersion => 
				prodVersion === version)
			);
	}
}

module.exports = ProductHolder;