//微信验证成功后的回调
if (typeof(wx) != 'undefined') {
    wx.ready(wechatConfigSuccess);

    wx.error(function (res) {         
        console.debug("WeChat Error：" + res.errMsg);       
    });
}

function initWeChat(config) {
    if (config != null) { WxConfigInfo = config;}
    wx.config({
        debug: false,
        appId: WxConfigInfo.appId,
        timestamp: WxConfigInfo.timestamp,
        nonceStr: WxConfigInfo.nonceStr,
        signature: WxConfigInfo.signature,
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage',
                    'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems',
                    'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
                    'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd',
                    'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice',
                    'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage',
                    'downloadImage', 'getNetworkType', 'openLocation',
                    'getLocation', 'hideOptionMenu', 'showOptionMenu',
                    'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
                    'addCard', 'chooseCard', 'openCard']
    });
}

function preShare() {
    var obj = {
        title: '你的朋友向你推荐了万品微店',
        desp: '你的朋友向你推荐了万品微店',
        link: BASE_URL+ "app/index.aspx?sopid=" + __SOPID,
        logo: BASE_URL+ "app/images/sharelog.jpg",
        success: function () { },
        cancel: function () { }
    };
    initWeChatShare(obj);
}  

function wechatConfigSuccess() {
    if (PageName == "pay")
    {
        setTimeout(PayPage.preDopay, 50);
    }
    else if (PageName == "detail") {
        setTimeout(DetailPage.preShare, 2000);
    }else if (PageName == "list") {
        setTimeout(ListPage.preShare, 2000);
    }else if (PageName == "shareproduct") {
        setTimeout(ShareProdcut.wxConfig_cb,1000);
    }else if (PageName == "cash") {
        setTimeout(hideMask, 500);
    }else {
        setTimeout(preShare, 2000);
    }
}

function initWeChatShare(obj) {
    wx.onMenuShareTimeline({
        title:obj.title,
        link: obj.link,
        imgUrl: obj.logo,
        success: obj.success,
        cancel: obj.cancel
    });

    wx.onMenuShareAppMessage({
        title: obj.title,
        desc: obj.desp,
        link: obj.link,
        imgUrl: obj.logo,
        type: '',
        dataUrl: '',
        success: obj.success,
        cancel: obj.cancel
    });
}

function imgBrower(currImg, imgs)
{    
    wx.previewImage({
        current: currImg, //当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
    });
}

function WxDoPay(sucCallBack, failCallBack) {
    wx.chooseWXPay({
        timestamp: WxPayConfigInfo.timestamp,
        nonceStr: WxPayConfigInfo.nonce,
        package: WxPayConfigInfo.package,
        signType: 'MD5',
        paySign: WxPayConfigInfo.signature,
        appid: WxPayConfigInfo.appid,
        success: function (res) {
            if (res.errMsg == "chooseWXPay:ok") {                
                sucCallBack();
            }
            else {
                failCallBack();
            }
        },
        cancel: function (res) {
            if (res.errMsg == "chooseWXPay:cancel") {
                failCallBack();
            }
        }
    });   
}

var serverIds = [];
var picLength = 0;
var $Imgs = [];
var upoverCallBack = null;
function uploadImage(callback) {
    upoverCallBack = callback;
    picLength = $(".img-col img").length;
    if (picLength == 0) {
        upoverCallBack();
    }
    else {
        var imgs = $(".img-col img");
        $(imgs).each(function (i,_o) {
            $Imgs.push($(_o).attr("src"));
        });
        updateImageToWeChat();
    }
}

function updateImageToWeChat() {
    var localId = $Imgs.pop();
    wx.uploadImage({
        localId: localId,
        isShowProgressTips: 1,
        success: function (res) {
            var serverId = res.serverId;
            serverIds.push(serverId);            
            if ($Imgs.length == 0) {
                var seridstr = serverIds.join("|");
                upoverCallBack(seridstr);
            }
            else {
                updateImageToWeChat();
            }
        }
    });
}