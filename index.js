const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
const app = express() 

var Publishable_Key = 'pk_test_51Kti4zIx8XaewESqy5ZNaSdu3wp8Qm37OMGKuEFmwFmDbSMusQkOXnBClsXYDIfw4OIcpcKGxAICrziqJAqmXj2z00vq3L1Ead'
var Secret_Key = 'sk_test_51Kti4zIx8XaewESqFFLC9zsSNQt4dnFwJrsYFPfmooLnsQJTyf0jnD5WkJJHAkysqPtkEidrPJbBn4BH57MEX5Zq00xIXFr3Ft'

const stripe = require('stripe')(Secret_Key) 

const port = process.env.PORT || 3000 

app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 

app.get('/', function(req, res){ 
	res.render('Home', { 
	key: Publishable_Key 
	}) 
}) 

app.post('/payment', function(req, res){ 

	stripe.customers.create({ 
		email: req.body.stripeEmail, 
		source: req.body.stripeToken, 
		name: 'Sahil Shah', 
		address: { 
			line1: 'CN Tower', 
			postal_code: 'XXX XXX', 
			city: 'Toronto', 
			state: 'ON', 
			country: 'Canada' 
		} 
	}) 
	.then((customer) => { 

		return stripe.charges.create({ 
			amount: 5000,	 
			description: 'Placeholder', 
			currency: 'CAD', 
			customer: customer.id 
		}); 
	}) 
	.then((charge) => { 
		res.send("Your Payment has been processed") 
	}) 
	.catch((err) => { 
		res.send(err)	 
	}); 
}) 

app.listen(port, function(error){ 
	if(error) throw error 
	console.log("Server Started") 
}) 