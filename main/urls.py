from django.conf.urls import url

from . import views

urlpatterns = [
  url(r'^$', views.index, name='index'),
  url(r'^save_image/$', views.save_image, name='save_image'),
	url(r'^combine_images/$', views.combine_images, name='combine_images'),
	url(r'^blur/$', views.blur, name='blur'),
	url(r'^home/$', views.home, name='home'),
	url(r'^calibrate/$', views.calibrate, name='calibrate'),
]