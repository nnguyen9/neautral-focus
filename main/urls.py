from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^main/$', views.main, name='main'),
	url(r'^pick/$', views.pick, name='pick'),
    url(r'^save_image/$', views.save_image, name='save_image'),
	url(r'^combine_images/$', views.combine_images, name='combine_images'),
	url(r'^scratch_away/$', views.scratch_away, name='scratch_away'),
	url(r'^blur/$', views.blur, name='blur'),
	url(r'^$', views.index, name='index'),
	url(r'^calibrate/$', views.calibrate, name='calibrate'),
	url(r'^compare/$', views.compare, name='compare'),
]