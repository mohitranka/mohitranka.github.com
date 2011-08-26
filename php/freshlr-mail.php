<?php

    /*
    * Custom PHP for Freshlr Personal Site v1.7
    *
    * Copyright (c) 2010-2011 Amatyr4n
    * http://themeforest.net/user/amatyr4n?ref=amatyr4n
    */

    $fromname 	= $_POST['fromname']; 
    $mailfrom 	= $_POST['mailfrom']; 
    $msg 	    = filter_var($_POST['msg'], FILTER_SANITIZE_SPECIAL_CHARS); // filter from HTML special chars

    $subject 	= "[Freshlr Contact Form] ".$_POST['subject'];
    $message 	= "You've received a message from ".$fromname." (".$mailfrom."): ".$msg." (sent from Freshlr's contact form)";
    $header	    = "From: ".$mailfrom;

    // if unsuccessful
    $confirm	= "Sorry, please email me directly";

    /* 
     * replace the address below to define YOUR email as destination here..
     */    
    $mailto = "yourname@yourdomain.com";

    /*
     * uncomment two lines below and replace the e-mail address if you want to add more email destination.. cc (carbon copy)
     */
    // $secondmailto = "youremailaddress@yourdomain.com";
    // $header	.= "\r\nCC: ".$secondmailto;
    

/*  // recaptcha (still not works, need a google API, maybe added for future update)

    require_once 'recaptchalib.php';

    $publickey  = '';
    $privatekey = '';
    $enable_recaptcha = true;   // set to true if you want to enable recaptcha
    $passed_recaptcha = false;

    if($enable_recaptcha){
        if($_POST['recaptcha']){
		    $resp = recaptcha_check_answer($privatekey,
					          $_SERVER["REMOTE_ADDR"],
					          $_POST["recaptcha_challenge_field"],
					          $_POST["recaptcha_response_field"]);
		    if (!$resp->is_valid) {
		        echo 'recaptcha you typed was incorrect';
		        exit();
		    }
        } else {
            echo recaptcha_get_html($publickey);
            exit();
        }
    }
*/

    if(filter_var(filter_var($mailfrom, FILTER_VALIDATE_EMAIL), FILTER_SANITIZE_EMAIL)) {
        try {
            mail($mailto, $subject, $message, $header);
            $confirm	= "Your message has been sent successfully";
            
            // uncomment line below only for testing your server
            // $confirm .=  "\nto ".$mailto;
        }
        catch(Exception $e) {
            $confirm = "Sorry but there’s something error happened when sending the message.\nDon't worry, you still can e-mail me to: ".$mailto;

            // uncomment line below only for testing your server
            // $confirm .=  "Error report:\n".$e;
        }
    } else {
	    $confirm = "Sorry but that's not a valid email address";
    }

    echo $confirm;
?>
