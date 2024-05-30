from rest_framework import serializers
from .models import User, Game
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
import logging

class UserSerializer(serializers.ModelSerializer):
	class Meta():
		model = User
		fields = ['username', 'password']

class SignupSerializer(serializers.ModelSerializer):
	confirmation_password = serializers.CharField(write_only=True)
	class Meta():
		model = User
		fields = ['username', 'password', 'confirmation_password']
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		for field_name, field in self.fields.items():
			field.error_messages['blank'] = "All fields must be completed."
	
	def validate_username(self, value):
		if len(value) > 13:
			raise serializers.ValidationError("Username must contains 12 characters maximum.")
		return value

	# def validate_password(self, value):
	# 	try:
	# 		validate_password(value)
	# 	except ValidationError as e:
	# 		raise PasswordValidationError(detail=e.error_list[0])
	# 	return value
	
	def validate_confirmation_password(self, value):
		confirmation_password = value
		password = self.initial_data.get('password')

		if password != confirmation_password:
			raise PasswordValidationError(detail="Password not identical")
		return value

class UpdateInfoSerializer(serializers.ModelSerializer):
	confirmation_password = serializers.CharField(write_only=True, required=False)
	class Meta():
		model = User
		fields = ['username', 'password', 'bio', 'profile_picture', 'confirmation_password']
		extra_kwargs = {
			'password': {'write_only': True, 'required': False},
			'username': {'required': False},
			'bio': {'required': False},
			'profile_picture': {'required': False}
		}

	def	validate_username(self, value):
		if value:
			if len(value) > 13:
				raise serializers.ValidationError("Username must contains 12 characters maximum.")
			if User.objects.filter(username=value).exists():
				raise serializers.ValidationError("Username already exist")
		return value

	def validate_password(self, value):
		if value:
			try:
				validate_password(value)
			except ValidationError as e:
				raise PasswordValidationError(detail=e.error_list[0])
		return value

	def validate_bio(self, value):
		if value:
			if len(value) > 28:
				raise serializers.ValidationError("Bio must contains 28 characters maximum.")
		return value

	def validate(self, data):
		password = data.get('password')
		confirmation_password = data.pop('confirmation_password', None)

		if password:
			if not confirmation_password:
				raise serializers.ValidationError("You need to confirm your password.")
			if password != confirmation_password:
				raise serializers.ValidationError("Password not identical")
		return data
	
	def update(self, instance, validated_data):
		for attr, value in validated_data.items():
			if attr == 'password' and value:
				instance.set_password(value)
			elif value:
				setattr(instance, attr, value)
		instance.save()
		return instance
	

class PasswordValidationError(serializers.ValidationError):
	def __init__(self, detail=None):
		if detail is None:
			detail = "Mot de passe invalide."
		super().__init__(detail)

class UserListSerializer(serializers.ModelSerializer):
	class Meta():
		model = User
		fields = ['id', 'username', 'language', 'last_login_date', 'status', 'profile_picture', 'bio', 'is_host']


class GameListSerializer(serializers.ModelSerializer):
	player1_username = serializers.CharField(source='player1.username', read_only=True)
	player1_profilePicture = serializers.CharField(source='player1.profile_picture.url', read_only=True)
	player2_username = serializers.CharField(source='player2.username', read_only=True)
	player2_profilePicture = serializers.CharField(source='player2.profile_picture.url', read_only=True)
	player3_username = serializers.CharField(source='player3.username', read_only=True, allow_null=True)
	Date = serializers.DateTimeField(format="%Y-%m-%d %H:%M", source='date', read_only=True)

	class Meta:
		model = Game
		fields = ['id', 'player1', 'player1_username', 'player1_profilePicture', 'player2', 'player2_username', 'player2_profilePicture', 'player3', 'player3_username', 'scorePlayer1', 'scorePlayer2', 'gameplayMode', 'modeGame', 'Date']
