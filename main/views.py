from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.conf import settings

import cStringIO
from PIL import Image
from PIL import ImageFilter

import re
import os, base64

# Create your views here.
def index(request):
	return render(request, 'main/index.html', {})

def save_image(request):
	imageURI = request.POST.get('image')
	file_name = request.POST.get('file_name')

	# pic.seek(0)
	loc = settings.STATIC_ROOT + "/images/" + file_name

	img_data = imageURI.decode("base64")
	img_file = open(loc, "wb")
	img_file.write(img_data)
	img_file.close()

	return HttpResponse('Image saved to: ' + loc)

# Combine the images and save as the first image
def combine_images(request):
	im1_file = request.POST.get('im1_file');
	im2_file = request.POST.get('im2_file');
	mask_file = request.POST.get('mask_file');
	
	im1 = Image.open(settings.STATIC_ROOT + "/images/" + im1_file);
	im2 = Image.open(settings.STATIC_ROOT + "/images/" + im2_file);
	mask = Image.open(settings.STATIC_ROOT + "/images/" + mask_file);
	
	final_image = Image.composite(im2, im1, mask);
	final_image.save(settings.STATIC_ROOT + "/images/" + "iterable2.png");
	
	return HttpResponse('Images combined')
	