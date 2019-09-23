var express = require('express');
var router = express.Router();
var connection  = require('../lib/db');
var Client = require('ssh2').Client;
var config = require('../config.json');
 
 
/* GET home page. */
router.get('/', function(req, res, next) {
	  
connection.query('SELECT * FROM trc.publisher_config where publisher_id = 1217239 ORDER BY id desc', function(err,rows) {
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
		data: '',
		pubName: ''       
	})
})

// DFP and Infinite code template
router.get('/code-template', function(req, res, next){    
	// render to views/user/add.ejs
	res.render('box/code-template', {
		title: 'Create new widgets for explore more',
		name: '',
		email: ''        
	})
})

// Publisher look up view
router.get('/lookup', function(req, res, next){    
	// render to views/user/add.ejs
	res.render('box/mainpage', {
			title: 'Publisher Lookup',
			data: '',       
			newLoad: true
		})
})


router.post('/lookup', async function(req, res, next){   
	var pubLookup = "select (select id from trc.publishers where id = "+req.body.name+") as id,"+" (select name from trc.publishers where id = "+req.body.name+") as name,"+" (select country from trc.publishers where id = "+req.body.name+") as country,"+" (select currency from trc.publishers where id = "+req.body.name+") as currency,"+" (select url from trc.publishers where id = "+req.body.name+") as url,"+" (select value from trc.publisher_config where publisher_id = "+req.body.name+" and attribute like '%is_visible%') as is_visible,"+" (select count(*) from trc.videos where publisher_id = "+req.body.name+" and is_recommendable = 1 and is_manual_recommendable = 1 and has_expired = 0 and was_removed = 0 )as reccoomendable_items,"+" (select count(*) from apps_config.pc_users where publisher_id = "+req.body.name+") as user,"+" (select max(last_disconnected_date) from trc.sp_affiliations_connectivity where affiliate_id = "+req.body.name+" and last_disconnected_date is not null) as last_db_disconnect_date,"+" (select case when (select count(*) from trc.publisher_config where publisher_id= "+req.body.name+" and attribute like '%organic-recommendations-matrix%') > 0 then 'Generated' else 'Not Generated' end as is_publisher_hybrid ) as is_publisher_hybrid,"+" (select case when (select ((select count(*) from trc.publisher_content_lookback where publisher_id = "+req.body.name+" and max_age is not null) + (select count(*) from trc.publisher_placement_lookback where publisher_id = "+req.body.name+"))) > 0 Then 'Lookback present' else 'No Lookback Configured' end) as lookback, (select count(*) from trc.videos where publisher_id = "+req.body.name+" and id not in (select id from trc.videos where publisher_id = "+req.body.name+" and is_recommendable = 1 and is_manual_recommendable = 1 and has_expired = 0 and was_removed = 0)) as non_recommendable, (select count(*) from trc_client.modes where version_id in (select version_id from trc_client.versions where publisher_id = "+req.body.name+") and mode_name like '%abp%') as number_of_abp_widgets, (select count(*) from trc_client.modes where version_id in (select version_id from trc_client.versions where publisher_id = "+req.body.name+" and mode_name <> 'rbox-blended')) as number_of_widgets, (select tier from analysts.publishers_in_tiers_dynamic where publisher_id = "+req.body.name+") as tier";

	// var command = 'SELECT id from publishers where id = "' +req.body.name+'"';
	await connection.query(pubLookup, function(err,rows) {
		if(err){
			console.log("************************** - - -PUB Lookup Error --- **********\n\n\n\n\n");
			console.log(err);
			console.log("\n\n\n\n\n***************************************************************");
			req.flash('error', err); 
			res.render('box/mainpage',{data: '', newLoad: false});   
		} 

		req.flash('sucess', "Please see the data below");
		res.render('box/mainpage',{data: rows}); 


	});


// 	connection.query(command2, function(err,rows) {
// 		if(err){
// 			req.flash('error', err); 
// 			res.render('box/mainpage',{data: ''});   
// 		} else {	
// 			allPubData.query2 = rows;
// 		}
// 	});
})

router.post('/explore', async function(req, res, next){    
	var conn = new Client();
	var validate = "Select name from trc.publishers WHERE name = '"+ req.body.name +"'";
	
	connection.query(validate, function(err,rows) {
		if(err){
			req.flash('error', err); 
			return res.render('box/explore', {title: 'One click explore more', data:'', pubName: ''}); 
		}

		if (!rows.length) {
			req.flash('error', "Publisher doesnot exist"); 
			return res.render('box/explore', {title: 'One click explore more', data:'', pubName: ''});
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

	  		req.flash('success', "Widgets are being created, they will render within 2-3 min"); 
			res.render('box/explore', {title: 'Create new widgets for explore more', data:'', pubName: req.body.name});
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
