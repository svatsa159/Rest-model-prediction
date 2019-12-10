var express =   require("express");
var multer  =   require('multer');
var exec = require('child_process').exec;
var fs = require('fs');
var zipFolder = require('zip-folder');
var unzipper=require('unzipper')
var ffmpeg = require("ffmpeg")
var app         =   express();
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, 'frames.zip');
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
        fs.createReadStream('./uploads/frames.zip')
  .pipe(unzipper.Extract({ path: './uploads/frames' }));
        
      

        res.end("File is uploaded");
        
    });


});

app.listen(5000,function(){
    console.log("Working on port 5000");
});
