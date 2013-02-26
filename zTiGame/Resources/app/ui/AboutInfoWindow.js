/**
* Created by zhaoqy on 2012-9-18.
**/

function AboutInfoWindow(title) {
	var self = Ti.UI.createWindow({
	    backgroundColor : '#000',
	    backgroundImage : '/images/about_info.png',
	    barColor : '#414444',
	    fullscreen   : true,
	    navBarHidden : true,
	    tabBarHidden : true,
	    exitOnClose  : false,
	    orientationModes: [  
	        Titanium.UI.PORTRAIT
	    ]
	});	
	var logoImg = Ti.UI.createImageView({
		top : '15%',
		left: '10%',
		width : 96,
		height : 96,
		backgroundImage : '/images/logo.png'
	});
	self.add(logoImg);
	
	var appName = Ti.UI.createLabel({
		top : '18%',
		left : '45%',
		height : 40,
		width : 150,
		color : '#fff',
		font : {fontSize : '16sp',fontFamily:'Arial',fontWeight:'bold'},
		text : L('app_emat_name')
	});
	self.add(appName);
	
	var versionInfo =  Ti.UI.createLabel({
		top : '27.5%',
		left : '45%',
		height : 40,
		width : 150,
		color : '#fff',
		font : {fontSize : '20sp',fontFamily:'Arial',fontWeight:'bold'}
	});
	versionInfo.text = L('version') + Ti.App.version;
	self.add(versionInfo);

	var gameInfo =  Ti.UI.createLabel({
		top : '40%',
		left : '25%',
		height : 40,
		width : 200,
		color : '#fff',
		font : {fontSize : '20sp',fontFamily:'Arial',fontWeight:'bold'},
		text : L('game_info')
	});
	self.add(gameInfo);

	var companyNameCn = Ti.UI.createLabel({
		bottom : '25%',
		left : 0,
		backgroundColor:'red',
		height :35,
		width : '100%',
		color : '#fff',
		textAlign : 'center',
		font : {fontSize : '15sp',fontFamily:'Arial',fontWeight:'bold'},
		text : L('company_name_cn')
	});
	self.add(companyNameCn);
	companyNameCn.addEventListener('click',function(){
		Ti.Platform.openURL(L('website_url'));
	});
	
	var copyrightInfo = Ti.UI.createLabel({
		bottom : '1%',
		left : 0,
		height :35,
		width : '100%',
		color : '#fff',
		textAlign : 'center',
		font : {fontSize : '12sp',fontFamily:'Arial',fontWeight:'bold'},
		text : L('copyright')
	});
	self.add(copyrightInfo);
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
		self.close({animated: true});
	});
	return self;
};

module.exports = AboutInfoWindow;