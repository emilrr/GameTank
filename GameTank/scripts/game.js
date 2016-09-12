var game = new Game(),
    obstaclesArray,
    imageRepository;

obstaclesArray = [
    {
        'x': 300,
        'y': 150,
        'width': 50,
        'height': 50
    },
    {
        'x': 850,
        'y': 100,
        'width': 50,
        'height': 50
    },
    {
        'x': 350,
        'y': 450,
        'width': 50,
        'height': 50
    },
    {
        'x': 650,
        'y': 250,
        'width': 50,
        'height': 50
    },
    {
        'x': 850,
        'y': 500,
        'width': 50,
        'height': 50
    }
];

imageRepository = new function () {
    var numImages,
        numLoaded;

    this.gameOver = new Image();
    this.tank = new Image();
    this.bullet = new Image();
    this.greenMonster = new Image();
    this.blueMonster = new Image();
    this.obstacle = new Image();

    numImages = 6;
    numLoaded = 0;

    function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
            window.startGame();
        }
    }

    this.obstacle.onload = function () {
        imageLoaded();
    };
    this.tank.onload = function () {
        imageLoaded();
    };
    this.bullet.onload = function () {
        imageLoaded();
    };
    this.greenMonster.onload = function () {
        imageLoaded();
    };
    this.blueMonster.onload = function () {
        imageLoaded();
    };
    this.gameOver.onload = function () {
        imageLoaded();
    };

    this.gameOver.src = "images/gameOver.png";
    this.tank.src = "images/tank.png";
    this.bullet.src = "images/bullet.png";
    this.blueMonster.src = "images/blueMonster.png";
    this.greenMonster.src = "images/greenMonster.png";
    this.obstacle.src = "images/obstacle.png";
}();

function startGame() {
    if (game.init()) {
        game.start()
    }
}

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
    var width;

    if(obj2 === game.monster){
        width = -10;
    }else if (obj2 === game.tank){
        width = 25;
    }

    return ((points1.x1 <= points2.x1 && points2.x1 <= points1.x2 + width)
        || (points1.x1 + width <= points2.x2 && points2.x2 <= points1.x2))
        && ((points1.y1 <= points2.y1 && points2.y1 <= points1.y2 + width)
        || (points1.y1 + width <= points2.y2 && points2.y2 <= points1.y2));

}

function isColliding(obj) {
    var i, len;

    for (i = 0, len = obstaclesArray.length; i < len; i += 1) {
        if (areTouching(obstaclesArray[i], obj)) {
            return true;
        }
    }

    return false;
}

function animate() {
    requestAnimFrame(animate);
    game.obstacles.draw();
    game.tank.move();
    game.tank.bulletPool.animate();
    game.monster.draw();
    game.monster.move();
}

function Game() {
    this.init = function () {
        this.obstCanvas = document.getElementById('obstacles');
        this.mainCanvas = document.getElementById('main');
        this.tankCanvas = document.getElementById('tank');

        if (this.obstCanvas.getContext) {
            this.obstContext = this.obstCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');
            this.tankContext = this.tankCanvas.getContext('2d');

            Obstacles.prototype.context = this.obstContext;
            Obstacles.prototype.canvasWidth = this.obstCanvas.width;
            Obstacles.prototype.canvasHeight = this.obstCanvas.height;

            Tank.prototype.context = this.tankContext;
            Tank.prototype.canvasWidth = this.tankCanvas.width;
            Tank.prototype.canvasHeight = this.tankCanvas.height;

            Bullet.prototype.context = this.mainContext;
            Bullet.prototype.canvasWidth = this.mainCanvas.width;
            Bullet.prototype.canvasHeight = this.mainCanvas.height;

            GameOver.prototype.context = this.tankContext;
            GameOver.prototype.canvasWidth = this.tankCanvas.width;
            GameOver.prototype.canvasHeight = this.tankCanvas.height;

            Monster.prototype.context = this.mainContext;
            Monster.prototype.canvasWidth = this.mainCanvas.width;
            Monster.prototype.canvasHeight = this.mainCanvas.height;

            this.obstacles = new Obstacles(0, 0);
            this.gameOver = new GameOver(0, 0, this.tankContext, this.tankCanvas);

            var tankStartX = this.tankCanvas.width - imageRepository.tank.width;
            var tankStartY = this.tankCanvas.height - imageRepository.tank.height;
            this.tank = new Tank(tankStartX, tankStartY, imageRepository.tank.width, imageRepository.tank.height, this.tankContext, this.tankCanvas);

            this.speedMonster = 3;
            this.monster = new Monster(0, 10, imageRepository.greenMonster.width, imageRepository.greenMonster.height, this.speedMonster);

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
            window.setTimeout(callback, 5000 / 180);
        };
})();