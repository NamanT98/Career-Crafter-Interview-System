from django.shortcuts import render,redirect
from django.contrib.auth.models import User,auth
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    return render(request,'index.html')

def login(request):
    if request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        username=request.POST['Username']
        password=request.POST['Password']
        user=auth.authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return redirect('/')
        else:
            messages.info(request,"Invalid username or password")
            return redirect('login')
    else:
        return render(request,'login.html')

def register(request):
    if request.method == 'POST':
        username=request.POST['Username']
        email=request.POST['Email']
        password=request.POST['Password']

        if User.objects.filter(email=email).exists():
                messages.info(request,"Email already exists")
                return redirect('register')
        elif User.objects.filter(username=username).exists():
            messages.info(request,"Username already exists")
            return redirect('register')
        else:
            user=User.objects.create_user(username=username,
                                        email=email,
                                        password=password)
            user.save()
            auth.login(request,user)
            return redirect('/')
    else:
        return render(request,'register.html')

def logout(request):
    auth.logout(request)
    return redirect('/')

def contact(request):
    return render(request,'contactus.html')
    
def account(request):
    if request.user.is_authenticated:
        user=request.user
        if request.method=="POST":
            username=user.username
            old_password=request.POST['old_password']
            user=auth.authenticate(username=username,password=old_password)
            if user is not None:
                new_password1=request.POST['new_password1']
                new_password2=request.POST['new_password2']

                if new_password1 != new_password2:
                    messages.info(request,"Passwords do not match")
                    return redirect('account')
                
                user.set_password(new_password1)
                user.save()
                auth.login(request,user)
                messages.info(request,"Successfully updated password")
                return redirect('account')
            else:
                messages.info(request,"Wrong Password")
                return redirect('account')
        return render(request,"account.html")
    else:
        return redirect('/login')
    
def interview(request):
    if request.user.is_authenticated:
        return render(request,'interview.html')
    else:
        return redirect('/login')
