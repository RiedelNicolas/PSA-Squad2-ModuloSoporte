// base para hardcodear todos los productos que querramos

const Product = require('./product');

class ProductHolder {
	constructor(){
		this.products = [];
		this.products.push(new Product("Siu Guarani", "1.0.0"));
		this.products.push(new Product("Campus FIUBA", "2.0"));
		this.products.push(new Product("Campus FIUBA", "2.1"));
		this.products.push(new Product("Campus FIUBA", "2.1.1"));
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
			product.version === version);
	}

	getProducts(){
		return this.products;
	}
}

module.exports = ProductHolder;