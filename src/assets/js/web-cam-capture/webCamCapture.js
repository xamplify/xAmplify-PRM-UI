$(document).ready(function(){
    $("#script-text").focusout(function(){
        $( "#script-text" ).scrollTop( 0 );

    });
});
$(document).keydown(function(e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        return false;
    }
});
function testSpeed(){
	$("#script-text").stop(true);
	 $( "#script-text" ).scrollTop( 0 );
	if($("#script-text").val()==""){
		//alert("Please Add your script and Test it back");
		sweetAlertPopUp("Please Add your script and Test it back");
	}else{
		$('#testSpeedButton').hide();
		$('#stopButton').show();
		$('#fader').attr('disabled',true);
		var volume = $('#volume').text();
		volume = volume*10000;
	
		
		 $( "#script-text" ).animate({scrollTop: $("#script-text").prop("scrollHeight")},
				 	{
			 		duration: volume,
			 		complete: function() {
				 		stop();
				 	}
			  });
	}
	
}
function stop(){
	$('#stopButton').hide();
	$('#testSpeedButton').show();
	$('#fader').attr('disabled',false);
	$("#script-text").stop(true);
	
}
function outputUpdate(vol) {
	document.querySelector('#volume').value = vol;
	$('#volume').text(vol);
}
function recordVideo(){
	player.recorder.getDevice();
	  $("#save").attr("disabled", true);
      $("#discard").attr("disabled", true);
      $('#fader').val(1);
      $('#volume').text(1);
      $('#script-text').val('');
      $("#capturedVideoUploadLoading span").text("");
	  $("#capturedVideoUploadLoading").hide();
	 $("#webcamcapture").modal("show");
}

function removeVideo(){
	player.recorder.stopDevice();
	player.recorder.getDevice();
	$("#save").attr("disabled", false);
	
}


function uploadRecordedVideo(){
	 $('#closeModalId').attr('disabled',true);
	var object = player.recordedData;
	 $('.vjs-control-bar').hide();
		var fd = new FormData();
		if(navigator.userAgent.indexOf("Chrome") != -1){
			fd.append('file', object.video);
		}else{
			fd.append('file', object);
		}
		$("#save").attr("disabled", true);
		$("#discard").attr("disabled", true);
		$("#capturedVideoUploadLoading span").text("*Encoding the recorded video file, Please do not close this pop up until the video file has been processed.");
		$("#capturedVideoUploadLoading").show();
			$.ajax({
				type : 'POST',
				url : 'capture',
				data : fd,
				processData : false,
				contentType : false
			}).done(function(data) {
				$.ajax({
					url: "process_video",
					type: 'POST',
					data : {"path" : data},
					success: function (data) {
						
						$("#capturedVideoUploadLoading").hide();
						alertTimeout(5000);
						
						if(data.error && data.error.length > 0){
							$("#message").append('<div class="alert alert-error" style="width: 80%;"><a href="#" class="close" data-dismiss="alert">&times;</a><span>'+data.error+'</span></div>');
						}else{	
							$("#uploadVideo").hide();			
  							$("#saveVideo").show("slow");
  							$("#upload_new").show("slow");
							
							$.each(data.viewBy, function(){
								if(this == 'PRIVATE'){
									$("<option />").val(this).text("Library").appendTo($("#view_by"));
							}

							});
							
							if(data.viewBy.length == 1){
								$("#view_by_info_message").attr("data-toggle","tooltip");
								$("#view_by_info_message").attr("data-placement","left");
								if(data.viewBy.indexOf('PRIVATE')){
									$("#view_by_info_message").attr("title","Public Mobinars limit reached for your subscription");
								}
								if(data.viewBy.indexOf('PUBLIC')){
									$("#view_by_info_message").attr("title","Private Mobinars limit reached for your subscription");
								}
								$(function () { $('[data-toggle="tooltip"]').tooltip(); });
							}else{
								$("#view_by_info_message").hide();
							}
							
							
							$("#videoImage1").attr("src", data.imageFiles[0]);
							$("#videoImage1Radio").val(data.imageFiles[0]);
							$("#videoImage2").attr("src", data.imageFiles[1]);
							$("#videoImage2Radio").val(data.imageFiles[1]);
							$("#videoImage3").attr("src", data.imageFiles[2]);
							$("#videoImage3Radio").val(data.imageFiles[2]);
							
							$("#gifImage1").attr("src", data.gifFiles[0]);
							$("#gifImage1Radio").val(data.gifFiles[0]);
							$("#gifImage2").attr("src", data.gifFiles[1]);
							$("#gifImage2Radio").val(data.gifFiles[1]);
							$("#gifImage3").attr("src", data.gifFiles[2]);
							$("#gifImage3Radio").val(data.gifFiles[2]);
						
							$("#id").val(data.id);
							$("#title_id").val(data.title);
							$('#webcamcapture').modal('hide');
							$('#manualRecordDiv').hide();
							$("#save").attr("disabled", false);
							$("#discard").attr("disabled", false);
							 $('.vjs-control-bar').show();
							 $('#closeModalId').attr('disabled',false);
						}
					},
					error: function (xhr, ajaxOptions, thrownError) {
						$("#message").append('<div class="alert alert-error" style="width: 80%;"><a href="#" class="close" data-dismiss="alert">&times;</a><span>'+xhr.responseText+'</span></div>');
					}
				});
				
				//update the tracker
					
					(function worker() {
					  $.ajax({
					    url: 'uploadStatus', 
					    success: function(data) {
					    	console.log("upload status "+ data);
					    	$("#captured-upload-status").html(data);
					    },
					    complete: function() {
					      // Schedule the next request when the current one's complete
					      setTimeout(worker, 2000);
					    }
					  });
					})();
				
			});
			return false;
		
	}


	

function closeRecordPopup(){
	$("#webcamcapture").modal("hide");
	player.recorder.stopDevice();
}
