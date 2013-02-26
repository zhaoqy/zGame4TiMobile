/**
* Created by zhaoqy on 2012-9-18.
**/

function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
	    backgroundColor : '#000',
	    backgroundImage : 'images/main.png',
	    barColor : '#414444',
	    fullscreen   : true,
	    navBarHidden : true,
	    tabBarHidden : true,
	    exitOnClose  : false,
	    orientationModes: [  
	        Titanium.UI.PORTRAIT
	    ]
	});
	var buttonHeight = 50;
	var buttonWidth = buttonHeight * 3.6;
	var shooterButton = Ti.UI.createButton({
		zIndex : 10,
		top : '25%',
		width : buttonWidth,
		height : buttonHeight,
		backgroundImage : 'images/shooter.png',
		backgroundSelectedImage : 'images/shooter_press.png'
	});
	self.add(shooterButton);
	var ShooterGameWindow = new (require('app/ui/ShooterGameWindow'))();	
	shooterButton.addEventListener('click',function(){
		ShooterGameWindow.open()
	});
	
	
	var numberButton = Ti.UI.createButton({
		zIndex : 10,
		top : '40%',
		width : buttonWidth,
		height : buttonHeight,
		backgroundImage : 'images/number.png',
		backgroundSelectedImage : 'images/number_press.png'
	});
	self.add(numberButton);	
	var NumberGameWindow = new (require('app/ui/NumberGameWindow'))();
	numberButton.addEventListener('click',function(){
		NumberGameWindow.open();
	});
	
	
	var snakeButton = Ti.UI.createButton({
		zIndex : 10,
		top : '55%',
		width : buttonWidth,
		height : buttonHeight,
		backgroundImage : 'images/snake.png',
		backgroundSelectedImage : 'images/snake_press.png'
	});
	self.add(snakeButton);	
	var SnakeGameWindow = new (require('app/ui/SnakeGameWindow'))();
	snakeButton.addEventListener('click',function(){
		SnakeGameWindow.open();
	});
	
	var aboutButton = Ti.UI.createButton({
		zIndex : 10,
		right : '15%',
		bottom : '20%',
		width : '81',
		height : '27',
		backgroundImage : 'images/about.png',
		backgroundSelectedImage : 'images/about_press.png'
	});
	self.add(aboutButton);	
	var AboutInfoWindow = new (require('app/ui/AboutInfoWindow'))();
	aboutButton.addEventListener('click',function(){
		// alert(L('main_about'));
		AboutInfoWindow.open();
	});
	return self;
};

module.exports = ApplicationWindow;
