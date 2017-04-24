from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.conf import settings

import cStringIO
import math
from PIL import Image
from PIL import ImageFilter
from PIL import ImageEnhance


import re
import os, base64

filter_count = 0;

def index(request):
	return render(request, 'main/index.html', {})

def calibrate(request):
	return render(request, 'main/calibrate.html', {})

def compare(request):
	return render(request, 'main/compare.html', {})

def pick(request):
	return render(request, 'main/pick.html', {})

# Create your views here.
def main(request):
	file_name = request.GET.get('file_name')

	if not file_name:
		file_name = "foo.png"

	image = Image.open(settings.STATIC_ROOT + "/images/" + file_name)

	resized_image = image.resize((1200, 800), Image.ANTIALIAS)

	test_image_name = "test_resized.png"
	resized_image.save(settings.STATIC_ROOT + "/images/" + test_image_name)

	return render(request, 'main/main.html', {'test_image_name': test_image_name})

def save_image(request):
	imageURI = request.POST.get('image')
	file_name = request.POST.get('file_name')

	tempimg = cStringIO.StringIO(imageURI.decode('base64'))

	image = Image.open(tempimg)

	loc = settings.STATIC_ROOT + "/images/" + file_name

	image.save(loc)

	return HttpResponse('Image saved to: ' + loc)

def combine_images(request):
	global filter_count
	f = filter_count%3;
	
	image_file = request.POST.get('image_file')
	mask_file = request.POST.get('mask_file')
	
	image = Image.open(settings.STATIC_ROOT + "/images/" + image_file)
	mask = Image.open(settings.STATIC_ROOT + "/images/" + mask_file)
	
	if f == 0:
		detract = image.filter(ImageFilter.GaussianBlur(100))
		enhance = ImageEnhance.Sharpness(image).enhance(2*math.pow(0.99,filter_count))
	else:
		if f == 1:
			detract = ImageEnhance.Contrast(image).enhance(0.5)
			enhance = ImageEnhance.Contrast(image).enhance(0.2*math.pow(0.8,filter_count)+1)
		else:
			detract = ImageEnhance.Brightness(image).enhance(0.5)
			enhance = ImageEnhance.Brightness(image).enhance(0.2*math.pow(0.8,filter_count)+1)
			

	mask.save(settings.STATIC_ROOT + "/images/mask_resize.png")
	# BLUR - use GaussianBlur(50) instead
	# CONTOUR - Looks like a sketch
	# EMBOSS - Like plastic wrap or something
	# FIND_EDGES - Highlights edges only
	# SHARPEN
	
	mask = mask.filter(ImageFilter.GaussianBlur(30))
	
	final_image = Image.composite(detract, enhance, mask)

	final_loc = settings.STATIC_ROOT + "/images/" + "iterable3.png"

	final_image.save(final_loc)
	
	filter_count = filter_count + 1;
	
	return HttpResponse(final_loc)

def scratch_away(request):
	global filter_count
	
#	image_file1 = request.POST.get('image_file1')
#	image_file2 = request.POST.get('image_file2')
	mask_file = request.POST.get('mask_file')
	
	if filter_count == 0:
		image1 = Image.open(settings.STATIC_ROOT + "/images/" + "top.jpg")
	else:
		image1 = Image.open(settings.STATIC_ROOT + "/images/" + "iterable3.png")
		
	if filter_count < 3:
		image2 = Image.open(settings.STATIC_ROOT + "/images/" + "bottom.jpg")
	else:
		if filter_count < 6:
			image2 = Image.open(settings.STATIC_ROOT + "/images/" + "bottom2.png")
		else:
			return HttpResponse("No more iterations")
	
	mask = Image.open(settings.STATIC_ROOT + "/images/" + mask_file)
	
	mask = mask.filter(ImageFilter.GaussianBlur(30))
	
	final_image = Image.composite(image2, image1, mask)
	
	final_loc = settings.STATIC_ROOT + "/images/" + "iterable3.png"
	
	final_image.save(final_loc)
	
	filter_count = filter_count + 1;
	
	return HttpResponse(final_loc)
	
	
def blur(request):
	im_file = request.POST.get('im_file')
	
	image = Image.open(settings.STATIC_ROOT + "/images/" + im_file)
	
	image = image.filter(ImageFilter.GaussianBlur(50))
	
	image.save(settings.STATIC_ROOT + "/images/" + "blurred.png")
	
	return HttpResponse('Image blurred')
	
	
	