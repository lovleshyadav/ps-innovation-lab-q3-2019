var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
var Client = require('ssh2').Client;
var config = require('../config.json');
 
 
/* GET home page. */
router.get('/', function(req, res, next) {
	  
connection.query('SELECT * FROM publisher_config where publisher_id = 1217239 ORDER BY id desc', function(err,rows) {
		if(err){
			req.flash('error', err); 
			res.render('box',{page_title:"Box - Node.js",data:''});   
		} else {	
			res.render('box',{page_title:"Box - Node.js",data:rows});
		}
	});
});

// Explore More view
router.get('/explore', function(req, res, next){    
	// render to views/user/add.ejs
	res.render('box/explore', {
		title: 'Create new widgets for explore more',
		name: '',
		email: ''        
	})
})

// try SSH query
router.post('/explore', async function(req, res, next){    
	var conn = new Client();
	var existFlag = [];

	var validate = "Select name from publishers WHERE name = '"+ req.body.name +"'";
	await connection.query(validate, function(err,rows) {
		if(err){
			req.flash('error', err); 
			return res.render('box/explore', {title: 'One click explore more', data:''}); 
		}

		if (!rows.length) {
			req.flash('error', "Publisher doesnot exist"); 
			return res.render('box/explore', {title: 'One click explore more', data:''});
		}

		var command = 'client-properties-new copy innovationlabindiateam default thumbs-feed-01-x to ' + req.body.name + ' default thumbs-feed-01-x | client-properties-new import | client-properties-new copy innovationlabindiateam default thumbs-feed-01-z to ' + req.body.name + ' default thumbs-feed-01-z | client-properties-new import | client-properties-new copy innovationlabindiateam default organic-thumbs-feed-01-x to ' + req.body.name + ' default organic-thumbs-feed-01-x | client-properties-new import | client-properties-new copy innovationlabindiateam default organic-thumbs-feed-01-z to ' + req.body.name + ' default organic-thumbs-feed-01-z | client-properties-new import | client-properties-new purge ' + req.body.name;
		conn.on('ready', function() {
	  		console.log('Client :: ready working on the server');
	  		
	  		conn.exec(command, function(err, stream) {
		    	if (err) throw err;
		   		stream.on('close', function(code, signal) {
		      	console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
		      		conn.end();
		    	}).on('data', function(data) {
		      		console.log('STDOUT: ' + data);
		    	}).stderr.on('data', function(data) {
		      		console.log('STDERR: ' + data);
		    	});
	  		});

	  		req.flash('success', "Hola Amigo!!!"); 
			res.render('box/explore', {title: 'Create new widgets for explore more', data:''});
		}).connect({
		  host: config.cpServer.host,
		  username: config.cpServer.username,
		  privateKey: require('fs').readFileSync(config.cpServer.privateKey)
		});
	}); 
})

//and attribute = "image-url-prefix";
 
 
// SHOW ADD USER FORM
// router.get('/add', function(req, res, next){    
// 	// render to views/user/add.ejs
// 	res.render('customers/add', {
// 		title: 'Add New Customers',
// 		name: '',
// 		email: ''        
// 	})
// })
 
// // ADD NEW USER POST ACTION
// router.post('/add', function(req, res, next) {    
// 	// req.assert('name', 'Name is required').notEmpty()           //Validate name
// 	// req.assert('email', 'A valid email is required').isEmail()  //Validate email
  
// 	var errors = false;
// 	console.log(res);
	 
// 	if( !errors ) {   //No errors were found.  Passed Validation!
		 
	 
// 		var user = {
// 			name: req.body.name,
// 			email: req.body.email
// 		}
		 
// 	 connection.query('INSERT INTO customers SET ?', user, function(err, result) {
// 				//if(err) throw err
// 				if (err) {
// 					req.flash('error', err)
					 
// 					// render to views/user/add.ejs
// 					res.render('customers/add', {
// 						title: 'Add New Customer',
// 						name: user.name,
// 						email: user.email                    
// 					})
// 				} else {                
// 					req.flash('success', 'Data added successfully!');
// 					res.redirect('/customers');
// 				}
// 			})
// 	}
// 	else {   //Display errors to user
// 		var error_msg = ''
// 		errors.forEach(function(error) {
// 			error_msg += error.msg + '<br>'
// 		})                
// 		req.flash('error', error_msg)        
		 
// 		/**
// 		 * Using req.body.name 
// 		 * because req.param('name') is deprecated
// 		 */ 
// 		res.render('customers/add', { 
// 			title: 'Add New Customer',
// 			name: req.body.name,
// 			email: req.body.email
// 		})
// 	}
// })
 
// // SHOW EDIT USER FORM
// router.get('/edit/(:id)', function(req, res, next){
   
// connection.query('SELECT * FROM customers WHERE id = ' + req.params.id, function(err, rows, fields) {
// 			if(err) throw err
			 
// 			// if user not found
// 			if (rows.length <= 0) {
// 				req.flash('error', 'Customers not found with id = ' + req.params.id)
// 				res.redirect('/customers')
// 			}
// 			else { // if user found
// 				// render to views/user/edit.ejs template file
// 				res.render('customers/edit', {
// 					title: 'Edit Customer', 
// 					//data: rows[0],
// 					id: rows[0].id,
// 					name: rows[0].name,
// 					email: rows[0].email                    
// 				})
// 			}            
// 		})
  
// })
 
// // EDIT USER POST ACTION
// router.post('/update/:id', function(req, res, next) {
// 	// req.assert('name', 'Name is required').notEmpty()           //Validate nam           //Validate age
// 	// req.assert('email', 'A valid email is required').isEmail()  //Validate email
  
// 	var errors = false
	 
// 	if( !errors ) {   
 
// 		var user = {
// 			name: req.body.name,
// 			email: req.body.email
// 		}
		 
// connection.query('UPDATE customers SET ? WHERE id = ' + req.params.id, user, function(err, result) {
// 				//if(err) throw err
// 				if (err) {
// 					req.flash('error', err)
					 
// 					// render to views/user/add.ejs
// 					res.render('customers/edit', {
// 						title: 'Edit Customer',
// 						id: req.params.id,
// 						name: req.body.name,
// 						email: req.body.email
// 					})
// 				} else {
// 					req.flash('success', 'Data updated successfully!');
// 					res.redirect('/customers');
// 				}
// 			})
		 
// 	}
// 	else {   //Display errors to user
// 		var error_msg = ''
// 		errors.forEach(function(error) {
// 			error_msg += error.msg + '<br>'
// 		})
// 		req.flash('error', error_msg)
		 
// 		/**
// 		 * Using req.body.name 
// 		 * because req.param('name') is deprecated
// 		 */ 
// 		res.render('customers/edit', { 
// 			title: 'Edit Customer',            
// 			id: req.params.id, 
// 			name: req.body.name,
// 			email: req.body.email
// 		})
// 	}
// })
	   
// // DELETE USER
// router.get('/delete/(:id)', function(req, res, next) {
// 	var user = { id: req.params.id }
	 
// connection.query('DELETE FROM customers WHERE id = ' + req.params.id, user, function(err, result) {
// 			//if(err) throw err
// 			if (err) {
// 				req.flash('error', err)
// 				// redirect to users list page
// 				res.redirect('/customers')
// 			} else {
// 				req.flash('success', 'Customer deleted successfully! id = ' + req.params.id)
// 				// redirect to users list page
// 				res.redirect('/customers')
// 			}
// 		})
//    })
 
 
module.exports = router;
