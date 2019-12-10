var express =   require("express");
var multer  =   require('multer');
var exec = require('child_process').exec;
var fs = require('fs');
var zipFolder = require('zip-folder');
var request = require("request")
var ffmpeg = require("ffmpeg")
var app         =   express();
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, 'Result.mp4');
  }
});
var upload = multer({ storage : storage}).single('file');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
          console.log(err);
            return res.end("Error uploading file.");
        }

        try {
          var process = new ffmpeg('./uploads/Result.mp4');
          process.then(function (video) {
              video.fnExtractFrameToJPG("./uploads/frames/", {
                  every_n_frames : 10
              }).then(function(){
                zipFolder('./uploads/frames', './uploads/frames.zip', function(err) {
                  if(err) {
                      console.log('oh no!', err);
                  } else {
                    var req = request.post('http://localhost:5000/api/photo', function (err, resp, body) {
            if (err) {
              console.log(err);
            } else {
              console.log('URL: ' + body);
            }
          });
          var form = req.form();
          // form.append('file', 'videoFile', {
          //   filename: './uploads/Result.mp4',
          //   contentType: 'application/mp4'
          // });
          form.append('file', fs.createReadStream('./uploads/frames.zip'));
                      console.log('EXCELLENT');
                  }
              })
              })
          }, function (err) {
              console.log('Error: ' + err);
          });
      } catch (e) {
          console.log(e);
          // console.log(e.msg);
      }
      

        res.end("File is uploaded");
        
    });


});

app.listen(4000,function(){
    console.log("Working on port 4000");
});
