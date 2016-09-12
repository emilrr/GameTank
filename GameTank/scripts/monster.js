var Monster = (function () {
    var changeMonster = 1;

    function Monster(x, y, width, height, speed) {
        Drawable.call(this, x, y, width, height);
        this.speed = speed + 0.1;
        this.alive = true;
        this.direction = 0;
        this.isKilled = false;
        this.rightPoint = randomIntFromInterval(410, 1080);
        this.leftPoint = randomIntFromInterval(0, 400);
        this.bottomPoint = randomIntFromInterval(this.y, 580);
        this.bottomPoint = 250;
        this.upPoint = 0;
        this.changeMonster = ++changeMonster;
        this.gameOver = false;
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    Monster.prototype.draw = function () {
        var startPositionMonster = randomIntFromInterval(0, 500);
        this.context.save();

        if (this.direction === 3 || this.direction === 0) {
            this.context.clearRect(this.x - 5, this.y - 3, 40, 40); //move right
        } else if (this.direction === 1) {
            this.context.clearRect(this.x, this.y, 40, 40); //move left
        } else if (this.direction === 2) {
            this.context.clearRect(this.x, this.y - 5, 40, 40);  //move down
        } else if (this.direction === 4) {
            this.context.clearRect(this.x - 4, this.y, 40, 40);  //move up
        }

        if (this.alive === true && this.gameOver === false) {
            if (this.changeMonster % 2 === 0) {
                this.context.drawImage(imageRepository.monster, this.x, this.y, 30, 30);
            } else {
                this.context.drawImage(imageRepository.monsterSecond, this.x, this.y, 30, 30);
            }
        }

        this.context.translate(this.x, this.y);
        this.context.restore();

        if (this.isKilled) {
            if (this.changeMonster % 2 === 0) {
                game.monster = new Monster(0, startPositionMonster, imageRepository.monster.width, imageRepository.monster.height, this.speed);
            } else {
                game.monster = new Monster(0, startPositionMonster, imageRepository.monsterSecond.width, imageRepository.monsterSecond.height, this.speed);
            }
        }
    };

    Monster.prototype.move = function () {
        if (!this.gameOver) {
            if (this.direction === 0) {
                this.x += this.speed;

                if (isColliding(this)) {
                    this.x -= 2;
                    this.rightPoint = this.x;
                }

                if (this.x >= this.rightPoint) {
                    this.direction = 1;
                }
            } else if (this.direction === 1) {
                this.x -= this.speed;

                if (isColliding(this)) {
                    this.x += 2;
                    this.leftPoint = this.x;
                }

                if (this.x <= this.leftPoint) {
                    this.direction = 2;
                    this.upPoint = this.y;
                }
            } else if (this.direction === 2) {
                this.y += this.speed;

                if (isColliding(this)) {
                    this.y -= 3;
                    this.bottomPoint = this.y;
                }

                if (this.y >= this.bottomPoint) {
                    this.direction = 3;
                }
            } else if (this.direction === 3) {
                this.x += this.speed;
                if (isColliding(this)) {
                    this.x -= 2;
                    this.rightPoint = this.x;
                }

                if (this.x >= this.rightPoint) {
                    this.direction = 4;
                }
            } else if (this.direction === 4) {
                this.y -= this.speed;

                if (isColliding(this)) {
                    this.y += 2;
                    this.upPoint = this.y;
                }

                if (this.y <= this.upPoint) {
                    this.direction = 1;
                }
            }

            if (areTouching(this, game.tank)) {
                game.tank.gameOver = true;
                game.monster.gameOver = true;
                setTimeout(function () {
                    game.gameOver.draw();
                }, 500);
            }
            this.draw();
        }
    };

    Monster.prototype.clear = function () {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
    };

    return Monster;
}(window));