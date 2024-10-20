import * as THREE from 'three';
import { camera, landedOnPlanet } from './main.js';
import { showPage } from './showPages.js';
import { currentLanguage, getTranslatedText } from './translatePages.js';
import { emptyLoginField, getCookie } from './loginPage.js';

export let inCockpit = false;

const backPosition = new THREE.Vector3(0, 4.5, -1295);
const frontPosition = new THREE.Vector3(0, 4.5, -1304);

export function moveCameraToFrontOfCockpit(page) {1
    const duration = 1000;
    const cameraAnimation = new TWEEN.Tween(camera.position)
        .to(backPosition, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        emptyLoginField();
        inCockpit = true;
        if (page === 'signUpPage' && window.location.hash === '#rgpdPage') {

            showPage('signUpPage', 'delay');
            const selectedPage = document.querySelector('.signUpPage');
            const hologramContainer = selectedPage.querySelector('.hologram-container');
            if (hologramContainer) {
                hologramContainer.classList.remove('open');
                void hologramContainer.offsetWidth;
                hologramContainer.classList.add('open');
            }
        }
        else if (page === 'rgpdPage')
            showPage('rgpdPage', 'default');
        else {
            showPage('signUpPage', 'signUp');

            const selectedPage = document.querySelector('.signUpPage');
            const hologramContainer = selectedPage.querySelector('.hologram-container');
    
            if (hologramContainer) {
                hologramContainer.classList.remove('open');
                void hologramContainer.offsetWidth;
                hologramContainer.classList.add('open');
            }

        }
}


export function moveCameraToBackOfCockpit() {
    const duration = 1000;
    const cameraAnimation = new TWEEN.Tween(camera.position)
    .to(frontPosition, duration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
    showPage('loginPage');
    emptySignUpField();
    inCockpit = false;
}

const backToLoginButton = document.querySelector('.backToLoginButton');

backToLoginButton.addEventListener('click', function() {
    moveCameraToBackOfCockpit();
});

const RGPDPage = document.getElementById('RGPDPage');

// Add event listener to the sign-up form
// const signupForm = document.getElementById('signupForm');
// signupForm.addEventListener('submit', handleSignup);

//Add event listner to display RGPG page
const RGPDPolicy = document.getElementById('RGPDPolicy');
RGPDPolicy.addEventListener('click', function() {
    showPage('rgpdPage');
    RGPDPage.classList.add("holoPerspective");
    RGPDPage.classList.remove("noPerspective");
});


const RGPDBack = document.getElementById('RGPDBack');
RGPDBack.addEventListener('click', function() {
    if (landedOnPlanet) {
        blockingPanel.classList.remove('show');
        blockingPanel.classList.remove('show');
        showPage('none');
    }
    else {showPage('signUpPage');}
});

const signUpForm = document.getElementById('signupForm');
signUpForm.addEventListener('submit', handleSignUp);

function handleSignUp(event) {
    event.preventDefault();
    
    const messageContainer = document.getElementById('messageContainerSignup');
    messageContainer.innerText = '';
    const submitButton = document.getElementById('submitSignUp');
    submitButton.disabled = true;

    let formData = new FormData(this);
    formData.append('language', currentLanguage);

    fetch('signup/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) 
            return response.json().then(err => Promise.reject(err));
        return response.json();
    })
    .then(data => {
        changeColorMessage('.signupMessageCont', 'success');
        messageContainer.innerText = getTranslatedText(data.msg_code);
        submitButton.disabled = false;
        emptySignUpField(true);
    })
    .catch(error => {
        changeColorMessage('.signupMessageCont', 'failure');
        messageContainer.innerText = getTranslatedText(error.msg_code);
        submitButton.disabled = false;
    });
}

export function changeColorMessage(messageContainer, status) {
    let messageCont = document.querySelector(messageContainer);

    if (status === "success") {
        messageCont.classList.remove("failure");
        messageCont.classList.add("success");
    } else if (status === "failure") {
        messageCont.classList.remove("success");
        messageCont.classList.add("failure");
    }
}

export function emptySignUpField(success = false) {
    document.getElementById('usernameSignUpInput').value = '';
    document.getElementById('passwordSignUpInput').value = '';
    document.getElementById('confirmPasswordSignUpInput').value = '';
    if (success === false)
        document.getElementById('messageContainerSignup').innerText = '';
}