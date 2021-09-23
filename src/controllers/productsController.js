const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = require('../utils/toThousand');
const finalPrice =require('../utils/toDiscount');
const checkId = require('../utils/checkId');

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products',{products, toThousand, finalPrice}
		)
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const id =parseInt( req.params.id, 10)
		if(checkId(id, products)){
			let product = products.find(product => product.id === +req.params.id)
			return res.render('detail', {
				product,
				finalPrice,
				toThousand,
			})
		}else{
			res.redirect('/');
		}

	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
	
		const {name,price,discount,category,description} =req.body;
		let product = {
			id: (products[products.length-1].id + 1),
			name,
			price:+price,
			discount:+discount,
			category,
			description,
			image:'default-image.png'
		}
		products.push(product);
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8') //primer parametro donde lo guardo segundo que
		return res.redirect('/')
	},

	// Update - Form to edit
	edit: (req, res) => {
	let product = products.find(product => product.id === +req.params.id);
	return res.render('product-edit-form',{
		product
	})
	},
	// Update - Method to update
	update: (req, res) => {
		const {name,price,description,discount,category} = req.body
		products.forEach(product => {
			if(product.id === +req.params.id){
				product.id = +req.params.id;
				product.name = name;
				product.price = price;
				product.description = description;
				product.discount = discount;
				product.category = category;
			}
			fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8') //primer parametro donde lo guardo segundo que
			return res.redirect('/products/detail/:id' + req.params.id)
		});
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
	let	productsEdit = products.filter(product =>product.id !== +req.params.id);
		fs.writeFileSync(productsFilePath,JSON.stringify(productsEdit,null,2),'utf-8') //primer parametro donde lo guardo segundo que
		return res.redirect('/products/detail/:id' + req.params.id)
	}
};

module.exports = controller;