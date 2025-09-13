$(document).ready(function() {
	//rotation speed and timer
	var speed = 5000;
	var run = setInterval('rotate()', speed);	
	
	//grab the width and calculate left value
	var item_width = $('#clients-slides li').outerWidth(); 
	var left_value = item_width * (-1); 
        
    //move the last item before first item, just in case user click prev button
	$('#clients-slides li:first').before($('#clients-slides li:last'));
	//set the default item to the correct position 
	$('#clients-slides ul').css({'left' : left_value});
    //if user clicked on prev button
	$('#btn-prev').click(function() {
		//get the right position            
		var left_indent = parseInt($('#slides ul').css('left')) + item_width;

		//slide the item            
		$('#clients-slides ul:not(:animated)').animate({'left' : left_indent}, 200,function(){    
            //move the last item and put it as first item            	
			$('#clients-slides li:first').before($('#clients-slides li:last'));           

			//set the default item to correct position
			$('#clients-slides ul').css({'left' : left_value});
		
		});
		//cancel the link behavior            
		return false;            
	});

 
    //if user clicked on next button
	$('#btn-next').click(function() {		
		//get the right position
		var left_indent = parseInt($('#clients-slides ul').css('left')) - item_width;
		
		//slide the item
		$('#clients-slides ul:not(:animated)').animate({'left' : left_indent}, 200, function () {            
            //move the first item and put it as last item
			$('#clients-slides li:last').after($('#clients-slides li:first'));                 	
			
			//set the default item to correct position
			$('#clients-slides ul').css({'left' : left_value});
		
		});
		         
		//cancel the link behavior
		return false;		
	});        
	
	//if mouse hover, pause the auto rotation, otherwise rotate it
	$('#clients-slides').hover(		
		function() {
			clearInterval(run);
		}, 
		function() {
			run = setInterval('rotate()', speed);	
		}
	); 
        
});

//a simple function to click next link
//a timer will call this function, and the rotation will begin :)  
function rotate() {
	$('#btn-next').click();
}