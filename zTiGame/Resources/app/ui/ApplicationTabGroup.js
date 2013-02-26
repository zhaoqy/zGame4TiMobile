/**
* Created by zhaoqy on 2012-9-18.
**/

function ApplicationTabGroup(Windows) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	for(var i=0,l=Windows.length; i<l; i++){
		//create app tabs
		var win = Windows[i];
		var tab = Ti.UI.createTab({
			window: win
		});
		win.containingTab = tab;
		
		self.addTab(tab);
	}
	
	return self;
};

module.exports = ApplicationTabGroup;
