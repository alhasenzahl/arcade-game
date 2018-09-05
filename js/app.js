// This is the constructor function for the enemy.
// Each new enemy created within the game inherits all of these properties.
'use strict';

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y + 55;
        this.speed = speed;
        this.horizontal = 101;
        this.boundary = this.horizontal * 5;
        this.resetX = this.horizontal * -1;
        this.sprite = 'images/enemy-bug.png';
}

    // Updates the positioning of the enemies as they cross the screen and allows them to be reset at the beginning when they make it to the end of the game board.
    update(dt) {
        if (this.x < this.boundary) {
              this.x += this.speed * dt;
        } else {
            this.x = this.resetX;
        }
    }
     
    // Allows each of the enemies to be seen (drawn) on the screen.
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Variable that store the star icons and scoreboard.
const starsList = document.querySelector('.stars');
const star5 = starsList.children[4];
const star4 = starsList.children[3];
const star3 = starsList.children[2];
const star2 = starsList.children[1];
const star1 = starsList.children[0];

const scoreboard = document.querySelector('.scoreboard');

// This is the constructor function for the player.
// The main player (and any subsequent players that may be created) within the game inherits all of these properties.
class Hero {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.horizontal = 101;
        this.vertical = 83;
        this.startingX = this.horizontal * 2;
        this.startingY = (this.vertical * 4) + 55;
        this.x = this.startingX;
        this.y = this.startingY;
        this.winner = false;
        this.collisionCount = 0;
        this.score = 0;
    }

    // Allows the player image to be seen (drawn) on the screen.
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Manages the positioning of the player on the game board, so they can't move outside of the boundaries of the game board.
    handleInput(input) {
        if (input === 'left') {
            if (this.x > 0) {
                this.x -= this.horizontal
            }
        } else if (input === 'up') {
            if (this.y > 0) {
                this.y -= this.vertical;
            }
        } else if (input === 'right') {
            if (this.x < this.horizontal * 4) {
                this.x += this.horizontal;
            }
        } else if (input === 'down') {
            if (this.y < this.vertical * 4 ) {
                this.y += this.vertical;
            }
        }

        // check if player makes it to other side successfully
        if (this.y === -28) {
            this.score += 50;
            scoreboard.innerText = this.score;
            this.reset();
        }
    }

    // Resets the player to the starting position.
    reset() {
        this.x = this.startingX;
        this.y = this.startingY;
    }

    // Updates the position of the player by checking to see if they collided with an enemy or won the game.
    update() {
        // check for a collision
        for (let enemy of allEnemies) {
            if (enemy.y === this.y && (enemy.x + enemy.horizontal / 2 > this.x && enemy.x < this.x + this.horizontal / 2)) {
                this.reset();
                this.collisionCount += 1;
                this.removeStars();
                
                if (this.collisionCount === 5) {
                    star1.remove();
                    this.winner = true;
                }
            }
        }   
    }

    // Function that removes a star each time the player collides with an enemy.
    removeStars() {
        if (this.collisionCount === 1) {
            star5.remove();
        } else if (this.collisionCount === 2) {
            star4.remove();
        } else if (this.collisionCount === 3) {
            star3.remove();
        } else if (this.collisionCount === 4) {
            star2.remove();
        }
    }

    // Function that adds the five stars back on to the board when the game is reset.
    addStars() {
        starsList.appendChild(star1);
        starsList.appendChild(star2);
        starsList.appendChild(star3);
        starsList.appendChild(star4);
        starsList.appendChild(star5);
        this.score = 0;
        this.collisionCount = 0;
    }
}

// Variable that creates a new player object.
const player = new Hero();

// Variables that create the five new enemy objects and the array that they are all stored into.
const allEnemies = [];
const bug1 = new Enemy(-101, 0, 100);
const bug2 = new Enemy((-101 * 5), 83, 200);
const bug3 = new Enemy((-101 * 2.5), 166, 175);
const bug4 = new Enemy((-101 * 6), 0, 110);
const bug5 = new Enemy((-101 * 10), 166, 170);

allEnemies.push(bug1, bug2, bug3, bug4, bug5);

// Event listener that looks for keyboard clicks to move the player around the game board.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
