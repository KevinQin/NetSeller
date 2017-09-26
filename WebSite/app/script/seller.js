var SSJ = {};
var ajaxServerUrl = "/service/handler.ashx";
var PageName = "";
var BASE_URL = "http://s.seascapeapp.cn/";
var debug_openId = "o9jMc1rBitv6-7Bi6cFWqO0Omq0Y";
var storage = window.localStorage;
var cookie_before = "wpshopV1_";

SSJ.init = function () {
    var pageUrl = window.location.href;
    var pageItems = pageUrl.split("/");
    PageName = pageItems[pageItems.length - 1].split('.')[0].toLowerCase();
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
    },
    ReaderList: function () {
        var FeePostLimit = 39;
        var html = '<div class="shopcar-list"><div class="info-bar"><h3>满' + FeePostLimit + '元免运费</h3><h6><span>已免运费</span><i class="icon iconfont icon-warning"></i></h6></div>'
        html += '<ul>'
        var allPrice = 0, allNum = 0;
        var list = ShopCarPage._PS;
        $(list).each(function (i, _o) {
            var id = _o.Id;
            html += '<li data-id="' + id + '"><div class="check-col weui-cells_checkbox"><label class="weui-cell weui-check__label" for="chk_' + id + '"><div class="weui-cell__hd"><input type="checkbox" name="chkProduct" class="weui-check" id="chk_' + id + '"><i class="weui-icon-checked"></i></div></label></div>';
            html += '<div class="photo-col"><img src="' + _o.PhotoUrl + '" /></div>';
            html += '<div class="main-col"><div class="info-row"><h3>' + _o.Name + '</h3><h4>' + _o.Price.toFixed(2) + '</h4></div><div class="add-sub-row"><div class="sub-col"><i class="icon iconfont icon-minus"></i></div><div class="num-col">' + _o.Num + '</div><div class="add-col"><i class="icon iconfont icon-add1"></i></div></div></div></li>'
            allPrice += _o.Price * _o.Num;
            allNum += _o.Num;
        });
        html += '</ul></div>'
        allPrice = allPrice.toFixed(2);
        $(".page__bd").append(html);
        if (allPrice < FeePostLimit) {
            $(".shopcar-list .info-bar h6 span").text("邮费10元")
        }
        $(".block-btn-col span").text("共" + allNum + "件");
        $(".price-info-col em").text(allPrice);
        $(".price-info-col h6").text("总价：" + allPrice + "，优惠：0.00");
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
        else {            
            _obj = { Id: obj.Id, Name: obj.Name, PhotoUrl: obj.PhotoUrl, Cid: obj.Cid, Num: obj.Num, DbNum:obj.DbNum, Price: obj.Price, CateName: obj.CateName };
        }
       
        if (_ind > -1) {
            ShopCarPage._PS[_ind] = _obj;
        }
        else {
            ShopCarPage._PS.push(_obj);
        }
        ShopCarPage.saveToStorage();
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
    }
};

var DetailPage = {
    Pid:0,
    init: function () {
        DetailPage.Pid = request("id");
        DetailPage.Load();
    },
    Load: function () {
        $ajax({ fn: 106, pid: DetailPage.Pid }, DetailPage.Load_cb, true);
    },
    Load_cb: function (o) {
        if (o.Return == 0) {
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
            html = '<div class="title-bar"><h3>' + o.data.pName + '</h3><h6>' + o.data.desp + '</h6><div class="price-row"><div class="price-col"><em>' + o.data.price + '</em><s>' + o.data.mPrice + '</s></div><div class="num-col">库存:' + o.data.storeNum + '</div></div></div>'
            $('.detail-info').append(html);
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
        }
    },
};

var ListPage = {
    PageNo:1,
    init: function() {
        ListPage.LoadProductList();
    },
    LoadProductList: function () {
        $ajax({ fn: 102, pid: request("sid"), page: ListPage.PageNo }, ListPage.LoadProductList_cb, true); 
    },
    LoadProductList_cb: function (o) {
        if ($(".weui-loadmore").length > 0) {
            $(".weui-loadmore").remove();
        }
        if (o.Return == 0 && o.data.length>0) {
            $(o.data).each(function (i, _o) {
                var imgUrl = _o.imgUrl.split('@')[0];
                var html = '<li data-id="' + _o.id + '"><img src="' + BASE_URL + imgUrl + '" />';
                html += '<h4>' + _o.pName + '</h4><h5>' + _o.desp + '</h5>';
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

            $(".product-list ul li img,h4,.info-bar>.desp-col").on("click", function() { $go("detail.aspx?id=" + $(this).parents("li").attr("data-id")); });
            $(".info-bar>.icon-col").on("click", ListPage.AddProductToCar);
        }
        else {
            var html = '<div style="margin-top:15rem;" class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips" >暂无产品，点击刷新</span></div>';
            $(".product-list").append(html);
            $(".weui-loadmore__tips").on("click", ListPage.LoadProductList);
        }
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
                $go("list.aspx?sid=" + $(this).attr("data-id"));
            })
        }
    }
};

var IndexPage = {
    PDATA:[],
    init: function () {
        CheckWechatUserInfo();
        IndexPage.LoadBanner();
        IndexPage.LoadSubject();
        IndexPage.LoadVipProduct();
        IndexPage.LoadActiveProduct();
        IndexPage.LoadTopProduct();
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
                html += '<div class="info-bar"><div class="desp-col"><em>￥' + _o.price + '</em><s>￥' + _o.mPrice + '</s></div>';
                html += '<div class="icon-col"><i class="icon iconfont icon-shopcart10"></i></div></div></li>';
                $(".product-top-list ul").append(html);
            });
            $(".product-top-list ul li img,h4,.info-bar>.desp-col").on("click", function() { $go("detail.aspx?id=" + $(this).parents("li").attr("data-id")); });
            $(".info-bar>.icon-col").on("click", IndexPage.AddProductToCar);
        }
    },
    AddProductToCar: function() {
        var id = $(this).parents("li").attr("data-id");
        var ind = $(this).parents("li").attr("data-ind");
        var obj = IndexPage.PDATA[ind];
        ShopCarPage.addToShopCar({ Id: obj.id, Cid: 0, Name: obj.pName, PhotoUrl: obj.imgUrl, Price: obj.price });
    },
    LoadActiveProduct: function () {
        $ajax({ fn: 102, type: 4 }, IndexPage.LoadActiveProduct_cb, true);
    },
    LoadActiveProduct_cb: function (o) {
        if (o.Return == 0 && o.data.length>0) {
            var html = '<div class="title-row">今日推荐</div>';            
            var data = o.data[0];
            var imgUrl = data.imgUrl.split('@')[0];
            html += '<img src="' + BASE_URL + imgUrl + '" />';
            html += '<div class="info-bar">'
            html += '<div class="left-col">' + data.pName + '<h6>' + data.desp + '</h6></div>'
            html += '<div class="right-col"><em>￥' + data.price +'</em><i class="icon iconfont icon-shopcart10"></i></div>'
            html += '</div>'
            $('.active-panel').append(html);
            $(".active-panel").on("click", function() {$go("detail.aspx?id="+data.id) });
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
                html += '<div class="swiper-slide"><a alt="' + _o.pName + '" href="detail.aspx?id=' + _o.id + '"><img src="' + BASE_URL + imgUrl + '" /></a></div>';
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
                    $go("subject.aspx");
                } else {
                    $go("list.aspx?sid=" + $(this).attr("data-id"));
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
            $(".vip-panel ul li").on("click", function () { $go("detail.aspx?id=" + data.id) });
        }
    }
};

$(document).ready(function () {
    SSJ.init();
});

function addTabBar() {
    var html = '<div class="weui-tabbar">';
    html += '<a href= "index.aspx" class="weui-tabbar__item" ><i class="icon iconfont icon-wxbzhuye weui-tabbar__icon"></i><p class="weui-tabbar__label">首页</p></a >';
    html += '<a href="subject.aspx" class="weui-tabbar__item"><i class="icon iconfont icon-all weui-tabbar__icon"></i><p class="weui-tabbar__label">分类</p></a>';
       //<span class="weui-badge weui-badge_dot" style="display:none;position: absolute;top: 0;right: -6px;"></span>
    html += '<a href="shopcar.aspx" class="weui-tabbar__item"><span style="display: inline-block;position: relative;"><i class="icon iconfont icon-cart weui-tabbar__icon"></i><span class="weui-badge" style="display:none; position: absolute;top: -2px;right: -13px;">0</span></span><p class="weui-tabbar__label">购物车</p></a>';
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
