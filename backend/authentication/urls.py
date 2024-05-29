from django.urls import path
from .views import authentication, tournament

urlpatterns = [
	path('', authentication.index, name='index'),

    path('login_page/', authentication.login_page, name='login_page'),
    path('signup/', authentication.signup, name='signup'),
    path('change_language/', authentication.change_language, name='change_language'),
    path('update_status/', authentication.update_status, name='update_status'),
    path('get_status/', authentication.get_status, name='get_status'),

    path('tournament/', tournament.result, name='result'),
    path('addPlayer/', tournament.add_member, name='add_member'),
    path('game_list/', tournament.game_list, name='game_list'),
    path('add_game/', tournament.add_game, name='add_game'),
]