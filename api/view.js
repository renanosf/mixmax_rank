var model = require('./model/model.js');

module.exports = function(req, res) {
  	if(!req.params.campaign){
    	res.status(403).send('Invalid params');
    	return;
  	}

  	model.getStatus(req.params.campaign)
  	.then(function(data){
      var html = '<h4>Rank created by: <strong>' + data.user +'</strong></h4><div style="border:3px solid #99b0e1;border-radius: 4px;padding:0px 4px;">';
      html += data.html + '</div><br><small><strong>Total votes: ' + data.totalVotes + '</strong></small><br>';
      html += '<small><strong>Average rating: ' + data.avg + '</strong></small>';
  		res.status(200).send(html);
  	})
  	.catch(function(err){
      console.log(err);
  		res.status(200).send(err);
  	});
};