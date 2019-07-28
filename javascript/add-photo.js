var imuplFilesMax = 10;
var imuplMaxDimension = 1200;
var imuplJpgQuality = 0.75;
var imuplMaxEditorSize = 0.8;

var imuplFilesCurrent = 0;
var imuplOffset = 1;
var imuplFiles = [];
var imuplEditorLoaded = 0;
var imuplCropperDragging = 0;
var imuplEditorRatio = 1;

var $imuplFilesList = $('.imupl-files-list'),
		$imuplFilesCurrent = $('.imupl-files-current'),
		$imuplFilesMax = $('.imupl-files-max'),
		$imuplEditorImg = $('.imupl-edit-overlay .thumbnail .img'),
		$imuplEditorOverlay = $('.imupl-edit-overlay'),
		$imuplCropWrapper = $('.imupl-crop-wrapper'),
		$imuplCropper = $('.imupl-cropper'),
		$imuplCropperStart = $('.imupl-cropper-start'),
		$imuplCropperEnd = $('.imupl-cropper-end');

$imuplFilesList.sortable();

function imuplUpdateFileCount() {
		$imuplFilesCurrent.html(imuplFilesCurrent);
		$imuplFilesMax.html(imuplFilesMax);
}
imuplUpdateFileCount();

function imuplRender(offset) {
		var img = imuplFiles[offset];
		var thisElement = $('div[data-imupl-offset="' + offset + '"]');

		var cropWidth = img.cropEndX - img.cropStartX;
		var cropHeight = img.cropEndY - img.cropStartY;
		var finalWidth = 0;
		var finalHeight = 0;
		if (cropWidth <= imuplMaxDimension && cropHeight <= imuplMaxDimension) {
				finalWidth = cropWidth;
				finalHeight = cropHeight;
		} else if (cropWidth > cropHeight) {
				finalWidth = imuplMaxDimension;
				finalHeight = cropHeight * (imuplMaxDimension / cropWidth);
		} else {
				finalHeight = imuplMaxDimension;
				finalWidth = cropWidth * (imuplMaxDimension / cropHeight);
		}

		var canvas = document.createElement('canvas');
		canvas.width = finalWidth;
		canvas.height = finalHeight;
		var context = canvas.getContext('2d');

		context.drawImage(img.imgObj, img.cropStartX, img.cropStartY, cropWidth, cropHeight, 0, 0, finalWidth, finalHeight);
		img.resultData = canvas.toDataURL('image/jpeg', imuplJpgQuality);

		thisElement.css('background-image', 'url(' + img.resultData + ')');
		$('input', thisElement).val(img.resultData);
		thisElement.removeClass('loading');
}

function imuplRotateCW(offset) {
		var img = imuplFiles[offset];
		var newWidth = img.origHeight,
				newHeight = img.origWidth;
		var oldCropStartX = img.cropStartX,
				oldCropEndX = img.cropEndX,
				oldCropStartY = img.cropStartY,
				oldCropEndY = img.cropEndY;

		img.cropStartX = img.origHeight - oldCropEndY;
		img.cropStartY = oldCropStartX;
		img.cropEndX = img.origHeight - oldCropStartY;
		img.cropEndY = oldCropEndX;
		img.origHeight = newHeight;
		img.origWidth = newWidth;

		var canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		var context = canvas.getContext('2d');

		context.save();
		context.translate(newWidth / 2, newHeight / 2);
		context.rotate(90 * Math.PI / 180);
		context.drawImage(img.imgObj, -(newHeight / 2), -(newWidth / 2));
		context.restore();

		img.rawData = canvas.toDataURL();
		var imgObj = new Image;
		imgObj.onload = function() {
				img.imgObj = imgObj;
				imuplRender(offset);
		};
		imgObj.src = img.rawData;
}

function imuplRotateCCW(offset) {
		var img = imuplFiles[offset];
		var newWidth = img.origHeight,
				newHeight = img.origWidth;
		var oldCropStartX = img.cropStartX,
				oldCropEndX = img.cropEndX,
				oldCropStartY = img.cropStartY,
				oldCropEndY = img.cropEndY;

		img.cropStartX = oldCropStartY;
		img.cropStartY = img.origWidth - oldCropEndX;
		img.cropEndX = oldCropEndY;
		img.cropEndY = img.origWidth - oldCropStartX;
		img.origHeight = newHeight;
		img.origWidth = newWidth;

		var canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		var context = canvas.getContext('2d');

		context.save();
		context.translate(newWidth / 2, newHeight / 2);
		context.rotate(-90 * Math.PI / 180);
		context.drawImage(img.imgObj, -(newHeight / 2), -(newWidth / 2));
		context.restore();

		img.rawData = canvas.toDataURL();
		var imgObj = new Image;
		imgObj.onload = function() {
				img.imgObj = imgObj;
				imuplRender(offset);
		};
		imgObj.src = img.rawData;
}



function imuplCloseEditor() {
	$imuplEditorOverlay.removeClass('active');
	var img = imuplFiles[imuplEditorLoaded];
	img.cropStartX = parseInt($imuplCropper.css('left'))/imuplEditorRatio;
	img.cropStartY = parseInt($imuplCropper.css('top'))/imuplEditorRatio;
	img.cropEndX = ($imuplCropWrapper.width()-parseInt($imuplCropper.css('right')))/imuplEditorRatio;
	img.cropEndY = ($imuplCropWrapper.height()-parseInt($imuplCropper.css('bottom')))/imuplEditorRatio;
	console.log(img);
	setTimeout(function() {
		imuplRender(imuplEditorLoaded);
		imuplEditorLoaded=0;
	}, 1);
}

function imuplOpenEditor(offset) {
		var img = imuplFiles[offset];
		imuplEditorLoaded = offset;
		imuplCropperDragging = 0;

		$imuplEditorImg.attr('style', '');
		$imuplEditorImg.css('background-image', 'url(' + img.rawData + ')');

		var imgWidth = img.origWidth,
				imgHeight = img.origHeight,
				ratio=1;
		if (imgWidth > $(window).width() * imuplMaxEditorSize) {
				ratio *= $(window).width() * imuplMaxEditorSize / imgWidth;
		}
		if (imgHeight > $(window).height() * imuplMaxEditorSize) {
				ratio *= $(window).height() * imuplMaxEditorSize / imgHeight;
		}
		imgWidth = img.origWidth * ratio;
		imgHeight = img.origHeight * ratio;
	
		$imuplEditorImg.css('width', imgWidth);
		$imuplEditorImg.css('height', imgHeight);
	
		$imuplCropper.css('left',img.cropStartX*ratio).css('top',img.cropStartY*ratio);
		$imuplCropper.css('right',imgWidth - img.cropEndX*ratio).css('bottom',imgHeight - img.cropEndY*ratio);

		imuplEditorRatio = ratio;
		$imuplEditorOverlay.addClass('active');
}

function imuplAddFile(f) {
		if (imuplFilesCurrent >= imuplFilesMax ||  f.type.indexOf("image") !== 0) {
				return;
		}
		var thisOffset = imuplOffset++;
		var thisElement = $('<div class="imupl-file-item loading" data-imupl-offset="' + thisOffset + '"><div class="imupl-button-remove"><i class="fas fa-trash-alt"></i></div><div class="imupl-button-edit"><i class="fas fa-crop-alt"></i></div><div class="imupl-button-rotate-ccw"><i class="fas fa-undo"></i></div><div class="imupl-button-rotate-cw"><i class="fas fa-undo fa-flip-horizontal"></i></div><input type="hidden" name="imupl-payload[]" value="" /></div>');
		var reader = new FileReader();
		reader.onload = function(e) {
				var img = new Image;
				img.onload = function() {
						var newImage = {
								rawData: e.target.result,
								resultData: e.target.result,
								imgObj: img,
								origWidth: img.width,
								origHeight: img.height,
								cropStartX: 0,
								cropStartY: 0,
								cropEndX: img.width,
								cropEndY: img.height
						};
						imuplFiles[thisOffset] = newImage;
						imuplRender(thisOffset);
				};
				img.src = e.target.result;
		}
		reader.readAsDataURL(f);
		thisElement.appendTo($imuplFilesList);
		$('.imupl-button-remove', thisElement).click(function() {
				var o = $(this).parent().attr('data-imupl-offset');
				delete imuplFiles[o];
				$(this).parent().remove();
				imuplFilesCurrent--;
				imuplUpdateFileCount();
		});
		$('.imupl-button-rotate-cw', thisElement).click(function() {
				var o = $(this).parent().attr('data-imupl-offset');
				$('div[data-imupl-offset="' + o + '"]').addClass('loading').css('background-image', '');
				setTimeout(function() {
						imuplRotateCW(o);
				}, 1);
		});
    $('.imupl-button-rotate-ccw', thisElement).click(function() {
                var o = $(this).parent().attr('data-imupl-offset');
                $('div[data-imupl-offset="' + o + '"]').addClass('loading').css('background-image', '');
                setTimeout(function() {
                        imuplRotateCCW(o);
                }, 1);
        });
		$('.imupl-button-edit', thisElement).click(function() {
				var o = $(this).parent().attr('data-imupl-offset');
				$('div[data-imupl-offset="' + o + '"]').addClass('loading').css('background-image', '');
				imuplOpenEditor(o);
		});
		imuplFilesCurrent++;
		imuplUpdateFileCount();
}

$('.imupl-button-choose').click(function(e)  {
		e.preventDefault();
		$('.imupl-fileinput').trigger('click');
});

$('.imupl-fileinput').on('change', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var files = e.target.files;
		for (var i = 0, f; f = files[i]; i++) {
				imuplAddFile(f);
		}
});

$('body').on('drop', function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (imuplFilesCurrent >= imuplFilesMax ||  imuplEditorLoaded != 0) {
				return;
		}
		$('.imupl-dragdrop-hover').removeClass('active');
		var files = e.originalEvent.dataTransfer.files;
		for (var i = 0, f; f = files[i]; i++) {
				imuplAddFile(f);
		}
});

function imuplMoveCropper(e) {
	if(!imuplCropperDragging) {
		return;
	}
	e.preventDefault();
	if(imuplCropperDragging == 1) {
		var posX = e.pageX - $imuplCropWrapper.offset().left;
		var posY = e.pageY - $imuplCropWrapper.offset().top;
		posX = Math.max(0,posX);
		posY = Math.max(0,posY);
		posX = Math.min(posX,$imuplCropWrapper.width()-parseInt($imuplCropper.css('right'))-40);
		posY = Math.min(posY,$imuplCropWrapper.height()-parseInt($imuplCropper.css('bottom'))-40);
		$imuplCropper.css('left',posX);
		$imuplCropper.css('top',posY);
	}
	if(imuplCropperDragging == 2) {
		var posX = e.pageX - $imuplCropWrapper.offset().left;
		var posY = e.pageY - $imuplCropWrapper.offset().top;
		posX = Math.min($imuplCropWrapper.width(),posX);
		posY = Math.min($imuplCropWrapper.height(),posY);
		posX = Math.max(posX,parseInt($imuplCropper.css('left'))+40);
		posY = Math.max(posY,parseInt($imuplCropper.css('top'))+40);
		posX = $imuplCropWrapper.width() - posX;
		posY = $imuplCropWrapper.height() - posY;
		$imuplCropper.css('right',posX);
		$imuplCropper.css('bottom',posY);
	}
}
$('body').mousemove(imuplMoveCropper);

$imuplCropperStart.mousedown(function(e) {
	e.preventDefault();
	imuplCropperDragging=1;
});

$imuplCropperEnd.mousedown(function(e) {
	e.preventDefault();
	imuplCropperDragging=2;
});

$('body').mouseup(function(){
	imuplCropperDragging=0;
});

$('.imupl-button-edit-save').click(imuplCloseEditor);

$('body').on('dragover', function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (imuplFilesCurrent >= imuplFilesMax ||  imuplEditorLoaded != 0) {
				return;
		}
		$('.imupl-dragdrop-hover').addClass('active');
});

$('body').on('dragleave', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('.imupl-dragdrop-hover').removeClass('active');
});
