class Product {
	// un producto puede tener muchas versiones
	constructor(name, version){
		this.name = name;
		this.version = version;
		this.tickets = [];
	}

	addTicket(ticket) {
		this.tickets.push(ticket);
	}

	getTickets() {
		return this.tickets;
	}
}


module.exports = Product;