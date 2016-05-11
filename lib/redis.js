var redis = require("redis"),
client = redis.createClient({host : 'localhost'});

var connected = false;

client.on("error",function(error){
	console.log("erro");
});

client.on("reconnecting",function(data){
	connected = false;
	console.log("reconnecting");
});

client.on("ready",function(){
	connected = true;
	console.log("Redis está pronto para uso");
});

client.on("connect",function(){
	console.log("Conectou com Redis");
});

module.exports = {
	client : client,
	isConnected : function(){
		return connected;
	}
};