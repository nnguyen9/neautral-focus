from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.conf import settings

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