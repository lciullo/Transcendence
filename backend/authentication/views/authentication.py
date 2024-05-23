from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated

from ..models import User
from ..serializers import UserSerializer, SignupSerializer

def index(request):
  return render(request, 'index.html')

# change user status to online
@api_view(['POST'])
@permission_classes([AllowAny])  
def login_page(request):
  try:
    username = request.POST.get("username")
    password = request.POST.get("password")
    language = request.POST.get("language")
    languageClicked = request.POST.get("languageClicked")

    print(username)
    print(password)
    print(language)
    print(languageClicked)
    user = authenticate(username=username, password=password)
    if user is not None:
      print(user)
      token, created = Token.objects.get_or_create(user=user)
      if language != user.language and languageClicked :
        user.language = language
        user.save()
      return  Response({'status': "succes", 'token': token.key, 'message': "You are now logged in!\nPress [E] to enter a new galaxie"}) #return languages pour mettre a jour currenLanguage00000000000000000
    else:
      print("J'existe pas")
      return  Response({'status': "failure", 'message': "Username and/or password invalid"})
  except Exception as e:
      return Response({'status': "error", 'message': str(e)})

#ajouter message d'erreur quand user existe deja
##checker que username pas deja pris
@api_view(['POST'])
@permission_classes([AllowAny])  
def signup(request):
  print("je suis dans sign up")
  print(request.data)
  serializer = SignupSerializer(data=request.data)
  if serializer.is_valid():
    user_data = serializer.validated_data
    user = User(username=user_data['username'])
    user.set_password(user_data['password'])
    print(user_data['username'])
    print(user_data['password'])
    print("Utilisateur cree")
    user.save()
    return Response({"ok": True})
  print(serializer.errors)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def logout(request):

#change user status to online
#view logout --> bien pense a supprime le token d'authentication dans le local storage

# @api_view(['POST'])
# def update_info(request):