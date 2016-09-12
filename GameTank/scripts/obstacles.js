var Obstacles = (function () {
    function Obstacles(x, y) {
        Drawable.call(this, x, y);
    }

    Obstacles.prototype = new Drawable();

    Obstacles.prototype.draw = function () {
        var i,
            len;

        for (i = 0, len = obstaclesArray.length; i < len; i += 1) {
            this.context.drawImage(imageRepository.obstacle, obstaclesArray[i].x, obstaclesArray[i].y, obstaclesArray[i].width, obstaclesArray[i].height);
        }
    };

    return Obstacles;
}(window));