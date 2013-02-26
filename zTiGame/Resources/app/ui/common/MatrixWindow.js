/**
* Created by zhaoqy on 2012-9-18.
**/

module.exports = function(win, prpperties) {
    var self = {};
    
    var isAndroid = (function(){
        return (Ti.Platform.osname == 'android');
    })();
    var mainWindow = win;
    if(isAndroid) {
        self.window = Titanium.UI.createWindow({
            opacity : 0,
            backgroundColor : '#000',
           	exitOnClose: fasle,
            fullscreen : false,
            navBarHidden: true,
            orientationModes: [  
                Titanium.UI.PORTRAIT
            ]   
        });
        
        self.contentView = Titanium.UI.createView({
        	 opacity : 0.1,
        });
        self.window.add(self.contentView);
        
        var lableHeight = 40;
        self.titleLabel = Titanium.UI.createLabel({
            backgroundImage : '/images/content_bg.png',
            opacity : 0.9,
            color : 'white',
            textAlign : 'center',
            top : 0,
            height : ('40dp'),
            width : '100%'
        });
        self.contentView.add(self.titleLabel);

        self.bottomLabel = Titanium.UI.createLabel({
            backgroundImage : '/images/content_bg.png',
            opacity : 0.9,
            color : 'white',
            textAlign : 'center',
            bottom : 0,
            height : ('40dp'),
            width : '100%'
        });
        self.contentView.add(self.bottomLabel);

        // create a button to close window
        var closeBtn = Titanium.UI.createButton({
        	bottom : 10,
        	width : 80,
        	text : 'Close',
            zIndex : 10
        });

        self.contentView.add(closeBtn);
        closeBtn.addEventListener('click', function() {
            self.window.close();
        });
        self.closeBtn = closeBtn;

        self.scrollView = Titanium.UI.createScrollView({
            width 	: '100%',
            top 	: '40dp',
            bottom : '40dp',
            opacity : 0.85,
            showVerticalScrollIndicator : true,
            showHorizontalScrollIndicator : false
        });
        self.contentView.add(self.scrollView);

        self.open = function() {
            self.window.open({modal:true});
        }

        self.setTitle = function(title) {
            self.titleLabel.text = title;
        }

        self.addContentView = function(contentView) {
            self.scrollView.add(contentView);
        }

        self.addBtnWithClose = function(btn) {
            self.contentView.add(btn);
            btn.addEventListener('click', function(e) {
            	self.closeBtn.fireEvent('click');
            });
        }
        
        self.window.addEventListener('android:back', function() {
            this.close();
        });
        
    } else {
        var t = Titanium.UI.create2DMatrix();
        t = t.scale(0);

        self.window = Titanium.UI.createWindow(prpperties);

        // Common properties
        if(!isAndroid) {
            self.window.transform = t;
            self.window.borderRadius = 5;

        } 

        self.window.backgroundColor = '#000000';
        self.window.borderColor = 'purple';
        self.window.borderWidth = 2;
        self.window.opacity = 0.8;

        // create first transform to go beyond normal size
        var t1 = Titanium.UI.create2DMatrix();
        t1 = t1.scale(1.1);
        self.animation = Titanium.UI.createAnimation();
        self.animation.transform = t1;
        self.animation.duration = 100;

        // when self animation completes, scale to normal size
        self.animation.addEventListener('complete', function() {
            var t2 = Titanium.UI.create2DMatrix();
            t2 = t2.scale(1.0);
            self.window.animate({
                transform : t2,
                duration : 100
            });

        });

        self.titleLabel = Titanium.UI.createLabel({
        	backgroundImage : '/images/content_bg.png',
            text : L('label_about'),
            color : 'white',
            textAlign : 'center',
            top : 0,
            left : 0,
            font : {fontSize : '28sp',fontFamily:'Arial',fontWeight:'bold'},
            height : '40dp',
            width : '100%'
        });
        self.window.add(self.titleLabel);

        self.bottomLabel = Titanium.UI.createLabel({
            backgroundImage : '/images/content_bg.png',
            color : 'white',
            textAlign : 'center',
            bottom : 0,
            height : '40dp',
            width : '100%'
        });
        self.window.add(self.bottomLabel);

        // create a button to close window
        var closeBtn = Titanium.UI.createButton({
        	bottom : 3,
        	width : 100,
        	height: 36,
        	backgroundImage : '/images/button_ok.png',
        	color : '#000',
        	font : {fontSize : '28sp',fontFamily:'Arial',fontWeight:'bold'},
            zIndex : 10
        });

        self.window.add(closeBtn);
        closeBtn.addEventListener('click', function() {
            var t3 = Titanium.UI.create2DMatrix();
            t3 = t3.scale(0);
            self.window.close({
                transform : t3,
                duration : 100
            });
            if(mainWindow){
            	mainWindow.opacity = 1;
        		mainWindow.touchEnabled = true;
            }
        });
        self.closeBtn = closeBtn;

        self.scrollView = Titanium.UI.createScrollView({
            width 	: '100%',
            top 	: '40dp',
            bottom  : '40dp',
            showVerticalScrollIndicator : true,
            showHorizontalScrollIndicator : false
        });
        self.window.add(self.scrollView);

        self.open = function() {
       		if(mainWindow){
            	mainWindow.opacity = 0.5;
        		mainWindow.touchEnabled = false;
            }
            self.window.open(self.animation);
        }

        self.setTitle = function(title) {
            self.titleLabel.text = title;
        }

        self.addContentView = function(contentView) {
            self.scrollView.add(contentView);
        }

        self.addBtnWithClose = function(btn) {
            self.window.add(btn);
            btn.addEventListener('click', function(e) {
            	self.closeBtn.fireEvent('click');
            });
        }
    }
    //free
	self.window.addEventListener('close',function(e){
		for(var i in self){
			self[i] = null;
		}
	});

    return self;
}

