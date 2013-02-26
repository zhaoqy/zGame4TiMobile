/**
* Created by zhaoqy on 2012-9-18.
**/

module.exports = (function() {
	var isAndroid = (function(){
        return (Ti.Platform.osname == 'android');
    })();
    var activityIndicator;
    var isShowing = false;
    var myTimeout = undefined;

    if(isAndroid) {
        activityIndicator = Ti.UI.createActivityIndicator({
            color : '#fff',
            cancelable : true
        });
    } else {
        var activityIndicator = Ti.UI.createWindow({
            modal : false,
            height : '100%',
            width : '100%',
            navBarHidden : true,
            touchEnabled : true,
            opacity : 1
        });
        activityIndicator.orientationModes = [Ti.UI.PORTRAIT];
        var view = Ti.UI.createView({
        	zIndex : 10,
        	backgroundColor : '#000',    
			borderColor : '#fff',
            borderWidth : 1,
			borderRadius : 10,
            left:'20%',
            right:'20%',
            top:'30%',
            bottom : '30%',
            height : '20%',
            width : '60%',
            opacity : 0.5,
        });
        var ai = Ti.UI.createActivityIndicator({
            style : Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
            color : '#ffffff',
            font : {
				fontSize : '20sp',
				fontFamily : 'Arial'
			},
            left:'20%',
            right:'20%',
            top:'30%',
            bottom : '30%',
            height : '20%',
            width : '60%',
        });
        activityIndicator.ai = ai;
        activityIndicator.add(view);
        activityIndicator.add(ai);
    }
    activityIndicator.showModal = function(message, timeout, timeoutMessage) {
        if(isShowing) {
            return;
        }
        isShowing = true;
        if(isAndroid) {
            activityIndicator.message = message;
            activityIndicator.show();
        } else {
            activityIndicator.ai.message = message;
            activityIndicator.ai.show();
            activityIndicator.open({
                animated : false
            });
        }
        var time = timeout || 10000;
        if(time) {
            myTimeout = setTimeout(function() {
                activityIndicator.hideModal();
                if(timeoutMessage) {
                    var alertDialog = Ti.UI.createAlertDialog({
                        title : 'Loading Timeout',
                        message : timeoutMessage || '',
                        buttonNames : ['OK']
                    });
                    alertDialog.show();
                }
            }, time);
        }
    };
    
    activityIndicator.hideModal = function() {
        if(myTimeout !== undefined) {
            clearTimeout(myTimeout);
            myTimeout = undefined;
        }
        if(isShowing) {
            isShowing = false;
            if(isAndroid) {
                activityIndicator.hide();
            } else {
                activityIndicator.ai.hide();
                activityIndicator.close({
                    animated : false
                });
            }
        }
    }
    return activityIndicator;
})();
