$(document).ready(function(){

    firebase.database().ref('frd/counter').on('value', function(snap){
        //console.log(snap.val());
        $('#count-num').html(numberWithCommas(snap.val()));
    });

    var ctx = $('#canvas')[0].getContext("2d");

    var image = new Image();
    image.src = './images/FNBR_clipped.png';
    image.onload = function(){
        ctx.drawImage(this,0,0);
        $('#cover').fadeOut();
    }

    var pointLoc = {
        x: 100,
        y: 100,
        xPerc: .5,
        yPerc: .5
    };
    
    $('#where').click(function(){
        var map = $('#map');

        var topRan = Math.random();
        var leftRan = Math.random();

        var top = Math.floor(topRan*map.height()-30);
        var left = Math.floor(leftRan*map.width()-30);

        var testTop = (1000/map.height())*top;
        var testLeft = (1000/map.width())*left;

        var timeOut = true;

        setTimeout(function(){
            timeOut = false;
            //console.log('timed out');
        }, 2000);

        while(isOnWater(testLeft,testTop) || isOnEdge(left, top) && timeOut){
            //console.log('new' + ' timeout: '+timeOut);

            topRan = Math.random();
            leftRan = Math.random();
            
            top = Math.floor(topRan*map.height());
            left = Math.floor(leftRan*map.width());

            testTop = (1000/map.height())*top;
            testLeft = (1000/map.width())*left;
        }

        pointLoc.xPerc = leftRan;
        pointLoc.yPerc = topRan;

        // console.log('--------------');
        // console.log(isOnWater(testLeft,testTop));
        // console.log('top', top);
        // console.log('left', left);
        // console.log('--------------');

        updatePointer();

        $('#pointer').css({
            borderWidth: '1',
            transform: 'scale(10)'
        });
        setTimeout(function(){
            $('#pointer').css({
                borderWidth: '4',
                transform: 'scale(1)'
            });
        },300);

        firebase.database().ref('frd/counter').transaction(function(curValue){
            return (curValue||0) + 1;
        });
    });


    function isOnEdge(left, top){
        var map = $('#map');
        var oRange = 100;
        var range = 50;

        if(between(left, -oRange, range) || between(left, map.width()-range, map.width()+oRange)){
            return true;
        }
        if(between(top, -oRange, range) || between(top, map.height()-range, map.height()+oRange)){
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


    function updatePointer(){
        var p = $('#pointer');

        var map = $('#map');

        var top = Math.floor(pointLoc.yPerc*map.height()-30);
        var left = Math.floor(pointLoc.xPerc*map.width()-30);


        p.css({
            top: top,
            left: left
        });
    }


    function resize(){
        var win = $(window);
        if(win.height() > win.width()){
            $('#map').addClass('tall');
            $('#map').removeClass('wide');
        }
        else if(win.height() < win.width()){
            $('#map').addClass('wide');
            $('#map').removeClass('tall');
        }

        updatePointer();
    }

    $(window).on('resize', function(){
        resize();
    });


    resize();

    function numberWithCommas(x){
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

});