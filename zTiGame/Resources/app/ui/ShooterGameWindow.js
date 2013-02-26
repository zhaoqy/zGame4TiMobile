/**
* Created by zhaoqy on 2012-9-18.
**/

function ShooterGameWindow(ApplicationTabGroup) {

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
	
	var gameView = Titanium.UI.createWebView({
		zIndex:1,
	    backgroundColor : '#414444',
	    opacity : 0.1,
	    disableBounce : true,
	    scrollsToTop : false,
	    enableZoomControls : true,
   		loading : false,
   		scalesPageToFit : true,
        top : 0,
        bottom : 0,
        width : '100%',
        height : '100%',
		url:'/app/game/shooter/index.html'
	});
	self.add(gameView);
	
	gameView.addEventListener('load',function(){
		this.opacity = 1;
		ActivityIndicator.hide();
		//游戏最高得分
		var highScore = Ti.App.Properties.getInt("Shooter_HighScore", 0);
		Ti.App.fireEvent('Game_Shooter_Init',{
			width : platformWidth,
			height : platformHeight,
			highScore : highScore
		});
	});
	//保存游戏最高分数
	function setHighScore (e) {
		Ti.API.info(e.highScore);
		var highScore = parseInt(e.highScore) || 0;
		var highScoreHistory = Ti.App.Properties.getInt("Shooter_HighScore", 0);
		if(highScoreHistory < highScore){
			Ti.App.Properties.setInt("Shooter_HighScore", highScore);					
		}
	}
	Titanium.App.addEventListener("Game_Shooter_HighScore", setHighScore);
	
	
	var indexView = Ti.UI.createView({
		zIndex:2,
		top : 0,
		left : 0,
		width : '100%',
		height : '100%',
		backgroundImage : 'images/scrollingbg.png'
	});
 	//logo
	var titleImg = Ti.UI.createImageView({
		left : '10%',
		right : '10%',
		top : '5%',
		width : '80%',
		image : 'images/shooterTitle.png'
	});
	//start game
	var startGameButton = Ti.UI.createImageView({
		left : '20%',
		right : '20%',
		top : '35%',
		width : '60%',
		image:'images/shooterStartGame.png'
	});
	//game info
	var aboutButton = Ti.UI.createImageView({
		left : '20%',
		right : '20%',
		top : '50%',
		width : '60%',
		image:'images/shooterAbout.png'
	});
	var isGameStart = false;
	startGameButton.addEventListener('click',function(){
		Titanium.App.fireEvent("Game_Shooter_Start", {
			start : true
		});
		isGameStart = true;
		indexView.hide();
	});
	//about us info
	var aboutContentView = Ti.UI.createView({
		left : 0,
		top:0,
		width:'100%',
		bottom:0,
	});
	var aboutLabelInfo = Ti.UI.createLabel({
		left : '1%',
		right : '1%',
		top:0,
		bottom:0,
		color : 'green',
		text : L('main_shooter') 
	});
	aboutContentView.add(aboutLabelInfo);
	
	var AboutWindow = require('app/ui/common/MatrixWindow');	
	aboutButton.addEventListener('click',function(){
		var aboutWindow  = new AboutWindow(self, {
			width:'95%',
			height : '90%',
			orientationModes: [  
	        	Titanium.UI.PORTRAIT
			]
		});
		aboutWindow.addContentView(aboutContentView);
		aboutWindow.open();
	});
	indexView.add(titleImg);
	indexView.add(startGameButton);
	indexView.add(aboutButton);

	self.add(indexView);
	
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
			indexView.show();
			isGameStart = false;
			gameView.url = '/app/game/shooter/index.html';
			
			// Titanium.App.fireEvent("Game_Shooter_Paused", {
				// paused : true
			// });
		}else{
			self.close({animated: true});
		}
	});
	return self;
};

module.exports = ShooterGameWindow;