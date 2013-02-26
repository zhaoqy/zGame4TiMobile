function Highscore(a, b, c) {
    this.user = a;
    this.score = b;
    this.level = c
}
function VectorlightGame() {
    this.browser = "";
    this.deviceName = "Web";
    this.pageID = -1;
    this.appID = -1;
    this.gameWidth = 320;
    this.gameHeight = 480;
    this.userID = "";
    this.userIDDisplay = "";
    this.instanceID = "";
    this.useTouch = false;
    this.baseURL = "";
    this.rootID = "";
    this.tick = 0;
    this.splashTimer = 30;
    this.splashOpacity = 0;
    this.serviceURL;
    this.loadScrollY = 0;
    this.masUrl;
    this.wkTransPre = "translate3d(";
    this.wkTransPost = ",0)";
    this.useTimeout = false;
    this.interval = 0;
    this.gameInit = function (a, b, c, d, e) {
        this.gameInit2(a, b, c, d, e, false)
    };
    this.gameInit2 = function (a, b, c, d, e, f) {
        this.useTimeout = f;
        this.interval = e;
        if (e < 20) {
            this.splashTimer = 2 * 60
        } else {
            this.splashTimer = 2 * 30
        }
        if (navigator.userAgent.match(/FireFox/i) != null) {
            this.browser = "FF"
        } else {
            switch (navigator.appName) {
                case "Microsoft Internet Explorer":
                    this.browser = "IE";
                    break;
                default:
                    this.browser = "WK";
                    break
            }
        }
        this.pageID = b;
        this.deviceName = this.getDevice();
        this.rootID = a;
        this.gameWidth = c;
        this.gameHeight = d;
        if (this.deviceName != "Web" && this.deviceName != "IEMobile") {
            this.useTouch = true
        }
        this.userID = this.dg("hidun").value;
        this.userIDDisplay = this.userID;
        if (this.userID == "") {
            this.userIDDisplay = "Guest"
        }
        this.setUrl();
        if (!this.useTimeout) {
            setInterval(this.gameTick, e)
        } else {
            setTimeout(this.gameTick, e)
        }
    };
    this.setUrl = function () {
        this.baseURL = "";
        if (window.location.hostname == "localhost") {
            this.baseURL = "http://localhost/"
        } else {
            this.baseURL = "http://localhost/"
        }
        this.serviceURL = this.baseURL + "solid.ashx";
        this.masUrl = this.baseURL + "magic.ashx"
    };
    this.gameTick = function () {
        var a = true;
        thisObj = vlx;
        if (thisObj.splashTimer > 0) {
            if (thisObj.useTouch) {
                window.scrollTo(0, thisObj.loadScrollY)
            }
            thisObj.splashTimer--;
            if (thisObj.splashTimer == 0) {
                thisObj.hd("splashContainer")
            } else {
                // thisObj.dg("loadingProgress").innerHTML = "Loading 100%";
                // thisObj.dg("splash").style.opacity = thisObj.splashOpacity;
                thisObj.splashOpacity += .05;
                if (thisObj.splashOpacity > 1) {
                    thisObj.splashOpacity = 1;
                    thisObj.sh(thisObj.rootID)
                }
                a = false
            }
        }
        if (a) {
            gameLoop()
        }
        if (thisObj.useTimeout) {
            setTimeout(thisObj.gameTick, thisObj.interval)
        }
        this.tick++
    };
    this.pad = function (a, b) {
        var c = "" + a;
        while (c.length < b) {
            c = "0" + c
        }
        return c
    };
    this.dce = function (a, b) {
        var c = document.createElement(a);
        c.className = b;
        return c
    };
    this.dg = function (a) {
        return document.getElementById(a)
    };
    this.hd = function (a) {
        this.dg(a).style.display = "none"
    };
    this.sh = function (a) {
        this.dg(a).style.display = "block"
    };
    this.aTS = function (a, b) {
        this.dg(a).addEventListener("touchstart", b, false)
    };
    this.aTE = function (a, b) {
        this.dg(a).addEventListener("touchend", b, false)
    };
    this.uIP = function (a) {
        var b = (a.x | 0) + "px," + (a.y | 0) + "px";
        a.style.webkitTransform = this.wkTransPre + b + this.wkTransPost;
        a.style.MozTransform = "translate(" + b + ")";
        a.style.msTransform = a.style.MozTransform
    };
    this.getDevice = function () {
        var a = "Web";
        if (navigator.userAgent.match(/iPad/i) != null) {
            a = "iPad"
        } else if (navigator.userAgent.match(/iPod/i) != null) {
            a = "iPod"
        } else if (navigator.userAgent.match(/iPhone/i) != null) {
            a = "iPhone"
        } else if (navigator.userAgent.match(/Android/i) != null) {
            a = "Android";
            this.wkTransPre = "translate(";
            this.wkTransPost = ")"
        } else if (navigator.userAgent.match(/IEMobile/i) != null) {
            a = "IEMobile"
        }
        return a
    };
    this.ArrayRemove = function (a, b) {
        var c = this.ArrayIndexOf(a, b);
        if (c >= 0) {
            a.splice(c, 1)
        }
    };
    this.ArrayContains = function (a, b) {
        if (this.ArrayIndexOf(a, b) >= 0) {
            return true
        } else {
            return false
        }
    };
    this.ArrayIndexOf = function (a, b) {
        var c = -1;
        var d;
        for (d = 0; d < a.length; d++) {
            if (a[d] == b) {
                c = d;
                break
            }
        }
        return c
    };
    this.recordHighscore = function (a, b) {
        try {
            if (this.userID != "" && a > 0) {
                var c = a;
                var d = Math.floor(a * this.userID.length * 5 / 8);
                var e = this.serviceURL + "?ph=1&gid=" + this.pageID + "&u=" + encodeURIComponent(this.userID) + "&s=" + a + "&k=" + d + "&l=" + b;
            }
        } catch (f) {
        }
    };
    this.recordBestTime = function (a, b) {
        try {
            if (this.userID != "" && a > 0) {
                var c = Math.floor(a * this.userID.length * 5 / 8);
                var d = this.serviceURL + "?pt=1&gid=" + this.pageID + "&u=" + encodeURIComponent(this.userID) + "&s=" + a + "&k=" + c + "&l=" + b;

            }
        } catch (e) {
        }
    };
    this.rG = function () {
        this.recordGamePlay()
    };
    this.recordGamePlay = function () {
        var b = this.getUserId();
        if (b != null) {
            var c = _aid << 3;
        }
    };
    var a = 0;
    this.readHighscores = function (a) {
        try {
            highscores = new Array;
            $(a).find("s").each(function () {
                var a = new Highscore($(this).attr("user"), $(this).attr("score"), $(this).attr("level"));
                highscores.push(a)
            });
            drawHighscores()
        } catch (b) {
        }
    };
    this.readBestLevelHighscores = function (a) {
        try {
            bestLevelScores = new Array;
            $(a).find("s").each(function () {
                var a = new Highscore($(this).attr("user"), $(this).attr("score"), $(this).attr("level"));
                bestLevelScores[a.level] = a
            })
        } catch (b) {
        }
    };
    this.readBestUserHighscores = function (a) {
        try {
            bestUserScores = new Array;
            $(a).find("s").each(function () {
                var a = new Highscore($(this).attr("user"), $(this).attr("score"), $(this).attr("level"));
                bestUserScores[a.level] = a
            })
        } catch (b) {
        }
    };
    this.sA = function (a, b) {
        this.saveAchievement(a, b)
    };
    this.saveAchievement = function (b, c) {
        var d = this.getUserId();
        var e = this.getUsername();
        if (e == null) {
            e = ""
        }
        if (d != null) {
            var f = Math.floor(c * d.length * 5 / 8);
        }
    };
    this.getUserId = function () {

    };
    this.getUsername = function () {

    };
    this.setUsername = function (a) {

    };
    this.gA = function (a, b, c) {
        this.getBestAchievement(a, b, c)
    };
    this.getBestAchievement = function (a, b, c) {

    }
}