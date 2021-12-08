
// utilidad para sumar dias a una fecha
Date.prototype.addDays = function(baseDate, days) {
	var date = new Date(baseDate.toString());
	date.setDate(date.getDate() + days);
	return date;
}


class Severity {
	constructor() {
		this.mapping = {1: 7, 2: 30, 3: 90, 4: 360};
	}

	// devuelve el timestamp a partir de la fecha de creacion del ticket
	fromDateMapping(severity, creationDate) {
		return Date.prototype.addDays(creationDate, this.mapping[severity]).getTime();
	}

}


module.exports = Severity;