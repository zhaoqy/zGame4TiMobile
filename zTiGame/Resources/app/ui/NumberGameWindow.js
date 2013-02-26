/**
* Created by zhaoqy on 2012-9-18.
**/

function NumberGameWindow(title) {
	var self = Ti.UI.createWindow({
	    backgroundColor : '#000',
	    barColor : '#414444',
	    fullscreen   : true,
	    navBarHidden : true,
	    tabBarHidden : true,
	    exitOnClose  : false,
	    orientationModes: [  
	        Titanium.UI.PORTRAIT
	    ]
	});
	var platformWidth = (function(){
		if(Ti.Platform.displayCaps.platformWidth <= Ti.Platform.displayCaps.platformHeight){
			return Ti.Platform.displayCaps.platformWidth;
		}else{
			return Ti.Platform.displayCaps.platformHeight;
		}
	})(); 
	/*
	 * device Height 
	 */
	var platformHeight = (function(){
		if(Ti.Platform.displayCaps.platformHeight >= Ti.Platform.displayCaps.platformWidth){
			return Ti.Platform.displayCaps.platformHeight;
		}else{
			return Ti.Platform.displayCaps.platformWidth;
		}
	})(); 
	
	var ActivityIndicator = require('app/ui/common/ActivityIndicatorWindow');
	self.addEventListener('open', function(){
		ActivityIndicator.showModal(L('msg_loading'));
	});	
	
	var isGameStart = false;
	var gameView = Titanium.UI.createWebView({
	    backgroundColor : '#414444',
	    opacity : 0.1,
	    disableBounce : true,
	    scrollsToTop : false,
	    enableZoomControls : true,
   		loading : true,
   		scalesPageToFit : true,
        top : 0,
        bottom : 0,
        width : '100%',
        height : '100%',
		url:'/app/game/numbers/index.html'
	});
	self.add(gameView);
	gameView.addEventListener('load',function(){
		this.opacity = 1;
		ActivityIndicator.hide();
		Ti.App.fireEvent('Game_Numbers_Init',{
			width : platformWidth,
			height : platformHeight
		});
	});
	
	var backButton = Ti.UI.createButton({
		zIndex : 10,
		top : 10,
		right : 5,
		width : 60,
		height : 60,
		backgroundImage:'images/back.png'
	});
	self.add(backButton);
	backButton.addEventListener('click',function(){
		if(isGameStart){
			isGameStart = false;
			gameView.url = '/app/game/numbers/index.html';
		}else{
			self.close({animated: true});
		}
	});
	
	Titanium.App.addEventListener("Game_Numbers_Start", function(e){
		isGameStart = e.start;
	});
	
	return self;
};

module.exports = NumberGameWindow;