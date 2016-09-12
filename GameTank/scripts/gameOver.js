var GameOver = (function () {
    function GameOver(x, y) {
        Drawable.call(this, x, y);
    }

    GameOver.prototype = new Drawable();

    GameOver.prototype.draw = function () {
        this.context.drawImage(imageRepository.gameOver, this.x, this.y);
    };

    return GameOver;
}(window));