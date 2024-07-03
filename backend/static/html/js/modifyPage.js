import { togglePanelDisplay, togglePlanet, landedOnPlanet } from './enterPlanet.js';
import { returnToHost } from './userPage.js';
import { resetOutline } from './planetIntersection.js';
import { toggleBlurDisplay, toggleLobbyStart, toggleRSContainerVisibility } from './main.js';
import { spaceShip, spaceShipInt } from './objs.js';
import { showPage } from "./showPages.js";
import { getCookie } from './loginPage.js';
import { getProfileInfo, updateUserStatus, populateProfileInfo } from './userManagement.js';
import { getTranslatedText } from "./translatePages.js";
import { guestLoggedIn } from './arenaPage.js';


//import { toggleThirdPlaInfos } from '../../tournament/js/newTournament.js';
let isInfosShow = false;
let anonymousStatus;

var submitChangeButton = document.querySelector(".submitChangeButton");
submitChangeButton.addEventListener("click", handleChangeInfoForm);

function handleChangeInfoForm(event) {
  event.preventDefault();

  var form = document.getElementById("userInfoForm");
  var formData = new FormData(form);
  formData.append('anonymousStatus', anonymousStatus)

  const token = sessionStorage.getItem('host_auth_token');
  fetch('change_profile_info/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'X-CRSFToken': getCookie('crsftoken')
    },
    body: formData,
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    var changeInfoMessage = document.querySelector('.changeInfoMessage');
    if (data.status === "succes")
      getProfileInfo(sessionStorage.getItem("host_id"))
        .then(data => {
            populateProfileInfo(data);
        })
        .catch(error => {
            console.error('Failed to retrieve profile info:', error);
        });
    else changeInfoMessage.classList.toggle("errorMessage");
    document.getElementById('changeInfoMessage').innerText = getTranslatedText(data.msg_code);
  })
  .catch(error => {
    console.error('There was a problem with the change_profile_info:', error);
  });
}

const deleteAccountButton = document.querySelector(".deleteAccountButton");
const deleteBlockingPanel = document.getElementById('deleteBlockingPanel');
const blockingPanel = document.getElementById('blockingPanel');

document.getElementById('profile-pic').addEventListener('change', function() {
  let fileName = this.files[0] ? this.files[0].name : 'Aucun fichier sélectionné';
  document.getElementById('LinkPicture').textContent = fileName;
});

// Add the event listeners for cancel and confirmation buttons once
document.getElementById('deleteAccountCancel').addEventListener("click", function() {
  document.getElementById("validateDelete").classList.remove("showRectangle");
  deleteBlockingPanel.classList.remove('show');
});

document.getElementById('deleteAccountConfirmation').addEventListener("click", function() {
  const token = sessionStorage.getItem('host_auth_token');
  document.getElementById("validateDelete").classList.remove("showRectangle");

  fetch('delete_account/', {
      method: 'POST',
      headers: {
          'Authorization': `Token ${token}`,
          'X-CRSFToken': getCookie('crsftoken')
      },
  })
  .then(response => {
      deleteBlockingPanel.classList.remove('show');
      if (guestLoggedIn.length > 0) {
        guestLoggedIn.forEach(user => {
            updateUserStatus('offline', user[1]);
        });
      }
      guestLoggedIn.splice(0, guestLoggedIn.length);
      const lsCont = document.getElementById('lsCont');
      lsCont.innerHTML = `
          <div class="tinyRedShadowfilter">
              Players Connected
          </div>
      `;
      sessionStorage.clear();
      return response.json();
  })
  .catch(error => {
      console.error('There was a problem with the delete_account:', error);
  });

  document.getElementById("validateDelete").classList.remove("showRectangle");
  togglePlanet(true);
  returnToHost();
  spaceShip.position.set(0, 0, -1293.5);
  spaceShip.rotation.set(0, 0, 0);

  setTimeout(() => {
      toggleLobbyStart(true);
      spaceShipInt.visible = true;
      showPage('loginPage');
  }, 25);
});

deleteAccountButton.addEventListener("click", deleteAccount);

function deleteAccount() {
  document.getElementById("validateDelete").classList.toggle("showRectangle");
  deleteBlockingPanel.classList.add('show');
}

// document.addEventListener('DOMContentLoaded', (event) => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  let oldUsername;
  let toggleSwitchClicked = false;

  toggleSwitch.addEventListener('click', function() {
      this.classList.toggle('active');
      if (this.classList.contains('active')) {
        anonymousStatus = true;
        if (!toggleSwitchClicked) {
          toggleSwitchClicked = true;
          oldUsername = document.getElementById('changeUsernameInput').value;
        }
        getRandomUsername();
      }
      else {
        anonymousStatus = false;
        document.getElementById('changeUsernameInput').value = oldUsername;
      }
  });
// });

// document.addEventListener('DOMContentLoaded', (event) => {
  const thirdPlayerToggleSwitch = document.getElementById('thirdPlayertoggleSwitch');
  thirdPlayerToggleSwitch.addEventListener('click', function() {
      this.classList.toggle('active');
      toggleThirdPlayerMode();
  });
// });

export function getRandomUsername() {
  const token = sessionStorage.getItem('host_auth_token');
  fetch('generate_unique_username/', {
      method: 'GET',
      headers: {
          'Authorization': `Token ${token}`,
      }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.username);
    document.getElementById('changeUsernameInput').value = data.username;
  })
  .catch(error => {
      console.error('Error:', error);
      throw error;
  });
};

const RGPDPage = document.querySelector(".rgpdPage");

const RGPDPolicy = document.getElementById('RGPDPolicyInUserPage');
RGPDPolicy.addEventListener('click', function() {
  blockingPanel.classList.add('show');
  RGPDPage.classList.remove("perspectived");
  showPage('rgpdPage');
});

const infoButton = document.getElementById("infoButton");
infoButton.addEventListener("click", displayAnonymousMode);

function displayAnonymousMode() {
  isInfosShow = !isInfosShow;
  document.getElementById("displayAnonymousMode").classList.toggle("showRectangle");
}

const infoBack = document.getElementById("infoBack");
infoBack.addEventListener("click", backInfosDisplay);

function backInfosDisplay() {
  isInfosShow = false;
  document.getElementById("displayAnonymousMode").classList.toggle("showRectangle");
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape')
    return;
    if (isInfosShow == true) {
      isInfosShow = false;
      document.getElementById("displayAnonymousMode").classList.toggle("showRectangle");
    }
});

export function resetModifyPageField() {
  console.log("resetModifyPageField");
  getProfileInfo(sessionStorage.getItem("host_id"))
  .then(data => {
      populateProfileInfo(data);
  })
  .catch(error => {
      console.error('Failed to retrieve profile info:', error);
  });
  document.getElementById('changePasswordInput').value = '';
  document.getElementById('changeConfirmPasswordInput').value = '';
  document.getElementById('changeInfoMessage').innerText = '';
  document.getElementById('profile-pic').value = '';
  document.getElementById('changeInfoMessage').innerText = '';
  document.getElementById('LinkPicture').innerText = '';
  const toggleSwitch = document.getElementById('toggleSwitch');
  toggleSwitch.classList.remove('active');
}