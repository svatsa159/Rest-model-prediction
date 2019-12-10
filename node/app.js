var express =   require("express");
var multer  =   require('multer');
var exec = require('child_process').exec;
var restler = require("restler")
var request = require("request")
var fs = require('fs');
var app         =   express();
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, 'Result.mp4');
  }
});
var upload = multer({ storage : storage}).single('videoFile');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
          console.log(err);
            return res.end("Error uploading file.");
        }
        
        dir = exec("ffmpeg -ss 0 -i ./uploads/Result.mp4 -t 30 -c copy ./uploads/Final.mp4", function(err, stdout, stderr) {
          if (err) {
            // should have err.code here?  
            console.log(err)
          }
          console.log(stdout);
        });
       
        var req = request.post('http://130.211.228.187:4000/api/photo', function (err, resp, body) {
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
        form.append('file', fs.createReadStream('./uploads/Final.mp4'));
        // form.submit('http://localhost:4000/api/photo', function(err, res) {
        //   // res – response object (http.IncomingMessage)  //
        //   res.resume();
        // });


        //   fs.stat("./uploads/Final.mp4", function(err, stats) {
        //     restler.post("http://localhost:4000/api/photo", {
        //         multipart: true,
        //         data: {
        //           "folder_id": "0",
        //             "filename": restler.file("./uploads/Final.mp4", null, stats.size, null, "application/mp4")
        //         }
        //     }).on("complete", function(data) {
        //         console.log(data);
        //     });
        // });
        
        res.end("File is uploaded");
    });


});

app.listen(3000,function(){
    console.log("Working on port 3000");
});
