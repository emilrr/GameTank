var GameOver = (function () {
    function GameOver(x, y) {
        Drawable.call(this, x, y);
    }

    GameOver.prototype = new Drawable();

    GameOver.prototype.draw = function () {
        this.context.save();
        this.context.clearRect(0,0, this.canvasWidth, this.canvasHeight );
        this.context.translate(this.x, this.y);
        this.context.drawImage(imageRepository.gameOver, this.x, this.y);
        this.context.restore();
    };

    return GameOver;
}(window));