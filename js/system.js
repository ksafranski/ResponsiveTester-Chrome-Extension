//////////////////////////////////////////////////////////////////////
// Get URL from Chrome
//////////////////////////////////////////////////////////////////////

function getParameterByName(name){
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

//////////////////////////////////////////////////////////////////////
// System Init
//////////////////////////////////////////////////////////////////////

$(function(){ system.init(); });

//////////////////////////////////////////////////////////////////////
// Objects
//////////////////////////////////////////////////////////////////////

header = $('header');
container = $('#container');
viewport = $('#viewport');
iframefix = $('#iframefix');

input_width = $('#width');
input_height = $('#height');
input_source = $('#src');

console_region = $('#console');
console_handle = $('#console #handle');
console_handle_reveal = $('#handle #reveal');
console_handle_inject = $('#handle #inject');

//////////////////////////////////////////////////////////////////////
// System
//////////////////////////////////////////////////////////////////////

var system = {

    init : function(){
		input_source.val(default_url);
        system.define_region();
        viewer.init();
        input.bind_form();
        console.init();    
    },
    
    define_region : function(){
        var margins_y = parseInt(container.css('margin-top').replace('px',''))*2;
        var margins_x = parseInt(container.css('margin-left').replace('px',''))*2;
        var padding_y = parseInt(container.css('padding-top').replace('px',''))*2;
        var padding_x = parseInt(container.css('padding-left').replace('px',''))*2;
        //var c_handle_w = console_handle.outerWidth();
		c_handle_w = 0;
        resize_max_h = $(window).height() - margins_y - padding_y - header.outerHeight();
        resize_max_w = $(window).width() - margins_x - padding_x - c_handle_w;
    }

};

//////////////////////////////////////////////////////////////////////
// User Input Methods
//////////////////////////////////////////////////////////////////////

var input = {

    bind_form : function(){
        $('header input').on('keypress',function(e){
            if(e.which == 13){
                e.preventDefault();
                viewer.set_source(input.get_source());
                viewer.set_width(input.get_width());
                viewer.set_height(input.get_height());
            }
        });
    },

    get_width : function(){ return input_width.val(); },
    
    set_width : function(v){ input_width.val(v); },
    
    get_height : function(){ return input_height.val(); },
    
    set_height : function(v){ input_height.val(v); },
    
    get_source : function(){ return input_source.val(); },
    
    set_source : function(v){ input_source.val(v); }

};

//////////////////////////////////////////////////////////////////////
// Viewer Methods
//////////////////////////////////////////////////////////////////////

var viewer = {

    init : function(){
    
        this.set_source(input.get_source());
        this.set_width(input.get_width());
        this.set_height(input.get_height());
    
        container.resizable({
            handles: "se",
            alsoResize: "#viewport, #iframefix",
            maxHeight: resize_max_h,
            maxWidth: resize_max_w,
            resize: function(event, ui){ 
            
                // Get dimensions
                var w = viewport.outerWidth();
                var h = viewport.outerHeight();
                input.set_width(w);
                input.set_height(h);
                iframefix.css({
                    'width':viewport.outerWidth()+'px',
                    'height':viewport.outerHeight()+'px'
                })
            
            },
            start : function(){ $('#iframefix').show(); },
            stop : function(){ $('#iframefix').hide(); }
        });
    
    },
    
    set_width : function(v){
        viewport.css({'width':v+'px'});
        container.css({'width':v+'px'});
    },
    
    set_height : function(v){
        viewport.css({'height':v+'px'});
        container.css({'height':v+'px'});
    },
    
    set_source : function(v){
        viewport.attr('src',v);
    }   
};

//////////////////////////////////////////////////////////////////////
// Console
//////////////////////////////////////////////////////////////////////

var console = {

    init : function(){
        //ace_editor.init();
        this.reveal();
        this.inject();
    },
    
    reveal : function(){
        console_handle_reveal.on('click',function(){
            var c_open = 0;
            var c_closed = console_region.outerWidth()-console_handle.outerWidth();
            if(console_region.hasClass('open')){
                console_region.animate({'right':'-'+c_closed+'px'},300).removeClass('open');
                console_handle_inject.animate({'opacity':'0.0'},300);
            }else{
                console_region.animate({'right':c_open+'px'},300).addClass('open');
                console_handle_inject.animate({'opacity':'1.0'},300);
                editor_instance.focus();
                editor_instance.gotoLine(1);
            }
        });
    },
    
    inject : function(){
        console_handle_inject.on('click',function(){
            viewport.contents().find('body').append('<style>'+ace_editor.get_content()+'</style>');
        });
    }
    
};

//////////////////////////////////////////////////////////////////////
// Ace Editor
//////////////////////////////////////////////////////////////////////

/*

var ace_editor = {
    
    mode : 'css',
    theme : 'twilight',
    
    init : function(){
        editor_instance = ace.edit("editor");       
		editor_instance.setShowPrintMargin(false);
        ace_editor.set_mode(ace_editor.mode);
        ace_editor.set_theme(ace_editor.theme);
    },
    
    set_mode : function(m){
		var EditorMode = require("ace/mode/"+m).Mode;
		editor_instance.getSession().setMode(new EditorMode());   
    },
    
    set_theme : function(t){
        editor_instance.setTheme("ace/theme/"+t);
    },
    
    get_content : function(){
        return editor_instance.getSession().getValue();
    }
    
};

*/
