


var update = {
    
  // Application Constructor
  initialize: function() {
    this.bindEvents();
     
  },

  // Bind any events that are required.
  // Usually you should subscribe on 'deviceready' event to know, when you can start calling cordova modules
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('chcp_updateIsReadyToInstall', this.updateIsReadyToInstall, false);
    document.addEventListener('chcp_beforeInstall', this.beforeInstall, false);
    document.addEventListener('chcp_updateInstalled', this.updateInstalled, false);
    document.addEventListener('chcp_updateInstallFailed', this.updateInstallFailed, false);
    document.addEventListener('chcp_updateLoadFailed', this.onUpdateLoadError, false);
  },

  onDeviceReady: function() {
      //var options = {
      //    'config-file': 'https://m.ci.sanduspace.com/hotupdate/android/chcp.json'
      //};
      //console.log('hotupdate');
      //chcp.fetchUpdate(update.fetchUpdateCallback,options);
	  chcp.fetchUpdate(update.fetchUpdateCallback);
  },
    
    onUpdateLoadError:function(eventData) {
        var error = eventData.detail.error;
        if (error && error.code == chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
            console.log('Native side update required');
            var dialogMessage = '有新版本在AppStore可用更新。请前往AppStor更新系统，谢谢。';
            chcp.requestApplicationUpdate(dialogMessage, this.userWentToStoreCallback, this.userDeclinedRedirectCallback);
        }
    },
updateIsReadyToInstall:function() {
//    alert('updateIsReadyToInstall');
//     chcp.installUpdate(this.installationCallback);
   
},
beforeInstall:function() {
    $.LoadingOverlay("show");
    //In order to this dialog is closed when the system have the unknown issue.
    setTimeout(function(){
               $.LoadingOverlay("hide");
               }, 5000);
},
updateInstalled:function() {
    // $.LoadingOverlay("hide");
    // window.alert('安装成功，请重新登录，谢谢！');
},
updateInstallFailed:function() {
    $.LoadingOverlay("hide");
    window.alert('更新失败，请联系客服，谢谢！');
},

fetchUpdateCallback: function(error, data) {
    if (error) {
      console.log('Failed to load the update with error code: ' + error.code);
    } else {
		 // chcp.isUpdateAvailableForInstallation(update.isUpdateAvailableForInstallationCallBack);
		$('html').css({
			'box-sizing': 'border-box'
		})
		$('body').css({
			'box-sizing': 'border-box'
		})
		window.hide = function() {
			$(".alertBox").hide();
			chcp.isUpdateAvailableForInstallation(update.isUpdateAvailableForInstallationCallBack);
		}
		var alertBox = $("<div class='alertBox' style='position: fixed;left: 0;top: 0;background: rgba(0, 0, 0, 0.3);z-index:9999;width: 100%;height: 100%;'></div>");
		var alert = $("<div style=' position: absolute;top: 50%;left: 0;margin-top: -151px;width: 100%;'></div>");
		var realBox = $("<div style='width: 260px;height: 323px;background: #fff;border-radius: 10px;margin: 0 auto;background-image: url(./bg_pop_Update.png);background-repeat: no-repeat;background-size: 100% 100%;background-position: center center;padding-top: 145px;box-sizing: border-box;'></div>");
		var title = $("<div style=' font-size: 20px;color: #333;text-align: center;margin-bottom: 23px;'>软件更新啦!</div>");
		var tit = $("<div style='font-size: 14px;color: #333;text-align: center;margin-bottom: 32px;'>发现新版本，升级后体验更顺畅！<br />不升级会影响使用哦~</div>");
		var but = $("<div style='text-align: center;'><span id='but' onclick='window.hide()' style='width: 130px;height: 40px;line-height: 40px;text-align: center;background-image: linear-gradient(-73deg, #ff6419 0%, #ffd400 100%), linear-gradient(#ff6419, #ff6419);background-blend-mode: normal, normal;border-radius: 10px;font-size: 17px;color: #fff;display: inline-block;'>立即更新<span></div>");
		realBox.append(title)
		realBox.append(tit)
		realBox.append(but);
		alert.append(realBox);
		alertBox.append(alert);
		$("body").append(alertBox)

    }
},
    
isUpdateAvailableForInstallationCallBack:function(error, data){
    // window.alert('有新功能上线，请点击确认安装更新包，谢谢!');
    chcp.installUpdate(this.installationCallback);
},
  
installationCallback: function(error) {
    if (error) {
      $.LoadingOverlay("hide");
    }
  }
  
};
update.initialize();

    
