var im = require('imagemagick');
/*
im.resize({
     srcPath: 'Desert.jpg',
     dstPath: 'Desert-thumb.jpg',
     width: 200,
     height: 200,
     quality: 0.8

  }, function(error, stdout, stderror) {
    if (error) {
      console.error(error);
    }
  });

});
*/

im.convert(['Desert.jpg', '-quality', 20, 'Desert-thumb.jpg'],
  function(error, stdout, stderror){
    if (error) {
      //callback(error, null);
      console.log(error, null);
    }
});