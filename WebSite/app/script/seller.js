var SSJ = {};
var ajaxServerUrl = "/service/handler.ashx";
var PageName = "";
var BASE_URL = "http://s.seascapeapp.cn/";
var debug_openId = "o9jMc1rBitv6-7Bi6cFWqO0Omq0Y";
var storage = window.localStorage;
var cookie_before = "wpshopV1_";
var __SOPID = "";

SSJ.init = function () {
    var pageUrl = window.location.href;    
    var pageItems = pageUrl.split("?")[0].split("/");
    PageName = pageItems[pageItems.length - 1].split('.')[0].toLowerCase();
    var PageExtName = pageItems[pageItems.length - 1].split('.')[1].split("?")[0].toLowerCase();
    __SOPID = request("sopid");
    if (__SOPID == null || typeof (__SOPID) == 'undefined'){ __SOPID = "_"; }
    if (PageName === "index" || PageName === "") {
        IndexPage.init();
        addTabBar();
    }
    else if (PageName == "subject") {
        SubjectPage.init();
        addTabBar();
    }
    else if (PageName == "shopcar") {
        ShopCarPage.init();
    }
    else if (PageName == "uc") {
        UcPage.init();
        addTabBar();
    }
    else if (PageName == "list") {
        ListPage.init();
    }
    else if (PageName == "detail") {
        DetailPage.init();
    }
    else if (PageName == "vipdetail") {
        VipDetailPage.init();
    }
    else if (PageName == "cash") {
        CashPage.init();
    }
    else if (PageName == "pay") {
        PayPage.init();
    }
    else if (PageName == "success") {
        SuccessPage.init();
    }
    else if (PageName == "orderlist") {
        OrderList.init();
    }
    else if (PageName == "orderdetail") {
        OrderDetail.init();
    }
    else if (PageName == "shareorder") {
        ShareOrder.init();
    }
    else if (PageName == "shareproduct") {
        ShareProdcut.init();
    }
    else if (PageName == "comment") {
        CommentPage.init();
    }
    else if (PageName == "ucedit") {
        UcEdit.init();
    }
    else if (PageName == "goldpoint") {
        GoldPoint.init();
    }
    else if (PageName == "getcash") {
        GetCashPage.init();
    }
    else if (PageName == "friend") {
        FriendPage.init();
    }
    else if (PageName == "vippicture") {
        VipPicture.init();
    }
    else if (PageName == "addetail") {
        AdDetailPage.init();
    }

    if (PageExtName == "aspx") {
        DoWeChatConfig();
    }
}

var AdDetailPage = {
    init: function () {
        AdDetailPage.load();
    },
    load: function () {
        $ajax({ fn: 123, id: request("id") }, AdDetailPage.load_cb, true);
    },
    load_cb: function (o) {
        if (o.Return == 0) {
            var html = "<h3>" + o.data.title + "</h3><p>" + unescape(o.data.contents) + "</p>";
            $(".page__bd").append(html);
        }
    }
};

var SuccessPage = {
    init: function () {
        var orderno = request("orderno");
        var t = parseInt(request("t"));
        $(".weui-footer__link").attr("href", "orderdetail.aspx?orderno=" + orderno);
        var text = "";
        if (t == 1) {           
            $(".weui-msg__title").text("订单提交成功");
            text = "请在24小时内支付，否则订单将被取消";
        }
        else {
            $(".weui-msg__title").text("订单支付成功");
        }
        text+="<br/>您还没有关注公众号，将尽快关注，否则将不能接收到订单通知。"
        $(".weui-msg__desc").html(text);
    }
};

var VipPicture = {
    init: function () {
        if ($get("HIDE_PIC_TIP") == null || $get("HIDE_PIC_TIP") == "") {
            $(".tip-page").show();
            $("#btnKnow").on("click", VipPicture.RemeberTip);
        }
        VipPicture.loadPic();
    },
    RemeberTip: function () {
        if ($("input:checked").length > 0) {
            $set("HIDE_PIC_TIP", 1);
        }
        $(".tip-page").hide();
    },
    loadPic: function () {
        $ajax({ fn: 113, uid: $get("userid") }, VipPicture.loadPic_cb, true);
    },
    loadPic_cb: function (o) {
        if (o.Return == 0) {           
            if ($(".weui-loadmore").length > 0) {
                $(".weui-loadmore").remove();
            }
            if (o.Return == 0 && o.data.length > 0) {
                $(o.data).each(function (j, _o) {
                    html = '<li data-id="'+ _o.id +'"><div style="background-image:url(' + BASE_URL+ _o.imgUrl + ');">&nbsp;</div></li>';
                    $("ul.pic-list").append(html);
                });
                var w = $("ul.pic-list li:eq(0) div").width()/750*1334;
                $("ul.pic-list li div").css({"height": w+"px"})
                $("ul.pic-list li").on("click", VipPicture.doCreate);
                $("ul.pic-list li").longPress(function () { return; });
            }
            else {
                var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >还没有海报</span></div>';
                $(".page__bd").append(html);
                $(".weui-loadmore__tips").on("click", VipPicture.loadPic);
            }
        }
        else {
            var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >还没有海报</span></div>';
            $(".page__bd").append(html);
            $(".weui-loadmore__tips").on("click", VipPicture.loadPic);
        }
    },
    doCreate: function () {
        if ($(this).attr("data-has") == "1") {
            var url = $(this).children("div").css("background-image").replace("url(\"", "").replace("\")","");
            VipPicture.hasCreate(url);
        }
        else {
            $ajax({ fn: 114, uid: $get("userid"), openid: $get("openid"), hbid: $(this).attr("data-id") }, VipPicture.doCreate_cb, true);
        }
    },
    doCreate_cb: function (o) {
        if (o.Return == 0) {
            var PicUrl = BASE_URL + o.data;           
            $("li[data-id=" + o.Ext + "] div").css({ "background-image": "url(" + PicUrl + ")" });
            $("li[data-id=" + o.Ext + "]").attr("data-has", "1");
            VipPicture.hasCreate(PicUrl);
        }
    },
    hasCreate: function (url) {
        var pics = [url];
        imgBrower(url, pics);
    }
};

var FriendPage = {
    init: function () {       
        FriendPage.loadNum();
    },
    loadList: function () {
        if ($(".weui-loadmore").length > 0) {
            $(".weui-loadmore").remove();
        }
        $ajax({ fn: 112, uid: $get("userid"), openid: $get("openid"), page: 0 }, FriendPage.loadList_cb, true);
    },
    loadList_cb: function (o) {       
        if (o.Return == 0) {            
            if ($(".weui-loadmore").length > 0) {
                $(".weui-loadmore").remove();
            }
            if (o.Return == 0 && o.data.length > 0) {               
                if ($("ul").length == 0) {
                    $(".weui-tab__panel").append("<ul class='img'></ul>");
                } 
                
                $(o.data).each(function (j, _o) {
                    html = '<li><img src="' + _o.photoUrl + '"/><h6>' + _o.nickName + '</h6></li>';
                    $("ul").append(html);
                });
            }             
        }
    },
    loadNum: function () {
        $ajax({fn:116,uid:$get("userid"),openid:$get("openid")}, FriendPage.loadNum_cb, true);
    },
    loadNum_cb: function (o) {
        if (o.Return == 0) { 
            //共有<em>10</em>位好友  
            if (o.data >= o.Ext) {
                $(".panel_f_hd").html("尊敬的VIP会员，您当前共有<em>"+ o.data +"</em>位好友");
            }
            else {
                $(".panel_f_hd").html("您当前共有<em>" + o.data + "</em>位好友<br/>再添加<em>"+ (o.Ext-o.data) +"</em>位好友即可升级为VIP会员");
            }            
            FriendPage.loadList();
        }
        else {
            var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >还没有朋友</span></div>';
            $(".weui-tab__panel").append(html);
            $(".weui-loadmore__tips").on("click", FriendPage.loadList);
        }
    }
};

var GetCashPage = {
    init: function () {
        $("input").on("focus", UcEdit.inputFocus);
        $("#btnGetCode").on("click", UcEdit.SendSmsCode);        
        $("#btnCancel").on("click", function () { history.back(); });
        $("#btnEditInfo").on("click", function () { $go("UcEdit.aspx"); });
        GetCashPage.load();
    },
    load: function () {
        $ajax({ fn: 120, uid: $get("userid"), openId: $get("openid") }, GetCashPage.load_cb, true);        
    },
    load_cb: function (o) {
        if (o.Return == 0) {
            $("#txtBankName").text(o.data.cardName);
            $("#txtName").text(o.data.userName);
            $("#txtCardNo").text(fmtBankCard(o.data.cardNo));
            $("#txtMobile").text(o.data.mobile);

            var Cash = 0;
            if (o.Ext >= 1) {
                Cash = parseInt(o.Ext);
            }

            $(".weui-cells__title:eq(1) span").text(Cash);
            $("#txtPrice").val(Cash);
            if (Cash >= 1) {
                $("#btnOk").on("click", GetCashPage.GetCash);
                $("#btnOk").removeClass("weui-btn_plain-disabled");
            }           
        }
        else {
            weui.dialog({
                title: '提示',
                content: '您还没有提现银行卡信息，请先添加银行卡信息然后再进行提现操作。',
                className: 'custom-classname',
                buttons: [{
                    label: '确定',
                    type: 'primary',
                    onClick: function () { $go("UcEdit.aspx"); }
                }]
            });
        }
    },
    GetCash: function () {
        weui.form.validate('#frmEdit', function (error) {
            if (!error) {
                var smsCode = $("#txtCode").val();
                var price = $("#txtPrice").val();
                $ajax({ fn: 118, uid: $get("userid"), mobile: $("#txtMobile").text(), openid: $get("openid"), cash: price, code: smsCode }, GetCashPage.GetCash_cb, true);
            }
        });
    },
    GetCash_cb: function (o) {
        if (o.Return == 0) {
            weui.toast('申请成功', {
                duration: 2000,
                className: 'custom-classname',
                callback: function () { history.back(); }
            });
        }
        else {
            weui.alert(o.Msg);
        }
    }
};

var GoldPoint = {
    init: function () {
        GoldPoint.loadLogs();
        GoldPoint.loadCount();
    },
    loadCount: function () {
        $ajax({ fn: 117, openid: $get("openid"), uid: $get("userid") }, GoldPoint.loadCount_cb, true);
    },
    loadCount_cb: function (o) {
        var str = fmtPrice(Math.abs(o.data - o.Ext));
        var p = str.split('.');
        var int_p = p[0];
        var float_p = ".00";
        if (p.length > 1) { float_p = "." + p[1]; }
        var html = '<span>总计</span><h2>' + int_p + '<em>' + float_p + '</em><span><a href="GetCash.aspx"><i class="iconfont icon-jifen"></i>&nbsp;申请提现</a></span></h2><ul><li>已使用<h5>' + fmtPrice(Math.abs(o.Ext)) + '</h5></li><li>可使用<h5>' + fmtPrice(o.data) + '</h5></li></ul>'
        $('.panel__hd').append(html);
    },
    loadLogs: function () {
        if ($(".weui-loadmore").length>0) {
            $(".weui-loadmore").remove();
        }
        $ajax({ fn: 111, ctype:-1, openid: $get("openid"),uid:$get("userid")}, GoldPoint.loadLogs_cb, true);
    },
    loadLogs_cb: function (o) {
        if (o.Return == 0) {
            if (o.data.length == 0) {
                var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >还没有任何明细</span></div>';
                $(".weui-tab__panel").append(moreHtml);
            }
            else {
                $(".weui-tab__panel").append('<ul class="logs"></ul>');
                $(o.data).each(function (i, _o) {                    
                    var state_word = "--";
                    if (_o.cType == 0) { state_word = "返佣"; }
                    if (_o.cType == 1) { state_word = "消费"; }
                    if (_o.cType == 2) { state_word = "奖励"; }
                    if (_o.cType == 3) {
                        state_word = "提现";
                        if (_o.state == 2) { state_word += "(冻结中)"; }
                    }                    
                    var html = '<li ' +(_o.orderno != null ? "data-no=" + _o.orderNo + '"':"")+'><div class="info-col"><div class="log-photo-col"><img src="' + _o.photoUrl + '"/></div><div class="log-info-col">' + _o.nickName + '<br/>' + new Date(_o.addOn).fmt("yyyy-MM-dd") + '</div></div><div class="price-col">' + state_word + '<br/>' + fmtPrice(_o.coin) + '</div></li>';
                    $("ul.logs").append(html);
                });
                $(".logs li[data-no]").on("click", function () { $go("OrderDetail.aspx?rno=" + $(this).attr("data-rno")); });
            }
        }
    }
};

var UcEdit = {
    init: function () {
        UcEdit.Load();
        $("#btnOk").on("click", UcEdit.Save);
        $("#btnCancel").on("click", function () { history.back(); });
        $("input").on("focus", UcEdit.inputFocus);
        $("#btnGetCode").on("click", UcEdit.SendSmsCode);
    },
    inputFocus: function () {
        $(this).parents(".weui-cell_warn").removeClass("weui-cell_warn");
    },
    Load: function () {
        $ajax({ fn: 120, openid: $get("openid"), uid: $get("userid") }, UcEdit.Load_cb, true);
    },
    Load_cb: function (o) {
        if (o.Return == 0) {
            $("#txtBankInfo").val(o.data.cardName);
            $("#txtAccount").val(o.data.userName);
            $("#txtCardNo").val(o.data.cardNo);
            $("#txtMobile").val(o.data.mobile);
        }
    },
    Save: function () {
        weui.form.validate('#frmEdit', function (error) {
            if (!error) {
                var bankinfo = $("#txtBankInfo").val();
                var account = $("#txtAccount").val();
                var cardno = $("#txtCardNo").val();
                var mobile = $("#txtMobile").val();
                var code = $("#txtCode").val();
                var openid = $get('openid');
                $ajax({ fn: 119, mobile: mobile, code: code, cardName: bankinfo, userName: account, cardno: cardno, uid: $get("userid"), openid: openid }, UcEdit.Save_cb, true);
            }
        });
    },
    Save_cb: function (o) {
        if (o.Return == 0) {
            weui.toast('修改成功', function () { $go("uc.aspx"); });
        }
        else {
            weui.dialog({ title: '提示', content: '修改个人资料失败，稍侯重试', });
        }
    },
    SendSmsCode: function () {
        var mobile = $("#txtMobile").val();
        var mobile_ = $("#txtMobile").text();
        if (mobile == "" && mobile_=="") {
            weui.topTips("请填写手机号码");
            return;
        }
        if (mobile == "") { mobile = mobile_; }
        $ajax({ fn: 121, uid: $get("userid"), openId: $get("openid"), mobile: mobile }, UcEdit.SendSmsCode_cb, true);
    },
        SendSmsCode_cb: function () {
            weui.toast("验证码已发送");
        $("#btnGetCode").off("click");
        $("#btnGetCode").css({ "color": "#ccc" });
        $("#btnGetCode").text("60s");
        UcEdit.SendTimes();
    },
    SendTimes: function () {
        var t = parseInt($("#btnGetCode").text().replace("s", ""));
        if (t > 1) {
            t--;
            $("#btnGetCode").text(t+"s");
            setTimeout(UcEdit.SendTimes, 1000);
        }
        else {
            $("#btnGetCode").text("获取验证码");
            $("#btnGetCode").on("click", UcEdit.SendSmsCode);
            $("#btnGetCode").css({ "color":"#3cc51f"});
        }
    }
};

var CommentPage = {
    PageNo: 1,
    init: function () {
        CommentPage.loadComment();
        CommentPage.loadProduct();
    },
    loadProduct: function () {
        $ajax({ fn: 106, pid: request("pid") }, CommentPage.loadProduct_cb, true);
    },
    loadProduct_cb: function (o) {
        if (o.Return == 0) {
            $(".point-col h4").text(o.data.pName);
            if (o.data.imgUrl.length > 0) {
                $("#imgPro").attr("src", BASE_URL + o.data.imgUrl[0]);
            }
        }
    },
    loadComment: function () {
        $ajax({ fn: 12, pid: request("pid"), uid: $get("userid"), openid: $get("openid"), pageno: CommentPage.PageNo }, CommentPage.loadComment_cb, true);
    },
    loadComment_cb: function (o) {
        if (o.Return == 0) {
            $("h5 em").text(o.Ext + "%");
            if ($(".weui-loadmore").length > 0) {
                $(".weui-loadmore").remove();
            }
            var isHasUl = $("ul").length > 0;
            if (o.Return == 0 && o.data.length > 0) { 
                var html = "";
                if (!isHasUl) { html += "<ul>"; }
                $(o.data).each(function (i, _o) {                   
                    html += '<li><div class="hd-col"><img src="' +  _o.photoUrl + '" /></div>';
                    html += '<div class="bd-col"><div class="hd-bar"><div class="left-col"><h6>' + _o.nickName + '</h6>';
                    for (var i = 0; i < _o.grade; i++) {
                        html += '<i class="iconfont icon-favoritesfilling"></i>'
                    }
                    for (var i = _o.grade; i < 5; i++) {
                        html += '<i class="iconfont icon-iconfontxingxing"></i>'
                    }
                    html += '</div><div class="right-col">' + new Date(_o.addOn).fmt("yyyy-MM-dd") + '</div></div>'
                    html += '<div class="bd-bar"><p>' + _o.memo + '</p>'
                    if (_o.attach.length > 0) {
                        html += '<div class="img-table">'
                        $(_o.attach).each(function (j, __o) {
                            html += '<div class="img-col"><img src="' + BASE_URL + __o.aSrc + '"/></div>';
                        });
                        html += '</div>'
                    }                    
                    //图片
                    html += '</div>'
                    html += '<div class="ft-row"></div></li>';
                    //商品规格名称及下单日期 $(".product-list ul").append(html);                   
                });
                if (!isHasUl) { html += "</ul>"; }
                $(".comment-bd").append(html);
                var _w = $(".img-col img").width();
                $(".img-col img").css({ "height": _w + "px" });
                $(".img-col img").on("click", CommentPage.priviewImg);
                if (o.data.length >= 10) {                 
                    CommentPage.PageNo++; 
                    //还有更多
                    var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >加载更多</span></div>';
                    $(".comment-bd").append(moreHtml);
                    $(".weui-loadmore__tips").on("click", CommentPage.loadComment);
                }
                else {
                    //没有更多了
                    var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >没有更多了</span></div>';
                    $(".comment-bd").append(moreHtml);
                }                
            }
            else {
                var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >还没有评论哦</span></div>';
                $(".product-list").append(html);
                $(".weui-loadmore__tips").on("click", CommentPage.loadComment);
            }
        }
    },
    priviewImg: function () {
        var currImg = $(this).attr("src");
        var imgs = [];
        $(this).parents(".img-table").find("img").each(function (i, _o) {
            imgs.push($(_o).attr("src"));
        });
        imgBrower(currImg, imgs);
    },
};

var UcPage = {
    init: function () {
        var photoUrl = $get('photourl');
        if (photoUrl != null && photoUrl != "") {
            $("img").attr("src", photoUrl);
        }
        var mobile = $get('mobile');
        if (mobile != null && mobile != "") {
            $("h5").text(mobile);
        } 
        var nickname = $get('nickname');
        if (nickname != null && nickname != "") {
            $("h4").text(nickname);
        } 
        setTimeout(function () {
            ShopCarPage.loadStorage();
            ShowFooterShopCarNum();
        }, 1000);  
    }
};

var ShareProdcut = {
    DATA: {},
    isCommened: false,    
    init: function () {
        $("#imgPro").attr("src", BASE_URL + request("imgurl"));
        ShareProdcut.loadComment();
    },
    wxConfig_cb: function () {
        $("#btnCamera").click(function () {
            wx.chooseImage({ success: ShareProdcut.chooseImage });
        });
        if (!ShareProdcut.isCommened) {
            $("#btnCamera").show();
            ShareProdcut.imgreSize();
        }
    },
    imgreSize: function () {       
        var _w = $(".img-col:first").width();
        $(".img-col").css({ "height": _w + "px" });
        $("#btnCamera i").css({ "line-height": _w + "px" });        
    },
    chooseImage: function (res) {
        var localIds = res.localIds;
         $(localIds).each(function (i, _o) {
            if (_o.length < 10) { return; }
            $("<div class='img-col'><img src='" + _o + "'/></div>").insertBefore($("#btnCamera"));
        });  
        ShareProdcut.imgreSize();
    },
    loadComment: function () {
        $ajax({ fn: 12, pid: request("pid"), uid: $get("userid"), openid: $get("openid"), unitno: request("cid"), orderno: request("orderno") }, ShareProdcut.loadComment_cb, true);
    },
    loadComment_cb: function (o) {
        if (o.Return == 0 && o.data.length > 0) { 
            ShareProdcut.isCommened = true;
            var obj = o.data[0];
            $("textarea").hide();            
            $(".content-area").append("<p>" + obj.memo+ "</p>");
            for (var i = 0; i < obj.grade; i++) {
                $(".point-items").append('<i class="iconfont icon-favoritesfilling"></i>')
            }
            for (var i = obj.grade; i < 5; i++) {
                $(".point-items").append('<i class="iconfont icon-iconfontxingxing"></i>')
            }
            $(obj.attach).each(function (i, _o) {
                if (_o.length < 10) { return; }
                $("<div class='img-col'><img src='" + BASE_URL+ _o.aSrc + "'/></div>").insertBefore($("#btnCamera"));
            });
            $(".img-col img").on("click", ShareProdcut.priviewImg);
            ShareProdcut.imgreSize();
        }
        else {    
            $("#btnOK").show();
            $("#btnOK").on("click", ShareProdcut.saveComment);
            for (var i = 0; i < 5; i++)
            {
                $(".point-items").append('<i class="iconfont icon-favoritesfilling"></i>')
            }
            $(".point-items i").on("click", ShareProdcut.changeToStar);
        }
    },
    priviewImg: function () {
        var currImg = $(this).attr("src");
        var imgs = [];
        $(".img-col img").each(function (i, _o) {
            imgs.push($(_o).attr("src"));
        });
        imgBrower(currImg, imgs);
    },
    changeToStar: function () {
        var ind = $(this).parents(".point-items").children().index($(this))+1;
        $(this).parents(".point-items").children("i").removeClass("icon-favoritesfilling").addClass("icon-iconfontxingxing");
        $(this).parents(".point-items").children(":lt(" + ind + ")").removeClass("icon-iconfontxingxing").addClass("icon-favoritesfilling");
    },
    saveComment: function () {        
        var isHasZone = false;
        var stars_n = $("i.icon-favoritesfilling").length;        
        if (stars_n==0) {
            weui.alert("请点亮星星进行评分");
            return;
        }
        var comment = $("#txtContent").val();
        if (comment == "") { comment = "好评"; }
        ShareProdcut.DATA = { fn: 11, aSrc: "", orderno: request("orderno"), unitno: request("cid"), pid: request("pid"), grade: stars_n, memo: comment, uid: $get("userid"),openid:$get("openid") };
        uploadImage(ShareProdcut.SaveEvaluate);
    },
    SaveEvaluate: function (imgSerIds) {        
        ShareProdcut.DATA.aSrc = imgSerIds;
        $ajax(ShareProdcut.DATA, ShareProdcut.SaveEvaluate_cb, true);
    },
    SaveEvaluate_cb: function (o) {
        if (o.Return == 0) {
            weui.alert("评论成功", function () {
                window.location.reload();
            });
        }
    }
};

var ShareOrder = {
    OrderNo:"",
    init: function () {
        ShareOrder.OrderNo = request("orderno");
        ShareOrder.loadProduct();
    },
    loadProduct: function () {
        $ajax({ fn: 105, orderno: ShareOrder.OrderNo, openid: $get("openid"), uid: $get("userid") }, ShareOrder.loadProduct_cb, true);
    },
    loadProduct_cb: function (o) {
        //商品信息
        var htm = "";
        $(o.data.product).each(function (i, _o) {
            htm = "<li>";
            htm += '<div class="img-col"><img src="' + BASE_URL + _o.imgUrl + '"></div>';
            htm += '<div class="info-col"><h4>' + _o.pName + "&nbsp;" + _o.unitInfo + '</h4>'
            htm += '<div class="price-row"><em></em><div class="btn-col"><a href="ShareProduct.aspx?orderno=' + ShareOrder.OrderNo + '&imgurl=' + _o.imgUrl+'&pid=' + _o.id + '&cid=' + _o.unitNo + '" class="weui-btn weui-btn_mini weui-btn_plain-primary"> <i class="iconfont icon-iconfontshumajiadian"></i> 评价晒单</a></div></div>'
            htm += "</div></li>";
            $(".product-list ul").append(htm);
        });
        $(".product-list").show();
    }
};

var OrderDetail = {
    OrderNo: "",
    DATA: {},
    init: function () {
        OrderDetail.OrderNo = request("orderno");
        OrderDetail.GetOrderDetail();
        $("#btnBuyAgain").on("click", OrderDetail.buyAgain);
        $("#btnPay").on("click", OrderDetail.payOrder);
        $("#btnCancel").on("click", OrderDetail.cancelOrder);
        $("#btnConform").on("click", OrderDetail.conformGet);
        $("#btnShare").on("click", OrderDetail.shareOrder);
    },
    GetOrderDetail: function () {
        $ajax({ fn: 105, orderno: OrderDetail.OrderNo, openid: $get("openid"), uid: $get("userid") }, OrderDetail.GetOrderDetail_cb, true);
    },
    GetOrderDetail_cb: function (o) {
        if (o.Return == 0) {
            var stateInfo = "";
            OrderDetail.DATA = o.data;
            if (o.data.state == 0) {
                $("#btnCancel").show();
                stateInfo = '<i class="iconfont icon-iconfontriyongbaihuo"></i> 请尽快付款，以免库存不足';
                if (o.data.isPay == 0) { $("#btnPay").show(); }          
            }           
            else if (o.data.state == 1) {
                stateInfo = '<i class="iconfont icon-similarproduct"></i> 商品正在出库';
                $("#btnBuyAgain").show();
            }
            else if (o.data.state == 2) {
                stateInfo = '<i class="iconfont icon-jiaoqibz"></i> 商品运输中，很快将送到你的身边';
                $("#btnConform").show();
            }
            else if (o.data.state == 8) {
                stateInfo = '<i class="iconfont icon-success1"></i> 完成，欢迎您再次光临！';
                $("#btnShare").show();
                $("#btnBuyAgain").show();
                $("btnDelete").show();
            }
            else if (o.data.state == 9) {
                stateInfo = '<i class="iconfont icon-prompt"></i> 订单已取消，欢迎您再次光临';
                $("#btnBuyAgain").show();
                $("btnDelete").show();
            } 
            else if (o.data.state == 10) {
                stateInfo = '<i class="iconfont icon-success"></i> 退货完成，欢迎您再次光临！';
                $("#btnBuyAgain").show();
                $("btnDelete").show();
            }
            $(".state-bar").html(stateInfo);
            if (o.data.state >= 8 && o.data.state <= 10) { $(".state-bar").addClass("state-bar-over"); }
            $(".address-bar .info-col h4").text(o.data.contact + "　" +maskTel(o.data.tel));
            $(".address-bar .info-col h6").text("地址：" + o.data.addr);
            $(".address-bar .icon-col").show();
            //商品信息
            var htm = "";
            $(o.data.product).each(function (i, _o) {
                htm = "<li>";
                htm += '<div class="img-col"><img src="' + BASE_URL + _o.imgUrl + '"></div>';
                htm += '<div class="info-col"><h4>'+ _o.pName +'</h4><h6>数量:'+ _o.pNum +'&nbsp;规格:'+ _o.unitInfo +'</h6>'
                htm += '<div class="price-row"><em>￥' + _o.price + '</em><div class="btn-col">'
                if (o.data.state == 8) {
                    htm += '<button type= "button" data-cid="' + _o.unitNo + '" name= "btnAfterSaleService" class="weui-btn weui-btn_mini weui-btn_plain-default" > 申请售后</button >'
                } else {
                    htm += '<button type= "button" data-cid="' + _o.unitNo + '" name= "btnAddShopCar" class="weui-btn weui-btn_mini weui-btn_plain-default" > 加购物车</button >'
                }
                htm += '</div></div > '
                htm += "</div></li>";
                $(".product-list ul").append(htm);
            });
            $(".product-list").show();
            //订单其它
            $(".order-info").append("<p>订单编号：" + o.data.orderNo + "&nbsp;<button style='display:none;' type='button' id='btnCopyOrderNo' class='weui-btn weui-btn_mini weui-btn_plain-default'>复制</button><br/>下单时间：" + new Date(o.data.addOn).fmt("yyyy-MM-dd HH:mm:ss") + "</p>")
            $(".order-info").append("<p>支付方式：微信支付</p>");
            if (o.data.state >= 2 || o.data.state <= 8) {
                $(".order-info").append("<p>配送方式：" + o.data.sendWorker + "<br/>快递单号：" + o.data.getWorker + "</p>");
            }
            else if (o.data.state == 1){
                $(".order-info").append("<p>配送方式：商品正在分拣，打包</p>");
            }           
            $(".order-info").append("<p style='display:none;'>发票类型：电子发票<br/>发票抬头：个人<br/>发票内容：明细</p>");
            //价格
            $(".price-panel").append("<ul><li><h4>商品总额</h4><h5>￥" + fmtPrice(o.data.allPrice - o.data.postFee) + "</h5></li><li><h4>+运费</h4><h5>￥" + fmtPrice(o.data.postFee) + "</h5></li><li><h4>-金币</h4><h5>￥" + fmtPrice(o.data.subPrice) + "</h5></li></ul>");
            $(".price-panel").append("<div class='total-row'>实付款：<em>￥" + fmtPrice(o.data.allPrice - o.data.subPrice) + "</em></div>");
            //日志
            var htm="<h5>订单日志</h5><ul>"
            $(o.data.log).each(function (i, _o) {
                htm += "<li><h4>" + new Date(_o.addOn).fmt("yyyy-MM-dd HH:mm:ss") + "</h4>" + _o.content + "</li>";
            });
            htm += "</ul>";
            $(".log-panel").append(htm);

            $("button[name=btnAddShopCar]").on("click", OrderDetail.addToShopCar);
            $("button[name=btnAfterSaleService]").on("click", OrderDetail.DoAfterSaleService);
            $("#btnCopyOrderNo").on("click", OrderDetail.copyOrderNo);

        }
        else {
            weui.alert("获取订单信息出错，请稍候重试");
        }
    },
    DoAfterSaleService: function () {
        $ajax({ fn: 124, orderno: OrderDetail.DATA.orderNo, unitNo: $(this).attr("data-cid"),uid: $get("userid"), openid: $get("openid") }, function (o) {
            if (o.Return == 0) {
                weui.alert("售后申请已提交。<br/>您还可以添加客服妹子来进行售后咨询", function () {
                    $go("Service.html");
                });
            } else {
                weui.topTips("服务器开了个小差,请重试");
            }
        }, true);
    },
    addToShopCar: function () {
        var cid = $(this).attr("data-cid");
        OrderDetail._buyAgain(cid, false, OrderDetail.DATA, OrderDetail.DATA.orderNo);
    },
    buyAgain: function () {
        var cid = [];
        $(OrderDetail.DATA.product).each(function (i, _o) {
            cid.push(_o.unitNo);
        });
        var order = OrderDetail.DATA;
        OrderDetail._buyAgain(cid.join(","), true, OrderDetail.DATA, OrderDetail.DATA.orderNo);
    },
    _buyAgain: function (cids, isall, orderdata, orderno) {    
        $ajax({ fn: 108, unitNo: cids }, function (o) {
            if (o.Return == 0) {
                var product = [];
                var _product = [];
                if (isall) {//再次购买                    
                    for (var i = 0; i < orderdata.product.length; i++) {
                        var unit = orderdata.product[i];
                        var obj = { Id: unit.id, Name: unit.pName, PhotoUrl: unit.imgUrl, Cid: unit.unitNo, Num: 1, DbNum: 0, Price: 0, CateName: unit.unitInfo, sopid: "", postFee: 0 };
                        var _obj = null;
                        for (var j = 0; j < o.data.length; j++) {
                            if (obj.Cid == o.data[j].unitNo) {
                                _obj = o.data[j];
                            }
                        }
                        if (_obj != null) {
                            obj.Price = _obj.price;
                            obj.DbNum = _obj.uNum;
                            product.push(obj);
                        }
                        else {
                            _product.push(obj);
                        }
                    }
                    //提示已下线产品
                    if (_product.length > 0) {
                        var htm = "";
                        $(_product).each(function (i, _o) {
                            htm += "<li>" + _o.Name + " " + _o.CateName + "</li>";
                        });
                        var dlg = weui.dialog({
                            title: '提示',
                            content: '以下产品已下线，是否先购买其它正常产品<br/><ul>' + htm + '</ul>',
                            className: 'custom-classname',
                            buttons: [{
                                label: '取消',
                                type: 'default',
                                onClick: function () { dlg.hide(); }
                            }, {
                                label: '确定',
                                type: 'primary',
                                onClick: function () { dlg.hide(); OrderDetail.DoBuyAgain(product,true); }
                            }]
                        });
                    }
                    else {
                        OrderDetail.DoBuyAgain(product,true);
                    }
                }
                else {//单品加入购买车
                    if (o.data.length == 1 && o.data[0].unitNo == cids) {
                        var unit = {};
                        var _obj = o.data[0];
                        $(orderdata.product).each(function (i, _o) {
                            if (_o.unitNo == cids) {
                                unit = _o;
                            }
                        });
                        var obj = { Id: unit.id, Name: unit.pName, PhotoUrl: unit.imgUrl, Cid: unit.unitNo, Num: 1, DbNum: _obj.uNum, Price: _obj.price, CateName: unit.unitInfo, sopid: "", postFee: 0 };
                        OrderDetail.DoBuyAgain([obj], false);
                        weui.alert(unit.pName+"已加入购买车");
                    }
                    else {
                        weui.alert("产品已下线");
                    }
                }                
            }
            else {
                weui.alert("产品已下线");
            }
        }, true);
    }, 
    DoBuyAgain: function (obj,isgo) {
        //存入购物车并转入购物车
        $(obj).each(function (i, _o) {
            ShopCarPage.addToShopCar(_o);
        });
        if (isgo) {
            $go("shopcar.aspx");
        }
    },
    copyOrderNo: function () {
        //window.clipboardData.setData("Text", OrderDetail.DATA.OrderNo);
        //weui.alert("订单号已复制");
    },
    cancelOrder: function () {
        var orderno = OrderDetail.DATA.orderNo;
        var dlg=weui.dialog({
            title: '提示',
            content: '您确认要取消订单吗？',
            className: 'custom-classname',
            buttons: [{
                label: '再想想',
                type: 'primary',
                onClick: function () { dlg.hide(); }
            }, {
                label: '我确认',
                type: 'default',
                onClick: function () {
                    dlg.hide();
                    $ajax({ fn: 107, state: 9, orderno: orderno, uid: $get("userid"), openid: $get("openid") }, function (o) {
                        if (o.Return == 0) {
                            weui.alert('订单已取消', function () {
                                window.location.reload();
                            });
                        }
                        else {
                            weui.alert("取消订单失败，稍候重试");
                        }
                    }, true);
                }
            }]
        });
    },
    shareOrder: function () {
        $go("ShareOrder.aspx?orderno=" + OrderDetail.DATA.orderNo);
    },
    payOrder: function () {
        var pname = OrderDetail.DATA.product[0].pName;
        if (OrderDetail.DATA.product.length > 1) { pname += "等"; }
        $go("Pay.aspx?pname=" + escape(pname) + "&price=" + OrderDetail.DATA.allPrice + "&orderno=" + OrderDetail.DATA.orderNo);
    },
    conformGet: function () {
        var orderno = OrderDetail.DATA.orderNo;
        $ajax({ fn: 107, state: 8, orderno: orderno, uid: $get("userid"), openid: $get("openid") }, function (o) {
            if (o.Return == 0) {
                window.location.reload();
            }
            else {
                weui.alert("服务开了个小差，再试一次");
            }
        }, true);
    }
};

var OrderList = {
    PageNo: 1,
    TabIndex: 0,
    DATA:[],
    init: function () {
        OrderList.initTab();
        OrderList.loadOrder();
    },
    initTab: function () {
        weui.tab('#hisTab', {
            defaultIndex: 0,
            onChange: function (index) {
                OrderList.DATA = [];
                OrderList.TabIndex = index;
                OrderList.PageNo = 1;
                $("ul").remove();
                OrderList.loadOrder();
            }
        });
    },
    loadOrder: function () {
        var state = 0;
        if (OrderList.TabIndex == 0) { state = -1; }
        else if (OrderList.TabIndex == 1) { state = 0; }
        else if (OrderList.TabIndex == 2) { state = 2; }
        else if (OrderList.TabIndex == 3) { state = 8; }
        else if (OrderList.TabIndex == 4) { state = 9; }
        $ajax({ fn: 104, openid: $get("openid"), uid: $get("userid"), state: state, page: OrderList.PageNo }, OrderList.loadOrder_cb, true);
    },
    loadOrder_cb: function (o) {
        $(".weui-loadmore").remove();
        if (o.Return == 0) {
            if (o.data.length > 0) {                
                if ($("ul").length == 0) {
                    $(".weui-tab__panel").append('<ul class="order"></ul>');
                }
                $(o.data).each(function (i, _o) {
                    OrderList.DATA.push(_o);
                    var htm = '<li data-ind="'+ i +'" data-no="' + _o.orderNo + '">'
                    htm += '<div class="statu-row"><h5><em>NO.</em>' + _o.orderNo + '</h5><h6><em>' + ConvertShowState(_o.state) + '</em>'
                    if (_o.state > 8) {
                        htm += '<i style="display:none;" class="iconfont icon-delete"></i>'
                    }
                    else {
                        htm += '<i style="display:none;" class="iconfont icon-delete"></i>'
                    }
                    htm += '</h6></div>'
                    htm += '<div class="main-card">'
                    var num = 0;
                    var name = "";
                    var uninNos = [];
                    if (_o.product.length > 1) {
                        $(_o.product).each(function (j, __o) {
                            if (name == "") { name = __o.pName; }
                            uninNos.push(__o.unitNo);
                            htm += '<div class="img-blank"><img src="' + BASE_URL + __o.imgUrl + '"/></div>';
                            num += __o.pNum;
                        }) 
                        htm += '</div>'
                        name += "等";
                    }
                    else {
                        htm += '<div class="img-blank"><img src="' + BASE_URL + _o.product[0].imgUrl + '"/></div>';
                        htm += '<div class="title-panel"><h4>' + _o.product[0].pName + " " + _o.product[0].unitInfo + '<h4></div>'
                        num = _o.product[0].pNum;
                        name = _o.product[0].pName;
                        uninNos.push(_o.product[0].unitNo);
                    }                    
                    htm += '</div>';
                    htm += '<div class="price-row">共'+ num +'件商品 实付款：<em>￥'+ _o.allPrice +'</em></div>'
                    htm += '<div class="order-btn-row">'
                    if (_o.state == 0) {
                        htm += '<button type= "button" name="btnCancel" class="weui-btn weui-btn_mini weui-btn_plain-default"> 取消订单</button>'
                    }
                    else {
                        htm += '<button type= "button" name="btnCancel" class="weui-btn weui-btn_mini weui-btn_plain-default" style="display:none;"> 取消订单</button>'
                    }
                    if (_o.isPay == 0 && _o.state == 0) {
                        htm += '<button type= "button" name="btnPay" data-name="' + name + '" data-price="' + _o.allPrice + '" class="weui-btn weui-btn_mini weui-btn_plain-primary"> 立即支付</button>'
                    }
                    else {
                        htm += '<button type= "button" name="btnPay" data-name="' + name + '" data-price="' + _o.allPrice + '" style="display:none;" class="weui-btn weui-btn_mini weui-btn_plain-primary"> 立即支付</button>'
                    }
                    if (_o.state == 8) {
                        htm += '<button type= "button" name="btnShare" class="weui-btn weui-btn_mini weui-btn_plain-primary"> 评价晒单</button>'
                    } else {
                        htm += '<button type= "button" name="btnShare" class="weui-btn weui-btn_mini weui-btn_plain-primary" style="display:none;" > 评价晒单</button>'
                    }
                    if (_o.state >= 1 ) {
                        htm += '<button type= "button" data-cids="' + uninNos.join(",") + '" name="btnBuyAgain" class="weui-btn weui-btn_mini weui-btn_plain-default"> 再次购买</button>'
                    } else {
                        htm += '<button type= "button" data-cids="' + uninNos.join(",") + '" name="btnBuyAgain" class="weui-btn weui-btn_mini weui-btn_plain-default" style="display:none;" > 再次购买</button>'
                    }
                    if (_o.state == 2) {
                        htm += '<button type= "button" data-cids="' + uninNos.join(",") + '" name="btnConform" class="weui-btn weui-btn_mini weui-btn_plain-primary"> 确认收货</button>'
                    } else {
                        htm += '<button type= "button" data-cids="' + uninNos.join(",") + '" name="btnConform" class="weui-btn weui-btn_mini weui-btn_plain-primary" style="display:none;" > 确认收货</button>'
                    }
                    htm +='</div > '
                    htm += '</li> '
                    $("ul").append(htm);
                });

                $("li>.statu-row,li>.main-card,li>.price-row").off("click").on("click", function () {
                    $go("OrderDetail.aspx?orderno=" + $(this).parents("li").attr("data-no"));
                });

                $("button[name=btnPay]").off("click").on("click", function () {
                    $go("Pay.aspx?pname=" + escape($(this).attr("data-name")) + "&price=" + $(this).attr("data-price") + "&orderno=" + $(this).parents("li").attr("data-no"));
                });
                $("button[name=btnCancel]").off("click").on("click", OrderList.CancelOrder);
                $("button[name=btnConform]").off("click").on("click", OrderList.ConformGet);
                $("button[name=btnShare]").off("click").on("click", function () {
                    $go("ShareOrder.aspx?orderno=" + $(this).parents("li").attr("data-no"));
                });
                $("button[name=btnBuyAgain]").off("click").on("click", OrderList.BuyAgain);

                if(o.data.length>=10) {
                    OrderList.PageNo++;
                    //还有更多
                    var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >加载更多</span></div>';
                    $(".weui-tab__panel").append(moreHtml);
                    $(".weui-loadmore__tips").on("click", OrderList.loadOrder);
                }
                else {
                    //没有更多了
                    var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >没有了</span></div>';
                    $(".weui-tab__panel").append(moreHtml);
                }

            }
            else {
                var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips">没有相应订单</span></div>';
                $(".weui-tab__panel").append(html);
                $(".weui-loadmore__tips").on("click", OrderList.loadOrder);
            }
        }
        else {
            var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips">服务器打盹了，再试一次</span></div>';
            $(".weui-tab__panel").append(html);
            $(".weui-loadmore__tips").on("click", OrderList.loadOrder);
        }
    },
    CancelOrder: function () {
        var orderno = $(this).parents("li").attr("data-no");
        var dlg = weui.dialog({
            title: '提示',
            content: '您确认要取消订单吗？',
            className: 'custom-classname',
            buttons: [{
                label: '再想想',
                type: 'primary',
                onClick: function () { dlg.hide(); }
            }, {
                label: '我确认',
                type: 'default',
                onClick: function () {
                    dlg.hide();
                    $ajax({ fn: 107, state: 9, orderno: orderno, uid: $get("userid"), openid: $get("openid") }, function (o) {
                        if (o.Return == 0) {
                            weui.alert('订单已取消', function () {
                                $("li[data-no=" + orderno + "] .statu-row h6 em").text("已取消");
                                //$("li[data-no=" + orderno + "] .statu-row h6 i").show();
                                $("li[data-no=" + orderno + "] .order-btn-row button").hide();
                                $("li[data-no=" + orderno + "] .order-btn-row button[name=btnBuyAgain]").show();
                            });
                        }
                        else {
                            weui.alert("取消订单失败，稍候重试");
                        }
                    }, true);
                }
            }]
        });
    },
    ConformGet: function () {
        var orderno = $(this).parents("li").attr("data-no");
        $ajax({ fn: 107, state: 8, orderno: orderno, uid: $get("userid"), openid: $get("openid") }, function (o) {
            if (o.Return == 0) {                
                    $("li[data-no=" + orderno + "] .statu-row h6 em").text("已收货");
                    //$("li[data-no=" + orderno + "] .statu-row h6 i").show();
                    $("li[data-no=" + orderno + "] .order-btn-row button").hide();
                    $("li[data-no=" + orderno + "] .order-btn-row button[name=btnShare]").show();
                    $("li[data-no=" + orderno + "] .order-btn-row button[name=btnBuyAgain]").show();
            }
            else {
                weui.alert("服务器开了个小差，再试一次");
            }
        }, true);
    },
    BuyAgain: function () {
        var orderno = $(this).parents("li").attr("data-no");
        var ind = $(this).parents("li").attr("data-ind");
        var cids = $(this).attr("data-cids");
        OrderDetail._buyAgain(cids, true, OrderList.DATA[ind], orderno);        
    }
};

var PayPage = {
    isSubcribe:0,
    init: function () {
        showMask();
        var price = request("price");
        var orderno = request("orderno");
        var pname = unescape(request("pname"));
        PayPage.isSubcribe = parseInt(request("subcribe"));
        $("#txtPrice").text("￥"+price);
        $("#txtProduct").text(pname);
        $("#txtOrderno").text(orderno);
        $("#txtCompany").text("上海晋淼食品有限公司");
    },
    onPayInitFail: function () {
        if (PayPage.isSubcribe == 1) {
            $go("orderlist.aspx");
        }
        else {
            $go("success.aspx?t=1&orderno=" + request("orderno"));
        }
        return;
    },
    preDopay: function () {
        hideMask();
        WxDoPay(PayPage.onPaySuccess, PayPage.onPayFail);
        //$("#btnOK").text("支付中").css({ "background-color": "rgb(69,192,24)" });
    },
    onPaySuccess: function () { 
        if (PayPage.isSubcribe == 1) {
            $go("orderdetail.aspx?orderno=" + request("orderno"));
        }
        else {
            $go("success.aspx?t=0&orderno=" + request("orderno"));
        }
    },
    onPayFail: function () {
        var dig = weui.dialog({
            title: "失败", content: "支付失败", buttons: [
                { label: "重试", type: 'primary', onClick: function () { pay.preDopay();dig.hide();  } },
                { label: "取消", type: 'default', onClick: function () { $go("orderdetail.aspx?orderno=" + request("orderno")); } }
            ]
        });
    }
};

var CashPage = {
    isTemp: false,
    CashP: [],
    Pid: [],
    PostData: null,
    citydata: [],
    AllPrice: 0,
    ProductPrice: 0,
    PostPrice: 0,
    ProvinceName: "",
    pname: "",
    GoldPoint: 0,
    init: function () {
        showMask();
        CashPage.getGoldPoint();
        $(_CITYARRAY).each(function (i, o) {
            var pname = o.name;
            if (pname == "其他" || pname == "海外") { return; }
            var cityarr = o.sub;
            var city = [];
            $(cityarr).each(function (j, _o) {
                if (_o.name == "请选择") { return; }
                city.push({ label: _o.name, value: j });
            });
            CashPage.citydata.push({ label: pname, value: i, children: city });
        });

        $("#txtCity").parents(".weui-cell").on("click", function () {
            weui.picker(CashPage.citydata, {
                className: 'custom-classname',
                defaultValue: [11, 1],
                onChange: function (result) {
                    //console.log(result)
                },
                onConfirm: function (result) {
                    var _p = result[0].label;
                    var _c = result[1].label;
                    $("#txtCity").val(_p + _c);
                    CashPage.CheckProvice(_p);
                },
                id: 'doubleLinePicker'
            });
        });
        CashPage.RenderGoods();
        $("#btnWechatAddress").on("click", CashPage.GetWeChatAddress);
        $("#chkUseGold").on("change", CashPage.CountPostFee);
    },
    getGoldPoint: function () {
        $ajax({fn:110,uid:$get("userid"),openId:$get("openid")}, CashPage.getGoldPoint_cb, false);
    },
    getGoldPoint_cb: function (o) {
        if (o.Return == 0) {
            CashPage.GoldPoint = o.data;
            $("#goldTip").text("可用" + o.data.toFixed(2) + "个金币");
            if (o.data <= 0) {
                $("#goldTitle").hide();
                $("#goldForm").hide();
            }
            else {
                $("#goldTitle").show();
                $("#goldForm").show();
            }
        }
    },
    addOrder: function () {
        //添加订单
        ShopCarPage.loadStorage();
        var pstr = [];      
        $(CashPage.CashP).each(function (i, _o) {
            var pitem = [];
            pitem.push(_o.Id);
            pitem.push(_o.Cid);
            pitem.push(_o.Num);
            pitem.push(_o.Price);
            pitem.push(_o.sopid);            
            pstr.push(pitem.join("@"));               
        });
        var isUseGold = $("#chkUseGold").is(":checked");
        var useGoldPoint = 0;
        if (isUseGold && CashPage.GoldPoint > 0) {
            if (CashPage.GoldPoint >= CashPage.ProductPrice) {
                useGoldPoint = CashPage.ProductPrice;
            }
            else {
                useGoldPoint = CashPage.GoldPoint;
            }
        }
        var detail = pstr.join(",");
        var isvip = 0;
        if (CashPage.isTemp && CashPage.CashP[0].isVip) {
            isvip = 1;
        }
        var data = { fn: 103, uid: $get("userid"), isvip: isvip, otype: $get("utype"), openid: $get("openid"), tel: $("#txtMobile").val(), contact: $("#txtName").val(), addr: $("#txtCity").val() + " " + $("#txtAddress").val(), memo: $("#txtMemo").val(), price: CashPage.ProductPrice, subPrice: useGoldPoint.toFixed(2), postFee: CashPage.PostPrice, shopping: detail };
        $ajax(data, CashPage.addOrder_cb, true);
    },
    addOrder_cb: function (o) {
        if (o.Return == 0) {
            if (CashPage.isTemp) {
                CashPage.clearTempShop();
            }
            else {
                ShopCarPage.ClearShopCar();
            }
            var orderno = o.data.OrderNo;
            var isSubcribe = parseInt(o.data.isSubcribe);
            var url = "Pay.aspx?price=" + o.data.price.toFixed(2) + "&subcribe=" + isSubcribe + "&pname=" + escape(CashPage.pname) + "&orderno=" + orderno + "&o=";
            if (parseInt(o.data.isPay) == 1) {
                url = "orderdetail.aspx?orderno=" + orderno;
                if (isSubcribe == 0) {
                    url = "success.aspx?orderno=" + orderno;
                }
            }            
            $go(url);
        }
        else {
            weui.alert(o.Msg);
        }
    },
    addTempShop: function (obj) {
        $set("SHOP_TEMP_CAR", JSON.stringify(obj));
    },
    clearTempShop: function () {
        $set("SHOP_TEMP_CAR", "");
    },
    loadTempShop: function () {
        var json = $get("SHOP_TEMP_CAR");
        var obj = null;
        if (typeof (json) != 'undefined' && json != null && json != "") {
            obj = JSON.parse(json);
        }
        return obj;
    },
    GetWeChatAddress: function () {        
        wx.openAddress({
            trigger: function (res) {
                //开始取出地址                
            },
            success: function (res) {                    
                console.debug(JSON.stringify(res));
                $("#txtMobile").val(res.telNumber);
                $("#txtName").val(res.userName);
                $("#txtCity").val(res.provinceName + res.cityName);
                $("#txtAddress").val(res.countryName + res.detailInfo);
                //是否在禁售范围内检测
                CashPage.ProvinceName = res.provinceName;
                CashPage.CountPostFee();
                CashPage.CheckProvice(res.provinceName);
            },
            cancel: function (res) {
                //用户取消取出地址
            },
            fail: function (res) {
                //取地址失败 alert(JSON.stringify(res));
            }
        });       
    },
    CheckProvice: function (prov) {
        prov = prov.replace("省", "");
        if (CashPage.PostData.Ext.provice.indexOf(prov) > -1) {
            weui.alert("抱歉，" + prov + "区域暂不发货");
            $("#txtCity").val("");
            $("#btnToCash").off("click");  
            $("#btnToCash").css({ "background-color": "#d8d8d8" });
        }
        else {
            $("#btnToCash").on("click", CashPage.addOrder);  
            $("#btnToCash").css({ "background-color": "#e64340" });
        }
    },
    GetPostFee: function () {
        $ajax({ fn: 109, pids: CashPage.Pid.join() }, CashPage.GetPostFee_cb, true);
    },
    GetPostFee_cb: function (o) {
        if (o.Return == 0) {
            CashPage.PostData = o;
            if (o.Ext.provice != "") {
                $("#addrTip").html("<i class='iconfont icon-warning'></i>&nbsp;提示:" + o.Ext.provice + "区域暂不发货。");
                $("#addrTip").show();
            }
            CashPage.CountPostFee();
        }
    },
    CountPostFee: function () {
        //系统运费方案
        var sysFeeType = CashPage.PostData.Ext.postFee;
        //sysFeeType == 0//包邮
        //sysFeeType == -1//没有邮费优惠
        //sysFeeType > 0//满减
        var allPrice = 0;        
        $(CashPage.CashP).each(function (i, _o) {
            var pid = _o.Id;
            var postFee = 0;
            var postFeeType = -1;
            $(CashPage.PostData.data).each(function (j, __o) {
                if (__o.pid == pid) {
                    //0参与，1不参与
                    postFeeType = __o.postFeeType;
                    if (postFeeType == 0 && sysFeeType==0) {
                        //参与邮费优惠，包邮
                        postFee = 0;
                    }
                    else {
                        if (postFeeType == 0 && sysFeeType > 0) {//满减情况计算总价
                            allPrice += _o.price;
                        }
                        //不参与邮费优惠，计算邮费
                        if (__o.postType == 1) {
                            postFee = __o.postFee;
                        }
                        else if (__o.postType == 2) {
                            $(_o.post).each(function (k, _p) {
                                if (postFee == 0 && _p.provice.indexOf(CashPage.ProvinceName) > -1) {
                                    postFee = _p.postFee;
                                }
                            });
                        }
                        else {
                            postFee = 0;
                        }
                    }
                }
            });
            _o.postFee = postFee;
            _o.postFeeType = postFeeType;
        });
        CashPage.AllPrice = allPrice;
        if (sysFeeType > 0 && CashPage.AllPrice > sysFeeType) {
            //满足满减的情况，改变适用满减的商品邮费
            $(CashPage.CashP).each(function (j, _o) {
                _o.postFee = 0;
            });
        }
        if (!CashPage.isTemp) {
            ShopCarPage.saveToStorage();
        }
        CashPage.RenderGoods();
    },
    RenderGoods: function () {
        CashPage.CashP = CashPage.loadTempShop();
        if (CashPage.CashP == null) {
            ShopCarPage.loadStorage();
            CashPage.CashP = ShopCarPage._PS;
            CashPage.isTemp = false;
        }
        else {
            CashPage.isTemp = true;
        }
        var FeePostLimit = 0;   
        $(".shop-list").empty();
        var html = '<ul>'
        var allPrice = 0, allNum = 0;        
        var allPostFee = 0;
        CashPage.Pid = [];
        var pname = "";
        $(CashPage.CashP).each(function (i, _o) {
            if (!_o) { return; }
            if (_o.Num == 0) { ShopCarPage.RemoveItem(_o.Cid); return; }
            var id = _o.Id;
            html += '<li data-ind="' + i + '" data-pid="'+ id +'">';
            html += '<div class="photo-col"><img src="' + BASE_URL + _o.PhotoUrl + '" /></div>';
            html += '<div class="main-col"><div class="info-row"><h3>' + _o.Name + '</h3><h4>' + _o.CateName + '</h4><h4>单价' + _o.Price.toFixed(2) + '，数量' + _o.Num + '，邮费' + _o.postFee + '</h4></div></div>'
            html += '<div class="right-col"><h3>' + (_o.Price * _o.Num).toFixed(2) + '</h3></div></li>'
            allPrice += _o.Price * _o.Num;
            allNum += _o.Num;
            if (pname == "") { pname = _o.Name; }
            if (CashPage.Pid.indexOf(id) == -1) {
                CashPage.Pid.push(id);
            }
            allPostFee += _o.postFee;
        });
        if (CashPage.CashP.length > 1) { pname += "等"; }
        html += '</ul>'       
        $(".shop-list").append(html);
        CashPage.PostPrice = allPostFee.toFixed(2);
        CashPage.ProductPrice = (allPrice + allPostFee).toFixed(2);


        var isUseGold = $("#chkUseGold").is(":checked");
        var useGoldPoint = 0;
        if (isUseGold && CashPage.GoldPoint > 0) {
            if (CashPage.GoldPoint >= CashPage.ProductPrice) {
                useGoldPoint = CashPage.ProductPrice;
            }
            else {
                useGoldPoint = CashPage.GoldPoint;
            }
        }

        if (allPostFee == 0) {
            $(".price-info-col h6").text("免邮费");            
        }
        else {
            $(".price-info-col h6").text("商品" + allPrice.toFixed(2) + "，邮费" + CashPage.PostPrice +  (useGoldPoint > 0 ? "，抵扣" + useGoldPoint.toFixed(2)  : ""));
        }


        $(".price-info-col em").text((CashPage.ProductPrice - useGoldPoint).toFixed(2));       
        if (CashPage.PostData == null) {
            CashPage.GetPostFee();
        }
        CashPage.pname = pname;
    }
};

var ShopCarPage = {
    _PS:[],
    init: function () {
        ShopCarPage.loadStorage();
        ShopCarPage.loadUnitInfo();
        $("#btnEdit").on("click", ShopCarPage.EditShopCar);
        $("#btnClear").on("click", ShopCarPage.RemoveShopCar);
        $("#btnToCash").on("click", function () { $go("Cash.aspx"); });
        $(".back-col").on("click", function () { history.back(); });
    },
    loadUnitInfo: function () {
        if (ShopCarPage._PS.length == 0) {
            ShopCarPage.showEmpeyInfo();
            return;
        }
        var cnoarray = [];
        $(ShopCarPage._PS).each(function (i, _o) {
            cnoarray.push(_o.Cid);            
        });
        if (cnoarray.length > 0) {
            $ajax({ fn: 108, unitNo: cnoarray.join(",") }, ShopCarPage.loadUnitInfo_cb, true);
        }        
    },
    showEmpeyInfo: function () {
        $(".weui-loadmore__tips").text("购物车是空的");
        $(".page__ft").hide();
        $("#btnEdit").hide();
    },
    loadUnitInfo_cb: function (o) {
        //修改为
        for (var j = 0; j < ShopCarPage._PS.length; j++) {
            obj = ShopCarPage._PS[j];
            var _o = null;
            for (var i = 0; i < o.data.length; i++) {
                _o = o.data[i];             
                if (obj.Cid == _o.unitNo) {
                    break;
                }
            }
            if (_o != null) {
                ShopCarPage._PS[j].Price = _o.price;
                ShopCarPage._PS[j].DbNum = _o.uNum;
            }
            else {
                //已下线 需要处理的
                ShopCarPage._PS[j].Price = -1;
                ShopCarPage._PS[j].DbNum = -1;
                ShopCarPage._PS[j].Num = 0;
            }
        }
        ShopCarPage.saveToStorage();
        ShopCarPage.ReaderList();
    },
    EditShopCar: function () {
        var act = $(this).attr("data-act");
        if (act == "edit") {
            $("input:checkbox").prop("checked", false);
            $(".right-col h4").hide();
            $(".right-col div").show();
            $(this).attr("data-act", "ok");
            $(this).text("完成");
            $(".price-info-col").hide();
            $(".block-btn-col").hide();
            $(".btn-col").show();
        } else if (act == "ok") {
            $("input:checkbox").prop("checked", true);
            $(".right-col h4").show();
            $(".right-col div").hide();
            $(this).attr("data-act", "edit");
            $(this).text("编辑");
            $(".price-info-col").show();
            $(".block-btn-col").show();
            $(".btn-col").hide();
            if (ShopCarPage._PS.length == 0) {
                ShopCarPage.showEmpeyInfo();
            }
        }
    },
    DeleteShopcarItem: function () {
        var cid = $(this).parents("li").attr("data-cid");
        ShopCarPage.RemoveItem(cid);
        $(this).parents("li").remove();
    },
    RemoveItem: function (cid) {
        var index = -1;
        $(ShopCarPage._PS).each(function (i, _o) {
            if (index>=0) { return; }
            if (_o.Cid == cid) {
                index = i;
            }
        });
        if (index >= 0) {
            ShopCarPage._PS.splice(index, 1);
        }
        ShopCarPage.saveToStorage();
        ShopCarPage.RanderPriceInfo();
    },
    ClearShopCar: function () {
        ShopCarPage._PS = [];
        $set("SHOP_CAR", "");
    },
    RemoveShopCar: function () {
        var chks = $("input[name=chkProduct]:checked");
        if (chks.length > 0) {
            $(chks).each(function (i, _o) {
                var cid = $(_o).parents("li").attr("data-cid");
                ShopCarPage.RemoveItem(cid);
                $(_o).parents("li").remove();
            });
        }
    },
    RanderPriceInfo: function () {
        var allPrice = 0,allNum=0;
        $(ShopCarPage._PS).each(function (i, _o) {
            allNum += _o.Num;
            allPrice += _o.Price*_o.Num;
        });
        allPrice = allPrice.toFixed(2);
        $(".block-btn-col span").text("共" + allNum + "件");
        $(".price-info-col em").text(allPrice);
        $(".price-info-col h6").text("总价：" + allPrice + "，优惠：0.00");
    },
    ReaderList: function () {
        var FeePostLimit = 0;        
        var html = '<div class="shopcar-list">'
        html += '<ul>'
        var allPrice = 0, allNum = 0;
        var list = ShopCarPage._PS;
        $(list).each(function (i, _o) {
            if (!_o) { return; }
            var id = _o.Id;            
            html += '<li data-id="' + id + '" data-cid="'+ _o.Cid +'" data-cnum="' + _o.DbNum + '"><div class="check-col weui-cells_checkbox"><label class="weui-cell weui-check__label" for="chk_' + id + '"><div class="weui-cell__hd"><input type="checkbox" name="chkProduct" checked="checked"  class="weui-check" id="chk_' + id + '"><i class="weui-icon-checked"></i></div></label></div>';
            html += '<div class="photo-col"><img src="' + BASE_URL + _o.PhotoUrl + '" /></div>';
            html += '<div class="main-col"><div class="info-row"><h3>' + _o.Name + '&nbsp;<span>' + _o.CateName + '</span></h3></div>'
            if (_o.Num > 0) {
                html += '<div class="add-sub-row" > <div class="sub-col" data-val="-1"><i class="iconfont icon-minus"></i></div> <div class="num-col">' + _o.Num + '</div> <div class="plus-col" data-val="1"><i class="iconfont icon-add1"></i></div></div>'
            }
            else if (_o.DbNum == 0 && _o.Price == -1) {
                html += '<div class="add-sub-row">商品已下线</div>'
            }
            else if (_o.DbNum == 0 && _o.Pirce>0) {
                html += '<div class="add-sub-row">商品已售馨</div>'
            }
            html += '</div>'
            html += '<div class="right-col"><h4>' + _o.Price.toFixed(2) + '</h4><div><i class="iconfont icon-delete"></i></div></div></li>'
            allPrice += _o.Price * _o.Num;
            allNum += _o.Num;
        });        
        html += '</ul></div>'
        allPrice = allPrice.toFixed(2);
        $(".blank-shop").before(html);       
        $(".block-btn-col span").text("共" + allNum + "件");
        $(".price-info-col em").text(allPrice);
        $(".price-info-col h6").text("总价：" + allPrice + "，优惠：0.00");
        $(".sub-col,.plus-col").on("click", ShopCarPage.ChangeNum);

        $("#chkAll").on("change", ShopCarPage.checkAllItem);
        $("input[name=chkProduct]").on("change", ShopCarPage.checkItem);
        $(".right-col div").on("click", ShopCarPage.DeleteShopcarItem);
    },
    checkItem: function () {
        if ($(this).is(':checked')) {
            var len = $("input[name=chkProduct]:checked").length;
            if (len == ShopCarPage._PS.length) {
                $("#chkAll").prop("checked", true);
            }
        }
        else {
            $("#chkAll").prop("checked", false);
        }
    },
    checkAllItem: function () {
        if ($(this).is(':checked')) {
            $("input:checkbox").prop("checked", true);
        }
        else {
            $("input:checkbox").prop("checked",false);
        }
    },
    addToShopCar: function (obj) {
        ShopCarPage.loadStorage();
        var _obj = null;
        var _ind = -1;
        if (ShopCarPage._PS.length > 0) {
            for (var i = 0; i < ShopCarPage._PS.length; i++) {
                var _o = ShopCarPage._PS[i];
                if (_o.Id == obj.Id && _o.Cid == obj.Cid) {
                    _ind = i;
                    _obj = _o;
                    _obj.Num += obj.Num;
                    break;
                }
            }
        }
        if(_ind==-1){          
            _obj = { Id: obj.Id, Name: obj.Name, PhotoUrl: obj.PhotoUrl, Cid: obj.Cid, Num: obj.Num, DbNum:5, Price: obj.Price, CateName: obj.CateName,sopid: obj.sopid,postFee:0 };
        }
       
        if (_ind > -1) {
            ShopCarPage._PS[_ind] = _obj;
        }
        else {
            ShopCarPage._PS.push(_obj);
        }
        ShopCarPage.saveToStorage();
        ShowFooterShopCarNum();
    },
    loadStorage: function () {
        var json = $get("SHOP_CAR");
        if (typeof (json) != 'undefined' && json != null && json != "") {
            ShopCarPage._PS = JSON.parse(json);
        }
        else {
            ShopCarPage._PS = [];
        }
    },
    saveToStorage: function () {
        if (ShopCarPage._PS!=null) {
            $set("SHOP_CAR", JSON.stringify(ShopCarPage._PS));
        }
    },
    getProductNum: function () {
        var num = 0;
        $(ShopCarPage._PS).each(function (i,_o) {
            num += _o.Num;
        })
        return num;
    },
    ChangeNum: function () {
        var v = parseInt($(this).attr("data-val"));
        var _v = parseInt($(this).siblings(".num-col").text());
        var cnum = parseInt($(this).parents("li").attr("data-cnum"));
        if (_v == 1 && v < 1) { weui.topTips("不能再少了~"); return; }
        if (_v >= cnum && v > 0) { weui.topTips("库存只有这么多了~"); return; }
        var num = _v + v;
        $(this).siblings(".num-col").text(num);
        var cid = $(this).parents("li").attr("data-cid");        
        for (var i = 0; i < ShopCarPage._PS.length; i++) {
            var _o = ShopCarPage._PS[i];
            if ( _o.Cid == cid) {                
                _o.Num = num;
                ShopCarPage._PS[i] = _o;
                break;
            }
        }
        ShopCarPage.saveToStorage();
        ShopCarPage.RanderPriceInfo();
    }
};

var VipDetailPage = {
    init: function () {
        VipDetailPage.UpdateUserInfo();
        DetailPage.isVipProduct = true;        
    },
    UpdateUserInfo: function () {
        $ajax({ fn: 2, openid: $get('openid') }, function (o) {
            getMemberInfoCallBack(o);
            if (o.data.uType == 1) {
                DetailPage.isVip = true;
                VipDetailPage.IsBuyed();
            }
            DetailPage.init();            
        }, true);
    },
    IsBuyed: function () {
        $ajax({ fn: 19, uid: $get("userid"), openid: $get("openid"), pid: request("id") }, VipDetailPage.IsBuyed_cb, false);
    },
    IsBuyed_cb: function (o) {
        if (o.Return == 1) {
            weui.alert("会员商品仅限购买一个");
            $("#btnToCash").addClass("weui-btn_disabled");
            $("#btnToCash").off("click");
        }
    }
};

var DetailPage = {
    isVipProduct: false,
    isVip: false,
    Pid: 0,
    CloseChooseType:0,
    DATA: {},
    shareObj: {},
    init: function () {        
        DetailPage.Pid = request("id");        
        DetailPage.Load();
        $("#btnAddToCart").on("click", function () { DetailPage.ShowChooseBox(0); });       
        $(".cart-col").on("click", function () { $go("ShopCar.aspx");});
        DetailPage.showShopCarNum();       
        if (DetailPage.isVipProduct && !DetailPage.isVip) {
            //非会员不能购买会员商品
            $("#btnToCash").addClass("weui-btn_disabled");
        }
        else {
            if (DetailPage.isVipProduct) {
                $("#btnToCash").on("click", function () {
                    $(".num-row").hide();
                    DetailPage.ShowChooseBox(1);
                });
            } else {
                $("#btnToCash").on("click", function () { DetailPage.ShowChooseBox(1); });
            }
        }
    },
    ShowChooseBox: function (n) {
        DetailPage.CloseChooseType = n;
        $(".mask-bg").show();
        $(".detail-choose-box").show();
    },
    showShopCarNum: function () {
        if (ShopCarPage._PS.length == 0) { ShopCarPage.loadStorage(); }
        if (ShopCarPage._PS.length > 0) {
            $(".weui-badge").text(ShopCarPage.getProductNum());
            $(".weui-badge").show();
        }
    },
    preShare: function () {   
        initWeChatShare(DetailPage.shareObj);
    },
    initChooseBox: function (data,name) {
        var html = '<div class="mask-bg"></div>';
        html += '<div class="detail-choose-box">'
        html += '<div class="title-bar"><h4>' + name + '<p>￥<em></em></p></h4><div class="close-btn"><i class="iconfont icon-close"></i></div></div>'
        html += '<div class="choose-panel">'
        var Level = 1;
        var defPrice = 0, _defPrice = 0;
        var defcnum = 0;
        var isEmpty = data.unitName == null || data.unitName == "";
        var html_ = '<div';
        if (isEmpty) {
            html_ += ' style="display:none;"';
        }
        html_ += '><h6>' + data.unitName + '</h6>';        
        //一级
        if (data.itemList != null && data.unitList == null) {
            html_ += '<ul>';
            $(data.itemList).each(function (i, _o) {
                if (_o.uNum > 0) {
                    html_ += '<li  class="' + (defPrice == 0 ? "active" : "") + '" data-p="' + _o.price + '" data-p2="' + _o.mPrice + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                    if (defPrice == 0) { defPrice = _o.price; _defPrice = _o.mPrice; defcnum = _o.uNum; }
                }
                else {
                    html_ += '<li  class="disabled" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                }
            });
            html_ += '</ul>';
            Level = 1;
        }
        else {
            html_ += '<ul>';
            $(data.unitList).each(function (i, _o) {
                html_ += '<li data-ind="' + i + '" class="' + (i == 0 ? "active" : "") + '">' + _o.unitValue + '</li>'
            });
            html_ += '</ul>';
            html_ += '<h6>' + data.unitList[0].itemList[0].unitValue + '</h6>'
            html_ += '<ul>';
            $(data.unitList[0].itemList).each(function (i, _o) {
                if (_o.uNum == 0) {
                    html_ += '<li  class="disabled" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                }
                else {
                    html_ += '<li  class="' + (defPrice == 0 ? "active" : "") + '" data-ind="' + i + '" data-p2="' + _o.mPrice + '" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                    if (defPrice == 0) { defPrice = _o.price; _defPrice = _o.mPrice; defcnum = _o.uNum; }
                }
            });
            html_ += '</ul>';
            Level = 2;
        }
        html_ += '</div>'
        html += html_;
        html += '<div class="num-row"><div class="num-bd">购买数量(<span>库存:</span>)</div><div class="num-ft"><div class="sub-col" data-val="-1"><i class="iconfont icon-minus"></i></div><div class="num-col">1</div><div class="plus-col"  data-val="1"><i class="iconfont icon-add1"></i></div></div></div>'
        html += '</div><div class="btn-row"><a href="javascript:;" id="btnOk" class="weui-btn weui-btn_warn">确定</a></div></div>';
        $(".page__bd").append(html);
        $(".sub-col,.plus-col").on("click", DetailPage.ChangeNum);
        $("#btnOk").on("click", DetailPage.AddProductToCar);
        //更新价格
        $(".title-bar h4 em").text(fmtPrice(defPrice));
        $(".price-col em").text("￥" + fmtPrice(defPrice));
        $(".price-col s").text("￥" + fmtPrice(_defPrice));
        $(".price-row .num-col,.num-bd span").text("库存:" + defcnum);
        $(".icon-close").on("click", function () {
            $(".detail-choose-box").hide();
            $(".mask-bg").hide();
        });
        if (Level == 1) {
            $(".choose-panel ul li").not(".disabled").on("click", DetailPage.chooseCate);
        }
        else if (Level == 2) {
            $(".choose-panel ul:first li").on("click", DetailPage.loadSubCate);
            $(".choose-panel ul:last li").on("click", DetailPage.chooseCate);
        }
    },
    chooseCate: function () {
        $(this).siblings(".active").removeClass("active");
        $(this).addClass("active");
        var currPrice = $(this).attr("data-p");
        $(".detail-choose-box .title-bar h4 p em").text(currPrice);
        $(".price-col em").text("￥" + currPrice);
        $(".price-col s").text("￥" + $(this).attr("data-p2"));  
        $(".price-row .num-col,.num-bd span").text("库存:" + $(this).attr("data-cnum"));
        $(".num-ft .num-col").text("1");
    },
    loadSubCate: function () {
        $(this).siblings(".active").removeClass("active");
        $(this).addClass("active");
        $("ul:last").empty();
        var ind = $(this).attr("data-ind");
        var data = DetailPage.DATA.unit;
        var html = "";
        var defPrice = 0, _defPrice = 0;
        var defcnum = 0;

        $(data.unitList[ind].itemList).each(function (i, _o) {
            if (_o.uNum == 0) {
                html += '<li  class="disabled" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
            }
            else {
                html += '<li  class="' + (defPrice == 0 ? "active" : "") + '" data-ind="' + i + '" data-p2="' + _o.mPrice + '" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                if (defPrice == 0) { defPrice = _o.price; _defPrice = _o.mPrice; defcnum = _o.uNum; }
            }
        });
        $("ul:last").append(html);
        $(".choose-panel ul:last li").on("click", DetailPage.chooseCate);
        //更新价格
        $(".title-bar h4 em").text( fmtPrice(defPrice));
        $(".price-col em").text("￥" + fmtPrice(defPrice));
        $(".price-col s").text("￥" + fmtPrice(_defPrice));
        $(".price-row .num-col,.num-bd span").text("库存:" + defcnum);
        
    },
    Load: function () {
        $ajax({ fn: 106, pid: DetailPage.Pid }, DetailPage.Load_cb, true);
    },
    Load_cb: function (o) {
        if (o.Return == 0) {
            DetailPage.DATA = o.data;
            DetailPage.isVipProduct = o.data.pType == 2;
            var html = '<div class="swiper-wrapper">';
            var banner = o.data.imgUrl;
            $(banner).each(function (i, _o) {
                html += '<div class="swiper-slide"><img src="' + BASE_URL + _o + '" /></div>';
            });
            html += '</div><div class="swiper-pagination"></div>';
            $(".swiper-container").append(html);
            var mySwiper = new Swiper('.swiper-container', {
                loop: true,
                autoplay: 5000,
                pagination: '.swiper-pagination'
            });
            //标题栏
            html = '<div class="title-bar"><h3>' + o.data.pName + '</h3><h6>' + o.data.desp + '</h6><div class="price-row"><div class="price-col">'
            if (DetailPage.isVipProduct) {
                html += '<img class="vip" src="images/vip.png"/>'
            }
            html += '<em>￥' + fmtPrice(o.data.price) + '</em> <s>￥' + fmtPrice(o.data.mPrice) + '</s></div > <div class="num-col">库存:' + o.data.storeNum + '</div></div ></div > '
            $('.detail-info').append(html);
            var myOPID = $get("openid");
            var utype = parseInt($get("utype"));
            if (utype == 0) { myOPID = ""; }
            DetailPage.shareObj = {
                title: '你的朋友向你推荐' + o.data.pName,
                desp: o.data.pName + "," + o.data.desp,
                link: BASE_URL+ "app/detail.aspx?id=" + DetailPage.Pid + "&sopid=" + myOPID,
                logo: BASE_URL + o.data.imgUrl[0],
                success: function () { },
                cancel: function () { }
            };
            if (DetailPage.isVipProduct && !DetailPage.isVip) {
                html = '<div class="vipinfo-block"><a href="vippicture.aspx"><img src="images/vip-info.png"/></a></div>';
                $('.detail-info').append(html);
            }
            html = '<div class="comment-block" style="display:none;"></div>';
            DetailPage.loadComment();
            $('.detail-info').append(html);
            $('.detail-info').append('<div class="content">' + unescape(o.data.pInfo) + '</div>');
            DetailPage.initChooseBox(o.data.unit,o.data.pName);
        }
    },
    loadComment: function () {
        $ajax({ fn: 12, pid: DetailPage.Pid, uid: $get("userid"), openid: $get("openid") }, DetailPage.loadComment_cb, false);
    },
    loadComment_cb: function (o) {
        if (o.Return == 0 && o.data.length>0) {
            $(".comment-block").show();
            var html = '<div class="title-row"><div class="title-col">大家说</div><div class="rate-col">好评率：<em>' + o.Ext.toFixed(0) + '%</em><i class="icon iconfont icon-arrowright"></i></div></div>';
            html += '<ul>'
            var count = o.data.length;
            if (count > 5) { count = 5; }
            for (var i = 0; i < count;i++){
                var _o = o.data[i];
                html += '<li><div class="li-hd"><div class="photo-col"><img src="' + _o.photoUrl + '"/></div><div class="name-col"><h5>' + _o.nickName + '</h5><div class="star-row">';
                for (var j = 0; j < _o.grade; j++) {
                    html += '<i class="iconfont icon-favoritesfilling"></i>'
                }
                for (var j = _o.grade; j < 5; j++) {
                    html += '<i class="iconfont icon-iconfontxingxing"></i>'
                }
                html += '</div ></div > <div class="date-col">' + formatDate(_o.addOn) + '</div></div > <p>' + _o.memo + '</p>'
                //图片
                if (_o.attach.length > 0) {
                    html += '<div class="pic-area">'
                    $(_o.attach).each(function (j, __o) {
                        html += '<div class="img-col"><img src="' + BASE_URL+ __o.aSrc + '"/></div>';
                    });
                    html += '</div>'
                }
                html += '</li >'                
            }
            html += '</ul>'
            $(".comment-block").append(html);
            ShareProdcut.imgreSize();
            $(".img-col img").on("click", ShareProdcut.priviewImg);
            $(".comment-block .title-row").on("click", function () { $go("comment.aspx?pid=" + DetailPage.Pid); });
        }        
    },
    ChangeNum: function () {
        var v = parseInt($(this).attr("data-val"));
        var _v = parseInt($(".num-ft .num-col").text());
        var cnum = parseInt($(".num-bd span").text().replace("库存:",""));
        if (_v == 0 && v < 0) { return; }
        if (_v >= cnum && v > 0) { return; }
        $(".num-ft .num-col").text(_v + v);
    },
    AddProductToCar: function () {
        var unitobj = $("ul:last li.active");
        var unitNo = unitobj.attr("data-no");
        var unitName = unitobj.text();
        if ($("ul").length > 1) {
            unitName = $("ul:first li.active").text()+" "+unitobj.text();
        }
        var unitprice = parseFloat( unitobj.attr("data-p"));
        var num = parseInt($(".num-ft .num-col").text());
        var obj = DetailPage.DATA;
        if (DetailPage.CloseChooseType == 0) {
            //购物车           
            ShopCarPage.addToShopCar({ Id: obj.id, Cid: unitNo, CateName: unitName, Name: obj.pName, PhotoUrl: obj.imgUrl[0], Price: unitprice, Num: num, sopid: __SOPID });
            DetailPage.showShopCarNum();
            $(".mask-bg").hide();
            $(".detail-choose-box").hide();
        }
        else {
            //直接购买
            CashPage.addTempShop([{ Id: obj.id, Cid: unitNo, CateName: unitName, Name: obj.pName, PhotoUrl: obj.imgUrl[0], Price: unitprice, Num: num, sopid: __SOPID, postFee: 0, isVip: DetailPage.isVipProduct }]);
            $go("Cash.aspx");           
        }
    }
};

var ListPage = {
    PageNo: 1,
    DATA: [],
    PageSize: 10,
    shareObj: {},
    keyword:"",
    init: function() {
        ListPage.LoadProductList();
        ListPage.showShopCarNum();       
        $(".shopCarIcon").on("click", function () { $go("shopcar.aspx"); });
        var myOPID = $get("openid");
        var utype = parseInt($get("utype"));
        if (utype == 0) { myOPID = ""; }
        ListPage.shareObj = {
            title: '你的朋友向你推荐万品微店',
            desp: '你的朋友向你推荐万品微店',
            link: BASE_URL + "app/list.aspx?sid=" + request("sid") + "&sopid=" + myOPID,
            logo: BASE_URL + "app/images/sharelog.jpg",
            success: function () { },
            cancel: function () { }
        };
        $("#lnkSearch").on("click", function () {
            var keyLength = $("#txtKeyWord").val().length;
            if (keyLength==0) {
                ListPage.keyword = "";
                $(".product-list:eq(1)").hide();
                $(".product-list:eq(0)").show();
            }
            else {
                ListPage.keyword = $("#txtKeyWord").val();
                $(".product-list:eq(1) ul").empty();
                ListPage.LoadProductList();
            }
        })
        
    },    
    preShare: function () {
        initWeChatShare(ListPage.shareObj);
    },
    showShopCarNum: function () {
        if (ShopCarPage._PS.length == 0) { ShopCarPage.loadStorage(); }
        if (ShopCarPage._PS.length > 0) {
            $(".weui-badge").text(ShopCarPage.getProductNum());
            $(".weui-badge").show();           
        }
    },
    LoadProductList: function () {
        if (ListPage.keyword != "") {
            $ajax({ fn: 102, key: ListPage.keyword, page:1 }, ListPage.LoadProductList_cb, true);
        } else {
            $ajax({ fn: 102, pid: request("sid"), page: ListPage.PageNo }, ListPage.LoadProductList_cb, true);
        }         
    },
    LoadProductList_cb: function (o) {
        if ($(".weui-loadmore").length > 0) {
            $(".weui-loadmore").remove();
        }
        var ind = 0;
        if (o.Return == 0 && o.data.length > 0) {
            ListPage.DATA = ListPage.DATA.concat(o.data);            
            if (ListPage.keyword != "") {
                ind = 1;
                $(".product-list:eq(1)").show();
                $(".product-list:eq(0)").hide();
            } else {
                $(".product-list:eq(0)").show();
                $(".product-list:eq(1)").hide();
            }
            $(o.data).each(function (i, _o) {
                var imgUrl = _o.imgUrl.split('@')[0];
                var html = '<li data-id="' + _o.id + '" data-ind="' + ((ListPage.PageNo - 1) * ListPage.PageSize + i) + '"><img src="' + BASE_URL + imgUrl + '" />';
                html += '<h4>' + _o.pName + '</h4><h5>' + _o.desp + '<span>' + _o.unitName +'</span></h5>';
                html += '<div class="info-bar"><div class="desp-col"><em>￥' + _o.price + '</em><s>￥' + _o.mPrice + '</s></div>';
                html += '<div class="icon-col"><i class="icon iconfont icon-shopcart10"></i></div></div></li>';
                $(".product-list:eq("+ ind +") ul").append(html);
            });
            ListPage.PageNo = o.Ext.PageNo;
            if (o.Ext.PageCount > o.Ext.PageNo) {
                //还有更多
                var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >加载更多</span></div>';
                $(".product-list:eq(" + ind +")").append(moreHtml);
                $(".weui-loadmore__tips").on("click", ListPage.LoadProductList);
            }
            else {
                //没有更多了
                var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >没有更多了</span></div>';
                $(".product-list:eq(" + ind + ")").append(moreHtml);
            }
            $(".product-list ul li img,h4,.info-bar>.desp-col").on("click", function () { $go("detail.aspx?sopid=" + __SOPID + "&id=" + $(this).parents("li").attr("data-id")); });
            $(".info-bar>.icon-col").on("click", ListPage.AddProductToCar);
        }
        else {
            var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >暂无产品，点击刷新</span></div>';
            $(".product-list:eq(" + ind + ")").append(html);
            $(".weui-loadmore__tips").on("click", ListPage.LoadProductList);
        }
    },
    AddProductToCar: function () {
        var id = $(this).parents("li").attr("data-id");
        var ind = $(this).parents("li").attr("data-ind");
        var obj = ListPage.DATA[ind];
        var imgUrl = obj.imgUrl.split('@')[0];
        ShopCarPage.addToShopCar({ Id: obj.id, Cid: obj.unitNo, CateName: obj.unitName, Name: obj.pName, PhotoUrl: imgUrl, Price: obj.price, Num: 1, sopid: __SOPID });
        ListPage.showShopCarNum();
    }
};

var SubjectPage = {
    init: function () {
        SubjectPage.Load();  
        setTimeout(function () {
            ShopCarPage.loadStorage();
            ShowFooterShopCarNum();
        }, 1000);  
    },
    Load: function () {
        $ajax({ fn: 101 }, SubjectPage.Load_cb, true);       
    },
    Load_cb: function (o) {
        if (o.Return == 0) {            
            $(o.data).each(function (i, _o) {
                var html = '<li data-id="' + _o.id + '"><img src="' + BASE_URL+ _o.imgUrl + '"/><h5>' + _o.cName + '</h5></li>'
                $("ul").append(html);
            });
            $("li").on("click", function () {
                $go("list.aspx?sopid=" + __SOPID + "&sid=" + $(this).attr("data-id"));
            })
        }
    }
};

var IndexPage = {
    PDATA: [],
    ACT_DATA: {},
    init: function () {        
        CheckWechatUserInfo();
        IndexPage.LoadBanner();
        IndexPage.LoadSubject();
        IndexPage.LoadVipProduct();
        IndexPage.LoadActiveProduct();
        IndexPage.LoadTopProduct();
        setTimeout(function () {
            ShopCarPage.loadStorage();
            ShowFooterShopCarNum();
        }, 1000);        
    },   
    LoadTopProduct: function() {
        $ajax({ fn: 102, type: 0 }, IndexPage.LoadTopProduct_cb, true);
    },
    LoadTopProduct_cb: function(o) {
        if (o.Return == 0) {
            IndexPage.PDATA = o.data;
            $(o.data).each(function (i, _o) {
                var imgUrl = _o.imgUrl.split('@')[0];
                var html = '<li data-id="' + _o.id + '" data-ind="'+ i +'"><img src="' + BASE_URL + imgUrl + '" />';
                html += '<h4>' + _o.pName + '</h4>';
                html += '<div class="info-bar"><div class="desp-col"><p>' + _o.unitName +'&nbsp;</p><em>￥' + _o.price + '</em><s>￥' + _o.mPrice + '</s></div>';
                html += '<div class="icon-col"><i class="icon iconfont icon-shopcart10"></i></div></div></li>';
                $(".product-top-list ul").append(html);
            });
            $(".product-top-list ul li img,h4,.info-bar>.desp-col").on("click", function () { $go("detail.aspx?sopid=" + __SOPID + "&id=" + $(this).parents("li").attr("data-id")); });
            $(".info-bar>.icon-col").on("click", IndexPage.AddProductToCar);
        }
    },
    AddProductToCar: function() {
        var id = $(this).parents("li").attr("data-id");
        var ind = $(this).parents("li").attr("data-ind");
        var obj = IndexPage.PDATA[ind];
        var imgUrl = obj.imgUrl.split('@')[0];
        ShopCarPage.addToShopCar({ Id: obj.id, Cid: obj.unitNo, CateName: obj.unitName, Name: obj.pName, PhotoUrl: imgUrl, Price: obj.price, Num: 1, sopid: __SOPID });
    },
    AddActiveToCar: function () {
        var obj = IndexPage.ACT_DATA;
        var imgUrl = obj.imgUrl.split('@')[0];
        ShopCarPage.addToShopCar({ Id: obj.id, Cid: obj.unitNo, CateName: obj.unitName, Name: obj.pName, PhotoUrl: imgUrl, Price: obj.price, Num: 1, sopid: __SOPID });
    },
    LoadActiveProduct: function () {
        $ajax({ fn: 102, type: 4 }, IndexPage.LoadActiveProduct_cb, true);
    },
    LoadActiveProduct_cb: function (o) {
        if (o.Return == 0 && o.data.length>0) {
            var html = '<div class="title-row">今日推荐</div>';            
            var data = o.data[0];
            IndexPage.ACT_DATA = data;
            var imgUrl = data.imgUrl.split('@')[0];
            html += '<img src="' + BASE_URL + imgUrl + '" />';
            html += '<div class="info-bar">'
            html += '<div class="left-col">' + data.pName + '<span>' + data.unitName + '</span><h6>' + data.desp + '</h6></div>'
            html += '<div class="right-col"><em>￥' + data.price +'</em><i class="iconfont icon-shopcart10"></i></div>'
            html += '</div>'
            $('.active-panel').append(html);            
            $(".active-panel>img,.active-panel>.info-bar>.left-col").on("click", function () { $go("detail.aspx?sopid=" + __SOPID + "&id=" + data.id) });
            $(".active-panel>.info-bar>.right-col>i").on("click", IndexPage.AddActiveToCar);
        }
    },
    LoadBanner: function () {
        $ajax({ fn: 122 }, IndexPage.LoadBanner_cb, true);
    },
    LoadBanner_cb: function (o) {
        if (o.Return == 0) {
            var html = '<div class="swiper-wrapper">';
            $(o.data).each(function (i, _o) {
                html += '<div class="swiper-slide">'
                if (_o.isHref == 1) {
                    html += '<a alt= "' + _o.title + '" href= "' + _o.hrefUrl + '" >'
                }
                else {
                    html += '<a alt= "' + _o.title + '" href= "adDetail.aspx?id='+ _o.id +'" >'
                }
                html += '<img src="' + BASE_URL + _o.imgUrl + '" /></a></div> ';
            });
            html += '</div><div class="swiper-pagination"></div>';
            $(".swiper-container").append(html);
            var mySwiper = new Swiper('.swiper-container', {
                loop: true,
                autoplay: 5000,
                pagination: '.swiper-pagination'
            })
        }
    },
    LoadSubject: function () {
        $ajax({ fn: 101 }, IndexPage.LoadSubject_cb, true);
    },
    LoadSubject_cb: function (o) {
        if (o.Return == 0) {            
            $(o.data).each(function (i, _o) {
                var html = '<div class="category__item" data-id="' + _o.id + '"><img src="' + BASE_URL + _o.imgUrl + '"  ></img><h5>' + _o.cName + '</h5></div>'
                $(".category-area").append(html);
            });
            var html = '<div class="category__item" data-id="0"><img src="images/more.png"></img><h5>更多</h5></div>'
            $(".category-area").append(html);
            $(".category__item").on("click", function () {
                var sid = parseInt($(this).attr("data-id"));
                if (sid == 0) {
                    $go("subject.aspx?sopid=" + __SOPID );
                } else {
                    $go("list.aspx?sopid=" + __SOPID + "&sid=" + $(this).attr("data-id"));
                }
            })
        }
    },
    LoadVipProduct: function () {
        $ajax({ fn: 102, type: 2 }, IndexPage.loadVipProduct_cb, true);
    },
    loadVipProduct_cb: function (o) {
        if (o.Return == 0 && o.data.length > 0) {
            var html = '<div class="title-row">会员专享</div><ul></ul>';
            $('.vip-panel').append(html);
            $(o.data).each(function (i,_o) {
                var data = _o;
                var imgUrl = data.imgUrl.split('@')[0];
                html = '<li data-id="'+ data.id +'"><div class="img-col"><img src="' + BASE_URL + imgUrl + '" /></div>';
                html += '<div class="info-col">'
                html += '<h3>' + data.pName + '</h3><h5>' + data.desp + '</h5>'
                html += '<div class="price-row"><div class="price-col">会员专享￥<em>' + data.price + '</em></div><div class="btn-col"><div class="btn-go">立即抢购</div></div>'
                html += '</div></li>'
                $('.vip-panel ul').append(html);
            });
            $(".vip-panel ul li").on("click", function () { $go("vipdetail.aspx?id=" + $(this).attr("data-id")); });
        }
    }
};

$(document).ready(function () {
    SSJ.init();
});

function ShowFooterShopCarNum() {
    var n = ShopCarPage._PS.length;
    if (n > 0) {
        $("#footerNumber").text(ShopCarPage.getProductNum());
        $("#footerNumber").show();
    }
}

function addTabBar() {
    var html = '<div class="weui-tabbar">';
    html += '<a href= "index.aspx" class="weui-tabbar__item" ><i class="icon iconfont icon-wxbzhuye weui-tabbar__icon"></i><p class="weui-tabbar__label">首页</p></a >';
    html += '<a href="subject.aspx" class="weui-tabbar__item"><i class="icon iconfont icon-all weui-tabbar__icon"></i><p class="weui-tabbar__label">分类</p></a>';
       //<span class="weui-badge weui-badge_dot" style="display:none;position: absolute;top: 0;right: -6px;"></span>
    html += '<a href="shopcar.aspx" class="weui-tabbar__item"><span style="display: inline-block;position: relative;"><i class="icon iconfont icon-cart weui-tabbar__icon"></i><span id="footerNumber" class="weui-badge" style="display:none; position: absolute;top: -2px;right: -13px;">0</span></span><p class="weui-tabbar__label">购物车</p></a>';
    html += '<a href="uc.aspx" class="weui-tabbar__item"><i class="icon iconfont icon-account weui-tabbar__icon"></i><p class="weui-tabbar__label">我的</p></a></div>';
    $(".weui-tab").append(html);
    if (PageName == "index") { $(".weui-tabbar__item:eq(0)").addClass("weui-bar__item_on"); }
    if (PageName == "subject") { $(".weui-tabbar__item:eq(1)").addClass("weui-bar__item_on"); }
    if (PageName == "shopcar") { $(".weui-tabbar__item:eq(2)").addClass("weui-bar__item_on"); }
    if (PageName == "uc") { $(".weui-tabbar__item:eq(3)").addClass("weui-bar__item_on"); }
}

var controlId = -1;
function controlLayerSwitch() {
    window.onpopstate = function () {
        if (controlId > 1000) {
               
        }
    }
}

function fmtPrice(price) {
    if (price.toString().indexOf('.') > -1) {
        return price.toFixed(2).toString();
    }
    else {
        return price.toString();
    }
}

function ConvertShowState(n) {
    var result = "";
    switch (n) {
        case 0:
            result = "待付款";
            break;
        case 1:
            result = "待发货";
            break;
        case 2:
            result = "待收货";
            break;
        case 8:
            result = "已完成";
            break;
        case 9:
            result = "已取消";
            break;
        case 10:
            result = "已退款";
            break;               
        default:
            result = "处理中";
            break;
    }
    return result;
}

function fmtBankCard(cardno) {
    var result = '';
    while (cardno.length > 4) {
        result = result + cardno.substr(0, 4) + ' ';
        cardno = cardno.slice(4, cardno.length);
    }
    if (cardno) { result = result + " " + cardno; }
    return result;
}

function CheckWechatUserInfo() {
    if ($get("userid") != null && $get("userid") != "") { return; }
    var code = getParam("code");
    if (code == "") { return GetWechatLink("", PageName + ".aspx"); }
    var openid = $get('openid');
    if (code != "" && (openid == null || openid == "")) {
        getOpenId(code, getMemberInfo);
    }
}

function getOpenId(code, callback) {
    if ($isDebug) {
        $set('openid', debug_openId, cookie_obj);
        callback();
    }
    else {
        var data = { fn: 1, code: code, source: request("state") };
        $ajax(data, function (o) {
            if (o.Return == 1) {
                return;
            }
            else {
                $set('openid', o.data);
                callback();
            }
        }, false);
    }
}

function getMemberInfo() {
    if ($get('userid') == null) {
        $ajax({ fn: 2, openid: $get('openid'), code: request("code"), source: request("state") }, getMemberInfoCallBack, false);
    }
}

function getMemberInfoCallBack(o) {
    if (o.Return == 0) {
        var user = o.data;
        if (user != null) {
            $set('userid', user.id);
            $set('photourl', user.photoUrl);
            $set('mobile', user.mobile);
            $set('contact', user.contact);
            $set('nickname', user.nickName);
            $set('utype', user.uType);
            $set('sex', user.sex);
        }
    }
}

function maskTel(tel) {
    var len = tel.length;
    var result = "";
    if (len >= 11) {
        result = tel.substring(0, 3);
        for (var i = 0; i<len-7; i++) {
            result += "*";
        }
        result += tel.substring(len-4, len);
    }
    else if ( len > 7) {
        result = tel.substring(0, 2);
        for (var i = 0; i < len-5; i++) {
            result += "*";
        }
        result += tel.substring(len - 3, len);
    }
    else {
        result = tel;
    }
    return result;
}

function GetWechatLink(folder, page) {
    if ($isDebug) {
        $set('openid', debug_openId, cookie_obj);
        window.location.href = window.location.href + "?code=debug";
    }
    else {
        $go("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72bba0f3cbe6e8ca&redirect_uri=http%3a%2f%2fs.seascapeapp.cn%2fapp%2f" + (folder.length > 0 ? (folder + "%2f"):"") + page + "&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect");
    }
}

$.fn.longPress = function (fn) {
    var timeout = undefined;
    var $this = this;
    for (var i = 0; i < $this.length; i++) {
        $this[i].addEventListener('touchstart', function (event) {
            timeout = setTimeout(fn, 800);
        }, false);
        $this[i].addEventListener('touchend', function (event) {
            clearTimeout(timeout);
        }, false);
    }
}