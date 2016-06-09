// Dependências
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var path = require('path');
var moment = require('moment');

// Configurações
mongoose.connect('mongodb://localhost/mongo-app');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

//Definição dos schemas

//Categorias
var categorySchema = mongoose.Schema({
	description: String
}, { "strict": false });

//Equipamentos
var equipmentSchema = mongoose.Schema({
	name: String,
	maintenances: Array,
	category: String
}, { "strict": false });

//Definição dos modelos
var Equipment = mongoose.model('Equipment', equipmentSchema);
var Category = mongoose.model('Category', categorySchema);

// Rotas

//Listar equipamentos
app.get('/api/equipment', function(req, res){
	Equipment.find(function(err, equipments){
		if(err){
			res.send(err);
		}
		res.json(equipments);
	});
});

//Encontrar um equipamento
app.get('/api/equipment/:id', function(req, res){
	Equipment.findById(
		req.params.id,
		function(err, equipment){
			if(err){
				res.send(err);
			}
			res.json(equipment);
		});
});

//Criar novo equipamento
app.post('/api/equipment/new', function(req, res){
	Equipment.create({
		name: req.body.name,
		maintenances: [],
		category: req.body.category.description
	}, function(err){
		if(err){
			res.send(err);
		}
		res.sendStatus(200);
	});
});

//Adicionar nova manutenção ao equipamento
app.put('/api/equipment/:id/maintenance/new', function(req, res){
	Equipment.findByIdAndUpdate(
		req.params.id,
		{$push: {"maintenances": {
				description: req.body.description,
				value: req.body.value,
				date: moment(req.body.date).format('YYYY-MM-DD HH:mm:ss')
			}
		}},
		{safe: true, upsert: false},
		function(err){
			if(err){
				res.send(err);
			}
			res.sendStatus(200);
		}
	);
});

//Listar categorias
app.get('/api/category', function(req, res){
	Category.find(function(err, categories){
		if(err){
			res.send(err);
		}
		res.json(categories);
	});
});

//Criar nova categoria
app.post('/api/category/new', function(req, res){
	Category.create({
		description: req.body.description
	}, function(err){
		if(err){
			res.send(err);
		}
		Category.find(function(err, categories){
			if(err){
				res.send(err);
			}
			res.json(categories);
		});
	});

});

//Listar relatórios
app.get('/api/report', function(req, res){

	var context = {};
	context.map = function () {
		for(i = 0; i < this.maintenances.length; i++){
			emit(this.category, this.maintenances[i].value)
		}
	};
	context.reduce = function (key, values){
		return Array.sum(values);
	}

	Equipment.mapReduce(context, function(err, results) {
		if(err){
			res.send(err);
		}
		res.send(results);
	});

});

//Enviar o arquivo manuseado pelo Angular para qualquer requisição
app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, 'client/index.html'));
});

//Aplicação executando na porta 3000
app.listen(3000);
console.log('Application running on port 3000');
