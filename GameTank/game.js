var game = new Game();

function startGame() {
    if (game.init()) {
        game.start()
    }
}

var tankObstacles = [
    {
        'x': 335,
        'y': 450,
        'width': 50,
        'height': 50
    },
    {
        'x': 300,
        'y': 150,
        'width': 50,
        'height': 50
    },
    {
        'x': 850,
        'y': 200,
        'width': 50,
        'height': 50
    },
    {
        'x': 170,
        'y': 200,
        'width': 50,
        'height': 50
    },
    {
        'x': 550,
        'y': 350,
        'width': 50,
        'height': 50
    },
    {
        'x': 650,
        'y': 150,
        'width': 50,
        'height': 50
    },
    {
        'x': 950,
        'y': 500,
        'width': 50,
        'height': 50
    }
];

var imageRepository = new function () {
    this.background = new Image();
    this.tank = new Image();
    this.bullet = new Image();
    this.monster = new Image();
    this.monsterSecond = new Image();
    this.obstacle = new Image();

    var numImages = 5;
    var numLoaded = 0;

    function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
            window.startGame();
        }
    }

    this.background.onload = function () {
        imageLoaded();
    };
    this.tank.onload = function () {
        imageLoaded();
    };
    this.bullet.onload = function () {
        imageLoaded();
    };
    this.monster.onload = function () {
        imageLoaded();
    };
    this.monsterSecond.onload = function () {
        imageLoaded();
    };
    this.obstacle.onload = function () {
        imageLoaded();
    };

    this.background.src = "images/background.png";
    this.tank.src = "images/tank.png";
    this.bullet.src = "images/bullet.png";
    this.monsterSecond.src = "images/monsterSecond.png";
    this.monster.src = "images/monster.png";
    this.obstacle.src = "images/obstacle.png";
}();

var Drawable = (function () {
    function Drawable(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    Drawable.prototype.draw = function () {
    };

    Drawable.prototype.move = function () {
    };

    return Drawable;
}());

var Background = (function () {
    function Background(x, y) {
        Drawable.call(this, x, y);
    }

    Background.prototype = new Drawable();

    Background.prototype.draw = function () {
        this.context.drawImage(imageRepository.background, this.x, this.y);
    };

    return Background;
}());

var Obstacles = (function () {
    function Obstacles(x, y) {
        Drawable.call(this, x, y);
    }

    Obstacles.prototype = new Drawable();

    Obstacles.prototype.draw = function () {
        var i,
            len;

        for (i = 0, len = tankObstacles.length; i < len; i += 1) {
            this.context.drawImage(imageRepository.obstacle, tankObstacles[i].x, tankObstacles[i].y, tankObstacles[i].width, tankObstacles[i].height);
        }
    };

    return Obstacles;
}());

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
}());

var Pool = (function () {
    var pool = [];

    function Pool(size) {
        this.size = size || 0;
        for (var i = 0; i < this.size; i++) {
            var bullet = new Bullet(0, 0, imageRepository.bullet.width, imageRepository.bullet.height);
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
}());

var Monster = (function () {
    var changeMonster = 1;

    function Monster(x, y, width, height, speed) {
        Drawable.call(this, x, y, width, height);
        this.speed = speed + 0.1;
        this.alive = true;
        this.angle = 0;
        this.isKilled = false;
        this.rightPoint = randomIntFromInterval(410, 1080);
        this.leftPoint = randomIntFromInterval(0, 400);
        this.bottomPoint = randomIntFromInterval(this.y, 580);
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    Monster.prototype.draw = function () {
        var startPositionMonster = randomIntFromInterval(0, 500);
        this.context.save();
        if (this.angle === 90 || this.angle === 0) {
            this.context.clearRect(this.x - 5, this.y, 40, 40); //move right
        } else if (this.angle === 270) {
            this.context.clearRect(this.x, this.y, 40, 40); //move left
        } else if (this.angle === 180) {
            this.context.clearRect(this.x, this.y - 5, 40, 40);  //move down
        }

        if (this.alive) {
            if (changeMonster % 2 === 0) {
                this.context.drawImage(imageRepository.monster, this.x, this.y, 30, 30);
            } else {
                this.context.drawImage(imageRepository.monsterSecond, this.x, this.y, 30, 30);
            }
        }

        this.context.translate(this.x, this.y);
        this.context.restore();

        if (this.isKilled) {
            if (changeMonster % 2 === 0) {
                game.monster = new Monster(0, startPositionMonster, imageRepository.monster.width, imageRepository.monster.height, this.speed);
            } else {
                game.monster = new Monster(0, startPositionMonster, imageRepository.monsterSecond.width, imageRepository.monsterSecond.height, this.speed);
            }

            changeMonster += 1;
        }
    };

    Monster.prototype.move = function () {
        /*if(this.x >= game.background.canvasWidth - 50){
         this.x = game.background.canvasWidth - 50;
         this.rightPoint = game.background.canvasWidth - 50;
         }
         if(this.x <= 0){
         this.x = 0;
         this.leftPoint = 0;
         }
         if(this.y >= game.background.canvasHeight - 50){
         this.y = game.background.canvasHeight - 50;
         this.bottomPoint = game.background.canvasHeight - 50;
         }*/

        if (this.angle === 0 && this.x < this.rightPoint) {
            this.angle = 0;
            this.x += this.speed;
        } else if (this.x >= this.rightPoint || this.x > this.leftPoint) {
            this.angle = 270;
            this.x -= this.speed;
        } else if (this.x <= this.leftPoint && this.y < this.bottomPoint) {
            this.angle = 180;
            this.y += this.speed;
        } else if (this.y >= this.bottomPoint) {
            this.angle = 0;
            this.x += this.speed;
        }
        this.draw();
    };

    Monster.prototype.clear = function () {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
    };

    return Monster;
}());

var Tank = (function () {
    function Tank(x, y, width, height) {
        Drawable.call(this, x, y, width, height);
        this.speed = 3;
        this.angle = 0;
        this.bulletPool = new Pool(5);
    }

    Tank.prototype = new Drawable();

    var fireRate = 20;
    var counter = 0;

    Tank.prototype.draw = function () {
        this.context.save();
        this.context.clearRect(this.x + this.width, this.y - this.width, -this.width * 2, this.height * 2);
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle * Math.PI / 180);
        this.context.drawImage(imageRepository.tank, -this.width / 2, -this.height / 2, this.width, this.height);
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

        if (KEY_STATUS.left || KEY_STATUS.right ||
            KEY_STATUS.down || KEY_STATUS.up) {
            if (KEY_STATUS.left) {
                this.x -= this.speed;
                this.angle = 270;
                if (this.x <= this.height / 2) {
                    this.x = this.height / 2;
                }

                if (isTankColliding(this)) {
                    this.x += this.speed;
                }
                else {
                    this.draw();
                }

            } else if (KEY_STATUS.right) {
                this.x += this.speed;
                this.angle = 90;
                if (this.x >= this.canvasWidth - this.width / 2) {
                    this.x = this.canvasWidth - this.width / 2;
                }

                if (isTankColliding(this)) {
                    this.x -= this.speed;
                }
                else {
                    this.draw();
                }

            } else if (KEY_STATUS.up) {
                this.y -= this.speed;
                this.angle = 360;
                if (this.y <= this.height / 2) {
                    this.y = this.height / 2;
                }

                if (isTankColliding(this)) {
                    this.y += this.speed;
                }
                else {
                    this.draw();
                }

            } else if (KEY_STATUS.down) {
                this.y += this.speed;
                this.angle = 180;
                if (this.y >= this.canvasHeight - this.width / 2) {
                    this.y = this.canvasHeight - this.width / 2;
                }

                if (isTankColliding(this)) {
                    this.y -= this.speed;
                }
                else {
                    this.draw();
                }
            }
        }

        if (KEY_STATUS.space && counter >= fireRate) {
            this.fire();
            counter = 0;
        }
    };

    return Tank;
}());

function bounds(obj) {
    var points = {
        'x1': obj.x,
        'y1': obj.y,
        'x2': obj.x + obj.width,
        'y2': obj.y + obj.height
    };

    return points;
}

function areTouching(obj1, obj2) {
    var points1 = bounds(obj1),
        points2 = bounds(obj2);

    return ((points1.x1 <= points2.x1 && points2.x1 <= points1.x2 + 25) ||
        (points1.x1 + 25 <= points2.x2 && points2.x2 <= points1.x2)) &&
        ((points1.y1 <= points2.y1 && points2.y1 <= points1.y2 + 25) ||
        (points1.y1 + 25 <= points2.y2 && points2.y2 <= points1.y2));
}

function isTankColliding(tank) {
    var i,
        len;

    for (i = 0, len = tankObstacles.length; i < len; i += 1) {
        if (areTouching(tankObstacles[i], tank)) {
            return true;
        }
    }

    return false;
}

function animate() {
    requestAnimFrame(animate);
    game.background.draw();
    game.obstacles.draw();
    game.tank.move();
    game.tank.bulletPool.animate();
    game.monster.draw();
    game.monster.move();
}

function Game() {
    this.init = function () {
        this.bgCanvas = document.getElementById('background');
        this.tankCanvas = document.getElementById('tank');
        this.mainCanvas = document.getElementById('main');

        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.tankContext = this.tankCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');

            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            Obstacles.prototype.context = this.bgContext;
            Obstacles.prototype.canvasWidth = this.bgCanvas.width;
            Obstacles.prototype.canvasHeight = this.bgCanvas.height;

            Tank.prototype.context = this.tankContext;
            Tank.prototype.canvasWidth = this.tankCanvas.width;
            Tank.prototype.canvasHeight = this.tankCanvas.height;

            Bullet.prototype.context = this.mainContext;
            Bullet.prototype.canvasWidth = this.mainCanvas.width;
            Bullet.prototype.canvasHeight = this.mainCanvas.height;

            Monster.prototype.context = this.mainContext;
            Monster.prototype.canvasWidth = this.mainCanvas.width;
            Monster.prototype.canvasHeight = this.mainCanvas.height;

            this.background = new Background(0, 0, this.bgContext, this.bgCanvas);
            this.obstacles = new Obstacles(0, 0);

            var tankStartX = this.tankCanvas.width - imageRepository.tank.width;
            var tankStartY = this.tankCanvas.height - imageRepository.tank.height;
            this.tank = new Tank(
                tankStartX,
                tankStartY,
                imageRepository.tank.width,
                imageRepository.tank.height,
                this.tankContext,
                this.tankCanvas);

            this.speedMonster += 0.1;
            this.monster = new Monster(0, 10, imageRepository.monster.width, imageRepository.monster.height, this.speedMonster);

            return true;
        } else {
            return false
        }
    };

    this.start = function () {
        this.tank.draw();
        animate();
    };
}

KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

KEY_STATUS = {};

for (code in KEY_CODES) {
    KEY_STATUS[KEY_CODES[code]] = false;
}

document.onkeydown = function (e) {
    // Firefox and opera use charCode instead of keyCode to
    // return which key was pressed.
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
};

document.onkeyup = function (e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
};

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 180);
        };
})();