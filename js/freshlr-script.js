/*
 * Custom JavaScript for Freshlr Personal Site v1.7
 *
 * Copyright (c) 2010-2011 Amatyr4n
 * http://themeforest.net/user/amatyr4n?ref=amatyr4n
 *
  _____ _                 _           __                                   _               _               /\ /\ 
 |_   _| |__   __ _ _ __ | | _____   / _| ___  _ __   _ __  _   _ _ __ ___| |__   __ _ ___(_)_ __   __ _  |/\|/\|
   | | | '_ \ / _` | '_ \| |/ / __| | |_ / _ \| '__| | '_ \| | | | '__/ __| '_ \ / _` / __| | '_ \ / _` |        
   | | | | | | (_| | | | |   <\__ \ |  _| (_) | |    | |_) | |_| | | | (__| | | | (_| \__ \ | | | | (_| |        
   |_| |_| |_|\__,_|_| |_|_|\_\___/ |_|  \___/|_|    | .__/ \__,_|_|  \___|_| |_|\__,_|___/_|_| |_|\__, |        
                                                     |_|                                           |___/         
 *                                                                                                    
 *  as you have support me by purchasing this, feel free to edit/remove these lines then, every single characters within this file.
 *	─ Amatyr4n
 */

/*global Modernizr:false, Cufon:false*/
  
function initFreshlr(defs){

    // check if @font-face supported, fallback to cufon
    yepnope({
        test        : Modernizr.fontface,
        nope        : ['js/cufon-yui.js', 'js/bebas-neue.cufonfonts.js'],
        complete    : function(){
            if(!Modernizr.fontface){
                // elements using Bebas Font
                var bebasFont = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '#tagline', '.sidecon', '.page_title'];             
                var i;
                for(i = 0; i < bebasFont.length; i++){
                    Cufon.replace(bebasFont[i]);
                    $(bebasFont[i]).css({'padding-top':'0.3em'});
                }
            }
        }
    });
         
    var animateSlide = function(){
        $('#tab-contact').trigger('click').delay(2000).queue(function(){
            $(this).parent().siblings('.tab3').children('a').trigger('click').delay(1000).queue(function(){
                $(this).parent().siblings('.tab4').children('a').trigger('click').delay(2000).queue(function(){
                    $(this).parent().siblings('.tab2').children('a').trigger('click').delay(1000).queue(function(){
                        $(this).parent().siblings('.tab1').children('a').trigger('click');
                        $(this).dequeue();
                    });
                    $(this).dequeue();
                });
                $(this).dequeue();
            });
            $(this).dequeue();
        });
    };
    
    // set slider effect between pages
    yepnope({
        test        : (defs.slideType === 'scroll'),
        yep         : 'js/jquery.localscroll-min.js',
        nope        : 'js/jquery.coda-slider-2.0.js',
        both        : 'js/jquery.easing.1.3.js',
        complete    : function(){
            if(defs.slideType === 'scroll'){
                $.localScroll();
            } else {
                var slide = ['easing', 'duration'];                
                switch(defs.slideType){
                    case 'back':
                        slide = ['easeInOutBack', 1000];
                        break;
                    case 'bounce':
                        slide = ['easeOutBounce', 3000];
                        break;
                    case 'elastic':
                        slide = ['easeInOutElastic', 3000];
                        break;
                    default:
                        slide = ['easeInOutExpo', 1000];
                }
                // Slider for switching between pages
                $('#coda-slider-5').codaSlider({
                	autoHeightEaseDuration: slide[1],
	                autoHeightEaseFunction: slide[0],
                    dynamicArrows:false, 
                    dynamicTabs:false,
                    slideEaseDuration: slide[1],
	                slideEaseFunction: slide[0]		        
                });
                // To avoid conflict with coda slider when clicking menu links
                $('.panel').removeAttr('id');
            
            }            
        }
    });
                      
    // if ajax contact form enabled
    if(defs.enableAjaxForm){
        // As JavaScript is now present
        // we could safely set contact form to use AJAX
        $('#contactform').attr('action', '');
        
        // Focus and blur event listener for contact form input
        for(var i in defs){
            if(defs.hasOwnProperty(i) && (/^contact/i).test(i.toString())){
                //console.log(i);
                $('#' + i.toString())
                    .focus(function(){
                        var j = $(this).attr('id');
	                    if($(this).val() == defs[j]){
	                        $(this).attr('value', '');
	                    }
                    })
                    .blur(function(){
                        var j = $(this).attr('id');
                        if($(this).val() == ''){
                            $(this).attr('value', defs[j]);
                        }
	            });
            }
        }
        
        // when 'Submit' button clicked
        $('#sendmail').click(function(){

            var filterText = function(text){
                return text.toString()
                            .replace(/&/g, '&amp;')   // escape HTML characters
                            .replace(/>/g, '&gt;')
                            .replace(/</g, '&lt;')
                            .replace(/\"/g, '&quot')
            	            .replace(/\n/g, '\\n'); // fix multiline issues                                            
            };
            
	        var validMsg = '',
	            contact_name = filterText($('#contact_name').val()),            // get filled name input
	            contact_mailfrom = filterText($('#contact_mailfrom').val()),    // get filled e-mail input
	            contact_subject = filterText($('#contact_subject').val()),      // get filled subject input
	            contact_text = filterText($('#contact_text').val().toString());     // get filled contact-text input
            
            // check name length
	        if(contact_name.length < 1 || contact_name == defs.contact_name){ 
	            validMsg += '<li>' + defs.invalid_name + '</li>';
	        }
	        // check whether email is valid
	        if(!contact_mailfrom.match(/^([a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,4}$)/i) || contact_mailfrom == defs.contact_mailfrom){
	            validMsg += '<li>' + defs.invalid_mailfrom + '</li>';
	        }
	        // check subject length
	        if(contact_subject.length < 1 || contact_subject == defs.contact_subject){ 
	            validMsg += '<li>' + defs.invalid_subject + '</li>'; 
	        }
	        // check textbox length
	        if(contact_text.length < 1){ 
	            validMsg += '<li>' + defs.invalid_text + '</li>'; 
	        }
	        // if found at least one invalid input
	        if(validMsg != ''){
	            // display error response
	            $('#response')
	                .html('<p>Error: <ul class="disc">' + validMsg + '</ul></p>')
	                .fadeIn('slow');
	            // display for 5 seconds
	            setTimeout(function(){
	                $('#response').fadeOut('slow');
	            }, 5000);
	        } else {
	            // if its valid then
	            var datastr = ('fromname=' + contact_name 
	                            + '&mailfrom=' + contact_mailfrom 
	                            + '&subject=' + contact_subject 
	                            + '&msg=' + contact_text);
                // display sending information
	            $('#response')
	                .css('display', 'block')
	                .html(defs.sending_message)
	                .fadeIn('slow');
                // try sending the message with no more than 5 seconds timeout
	            setTimeout(function(){
	                // AJAX script to do HTTP POST to /php/freshlr-mail.php 
                    // PHP script will then send a mail from your site's web server to your e-mail
                    $.ajax({
                        type: 'POST',
                        url: 'php/freshlr-mail.php',
                        data: datastr,
                        cache: false,
                        error: function(html){
                            $('#response')
                                .html(defs.error_message)
                                .fadeIn('slow');
                            setTimeout(function(){
                                $('#response').fadeOut('slow');
                            }, 5000);
                        },
                        success: function(html){
                            $('#response')
                                .html(html)
                                .fadeIn('slow');
                            setTimeout(function(){
                                $('#response').fadeOut('slow');
                            }, 5000);
                        }
                    });
	            }, 5000);
	        }
	        return false;
        });
    }
    
    // if tooltip enabled
    yepnope({
        test        : defs.enableTooltip,
        yep         : 'js/jquery.tipTip.minified.js', 
        complete    : function(){
            if(defs.enableTooltip){
                // Add tiptip tooltip to sidebar link
                $('#social_icons').find('a').tipTip({
                    defaultPosition:'top', 
                    edgeOffset:10
                });
                $('.gallery').find('a').tipTip({
                    defaultPosition:'bottom', 
                    edgeOffset:-10
                }); 
                $('#bottom_icon').tipTip({
                    defaultPosition: 'top'
                });
                // Add tiptip tooltip to any html links contain title attribute
                $('[title]').tipTip();
            }
        }
    });
    
    // if fancybox enabled
    yepnope({
        test        : defs.enableFancybox,
        yep         : 'js/jquery.fancybox-1.3.1.pack.js', 
        complete    : function(){
            if(defs.enableFancybox){
                // Add fancybox functionality to gallery links and every anchor contains image
                $('.gallery a, a[href$=jpg|png]:has(img)').fancybox({
	                'titleShow'	: true,
	                'titlePosition'	: 'over',
	                'transitionIn'	: 'elastic',
	                'transitionOut'	: 'elastic'
                });
            }
        }
    });
    
    // if twitter feed enabled
    yepnope({
        test        : defs.enableTwitterFeed,
        yep         : 'js/jquery.livetweet.min.js',
        complete    : function(){
            if(defs.enableTwitterFeed){
                var tw = $.extend({}, defs.twitterFeedSettings, {html_tweets : '<li><span class="tweet-text">{text}</span>&nbsp;<span class="tweet-date">-&nbsp;{date}</span></li>'});
                $('#twitter-feed').livetweet(tw);
            }
        }
    });

    var activeMenu = 'tab-home';
    // right arrow beside menu links
    $('#' + activeMenu).find('span').remove();
    $('#tab-home').append('<span class="arrow-left"></span>');
    // switch the arrow when clicked
    $('#aside').find('a').click(function(){
        var id = $(this).attr('id');
        $('#' + activeMenu).find('span').remove();
        $('#' + id).append('<span class="arrow-left"></span>');
        activeMenu = id;
    });

    var colorOptions = ['blue', 'brown-green', 'dark-blue', 'dark-green', 'dark-purple', 'dark-red', 'light-blue', 'orange', 'red-brown', 'yellow-blue', 'magenta', 'silver', 'chocolate', 'dark'];
    var fontOptions = ['bebas-droid', 'bebas-news', 'ballpark-droid', 'ballpark-goudy', 'ballpark-news', 'marker-droid', 'marker-goudy', 'marker-news'];
    
    // function to switch CSS
    var switchCSS = function(b, c, f, s){
        if(b){
            $('#css-background').attr('href', 'css/background/freshlr-background-' + b + '.css');
        }
        if(c){
            $('#css-foreground').attr('href', 'css/color/freshlr-color-' + c + '.css');    
        }
        if(f){
            $('#css-font').attr('href', 'css/font/' + f + '.css');
        }
        if(s){
            animateSlide();
        }
    }
    
    // check if default color match with color options
    for(var i in colorOptions){
        if(colorOptions[i] == defs.backgroundColor){
            switchCSS(defs.backgroundColor, 0, 0, 0);
        }
        if(colorOptions[i] == defs.foregroundColor){
            switchCSS(0, defs.backgroundColor, 0, 0);
        }    
    }

    // To change the background in live preview mode
    $('.switch-color').find('a').click(function(e) { 
	    var co = String($(this).attr('href')).substr(1);
        if(co == 'random'){
	        var c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
	        var b = colorOptions[Math.floor(Math.random() * colorOptions.length)];
	        switchCSS(b, c, 0, 0);    
        } else {
            switchCSS(co, co, 0, 0);        
        }
	    e.preventDefault();
    });

    // To change the font in live preview mode
    $('.switch-font').find('a').click(function(e) { 
	    var fo = String($(this).attr('href')).substr(1);
        if(fo == 'random'){
	        fo = fontOptions[Math.floor(Math.random() * fontOptions.length)];
	        switchCSS(0, 0, fo, 1);  
        } else {
            switchCSS(0, 0, fo, 1);        
        }
	    e.preventDefault();
    });

    $('a[href$=jpg],a[href$=png],a[href$=gif]').bind({
        mouseenter: function(){
            // stop other animation
            $(this).parentsUntil('ul').find('img').stop(true, true);
            // start
            $(this).find('img').animate({'opacity': 0.5}, 500);
        },
        mouseleave: function(){
            $(this).find('img').animate({'opacity': 1}, 500);
        }
    });
    
    $('ul')
        .not('#social_icons')
            .children('li:has(a)')
                .find('a')
                    .not(':has(img)')
                        .bind({
                            mouseenter: function(){
                                // stop other animation
                                $(this).parentsUntil('ul').find('a').stop(true, true);
                                // start
                                $(this).animate({'padding-left': '10'}, 'fast');
                            },
                            mouseleave: function(){
                                $(this).animate({'padding-left': '0'}, 'fast');
                            }
    });
    
    // quickfix for sidebar which not shown in monitor with low res
    // because default set as position:fixed with top:200px
    var fixPos = function(){
        var $aside      = $('#aside');
        var $asideYMax  = $aside.offset().top + $aside.height();
        var $asideXMax  = 960; // fixed width
        if($(window).height() < $asideYMax || $(window).width() < $asideXMax || defs.animateSidebar){
            $('#aside').css({
                'position'  : 'absolute'
            });
        } else {
            $('#aside').css({
                'position'  : 'fixed'
            });
        }
    };    
    fixPos();
    
    if(defs.animateSidebar){
        $(window).scroll(function(){
            var initTop = 150;
            var newTop = $(window).scrollTop() + initTop;
            if($('#footer').offset().top < newTop){
                $('#aside').css({
                    'top'   : $('#wrapper').offset().top + initTop
                })
            } else {
                $('#aside').stop().animate({
                    'top'   : newTop
                }, 500);
            }
        });
    }
    
    if($.browser.msie && parseInt($.browser.version, 10) == 7 && defs.animateSidebar == false){
        // If browser is IE7, adjust the position of the menu
        $('#aside').css('left', $('#header').offset().left - 200);
    } else {
        $(window).resize(function(){
            fixPos();
        });
    }
    
    // if Google Analytics account is present
    if((/^ua-\d{4,9}-\d{1,4}$/i).test(defs.googleAnalytics.toString())){
        //console.log('match');
        var _gaq = _gaq || [];
        _gaq.push(["_setAccount", defs.googleAnalytics]);
        _gaq.push(["_trackPageview"]);
     
        (function() {
          var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;
          ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
          var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);
        })();
    }
   
    // if tweet button enabled    
    if(defs.enableTweetButton){
        $('#tweet-button').html('<a href="http://twitter.com/share" class="twitter-share-button" data-count="horizontal"></a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>');
    }
      
    // if like button enabled  
    if(defs.enableLikeButton){
        var url = escape(window.location.href);
        $('#like-button').html('<iframe src="http://www.facebook.com/plugins/like.php?href=' + url + '&amp;send=false&amp;layout=button_count&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:160px; height:21px; padding:15px 0 5px 0; " allowTransparency="true"></iframe>');
    }
    
    // if google maps enabled 
    if(defs.enableGoogleMaps){
        window.initialize = function(){             
            yepnope({
                load        : 'js/jquery-gmap-v3.min.js',
                complete    : function(){
                    $("#map").gMap(defs.gMapSettings);
                }
            });
        }      
        function loadScript() {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
          document.body.appendChild(script);
        }      
        window.onload = loadScript;
    }
}
