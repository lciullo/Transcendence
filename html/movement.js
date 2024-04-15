import { THREE, spaceShip, camera, spaceShipPointLight} from "./main.js";

let leftArrowPressed = false;
let rightArrowPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;
let wKeyPressed = false;
let aKeyPressed = false;
let sKeyPressed = false;
let dKeyPressed = false;
let aKeyIsPressed = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft')
        leftArrowPressed = true;
    if (event.key === 'ArrowRight')
        rightArrowPressed = true;
    if (event.key === 'ArrowUp')
        upArrowPressed = true;
    if (event.key === 'ArrowDown')
        downArrowPressed = true;
    if (event.key === 'w')
        wKeyPressed = true;
    if (event.key === 'a')
        aKeyPressed = true;
    if (event.key === 's')
        sKeyPressed = true;    
    if (event.key === 'd')
        dKeyPressed = true;
    aKeyIsPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft')
        leftArrowPressed = false;
    if (event.key === 'ArrowRight')
        rightArrowPressed = false;
    if (event.key === 'ArrowUp')
        upArrowPressed = false;
    if (event.key === 'ArrowDown')
        downArrowPressed = false;
    if (event.key === 'w')
        wKeyPressed = false;
    if (event.key === 'a')
        aKeyPressed = false;
    if (event.key === 's')
        sKeyPressed = false;    
    if (event.key === 'd')
        dKeyPressed = false;
});

document.addEventListener('keypress', (event) => {
    if (event.key === ' ' && !boost)
        startBoost(); 
})

let camMinDist = -0.5;
let camMaxDist = 10;
let distance = camMinDist;
let height = 0.1;
let moveSpeed = 5;
let rotSpeed = 0.10;
const tolerance = 0.01; 


function rotateSpaceShipAnim(targetRot) {
    const tolerance = 0.01;
    if (Math.abs(spaceShip.rotation.z - targetRot) > tolerance) {
        if (spaceShip.rotation.z > targetRot)
        spaceShip.rotation.z -= rotSpeed;
    else if (spaceShip.rotation.z < targetRot)
        spaceShip.rotation.z += rotSpeed;
}}

let boost = false;
const boostDuration = 1000;
let originalMoveSpeed;
let boostedMoveSpeed;
let boostStartTime;

function startBoost() {
    if (!boost) {
        originalMoveSpeed = moveSpeed;
        boostedMoveSpeed = moveSpeed * 5;
        boostStartTime = Date.now();
        boost = true;
        smoothBoost();
    }
}

function smoothBoost() {
    const now = Date.now();
    const elapsedTime = now - boostStartTime;
    const progress = Math.min(1, elapsedTime / boostDuration);
    
    if (progress < 1) {
        // Increase moveSpeed instantly
        moveSpeed = boostedMoveSpeed;
    } else {
        endBoost();
        return;
    }

    // Decrease moveSpeed gradually towards the end
    const remainingTime = boostDuration - elapsedTime;
    const decreaseFactor = remainingTime / boostDuration;
    moveSpeed = originalMoveSpeed + (moveSpeed - originalMoveSpeed) * decreaseFactor;

    requestAnimationFrame(smoothBoost);
}

function endBoost() {
    moveSpeed = originalMoveSpeed;
    boost = false;
}

function spaceShipMovement() {
    if (!aKeyIsPressed)
        return;
    if (upArrowPressed || wKeyPressed) {
        spaceShip.position.x += Math.sin(spaceShip.rotation.y) * moveSpeed;
        spaceShip.position.z += Math.cos(spaceShip.rotation.y) * moveSpeed;
        if (!leftArrowPressed && !rightArrowPressed && !aKeyPressed && !dKeyPressed)
            rotateSpaceShipAnim(0);
    }
    if (downArrowPressed || sKeyPressed) {
        spaceShip.position.x -= Math.sin(spaceShip.rotation.y) * moveSpeed;
        spaceShip.position.z -= Math.cos(spaceShip.rotation.y) * moveSpeed;
        if (!leftArrowPressed && !rightArrowPressed && !aKeyPressed && !dKeyPressed)
            rotateSpaceShipAnim(0);
    }
    if (leftArrowPressed || aKeyPressed) {
        if (downArrowPressed || sKeyPressed) {
            spaceShip.rotation.y -= 0.05;
        }
        else 
            spaceShip.rotation.y += 0.05;
        rotateSpaceShipAnim(-0.80);
    }
    if (rightArrowPressed || dKeyPressed) {
        if (downArrowPressed || sKeyPressed)
            spaceShip.rotation.y += 0.05;
        else 
            spaceShip.rotation.y -= 0.05;
        rotateSpaceShipAnim(0.80);

    }
    camera.position.copy(new THREE.Vector3(spaceShip.position.x - distance * Math.sin(spaceShip.rotation.y), height, spaceShip.position.z - distance * Math.cos(spaceShip.rotation.y)));
    spaceShipPointLight.position.copy(spaceShip.position);
}


let goToThirdPerson = true;

function camMovement() {
    if (!spaceShip)
        return;
    if (goToThirdPerson && distance < camMaxDist){
        distance += 1;
        height += 0.4;
        camera.position.copy(new THREE.Vector3(spaceShip.position.x - distance * Math.sin(spaceShip.rotation.y), height, spaceShip.position.z - distance * Math.cos(spaceShip.rotation.y)));
    }
    if (distance >= camMaxDist)
        goToThirdPerson = false;
    camera.rotation.y = spaceShip.rotation.y - Math.PI;
}


export { spaceShipMovement, camMovement };