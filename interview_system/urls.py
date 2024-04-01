from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login',views.login,name='login'),
    path('register',views.register,name='register'),
    path('logout',views.logout,name='logout'),
    path('contactus',views.contact,name='contact'),
    path('account',views.account,name='account'),
    path('interview',views.interview,name='interview'),
    path('submit',views.submit,name='submit')
    ]