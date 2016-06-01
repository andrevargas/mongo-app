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

//Definição do schema
var productSchema = mongoose.Schema({
	name: String,
	maintences: Array
}, { "strict": false });

//Definição do modelo
var Product = mongoose.model('Product', productSchema);

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
		maintences: []
	}, function(err){
		if(err){
			res.send(err);
		}
		res.sendStatus(200);
	});
});

app.put('/api/product/:id/maintence/new', function(req, res){
	Product.findByIdAndUpdate(
		req.params.id,
		{$push: {"maintences": {
				description: req.body.description,
				value: req.body.value,
				date: moment(req.body.date, 'YYYY-MM-DD HH:mm:ss')
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

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(3000);
console.log('Application running on port 3000');
