from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('X', views.X, name='X'),
    path('multitape/addition', views.mt_addition, name='mt_addition'),
    path('multitape/division', views.mt_division, name='mt_division'),
    path('multitape/power', views.mt_power, name='mt_power'),
    path('multitape/logarithm', views.mt_logarithm, name='mt_logarithm'),
    path('case0/', views.case_0, name='case_0'),

]
