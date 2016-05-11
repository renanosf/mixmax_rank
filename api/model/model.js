var redis = require('../../lib/redis.js');
var Promise = require('promise');

var Model = function(){};

Model.prototype.getStatus = function(campaign){
	var t = this;

	var promise = new Promise(function(resolve,reject){
		t.getInfoCampaign(campaign)
		.then(function(info){
			info = JSON.parse(info);
			return t.getScore(info,campaign);
		})
		.then(function(info){
			resolve(info);
		})
		.catch(function(err){
			reject(err);
		})
	});
	
	return promise;
};

Model.prototype.getScore = function(info,campaign){
	var promise = new Promise(function(resolve,reject){
		redis.client.zrange("voted:campaign:" + campaign,0,-1,"WITHSCORES",function(err,response){
			var count = 0;
			var votes = 0;
			for(var i = 0; i < response.length; i++){
				if(i%2 == 0){
					votes++;
				}else{
					count += parseInt(response[i]);
				}
			}
			info.totalVotes = votes;
			info.avg = count/votes;
			resolve(info);
		});
	});
	
	return promise;
};

Model.prototype.getInfoCampaign = function(campaign){
	var promise = new Promise(function(resolve,reject){
		redis.client.get("campaign:" + campaign,function(err,response){
			if(response === null) reject("Unavailable rank");
			else resolve(response);
		});
	});
	
	return promise;
};

Model.prototype.vote = function(params){
	var t = this;

	var promise = new Promise(function(resolve,reject){
		t.isMemeber(params.campaign,params.user)
		.then(function(){
			return t.hasVoted(params.campaign,params.user);
		})
		.then(function(){
			return t.confirmVote(params);
		})
		.then(function(msg){
			resolve(msg);
		})
		.catch(function(err){
			reject(err);
		});
	});
	
	return promise;
};

Model.prototype.hasVoted = function(campaign,user){
	var promise = new Promise(function(resolve,reject){
		redis.client.zrank("voted:campaign:" + campaign,user,function(err,response){
			if(response === null) resolve();
			else reject("You already voted!");
		});
	});
	
	return promise;
};

Model.prototype.confirmVote = function(params){
	var promise = new Promise(function(resolve,reject){
		redis.client.zadd("voted:campaign:" + params.campaign,"INCR",params.rating,params.user,function(err){
			if(err) reject("Ouch!!! Something went wrong");
			else resolve("Your vote has been recorded!");
		});
	});
	
	return promise;
};

Model.prototype.isMemeber = function(campaign,user){
	var promise = new Promise(function(resolve,reject){
		redis.client.sismember("recipients:campaign:" + campaign,user,function(err,response){
			if(response) resolve();
			else reject("You're not eligible to vote");
		});
	});
	
	return promise;
};

Model.prototype.activateCampaign = function(data){

	var t = this;

	var promise = new Promise(function(resolve,reject){
		var info = {hash : data.params.uuid, user : data.user, data : new Date(), html : data.params.html};
		t.setCampaign(info,data.params.uuid)
		.then(function(){
			return t.listRecipients(data.toRecipients,data.ccRecipients,data.params.uuid);
		})
		.then(function(){
			resolve();
		})
		.catch(function(err){
			reject(err);
		})
	});

	return promise;
};

Model.prototype.setCampaign = function(info,campaign){
	var promise = new Promise(function(resolve,reject){
		redis.client.set("campaign:" + campaign,JSON.stringify(info),function(err){
			if(err) reject(err);
			else resolve();
		});
	});
	
	return promise;
};

Model.prototype.listRecipients = function(to,cc,campaign){

	var promise = new Promise(function(resolve,reject){
		var promises = [];
		for(var i = 0; i < to.length; i++){
			promises.push(insertListRecipients(to[i].email,campaign));
		}

		for(var i = 0; i < cc.length; i++){
			promises.push(insertListRecipients(cc[i].email,campaign));
		}

		Promise.all(promises)
		.then(function(){
			resolve();
		})
		.catch(function(err){
			reject(err);
		});
	});
	
	return promise;
};

var insertListRecipients = function(member,campaign){
	var promise = new Promise(function(resolve,reject){
		redis.client.sadd("recipients:campaign:" + campaign,member,function(err){
			if(err) reject(err);
			else resolve();
		});
	});
	
	return promise;
};

module.exports = new Model();