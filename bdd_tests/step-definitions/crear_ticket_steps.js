const expect = require('chai').expect;
const axios = require('axios').default;

const url = 'https://shielded-shelf-11253.herokuapp.com';

const axiosInstance = axios.create({
    baseUrl: url,
    timeout: 5000
  });
  

module.exports = function(){
    this.When('creo un ticket valido', function(expression){
        console.log('expression is', expression);

        const ticket_valido = {
            "nombre": "Nombre Tickets1",
            "tipo": "consulta",
            "severidad": 2,
            "estado": "abierto",
            "cliente": 3,
            "creador": "Tomás",
            "descripcion": "Descripcion del ticket",
            "recurso": 1,
            "tareas": [
              1
            ],
            "producto": "Siu Guarani",
            "version": "1.0.0"
          }

        axiosInstance.post(url + `/tickets`, ticket_valido)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
        return true;
    })
    this.Then('se crea en la base de datos', function(res){
        console.log('res is', res);
        return true;
    })
};