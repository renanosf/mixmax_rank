var model = require('./model/model.js');

module.exports = function(req, res) {
  	if(!req.body.params){
    	res.status(403).send('Invalid params');
    	return;
  	}

  	model.activateCampaign(req.body)
  	.then(function(data){
  		res.status(200).send("");
  	})
  	.catch(function(err){
  		console.log(err);
  		res.status(500).send("");
  	});
};