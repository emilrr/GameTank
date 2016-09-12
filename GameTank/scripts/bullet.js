var Bullet = (function () {
    function Bullet(x, y, width, height) {
        Drawable.call(this, x, y, width, height);
        this.alive = false;
    }

    Bullet.prototype = new Drawable();

    Bullet.prototype.spawn = function (x, y, speed, angle) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.angle = angle;
        this.alive = true;
    };

    Bullet.prototype.draw = function () {
        this.context.save();
        this.context.clearRect(this.x + this.width, this.y - this.width, -this.width * 2, this.height * 2);

        if (this.angle === 90) {
            this.x += this.speed;
        } else if (this.angle === 180) {
            this.y += this.speed;
        } else if (this.angle === 270) {
            this.x -= this.speed;
        } else if (this.angle === 360 || this.angle === 0) {
            this.y -= this.speed;
        }
        if (this.y <= game.monster.y + 32 && this.y >= game.monster.y
            && this.x < game.monster.x + 32 && this.x >= game.monster.x) {
            game.monster.alive = false;
            game.monster.isKilled = true;
        }

        if (this.y <= 0) {
            return true;
        } else if (this.x <= 0) {
            return true;
        }

        else {
            this.context.translate(this.x, this.y);
            this.context.rotate(this.angle * Math.PI / 180);
            this.context.drawImage(imageRepository.bullet, -this.width / 2, -this.height / 2, this.width, this.height);
            this.context.restore();
        }
    };

    Bullet.prototype.clear = function () {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.angle = 0;
    };

    return Bullet;
}(window));