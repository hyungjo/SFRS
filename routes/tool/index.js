var express = require('express');
var router = express.Router();
var profile = './configs/gProfile.json';
var vision = require('google-vision-api-client');
var requtil = vision.requtil;

var fs = require('fs');

router.get('/img/:imgdir', function(req, res, next) {
  fs.readFile('./uploads/'+req.params.imgdir, function(err, data){
    if(err)
      console.log('==========' + err);
    res.writeHead(200, { 'Content-Type': 'text/html'});
    res.end(data);
  });
});

router.get('/img/tag/:imgdir', function(req, res, next) {
  var tags = [];

  vision.init("./configs/gProfile.json");

  //Build the request payloads
  var d = requtil.createRequests().addRequest(
              requtil.createRequest("./uploads/" + req.params.imgdir)
                  .withFeature('LABEL_DETECTION', 5)
                  .build());

  vision.query(d, function(e, r, d){
      if(e){
        console.log('ERROR:', e);
      } else{
        console.log('Success:');
        for(var i = 0; i < d.responses[0].labelAnnotations.length; i++)
          tags.push(d.responses[0].labelAnnotations[i].description);
        console.log(tags);
        res.json(tags);
      }
  });
});

module.exports = router;
