/*
* Mobile Viewer Script by Kent Safranski <http://www.fluidbyte.net>
*/

// GLOBALS

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


default_url = getParameterByName('url');

dimensions = {
    "Default (320x480)":"320x480",
    "Small (240x320)":"240x320",
    "Medium (480x640)":"480x640",
    "Large (960x640)":"960x640"
};

zooms = {
    "No Zoom":"100",
    "200%":"200",
    "175%":"175",
    "150%":"150",
    "125%":"125",
    "90%":"90",
    "80%":"80",
    "70%":"70",
    "60%":"60",
    "50%":"50"
};


// Load initial settings and bindings ######################

$(function(){ init(); });

// Load from globals #######################################

function init(){
    // Load default URL
    $('#url').val(default_url);
    // Load dimension set
    $.each(dimensions, function(key, value) { $('#dimensions').append($("<option></option>").attr("value",value).text(key)); });
    // Load zoom set
    $.each(zooms, function(key, value) { $('#zooms').append($("<option></option>").attr("value",value).text(key)); });
    // Set initial size
    set.dimensions(true,true);
    // Create bindings
    $('#url').keypress(function(e){
        code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13){ set.url(); }
    });
    $('#dimensions').change(function(){ set.dimensions(true,true); });
    $('#zooms').change(function(){ set.zoom(); });
    $('#rotate').click(function(){ set.rotation(); });
    set.url();
}

// Getters #################################################

var get = {
    url : function(){ return $('#url').val(); },
    dimensions : function(){ return $('#dimensions').val() },
    zoom : function(){ return $('#zooms').val(); },
    rotation : function(){ return $('#rotate').attr('rel'); }
}

// Setters #################################################

var set = {
    url : function(){ $('#viewport').attr('src',get.url()); },
    
    dimensions : function(device,viewport){
        var rotation = get.rotation();
        var dimensions = get.dimensions();
        var dimensions = dimensions.split('x');
        var wd = dimensions[0]; var hd = dimensions[1];
        if(rotation==0){ // Standard dimensions
            var wv = dimensions[0]; var hv = dimensions[1];
            var pusht = parseInt($('#device').css('padding-top').replace("px", "")) + parseInt($('#device').css('border-top-width').replace("px", "")); 
            var pushl = parseInt($('#device').css('padding-left').replace("px", "")) + parseInt($('#device').css('border-left-width').replace("px", ""));
        }else{ // Invert dimensions
            var wv = dimensions[1]; var hv = dimensions[0];
            var pusht = parseInt($('#device').css('padding-left').replace("px", "")) + parseInt($('#device').css('border-left-width').replace("px", "")); 
            var pushl = parseInt($('#device').css('padding-bottom').replace("px", "")) + parseInt($('#device').css('border-bottom-width').replace("px", ""));
        }
        // Modify device object
        if(device){
            $('#device').css({ width: wd+'px',height: hd+'px',margin:'-'+Math.round(hd/2)+'px 0 0 -'+Math.round(wd/2)+'px'});            
        }
        // Modify viewport object
        if(viewport){
            var z = get.zoom();
            if(z<100 || z>100){
                wv_adjust = Math.round(parseInt(wv) * (1/(z/100)));
                hv_adjust = Math.round(parseInt(hv) * (1/(z/100)));
                $('#viewport').css({ width: wv_adjust+'px',height: hv_adjust+'px',margin:'-'+(Math.round(hv/2)-pusht)+'px 0 0 -'+(Math.round(wv/2)-pushl)+'px'});
            }else{
                $('#viewport').css({ width: wv+'px',height: hv+'px',margin:'-'+(Math.round(hv/2)-pusht)+'px 0 0 -'+(Math.round(wv/2)-pushl)+'px'});
            }
            
            
        }
    },
    
    zoom : function(){ 
        var z = get.zoom()/100;
        $('#viewport').css({
            '-moz-transform': 'scale('+z+')',
            '-moz-transform-origin': '0 0',
            '-o-transform': 'scale('+z+')',
            '-o-transform-origin': '0 0',
            'webkit-transform': 'scale('+z+')',
            'webkit-transform-origin': '0 0',
            'transform': 'scale('+z+')',
            'transform-origin': '0 0'
        });
        set.dimensions(false,true); 
    },
    
    rotation : function(){
        if(get.rotation()==0){ 
            $('#rotate').attr('rel','1'); 
            $('#device').css({
                '-webkit-transform': 'rotate(90deg)',
                '-moz-transform': 'rotate(90deg)',
                '-o-transform': 'rotate(90deg)',
                '-ms-transform': 'rotate(90deg)',
                'transform': 'rotate(90deg)'
            });   
        }else{ 
            $('#rotate').attr('rel','0');
            $('#device').css({
                '-webkit-transform': 'rotate(0deg)',
                '-moz-transform': 'rotate(0deg)',
                '-o-transform': 'rotate(0deg)',
                '-ms-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
            }); 
        }
        set.dimensions(true,true);
    }
}
