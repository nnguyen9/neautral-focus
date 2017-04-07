from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.conf import settings

import cStringIO
from PIL import Image

import re
import os, base64

# Create your views here.
def index(request):
	return render(request, 'main/index.html', {})

def save_image(request):
	imageURI = request.POST.get('image')
	file_name = request.POST.get('file_name')

	# image_str = cStringIO.StringIO(imageURI)

	# pic = cStringIO.StringIO()
	# image = Image.open(image_str)
	# image.save(settings.STATIC_ROOT + "/textImage3.png", image.format, quality = 100)

	print imageURI

	# pic.seek(0)
	loc = settings.STATIC_ROOT + "/images/" + file_name

	img_data = imageURI.decode("base64")
	img_file = open(loc, "wb")
	img_file.write(img_data)
	img_file.close()

	return HttpResponse('Image saved to: ' + loc)