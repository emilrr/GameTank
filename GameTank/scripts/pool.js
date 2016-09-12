var Pool = (function () {
    var pool = [];

    function Pool(size) {
        var bullet;
        this.size = size || 0;
        for (var i = 0; i < this.size; i++) {
            bullet = new Bullet(0, 0, imageRepository.bullet.width, imageRepository.bullet.height);
            pool[i] = bullet;
        }
    }

    Pool.prototype.get = function (x, y, speed, angle) {
        if (!pool[this.size - 1].alive) {
            pool[this.size - 1].spawn(x, y, speed, angle);
            pool.unshift(pool.pop());
        }
    };

    Pool.prototype.animate = function () {
        for (var i = 0; i < this.size; i++) {
            if (pool[i].alive) {
                if (pool[i].draw()) {
                    pool[i].clear();
                    pool.push((pool.splice(i, 1))[0]);
                }
            }
            else {
                break;
            }
        }
    };

    return Pool;
}(window));