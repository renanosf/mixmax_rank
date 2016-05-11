var model = require('./model/model.js');

module.exports = function(req, res) {
  	if(!req.params.campaign || !req.params.rating || !req.params.user){
    	res.status(403).send('Invalid params');
    	return;
  	}

  	model.vote(req.params)
  	.then(function(message){
  		res.status(200).send(message);
  	})
  	.catch(function(err){
      console.log(err);
  		res.status(200).send(err);
  	});
};