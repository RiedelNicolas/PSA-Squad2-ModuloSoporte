class Product {
	// un producto puede tener muchas versiones
	constructor(name, versions){
		this.name = name;
		this.versions = versions;
		this.tickets = [];
	}

	// para poder agregar mas versiones a un producto ya existente
	addNewVersion(version) {
		this.versions.push(version);
	}

	addTicket(ticket) {
		this.tickets.push(ticket);
	}

	getTickets() {
		return this.tickets;
	}
}


module.exports = Product;