$(document).ready(function(){

    var ctx = $('#canvas')[0].getContext("2d");

    var image = new Image();
    image.src = './images/fortnite-map-clipped.png';
    image.onload = function(){
        ctx.drawImage(this,0,0);
        $('#cover').fadeOut();
    }
    
    $('#where').click(function(){
        var map = $('#map');

        var top = Math.floor(Math.random()*map.height()-30);
        var left = Math.floor(Math.random()*map.width()-30);

        var testTop = (1000/map.height())*top;
        var testLeft = (1000/map.width())*left;

        var timeOut = true;

        setTimeout(function(){
            timeOut = false;
            //console.log('timed out');
        }, 2000);

        while(isOnWater(testLeft,testTop) || isOnEdge(left, top) && timeOut){
            //console.log('new' + ' timeout: '+timeOut);
            
            top = Math.floor(Math.random()*map.height());
            left = Math.floor(Math.random()*map.width());

            testTop = (1000/map.height())*top;
            testLeft = (1000/map.width())*left;
        }

        // console.log('--------------');
        // console.log(isOnWater(testLeft,testTop));
        // console.log('top', top);
        // console.log('left', left);
        // console.log('--------------');

        $('#pointer').css({
            top: top,
            left: left,
            borderWidth: '1',
            transform: 'scale(10)'
        });
        setTimeout(function(){
            $('#pointer').css({
                borderWidth: '4',
                transform: 'scale(1)'
            });
        },300)
    });


    function isOnEdge(left, top){
        var map = $('#map');
        var range = 50;

        if(between(left, -range, range) || between(left, map.width()-range, map.width()+range)){
            return true;
        }
        if(between(top, -range, range) || between(top, map.height()-range, map.height()+range)){
            return true;
        }
        return false;
    }

    function isOnWater(left, top){
        var colors = averageColor(left, top);
        var waterColors = averageColor(10, 10);

        var compValue = 25;

        var bR = between(colors.red, waterColors.red-compValue, waterColors.red+compValue);
        var bG = between(colors.green, waterColors.green-compValue, waterColors.green+compValue);
        var bB = between(colors.blue, waterColors.blue-compValue, waterColors.blue+compValue);

        return bR&&bG&&bB;
    }


    function averageColor(left,top){
        var width = 10;
        var height = 10;

        var imageData = ctx.getImageData(left, top, width, height);
        var mapPixel = imageData.data;

        var red = 0,
        green = 0,
        blue = 0,
        nb_pixels = width * height;
        for(var i=0;i<nb_pixels;i+=4) {
            red += mapPixel[i];
            green += mapPixel[i+1];
            blue += mapPixel[i+2];
            // mapPixel[i+3] is the component of transparency, I do not think it will be useful to you. Useless with jpg that does not support transparency.
        }
        nb_pixels = nb_pixels / 4;
        red = Math.round(red/nb_pixels);
        green = Math.round(green/nb_pixels);
        blue = Math.round(blue/nb_pixels);
        return {red: red,green: green,blue: blue}; // components of the average color
    }

    function between(x, min, max) {
        return x >= min && x <= max;
      }
});