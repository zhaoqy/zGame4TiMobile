/**
* Created by zhaoqy on 2012-9-18.
**/

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//bootstrap and check dependencies
if (Ti.version < 2.0 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 2.0 or later');
}

// This is a single context application with windows in a stack
(function() {
	var ApplicationTabGroup = require('app/ui/ApplicationTabGroup');
	var AppWindow = new (require('app/ui/ApplicationWindow'))();
	new ApplicationTabGroup([AppWindow]).open({animated: true});
})();