/**
 * Created by luodan on 2015/10/11.
 */
//var exec = require("child_process").exec;
var querystring = require("querystring"),
    fs = require("fs"),
    //util = require('util'),
    formidable = require("formidable");

function start(response, postData){
    console.log("Request handler 'start' was called.");

    //function sleep(milliSeconds) {
    //    var startTime = new Date().getTime();
    //    while (new Date().getTime() < startTime + milliSeconds);
    //}
    //
    //sleep(10000);
    //return "Hello Start";

    //var content = "empty";
    //exec("ls -lah", function(error, stdout, stderr){
    //   content = stdout;
    //});
    //
    //return content;

    //exec("ls -lah", function(error, stdout, stderr){
    //    response.writeHead(200, {"Content-Type": "text/plain"});
    //    response.write(stdout);
    //    response.end();
    //});

    //上传文本
    //var body = '<!DOCTYPE html>'+
    //    '<html>'+
    //    '<head lang="en">'+
    //    '<meta charset="UTF-8">'+
    //    '<title>upload</title>'+
    //    '</head>'+
    //    '<body>'+
    //    '<form action="/upload" method="post">'+
    //    '<textarea name="text" rows="20" cols="60"></textarea>'+
    //    '<br/>'+
    //    '<input type="submit" value="Submit Text" />'+
    //    '</form>'+
    //    '</body>'+
    //    '</html>';

    //上传图片
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" '+
        'content="text/html; charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload" multiple="multiple">'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';

    //此时的Content-Type得为text/html
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();

}

function upload(response, request){
    console.log("Request handler 'upload' was called.");
    //return "Hello Upload";

    //response.writeHead(200,{"Content-Type": "text/plain"});
    //response.write("Hello Upload");
    //response.write("You've sent: " + querystring.parse(postData).text);
    //response.end();

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files){
        console.log("parsing done");

        /* Possible error on Windows systems:
         tried to rename to an already existing file */
        //fs.rename(files.upload.path, "/test1.png", function(err){
        //    if (err) {
        //        fs.unlink("/test1.png");
        //        fs.rename(files.upload.path, "/test1.png");
        //
        //    }
        //});

        //因为涉及到文件移动和复制，特别是跨磁盘的操作所以会报错
        //最后upload处要做一些小小的修改，原来写的是:
        //fs.renameSync(files.upload.path, "E:\\tmp\\test.png");
        //
        //要改成:
        //var is = fs.createReadStream(files.upload.path);
        //var os = fs.createWriteStream("E:\\tmp\\test.png");
        //is.pipe(os);
        //is.on('end',function(){
        //    fs.unlinkSync(files.upload.path);
        //});

        //This is another solution
        //var fs = require("fs"),
        //    util = require('util');
        //...
        //这是原来的语句：fs.renameSync(files.upload.path, "G:\\test1.png");
        //var readStream = fs.createReadStream(files.upload.path);
        //var writeStream = fs.createWriteStream("G:\\test1.png");
        //util.pump(readStream, writeStream, function() {
        //    fs.unlinkSync(files.upload.path);
        //});
        //【总结】
        //是跨分区重命名文件，会有权限问题。
        //其中此处使用的方案是，先从源文件拷贝到另外分区的目标文件，然后再unlink，就可以了。

        var is = fs.createReadStream(files.upload.path);
        var os = fs.createWriteStream("G:\\test1.png");
        is.pipe(os);
        is.on("end", function(){
            fs.unlinkSync(files.upload.path);
        });

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image: <br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response){
    console.log("Request handler 'show' was called.");
    //fs.readFile("/test1.png", "binary", function(error, file){
    //    if(error){
    //        response.writeHead(500, {"Content-Type": "text/plain"});
    //        response.write(error + "\n");
    //        response.end();
    //    } else {
    //        response.writeHead(200, {"Content-Type": "image/png"});
    //        response.write(file, "binary");
    //        response.end();
    //    }
    //});

    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("G:\\test1.png").pipe(response);
    //response.end();
}

exports.start = start;
exports.upload = upload;
exports.show = show;