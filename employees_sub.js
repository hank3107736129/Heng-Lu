'use strict';
var express = require('express');
var router = express.Router();
var User = require('./app/models/users_sql');
var multer  = require('multer');
var mysql   = require('mysql');
var upload = multer({ dest: 'www/upload/' });
var con = mysql.createConnection({
	 host:"localhost",
	 user:"root",
	 password:"xxxxxxx",
	 database:"employees"
});
con.connect(function(err){
	if(err){
		console.log('connecting error');
		return;
	}
	console.log('connecting success');
	
});




router.get('/',function(req,res){

	var sql = "SELECT * FROM employees.emp";
    con.query(sql,function(err,result){
    	if(err)throw err;
    	
    	res.json(result);
    });
	
		
			
	
	
}).
get('/:id',function(req,res){
	var id = req.url.slice(1);
	var sql = "SELECT * FROM employees.emp WHERE id="+id;
    con.query(sql,function(err,result){
    	if(err)throw err;
    	
    	res.json(result);
    });
	
	
}).
get('/report/:name',function(req,res){
	var name = req.url.slice(8);
	console.log(name);
	 var sql = "SELECT * FROM employees.emp WHERE name='"+name+"'";
    con.query(sql,function(err,result){
   	if(err)throw err;
    	
    	res.json(result);
   });
	
	
}).
// get('/count/:name',function(req,res){
// 	var name = req.url.slice(7);
// 	 var sql = "SELECT COUNT(*) FROM employees.emp WHERE manager='"+name+"'";
//     con.query(sql,function(err,result){
//    	if(err)throw err;
    	
//     	res.json(result);
    	
//     	console.log(result);
//    });
	
	
// }).


get('/manager/:manager',function(req,res){
	var manager = req.url.slice(9);
	console.log(manager);
	 var sql = "SELECT * FROM employees.emp WHERE manager='"+manager+"'";
    con.query(sql,function(err,result){
   	if(err)throw err;
    	
    	res.json(result);
   });
	
	
}).



post('/',function(req,res){

			    	//console.log(req.file);
			   var sql = "INSERT INTO employees.emp (name,title,phone,email,manager,report,img_path) VALUES ('"
                
                + req.body.name + "','"
                + req.body.title + "','"
                + req.body.phone + "','"
                 + req.body.email + "','"
                 + req.body.manager + "','"
                 + req.body.report + "','"
 
                + req.body.img_path + "')";
			    		con.query(sql,function(err,result){
			    			if(err)throw err;
			    			
			    		});

			    		res.json('success');
			    		
}).
post('/upload/',upload.single('file'),function(req,res,next){

			    	//console.log(req.file);
			   var sql = "INSERT INTO employees.emp (name,title,phone,email,manager,report,img_path) VALUES ('"
                
                + req.body.obj.name + "','"
                + req.body.obj.title + "','"
                + req.body.obj.phone + "','"
                 + req.body.obj.email + "','"
                 + req.body.obj.manager + "','"
                 + req.body.obj.report + "','/upload/"
 
                + req.file.filename + "')";
			    		con.query(sql,function(err,result){
			    			if(err)throw err;
			    			
			    		});

			    		res.json('success');
			    		
}).
put('/:id',function(req,res){


	var id = req.url.slice(1);
	//console.log(id);
	console.log(req.body);
	var name =req.body.name;
	var title = req.body.title;
	var phone = req.body.phone;
	var email = req.body.email;
	var manager = req.body.manager;
	var report = req.body.report;
	var img_path = req.body.img_path;

	var sql = "UPDATE employees.emp SET name = '"+ name+"', title= '"+title+"', phone= '"+phone+"', email= '"+email+"',manager= '"+manager+"', report= '"+report+"', img_path= '"+img_path+"' WHERE id= '"+id+"'";
    
    console.log(sql);
    con.query(sql,function(err,result){
    	if(err)throw err;
    	
    	res.json("work");
    });
	

     
}).
put('/upload/:id',upload.single('file'),function(req,res,next){


	var id = req.url.slice(8);
	console.log(id);
	var name =req.body.obj.name;
	var title = req.body.obj.title;
	var phone = req.body.obj.phone;
	var email = req.body.obj.email;
	var manager = req.body.obj.manager;
	var report = req.body.obj.report;
	var img_path = "/upload/"+req.file.filename;

	var sql = "UPDATE employees.emp SET name = '"+ name+"', title= '"+title+"', phone= '"+phone+"', email= '"+email+"',manager= '"+manager+"', report= '"+report+"', img_path= '"+img_path+"' WHERE id= '"+id+"'";
    
    console.log(sql);
    con.query(sql,function(err,result){
    	if(err)throw err;
    	
    	res.json("work");
    });
	

     
}).
delete('/:id',function(req,res){


	var id = req.url.slice(1);
    var sql = "Delete FROM employees.emp WHERE id="+id;
    con.query(sql,function(err,result){
    	if(err)throw err;
    	
    	res.json("work");
    });
	


})

router.get('/DeleteUser', function(req, res) {
	res.render('Delete User');
});


 module.exports = router;

