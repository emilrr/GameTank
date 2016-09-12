var Tank = (function () {
    var fireRate = 20,
        counter = 0;

    function Tank(x, y, width, height) {
        Drawable.call(this, x, y, width, height);
        this.speed = 3;
        this.angle = 0;
        this.bulletPool = new Pool(5);
        this.gameOver = false;
    }

    Tank.prototype = new Drawable();

    Tank.prototype.draw = function () {
        this.context.save();
        this.context.clearRect(this.x + this.width, this.y - this.width, -this.width * 2, this.height * 2);
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle * Math.PI / 180);
        if (!this.gameOver) {
            this.context.drawImage(imageRepository.tank, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        this.context.restore();
    };

    Tank.prototype.fire = function () {
        if (this.angle === 90) {
            this.bulletPool.get(this.x + 30, this.y, 6, this.angle);
        } else if (this.angle === 180) {
            this.bulletPool.get(this.x - 1, this.y + 30, 6, this.angle);
        } else if (this.angle === 270) {
            this.bulletPool.get(this.x - 30, this.y - 1, 6, this.angle);
        } else if (this.angle === 360 || this.angle === 0) {
            this.bulletPool.get(this.x - 1, this.y - 30, 6, this.angle);
        }
    };

    Tank.prototype.move = function () {
        counter++;
        console.log(this.x + ' ' + this.y);
        if (!this.gameOver) {
            if (KEY_STATUS.left || KEY_STATUS.right ||
                KEY_STATUS.down || KEY_STATUS.up) {
                if (KEY_STATUS.left) {
                    this.x -= this.speed;
                    this.angle = 270;
                    if (this.x <= this.height / 2) {
                        this.x = this.height / 2;
                    }

                    if (isColliding(this)) {
                        this.x += this.speed;
                    }

                } else if (KEY_STATUS.right) {
                    this.x += this.speed;
                    this.angle = 90;
                    if (this.x >= this.canvasWidth - this.width / 2) {
                        this.x = this.canvasWidth - this.width / 2;
                    }

                    if (isColliding(this)) {
                        this.x -= this.speed;
                    }

                } else if (KEY_STATUS.up) {
                    this.y -= this.speed;
                    this.angle = 360;
                    if (this.y <= this.height / 2) {
                        this.y = this.height / 2;
                    }

                    if (isColliding(this)) {
                        this.y += this.speed;
                    }

                } else if (KEY_STATUS.down) {
                    this.y += this.speed;
                    this.angle = 180;
                    if (this.y >= this.canvasHeight - this.width / 2) {
                        this.y = this.canvasHeight - this.width / 2;
                    }

                    if (isColliding(this)) {
                        this.y -= this.speed;
                    }
                }

                if (areTouching(game.monster, this)) {
                    game.tank.gameOver = true;
                    game.monster.gameOver = true;
                    setTimeout(function () {
                        game.gameOver.draw();
                    }, 500)
                }

                this.draw();
            }

            if (KEY_STATUS.space && counter >= fireRate) {
                this.fire();
                counter = 0;
            }
        }
    };

    return Tank;
}(window));