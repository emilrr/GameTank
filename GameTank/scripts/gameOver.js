var GameOver = (function () {
    function GameOver(x, y) {
        Drawable.call(this, x, y);
        this.isExplosion = true;
    }

    GameOver.prototype = new Drawable();

    GameOver.prototype.draw = function () {
        this.context.save();
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.translate(0, 0);
        if (this.isExplosion) {
            this.context.drawImage(imageRepository.explosion, this.x - 50, this.y - 50, 150, 150);
        } else {
            this.context.drawImage(imageRepository.gameOver, this.x, this.y);
        }
        this.context.restore();
    };

    return GameOver;
}(window));