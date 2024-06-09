from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.template.response import TemplateResponse

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from ..models import User
from ..serializers import UserSerializer, SignupSerializer

def index(request):
  return render(request, 'index.html')

# cree un loginForm pour rendre le code plus clair
@api_view(['POST'])
@permission_classes([AllowAny])  
def login_page(request):
  try:
    username = request.POST.get("username")
    password = request.POST.get("password")
    new_language = request.POST.get("language")
    languageClicked = request.POST.get("languageClicked") == 'true'

    user = authenticate(username=username, password=password)
    if user is not None:
      # if user.status != 'online':
        token, created = Token.objects.get_or_create(user=user)
        if languageClicked and new_language != user.language:
            user.language = new_language
        user.last_login_date = timezone.now()
        user.status = 'online'
        user.is_host = True
        user.save()
        return  JsonResponse({'status': "succes", 'token': token.key, 'msg_code': "loginSuccessful", 'language': user.language, 'id': user.id, 'graphic_mode': user.graphic_mode})
      # else:
        # return Response({'status': "failure", 'msg_code': "userAlreadyLoggedIn"})
    else:
      return  JsonResponse({'status': "failure", 'msg_code': "loginFailed"})
  except Exception as e:
      print(str(e))
      return JsonResponse({'status': "error", 'message': str(e)})


@api_view(['POST']) 
@permission_classes([AllowAny])  
def signup(request):
  new_language = request.POST.get("language") #on valide ?

  serializer = SignupSerializer(data=request.data)
  if serializer.is_valid():
    user_data = serializer.validated_data
    user = User(username=user_data['username'], language=new_language)
    user.set_password(user_data['password'])
    user.save()
    return JsonResponse({'status': "success", "msg_code": "successfulSignup"}, status=status.HTTP_200_OK)
  first_error = next(iter(serializer.errors.values()))[0]
  first_error_code = first_error.code 
  print(first_error_code)
  return JsonResponse({'status': "failure", "msg_code": first_error_code})
