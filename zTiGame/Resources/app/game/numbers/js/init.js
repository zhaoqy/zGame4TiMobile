function gameInit(e){
	var mainImg = _('main');
	mainImg.height = e.height;
	mainImg.width = e.width;
	//
	var panel = _('panel');
	panel.style.width = e.width + 'px';
	panel.style.height = e.height + 'px';
	
	document.body.style.width = e.width + 'px';
	document.body.style.height = e.height + 'px';
}

Titanium.App.addEventListener("Game_Numbers_Init", gameInit);
window.onunload = function(){
	Titanium.App.removeEventListener("Game_Numbers_Init", gameInit);
};

function GameStart(){
	start(2);
	Titanium.App.fireEvent("Game_Numbers_Start", {
		start : true
	});
	document.body.style.overflowY = 'scroll';
}
