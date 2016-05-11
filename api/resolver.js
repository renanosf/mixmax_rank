var fs = require('fs');
var html = fs.readFileSync("./api/script.html",'utf-8');
html = html.replace(/!!!HOST!!!/g, process.env.HOST);

module.exports = function(req, res) {
  if(!req.body.params){
    res.status(403).send('Invalid params');
    return;
  }
  var data = JSON.parse(req.body.params);
  if (!data || !data.uuid || !data.html) {
    res.status(403).send('Invalid params');
    return;
  }

  var temp = html;
  temp = temp.replace(/!!!Campaign!!!/g, data.uuid);

  res.json({
    body: '<div style="border:3px solid #99b0e1;border-radius: 4px;padding:0px 4px;">' + data.html + temp
  });
};