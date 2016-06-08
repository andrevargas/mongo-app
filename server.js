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

//Produtos
var productSchema = mongoose.Schema({
	name: String,
	maintenances: Array,
	category: String
}, { "strict": false });

//Definição dos modelos
var Product = mongoose.model('Product', productSchema);
var Category = mongoose.model('Category', categorySchema);

// Rotas
app.get('/api/product', function(req, res){
	Product.find(function(err, products){
		if(err){
			res.send(err);
		}
		res.json(products);
	});
});

app.post('/api/product/new', function(req, res){
	Product.create({
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

app.put('/api/product/:id/maintenance/new', function(req, res){
	Product.findByIdAndUpdate(
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

app.get('/api/category', function(req, res){
	Category.find(function(err, categories){
		if(err){
			res.send(err);
		}
		res.json(categories);
	});
});

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

	Product.mapReduce(context, function(err, results) {
		if(err){
			res.send(err);
		}
		res.send(results);
	});

});

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(3000);
console.log('Application running on port 3000');
