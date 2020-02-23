'use strict';

const field = document.getElementById('field');
const bricks = document.getElementById('bricks');

const keys = {
    jump: 32,
    left: 37,
    right: 39,
};

const hero = {
    walkingSkins: 0,
    scaleX: 1,
    x: 0,
    y: 0,
    speedMultiplier: 1,
    element: document.getElementById("hero"),

    setSkin(srcImg) {

        if (!srcImg) {
            srcImg = './img/character-01-resting.svg';
        }
        this.element.setAttribute('src', srcImg);
    },

    setScale(scale) {
        if (!scale) {
            scale = this.scaleX;
        }
        this.scaleX = scale;
        this.element.style.transform = `scaleX(${scale})`;
    }

};

hero.setSkin();
hero.setScale();

const setPressedKeys = function (event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    else {
        event.returnValue = false;
    }

    if (event.type === 'keyup' && event.keyCode !== keys.jump) {
        hero.setSkin();
    }

    const keyCode = event.keyCode || event.which;
    keys[keyCode] = event.type === 'keydown';
};

const jump = function (y, x) {

    const coordHero = hero.element.getBoundingClientRect();
    const coordBricks = bricks.getBoundingClientRect();
    let countUp = 1;
    let countDown = 5;
    let jumpHeight = 0;

    setInterval(() => {
        if (countUp < 5) {
            countUp++;
            hero.element.setAttribute('src', `./img/character-01-jump-0${countUp}.svg`);
        }
    }, 54);

    hero.y = y * hero.speedMultiplier;
    hero.element.style.top = hero.y + 'px';
    hero.x += (x / 2) * hero.speedMultiplier;
    hero.element.style.left = hero.x + 'px';

    if (coordHero.bottom > coordBricks.top &&
        coordHero.left > (coordBricks.left - coordHero.width / 2) &&
        coordHero.right < (coordBricks.right + coordHero.width / 2)
    ) {

        jumpHeight = coordBricks.top + 15 - (coordBricks.height*2) ;
        console.log(jumpHeight);
    }

    setTimeout(() => {
        setInterval(() => {
            if (countDown < 9) {
                countDown++;
                hero.element.setAttribute('src', `./img/character-01-jump-0${countDown}.svg`);
            }
        }, 54);



        hero.element.style.top = (0 - (jumpHeight)) + 'px';
        hero.x += (x / 2) * hero.speedMultiplier;
        hero.element.style.left = hero.x + 'px';

    }, 148)

};


const moveCharacter = (x) => {

    const coordHero = hero.element.getBoundingClientRect();
    const coordBricks = bricks.getBoundingClientRect();
    const coordField = field.getBoundingClientRect();

    hero.walkingSkins++;

    if (hero.walkingSkins > 4) {
        hero.walkingSkins = 1;
    }

    if ((coordHero.bottom  - 15 < coordBricks.top && ((coordHero.left + coordHero.width / 2) < coordBricks.left))
        ||
        ((coordHero.bottom  - 15 < coordBricks.top) && (coordHero.left + coordHero.width / 2) > coordBricks.right)) {
        hero.element.style.top = 0 + 'px';
    }

    if (coordHero.right > coordField.right) {
        hero.x = coordField.right - coordHero.width;
    }

    if (coordHero.left < coordField.left) {
        hero.x = 0
    } else {
        hero.x += x * hero.speedMultiplier;
    }

    hero.element.style.left = hero.x + 'px';

    hero.setSkin(`./img/character-01-walking-0${hero.walkingSkins}.svg`)
};

const detectCharacterMovement = () => {
    let scale;

    if (keys[keys.left]) {
        scale = -1;
        moveCharacter(-10, 0);
    }
    else if (keys[keys.right]) {
        scale = 1;
        moveCharacter(10, 0);
    }

    if (keys[keys.right] && keys[keys.jump]) {
        jump(-193, 130)
    }

    else if (keys[keys.left] && keys[keys.jump]) {
        jump(-193, -130)
    }

    else if (keys[keys.jump]) {
        jump(-220, 0)
    }

    hero.setScale(scale)
};

['keydown', 'keyup'].forEach(event => field.addEventListener(event, setPressedKeys));

setInterval(function () {
    detectCharacterMovement();
}, 150);

