var vlx = null;
var gameSurface = null;
var mode = "front";
var level = 0;
var currentDialogContent = null;
var objects = null;
var gamegrid = null;
var gameoverTimer = 0;
var gameover = false;
var isComplete = false;
var step = 3;
var BoardSize = new Size(320, 480);
var head = null;
var burgers = null;
var score = 0;

function startGame() {
    vlx = new VectorlightGame();

    vlx.gameInit("stage", 1607, 320, 480, 33);
    gamegrid = vlx.dg("gamegrid");
    gamegrid.x = 0;
    gamegrid.y = 0;
    vlx.uIP(gamegrid);

    if (vlx.useTouch) {
        vlx.aTS("l", moveLeft);
        vlx.aTS("r", moveRight);
        vlx.aTS("u", moveUp);
        vlx.aTS("d", moveDown);
        document.body.addEventListener('touchstart', touchProcess);
    }
    else {
    }

    document.body.tabIndex = 0;
    document.body.onkeydown = keyDown;

    gameSurface = vlx.dg("stage");
    fadeIn("front");
}

function touchProcess(e) {
    if (mode == "game") {
        return cD(e);
    }

    return true;
}

function showAd() {
    vlx.dg('mainAd').style.top = "0px";
}

function hideAd() {
    vlx.dg('mainAd').style.top = "-100px";
}

function cD(e) {
    if (e != null) {
        e.stopPropagation();
        e.preventDefault();
    }
    return false;
}

function quit() {
    hideDialog();
}

function fadeIn(v) {
    switch (v) {
        case "select":
            setupLevSelect();
            break;
        case "front":
            setupFront();
            break;
        case "gameover":
            setupGameOver();
            break;
        case "finish":
            setupFinish();
            break;
    }
}

function setupHighscore() {
    mode = "finish";
    showAd();

    var un = vlx.getUsername();
    if (un == null) {
        un = "";
    }

    vlx.dg("usernameInput").value = un;
    showDialog("saveHighscore");

    return false;
}

function saveHighscore() {
    hideDialog();
    vlx.setUsername(vlx.dg("usernameInput").value);
    setupFinish();

    if (vlx.useTouch) {
        window.scrollTo(0, vlx.loadScrollY);
    }
    return false;
}

function setupFinish() {
    mode = "finish";
    showAd();
    vlx.dg("gameoverTitle").innerHTML = "游戏结束";

    vlx.dg("finishLogin").innerHTML = "再来玩玩吧!";

    showDialog("gameover");

    vlx.saveAchievement(89, score);
	
    if (score > getTopScore()) {
        window.localStorage["snake_score"] = score;
    }

    vlx.sh("quit1");
    vlx.sh("retry1");
}

function getTopScore() {
    var topScore = 0;

    if (window.localStorage["snake_score"] != null) {
        topScore = window.localStorage["snake_score"];
    }

    return topScore;
}

function setupFront() {
    hideAd();
    cleanUp();

    var topScore = 0;

    if (window.localStorage["snake_score"] != null) {
        topScore = window.localStorage["snake_score"];
    }

    vlx.dg("frontTopScoreVal").innerHTML = vlx.pad(topScore, 5);

    mode = "front";
    vlx.sh("front");
    vlx.hd("gameTopScore");
    vlx.hd("l");
    vlx.hd("r");
    vlx.hd("u");
    vlx.hd("d");
    vlx.hd("dpad");
    vlx.hd("timer");
    vlx.hd("gameover");
}

function retry() {
    levSel(level);
    return false;
}

function levSel(no) {
    level = no;
    setupGame();

    return false;
}

function cleanUp() {
    if (gamegrid.hasChildNodes()) {
        while (gamegrid.childNodes.length >= 1) {
            gamegrid.removeChild(gamegrid.firstChild);
        }
    }
}

function setupGame() {
    try {
        util_createUnknownAccount();
    }
    catch (e) {
    }

	Titanium.App.fireEvent("Game_Snake_Start", {
		start : true
	});
    vlx.dg("gameTopScoreValue").innerHTML = "";
    vlx.dg("gameTopNameValue").innerHTML = "";

    vlx.getBestAchievement(89, "gameTopNameValue", "gameTopScoreValue");

    showAd();
    cleanUp();
    vlx.recordGamePlay();

    mode = "play";
    hideDialog();

    vlx.sh("gamegrid");
    vlx.sh("gameTopScore");
    vlx.sh("timer");
    vlx.hd("front");

    if (vlx.useTouch) {
        vlx.sh("l");
        vlx.sh("r");
        vlx.sh("u");
        vlx.sh("d");
        vlx.sh("dpad");
    }
    else {
        vlx.hd("l");
        vlx.hd("r");
        vlx.hd("u");
        vlx.hd("d");
        vlx.hd("dpad");
    }
    gameover = false;
    score = 0;
    updateScore();

    createSnake(3);
    createBurgers(5);

    return false;
}

function addScore(v) {
    score += v;
    updateScore();
}

function updateScore() {
    var s = vlx.pad(score, 5);

    vlx.dg("score1").className = "num" + s.charAt(0);
    vlx.dg("score2").className = "num" + s.charAt(1);
    vlx.dg("score3").className = "num" + s.charAt(2);
    vlx.dg("score4").className = "num" + s.charAt(3);
    vlx.dg("score5").className = "num" + s.charAt(4);
}

function showDialog(content) {
    vlx.sh("dialog");
    vlx.sh(content);

    currentDialogContent = content;
}

function hideDialog() {
    vlx.hd("dialog");

    if (currentDialogContent != null) {
        vlx.hd(currentDialogContent);
    }
}

function gameLoop() {
    var i;

    switch (mode) {
        case "play":
            updateInPlay();
            break;
    }
}

function updateInPlay() {
    if (!gameover && gameoverTimer == 0) {
        head.Update();
        checkSnakeCollision();

        if (head.AddTail) {
            head.AddTailSegment();
        }

        var i;

        for (i = burgers.length - 1; i >= 0; i--) {
            burgers[i].update();
        }
    }

    if (gameoverTimer > 0) {
        gameoverTimer--;
        if (gameoverTimer <= 0) {
            gameover = true;
            setupFinish();
        }
    }
}

function keyDown(e) {
    if (window.event) keypress = e.keyCode;
    else if (e.which) keypress = e.which;

    switch (keypress) {
        case 90:
        case 122:
            moveFire(null);
            break;
        case 39:
            moveRight(null);
            break;
        case 37:
            moveLeft(null);
            break;
        case 38:
            moveUp(null);
            break;
        case 40:
            moveDown(null);
            break;
    }
}

function moveLeft(ev) {
    head.Move(new Vector2(-step, 0));

    if (ev != null) {
        ev.preventDefault();
    }
}

function moveRight(ev) {
    head.Move(new Vector2(step, 0));

    if (ev != null) {
        ev.preventDefault();
    }
}

function moveUp(ev) {
    head.Move(new Vector2(0, -step));

    if (ev != null) {
        ev.preventDefault();
    }
}

function moveDown(ev) {
    head.Move(new Vector2(0, step));

    if (ev != null) {
        ev.preventDefault();
    }
}

function createSnake(segmentCount) {
    var i;
    var segment;

    head = createSnakeHead();
    head.Init(new Point(150, 150), new Vector2(-step, 0), 1);

    for (i = 0; i < segmentCount; i++) {
        segment = createSnakeSegment();
        segment.Lead = head;
        head.Segments[i] = segment;
    }

    for (i = 0; i < 60; i++) {
        head.Update();
    }
}

function createSnakeHead() {
    var visual = vlx.dce("div", "snakeHead snakeSegment");
    var part = new Head(visual);

    visual.style.zIndex = 2;

    uIP(visual);
    gamegrid.appendChild(visual);
    return part;
}

function createSnakeSegment() {
    var visual = vlx.dce("div", "snakeBody snakeSegment");
    var part = new Segment(visual);

    visual.style.zIndex = 2;

    uIP(visual);
    gamegrid.appendChild(visual);
    return part;
}

function createBurgers(num) {
    var i;

    burgers = new Array();

    for (i = 0; i < num; i++) {
        createBurger();
    }
}

function createBurger() {
    var b;
    var p;
    var type = "orange";
    var v = 50;

    switch ((Math.random() * 6) >> 0) {
        case 1:
            type = "banana";
            v = 100;
            break;
        case 2:
        case 3:
            type = "straw";
            v = 50;
            break;
        default:
            type = "orange";
            v = 20;
            break;
    }

    var visual = vlx.dce("div", "food " + type);
    b = new Item(visual, new Size(20, 20));

    p = getPositionToPlaceItem(b.Size);
    b.a = 0;
    b.type = type;
    b.v = v;
    b.Visual.x = p.x;
    b.Visual.y = p.y;
    b.Visual.style.zIndex = 1;
    b.Visual.style.opacity = 0;

    uIP(b.Visual);

    burgers.push(b);
    gamegrid.appendChild(visual);
}

function getPositionToPlaceItem(size) {
    var p = new Point();
    var hit = true;

    while (hit) {
        p.x = Math.random() * (BoardSize.Width - 20);
        p.y = Math.random() * (BoardSize.Height - 20);

        hit = tryPlaceItem(p);
    }

    return p;
}

function tryPlaceItem(pos) {
    var hit = false;
    var i;

    for (i = 0; i < burgers.length; i++) {
        if (burgers[i] != null) {
            hit = burgers[i].HitTest(pos.x, pos.y);
            if (hit) {
                return true;
            }
        }
    }

    for (i = 0; i < head.Segments.length; i++) {
        hit = head.Segments[i].HitTest(pos.x, pos.y);
        if (hit) {
            return true;
        }
    }

    return false;
}

function checkSnakeCollision() {
    var hit = false;
    var b;
    var i;

    for (i = 1; i < head.Segments.length; i++) {
        hit = head.Segments[i].HitTest(head.Visual.x + 15, head.Visual.y + 15);
        if (hit) {
            gameoverTimer = 50;
            return;
        }
    }

    for (i = burgers.length - 1; i >= 0; i--) {
        b = burgers[i];

        hit = b.HitTest(head.Visual.x + 15, head.Visual.y + 15);
        if (hit) {
            burgers.splice(i, 1);
            gamegrid.removeChild(b.Visual);
            burgerEaten(b);
        }
    }
}

function burgerEaten(b) {
    head.Segments[0].Eat();
    addScore(b.v);

    createBurger();
}

function uIP(obj) {
    var xy = (obj.x | 0) + "px," + (obj.y | 0) + "px";

    obj.style.webkitTransform = vlx.wkTransPre + xy + vlx.wkTransPost + " rotate(" + obj.r + "deg) scale(" + obj.s + ")";
    //obj.style.webkitTransform = "translate3d(" + xy + ",0) rotate(" + obj.r + "deg) scale(" + obj.s + ")";
    obj.style.MozTransform = "translate(" + xy + ") rotate(" + obj.r + "deg) scale(" + obj.s + ")";
    obj.style.msTransform = obj.style.MozTransform;
}

function Point(xValue, yValue) {
    this.x = xValue;
    this.y = yValue;
}

function Vector2(xValue, yValue) {
    this.x = xValue;
    this.y = yValue;
}

function Size(w, h) {
    this.Width = w;
    this.Height = h;
}

function Segment(visual) {
    this.Visual = visual;
    this.Lead = null;
    this.Size = new Size(20, 20);
    this.Rotation = 0;
    this.Scale = 1;
    this.ScaleStep = 0;
    this.ScaleCount = 0;

    this._eatCounter = 0;
    this._eatenCounter = 0;

    this.HitTest = function (px, py) {
        var result = false;

        if (px >= this.Visual.x && px < this.Visual.x + this.Size.Width && py >= this.Visual.y && py < this.Visual.y + this.Size.Height) {
            result = true;
        }

        return result;
    }

    this.Eat = function () {
        this._eatCounter = 6;
        this.ScaleStep = 0.1;
        this.ScaleCount = 3;
    }

    this.Eaten = function () {
        this._eatenCounter = 6;
        this.ScaleStep = -0.1;
        this.ScaleCount = 3;
    }

    this.Update = function () {
        var i;

        if (this._eatCounter > 0) {
            this._eatCounter--;
            if (this._eatCounter == 0) {
                this.Eaten();
            }
        }

        if (this._eatenCounter > 0) {
            this._eatenCounter--;
            if (this._eatenCounter == 0) {
                this.SetScale(1);
                i = this.Lead.Segments.indexOf(this);
                if (i + 1 < this.Lead.Segments.length) {
                    this.Lead.Segments[i + 1].Eat();
                }
                else {
                    this.Lead.AddTail = true;
                }
            }
        }

        if (this.ScaleCount > 0) {
            this.Scale += this.ScaleStep;
        }

        this.ScaleCount--;
    }

    this.SetRotation = function (r) {
        this.Rotation = r;
    }

    this.SetScale = function (s) {
        this.Scale = s;
    }
}

function Head(visual) {
    this.inheritFrom = Segment;
    this.inheritFrom(visual);

    this.Direction = new Vector2();
    this.Speed = 0;
    this.Segments = new Array();
    this.History = new Array();
    this.HistoryRotations = new Array();
    this.Rotation = -90;
    this.RotateFor = 0;
    this.RotationStep = 0;
    this.AddTail = false;

    this.SetScale(1);

    this.Init = function (pos, dir, speed) {
        this.Visual.x = pos.x;
        this.Visual.y = pos.y;
        this.Direction = dir;
        this.ModifySpeed(speed);
    }

    this.baseUpdate = this.Update;
    this.Update = function () {
        var i;

        this.baseUpdate();

        for (i = 0; i < this.Segments.length; i++) {
            this.Segments[i].Update();
            this.Segments[i].Visual.r = this.Segments[i].Rotation;
            this.Segments[i].Visual.s = this.Segments[i].Scale;
            uIP(this.Segments[i].Visual);
        }

        this.UpdateRotation();
        this.UpdatePosition();
        this.Visual.r = this.Rotation;
        this.Visual.s = this.Scale;
        uIP(this.Visual);
    }

    this.Move = function (dir) {
        if ((dir.x != 0 && this.Direction.x == 0) || (dir.y != 0 && this.Direction.y == 0)) {
            this.SetTargetRotation(this.Direction, dir);
            this.Direction = dir;
        }
    }

    this.AddTailSegment = function (s) {
        var visual = vlx.dce("div", "snakeBody snakeSegment");
        var s = new Segment(visual);

        var prev = this.Segments[this.Segments.length - 1];

        s.Visual.x = prev.Visual.x;
        s.Visual.y = prev.Visual.y;

        s.Scale = 0.1;
        s.ScaleCount = 9;
        s.ScaleStep = 0.1;
        s.Lead = this;

        s.Visual.s = s.Scale;
        s.Visual.r = s.Rotation;
        s.Visual.style.zIndex = 2;

        this.Segments.push(s);
        this.AddTail = false;

        uIP(visual);
        gamegrid.appendChild(visual);
    }

    this.ModifySpeed = function (offset) {
        this.Speed += offset;
    }

    this.SetTargetRotation = function (o, n) {
        var temp;

        if (n.x < 0) {
            if (o.y < 0) {
                this.SetRotation(0);
                temp = -1;
            }
            else if (o.y > 0) {
                this.SetRotation(180);
                temp = 1;
            }
        }
        else if (n.x > 0) {
            if (o.y < 0) {
                this.SetRotation(0);
                temp = 1;
            }
            else if (o.y > 0) {
                this.SetRotation(180);
                temp = -1;
            }
        }
        else if (n.y < 0) {
            if (o.x < 0) {
                this.SetRotation(-90);
                temp = 1;
            }
            else if (o.x > 0) {
                this.SetRotation(90);
                temp = -1;
            }
        }
        else if (n.y > 0) {
            if (o.x < 0) {
                this.SetRotation(270);
                temp = -1;
            }
            else if (o.x > 0) {
                this.SetRotation(90);
                temp = 1;
            }
        }

        this.RotateFor = 10;
        this.RotationStep = 9 * temp;
    }

    this.UpdateRotation = function () {
        if (this.RotateFor > 0) {
            this.Rotation += this.RotationStep;
            this.RotateFor--;
        }
    }

    this.UpdatePosition = function () {
        var i;
        var a;
        var unused;
        var frameIndex;
        var trim = true;
        var halfSize = new Size(this.Size.Width * 0.5, this.Size.Height * 0.5);

        this.History.unshift(new Point(this.Visual.x, this.Visual.y));
        this.HistoryRotations.unshift(this.Rotation);

        this.Visual.x += this.Direction.x * this.Speed;
        this.Visual.y += this.Direction.y * this.Speed;

        if (this.Visual.x < -this.Size.Width) {
            this.Visual.x = BoardSize.Width;
        }
        else if (this.Visual.x > BoardSize.Width) {
            this.Visual.x = -this.Size.Width;
        }

        if (this.Visual.y < -this.Size.Height) {
            this.Visual.y = BoardSize.Height;
        }
        else if (this.Visual.y > BoardSize.Height) {
            this.Visual.y = -this.Size.Height;
        }

        for (i = 0; i < this.Segments.length; i++) {
            frameIndex = ((i + 1) * ((this.Size.Width / 3) - 1)) >> 0;
            if (frameIndex >= this.History.length) {
                frameIndex = this.History.length - 1;
                trim = false;
            }

            this.Segments[i].Visual.x = this.History[frameIndex].x;
            this.Segments[i].Visual.y = this.History[frameIndex].y;
            this.Segments[i].SetRotation(this.HistoryRotations[frameIndex]);

            if (trim && i == this.Segments.length - 1) {
                unused = this.History.length - frameIndex;

                for (a = 0; a < unused; a++) {
                    this.History.pop();
                    this.HistoryRotations.pop();
                }
            }
        }
    }
}

function Item(visual, size) {
    visual.r = 0;
    visual.s = 1;

    this.Size = size;
    this.Visual = visual;
    this.a = 0;
    this.type = "";
    this.v = 0;

    this.HitTest = function (px, py) {
        var result = false;

        if (px >= this.Visual.x - 5 && px < this.Visual.x + this.Size.Width + 5 && py >= this.Visual.y - 5 && py < this.Visual.y + this.Size.Height + 5) {
            result = true;
        }

        return result;
    }

    this.update = function () {
        if (this.a < 1) {
            this.a += 0.1;
            if (this.a > 1) {
                this.a = 1;
            }

            this.Visual.style.opacity = this.a;
        }

        uIP(this.Visual);
    }
}