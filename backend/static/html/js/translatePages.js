import { getTranslatedText } from './loginPage.js';

const userlistText = document.getElementById('userlistText');
const arenaTitleText = document.getElementById('arenaTitleText');
const player3Text = document.getElementById('player3Text');
const player2Text = document.getElementById('player2Text');
const player1Text = document.getElementById('player1Text');
const powerupsText = document.getElementById('gamemodeText');
const mapsText = document.getElementById('mapsText');
const enabledText = document.getElementById('gamemodesNameText');
const startText = document.getElementById('startText');

export function translateArenaPageTexts() {
    userlistText.textContent = getTranslatedText('userlist');
    arenaTitleText.textContent = getTranslatedText('arenaTitle');
    player3Text.textContent = getTranslatedText('player3');
    player2Text.textContent = getTranslatedText('player2');
    player1Text.textContent = getTranslatedText('player1');
    powerupsText.textContent = getTranslatedText('gamemode');
    mapsText.textContent = getTranslatedText('maps');
    enabledText.textContent = getTranslatedText('gamemodesNameText');
    startText.textContent = getTranslatedText('start');
}