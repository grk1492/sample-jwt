//modules dont nou aurons besoins
var express = require('express');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');

//On instancie le server
var app = express();

//Configuration des routes
app.get('/api',function(req,res){
	
	res.json({
		message:"Test de l'API sur Postman"
	});
});
//verifyToken permet de proteger la route avec une authentication
app.post('/api/posts',verifyToken, (req,res) => { 

	jwt.verify(req.token, 'secretkey',(error,authData)=> {
		if(error){
			res.status(403);
		}else {
			res.json({
				message: 'Post created...',
				authData
			});
		}
	});

	
	
});
//Route qui utilise jwt
app.post('/api/login', (req,res) =>{
	//Creation fake user
	const user = {
		id:1,
		username:"Grace",
		email:"carter77@live.fr"
	}

	jwt.sign({user},'secretkey',{expiresIn:'30s'},(err,token) =>{
		res.json({
			token
		});
	});
});

//Formatage du token
//Authorization: Bearer <access_token>

//function verifyToken utiliser plus haut 
function verifyToken(req, res, next) {
   const bearerheader = req.headers['authorization'];
   //Verify si le bearer n'est pas défini
   if(typeof bearerheader !== 'undefined') {
   		//split at space
   		const bearer = bearerheader.split(" ");
   		//récupère le token du tableau
   		const bearerToken = bearer[1];
   		//Set le token
   		req.token = bearerToken;
   		//Next middleware
   		next();
   } else {
   	 //Interdit
   	 res.send("Not Allowed here error " + 403);
   }
}

app.listen(3000,function(){
	console.log('The server listen in port 3000');
});
