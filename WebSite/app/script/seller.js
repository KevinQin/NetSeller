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
    var pageItems = pageUrl.split("/");
    PageName = pageItems[pageItems.length - 1].split('.')[0].toLowerCase();
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
        addTabBar();
    }
    else if (PageName == "list") {
        ListPage.init();
    }
    else if (PageName == "detail") {
        DetailPage.init();
    }
    else if (PageName == "conform") {

    }
    else if (PageName == "pay") {

    }
    else if (PageName == "success") {
 
    }
    else if (PageName == "orderlist") {
       
    }
    else if (PageName == "orderdetail") {
        
    }
}

var ShopCarPage = {
    _PS:[],
    init: function () {
        ShopCarPage.loadStorage();
        ShopCarPage.ReaderList();
        $("#btnEdit").on("click", ShopCarPage.EditShopCar);
        $("#btnClear").on("click", ShopCarPage.RemoveShopCar);
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
        var FeePostLimit = 39;
        //<div class="info-bar"><h3>满' + FeePostLimit + '元免运费</h3><h6><span>已免运费</span><i class="icon iconfont icon-warning"></i></h6></div>
        var html = '<div class="shopcar-list">'
        html += '<ul>'
        var allPrice = 0, allNum = 0;
        var list = ShopCarPage._PS;
        $(list).each(function (i, _o) {
            if (!_o) { return; }
            var id = _o.Id;
            html += '<li data-id="' + id + '" data-cid="'+ _o.Cid +'" data-cnum="' + _o.DbNum + '"><div class="check-col weui-cells_checkbox"><label class="weui-cell weui-check__label" for="chk_' + id + '"><div class="weui-cell__hd"><input type="checkbox" name="chkProduct" checked="checked"  class="weui-check" id="chk_' + id + '"><i class="weui-icon-checked"></i></div></label></div>';
            html += '<div class="photo-col"><img src="' + BASE_URL + _o.PhotoUrl + '" /></div>';
            html += '<div class="main-col"><div class="info-row"><h3>' + _o.Name + '&nbsp;<span>' + _o.CateName + '</span></h3></div><div class="add-sub-row"><div class="sub-col" data-val="-1"><i class="iconfont icon-minus"></i></div><div class="num-col">' + _o.Num + '</div><div class="plus-col"  data-val="1"><i class="iconfont icon-add1"></i></div></div></div>'
            html += '<div class="right-col"><h4>' + _o.Price.toFixed(2) + '</h4><div><i class="iconfont icon-delete"></i></div></div></li>'
            allPrice += _o.Price * _o.Num;
            allNum += _o.Num;
        });
        html += '</ul></div>'
        allPrice = allPrice.toFixed(2);
        $(".page__bd").append(html);
        //if (allPrice < FeePostLimit) {
        //    $(".shopcar-list .info-bar h6 span").text("邮费10元")
        //}
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
            _obj = { Id: obj.Id, Name: obj.Name, PhotoUrl: obj.PhotoUrl, Cid: obj.Cid, Num: obj.Num, DbNum:5, Price: obj.Price, CateName: obj.CateName,sopid: obj.sopid };
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
        if (ShopCarPage._PS.length > 0) {
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
        if (_v == 0 && v < 0) { return; }
        if (_v >= cnum && v > 0) { return; }
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

var DetailPage = {
    Pid: 0,
    CloseChooseType:0,
    DATA: {},
    shareObj: {},
    init: function () {
        DetailPage.Pid = request("id");        
        DetailPage.Load();
        $("#btnAddToCart").on("click", function () { DetailPage.ShowChooseBox(0); });
        $("#btnToCash").on("click", function () { DetailPage.ShowChooseBox(1); });
        $(".cart-col").on("click", function () { $go("ShopCar.aspx");});
        DetailPage.showShopCarNum();
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
        initWeChatShare(obj);
    },
    initChooseBox: function (data,name) {
        var html = '<div class="mask-bg"></div>';
        html += '<div class="detail-choose-box">'
        html += '<div class="title-bar"><h4>' + name + '<p>￥<em></em></p></h4><div class="close-btn"><i class="iconfont icon-close"></i></div></div>'
        html += '<div class="choose-panel">'
        html += '<h6>' + data.unitName + '</h6>'
        var Level = 1;
        var defPrice = 0, _defPrice = 0;
        var defcnum = 0;

        //一级
        if (data.itemList != null && data.unitList == null) {
            html += '<ul>';
            $(data.itemList).each(function (i, _o) {
                if (_o.uNum > 0) {                    
                    html += '<li  class="' + (defPrice == 0 ? "active" : "") + '" data-p="' + _o.price + '" data-p2="' + _o.mPrice + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                    if (defPrice == 0) { defPrice = _o.price; _defPrice = _o.mPrice; defcnum = _o.uNum; }
                }
                else {                    
                    html += '<li  class="disabled" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                }
            });
            html += '</ul>';
            Level = 1;
        }
        else {
            html += '<ul>';
            $(data.unitList).each(function (i, _o) {
                html += '<li data-ind="'+ i +'" class="'+  (i==0?"active":"") +'">' + _o.unitValue + '</li>'
            });
            html += '</ul>';
            html += '<h6>' + data.unitList[0].itemList[0].unitValue + '</h6>'
            html += '<ul>';
            $(data.unitList[0].itemList).each(function (i, _o) {
                if (_o.uNum == 0) {
                    html += '<li  class="disabled" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                }
                else {
                    html += '<li  class="' + (defPrice == 0 ? "active" : "") + '" data-ind="' + i + '" data-p2="' + _o.mPrice + '" data-p="' + _o.price + '" data-no="' + _o.unitNo + '" data-cnum="' + _o.uNum + '">' + _o.itemName + '</li>'
                    if (defPrice == 0) { defPrice = _o.price; _defPrice = _o.mPrice;defcnum = _o.uNum; }
                }
            });
            html += '</ul>';
            Level = 2;
        }
        html += '<div class="num-row"><div class="num-bd">购买数量(<span>库存:</span>)</div><div class="num-ft"><div class="sub-col" data-val="-1"><i class="iconfont icon-minus"></i></div><div class="num-col">1</div><div class="plus-col"  data-val="1"><i class="iconfont icon-add1"></i></div></div></div>'
        html += '</div><div class="btn-row"><a href="javascript:;" id="btnOk" class="weui-btn weui-btn_warn">确定</a></div></div>';
        $(".page__bd").append(html);
        $(".sub-col,.plus-col").on("click", DetailPage.ChangeNum);
        $("#btnOk").on("click", DetailPage.AddProductToCar);
        //更新价格
        $(".title-bar h4 em").text(defPrice);
        $(".price-col em").text("￥"+defPrice);
        $(".price-col s").text("￥" + _defPrice);
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
        $(".title-bar h4 em").text(defPrice);
        $(".price-col em").text("￥" + defPrice);
        $(".price-col s").text("￥" + _defPrice);
        $(".price-row .num-col,.num-bd span").text("库存:" + defcnum);
        
    },
    Load: function () {
        $ajax({ fn: 106, pid: DetailPage.Pid }, DetailPage.Load_cb, true);
    },
    Load_cb: function (o) {
        if (o.Return == 0) {
            DetailPage.DATA = o.data;
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
            html = '<div class="title-bar"><h3>' + o.data.pName + '</h3><h6>' + o.data.desp + '</h6><div class="price-row"><div class="price-col"><em>￥' + o.data.price + '</em><s>￥' + o.data.mPrice + '</s></div><div class="num-col">库存:' + o.data.storeNum + '</div></div></div>'
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
            //评价
            /*
            html = '<div class="comment-block"><div class="title-row"><div class="title-col">大家说</div><div class="rate-col">好评率：<em>' + o.data.Comment.RatePeer + '</em><i class="icon iconfont icon-arrowright"></i></div></div>';
            html += '<ul>'
            $(o.data.Comment.List).each(function (i, _o) {
                html += '<li><div class="li-hd"><div class="photo-col"><img src="' + _o.PhotoUrl + '"/></div><div class="name-col"><h5>' + _o.Name + '</h5><div class="star-row">';
                for (var i = 1; i <= _o.RateStar; i++) {
                    html += '<i class="icon iconfont icon-favoritesfilling"></i>'
                }
                for (var i = _o.RateStar; i < 5; i++) {
                    html += '<i class="icon iconfont icon-favoritesfilling gray"></i>'
                }
                html += '</div ></div > <div class="date-col">' + formatDate(_o.AddOn) + '</div></div > <p>' + _o.Msg + '</p></li > '
            });
            html += '</ul></div>';
            $('.detail-info').append(html);*/
            $('.detail-info').append('<p class="content">' + unescape(o.data.pInfo) + '</p>');
            DetailPage.initChooseBox(o.data.unit,o.data.pName);
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
            $go("Cash.aspx?t=1&sopid=" + __SOPID + "&id=" + obj.id + "&cid=" + unitNo + "&catename=" + unitName + "&name=" + obj.pName + "&photoUrl=" + obj.imgUrl[0] + "&price=" + unitprice + "&num=" + num + "&ot=" + new Date().getTime());           
        }
    }
};

var ListPage = {
    PageNo: 1,
    DATA: [],
    PageSize: 10,
    shareObj: {},
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
        $ajax({ fn: 102, pid: request("sid"), page: ListPage.PageNo }, ListPage.LoadProductList_cb, true); 
    },
    LoadProductList_cb: function (o) {
        if ($(".weui-loadmore").length > 0) {
            $(".weui-loadmore").remove();
        }
        if (o.Return == 0 && o.data.length > 0) {
            ListPage.DATA=ListPage.DATA.concat(o.data);
            $(o.data).each(function (i, _o) {
                var imgUrl = _o.imgUrl.split('@')[0];
                var html = '<li data-id="' + _o.id + '" data-ind="' + ((ListPage.PageNo - 1) * ListPage.PageSize + i) + '"><img src="' + BASE_URL + imgUrl + '" />';
                html += '<h4>' + _o.pName + '</h4><h5>' + _o.desp + '<span>' + _o.unitName +'</span></h5>';
                html += '<div class="info-bar"><div class="desp-col"><em>￥' + _o.price + '</em><s>￥' + _o.mPrice + '</s></div>';
                html += '<div class="icon-col"><i class="icon iconfont icon-shopcart10"></i></div></div></li>';
                $(".product-list ul").append(html);
            });
            ListPage.PageNo = o.Ext.PageNo;
            if (o.Ext.PageCount > o.Ext.PageNo) {
                //还有更多
                var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >加载更多</span></div>';
                $(".product-list").append(moreHtml);
                $(".weui-loadmore__tips").on("click", ListPage.LoadProductList);
            }
            else {
                //没有更多了
                var moreHtml = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >没有更多了</span></div>';
                $(".product-list").append(moreHtml);
            }
            $(".product-list ul li img,h4,.info-bar>.desp-col").on("click", function () { $go("detail.aspx?sopid=" + __SOPID + "&id=" + $(this).parents("li").attr("data-id")); });
            $(".info-bar>.icon-col").on("click", ListPage.AddProductToCar);
        }
        else {
            var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >暂无产品，点击刷新</span></div>';
            $(".product-list").append(html);
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
                html += '<div class="info-bar"><div class="desp-col"><p>' + _o.unitName +'</p><em>￥' + _o.price + '</em><s>￥' + _o.mPrice + '</s></div>';
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
            $(".active-panel>img,.active-panel>.info-bar>.left-col").on("click", function () { $go("detail.aspx??sopid=" + __SOPID + "&id=" + data.id) });
            $(".active-panel>.info-bar>.right-col>i").on("click", IndexPage.AddActiveToCar);
        }
    },
    LoadBanner: function () {
        $ajax({ fn: 102, type: 3 }, IndexPage.LoadBanner_cb, true);
    },
    LoadBanner_cb: function (o) {
        if (o.Return == 0) {
            var html = '<div class="swiper-wrapper">';
            $(o.data).each(function (i, _o) {
                var imgUrl = _o.imgUrl.split('@')[0];
                html += '<div class="swiper-slide"><a alt="' + _o.pName + '" href="detail.aspx?sopid=' + __SOPID + '&id=' + _o.id + '"><img src="' + BASE_URL + imgUrl + '" /></a></div>';
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
        case 3:
            result = "待评价";
            break;
        case 9:
            result = "已退货";
            break;               
        default:
            result = "处理中";
            break;
    }
    return result;
}


function CheckWechatUserInfo() {
    var code = getParam("code");
    if (code == "") { return GetWechatLink("broker", PageName + ".aspx"); }
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

function GetWechatLink(folder, page) {
    if ($isDebug) {
        $set('openid', debug_openId, cookie_obj);
        window.location.href = window.location.href + "?code=debug";
    }
    else {
        $go("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72bba0f3cbe6e8ca&redirect_uri=http%3a%2f%2fs.seascapeapp.cn%2fapp%2f" + (folder.length > 0 ? (folder + "%2f"):"") + page + "&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect");
    }
}
