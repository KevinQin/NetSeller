var SSJ = {};
var ajaxServerUrl = "/service/handler.ashx";
var ajaxBaseUrl = "/service/handler.ashx";
var PageName = "";
var BASE_URL = "http://ns.seascapeapp.cn/";

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
    init: function () {
        ShopCarPage.LoadList();
    },
    LoadList: function () {
        var list = [
            { Id: 1, Name: '奶油味爆米花 150g', Price: 12.90, Num: 2, PhotoUrl: 'images/p1-1.jpg' },
            { Id: 2, Name: '芒果干 120gx3袋', Price: 27.90, Num: 3, PhotoUrl: 'images/p1-2.jpg' },
        ];
        var FeePostLimit = 39;
        var html = '<div class="shopcar-list"><div class="info-bar"><h3>满' + FeePostLimit + '元免运费</h3><h6><span>已免运费</span><i class="icon iconfont icon-warning"></i></h6></div>'
        html += '<ul>'  
        var allPrice = 0,allNum=0;
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
        $(".price-info-col h6").text("总价：" + allPrice+"，优惠：0.00");
    },
};

var DetailPage = {
    init: function () {
        DetailPage.Load();
    },
    Load: function () {
        var obj = {
            Return: 0, data: {
                Id: 1,
                Name: '三只松鼠芒果干',
                Desp: '休闲零食蜜饯果脯果干风味小吃',
                Price: 69.0,
                RealPrice: 29.9,
                SellNum: 176956,
                MaxNum: 85,
                Content: "<img src='images/pd-1-1.jpg'/><img src='images/pd-1-2.jpg'/><img src='images/pd-1-3.jpg'/><img src='images/pd-1-4.jpg'/><img src='images/pd-1-5.jpg'/><img src='images/pd-1-6.jpg'/><img src='images/pd-1-7.jpg'/><img src='images/pd-1-8.jpg'/><img src='images/pd-1-9.jpg'/><img src='images/pd-1-10.jpg'/><img src='images/pd-1-11.jpg'/><img src='images/pd-1-12.jpg'/>",
                Params:"生产许可证编号：SC11834020305037<br/>产品标准号：GB/T10782<br/>厂名：三只松鼠股份有限公司<br/>厂址：安徽省芜湖市弋江区芜湖高新技术产业开发区久盛路8号;安徽省芜湖市弋江区高新开发区南区龙华厂房<br/>厂家联系方式：400-800-4900<br/>配料表：芒果、白砂糖、葡萄糖、玉米糖浆、麦芽糖浆、食用盐<br/>储藏方法：请置于阴凉干燥处<br/>保质期：360 天<br/>食品添加剂：柠檬酸、丙三醇、焦亚硫酸钠，食品用香料、香精<br/>净含量: 348g<br/>包装方式: 包装<br/>品牌: Three Squirrels/三只松鼠<br/>系列: 松鼠云果园-芒果干116gx3 袋装<br/>食品口味: 116gx3袋<br/>产地: 中国大陆<br/>省份: 安徽省",
                Subject: [{Id:1, Name: '116gx3袋', Price: 27.9 }, {Id:2, Name: '116gx6袋', Price: 51.9}],
                Comment: {
                    RatePeer: 4.9, List: [
                        { Id: 1, PhotoUrl: 'images/photo1.jpg',AddOn:'2017-08-21 11:09:08', Name: '汪***7', RateStar: 4, Msg: '包装精美，味道不错，价格有点小贵' },
                        { Id: 2, PhotoUrl: 'images/photo2.jpg', AddOn: '2017-08-21 11:09:08', Name: 'S***e', RateStar: 5, Msg: '满满一箱的东西，让人感觉特别爽呀。有很完备的开箱器，开壳器，还有收纳袋，总之还是很完美的。味道也很不错，虽然我就开了一部分东西尝了一下，哈哈哈，是一次非常愉快的购物哟，东西比较多，我就不一一评论了。' },
                        { Id: 3, PhotoUrl: 'images/photo3.jpg', AddOn: '2017-08-21 11:09:08', Name: 't***9', RateStar: 4, Msg: '特别喜欢，收到的时候就忍不住拆开来吃了，跟想象中的一样，没有想到还送了小礼物，客服的服务特别好，超级爱我家鼠南歌和鼠开怀，特别贴心，而且还很可爱，非常愉快的一次购物，聊天还总是忍不住想笑起来，特别开心' },
                        { Id: 4, PhotoUrl: 'images/photo4.jpg', AddOn: '2017-08-21 11:09:08', Name: '关***团', RateStar: 3, Msg: '物流很棒 发货还有短信通知 包装也超可爱！ 非常喜欢这个牌子的 一直力挺 请继续加油！ 现在尝试一下味道 亲们赶快下手吧 超棒棒耶必须好评呐呐 哇' },
                        { Id: 5, PhotoUrl: 'images/photo5.jpg', AddOn: '2017-08-21 11:09:08', Name: '渡***凡', RateStar: 4, Msg: '嗯……三天到货应该算快了吧……外包装有一点破损，不过不影响里面的东西，价格比超市的便宜，还准备了鼠小巾和果壳袋，很贴心呢～还有一个小胸针也很可爱啊' },
                    ]
                },
                PhotoUrl: ['images/p1-1.jpg', 'images/p1-2.jpg', 'images/p1-3.jpg', 'images/p1-4.jpg']
            }
        };
        DetailPage.Load_cb(obj);
    },
    Load_cb: function (o) {
        if (o.Return == 0) {
            var html = '<div class="swiper-wrapper">';
            var banner = o.data.PhotoUrl;
            $(banner).each(function (i, _o) {
                html += '<div class="swiper-slide"><img src="' + _o + '" /></div>';
            });
            html += '</div><div class="swiper-pagination"></div>';
            $(".swiper-container").append(html);
            var mySwiper = new Swiper('.swiper-container', {
                loop: true,
                autoplay: 5000,
                pagination: '.swiper-pagination'
            });
            //标题栏
            html = '<div class="title-bar"><h3>' + o.data.Name + '</h3><h6>' + o.data.Desp + '</h6><div class="price-row"><div class="price-col"><em>' + o.data.RealPrice + '</em><s>' + o.data.Price + '</s></div><div class="num-col">销量:' + o.data.SellNum + '</div></div></div>'
            $('.detail-info').append(html);
            //评价
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
            $('.detail-info').append(html);
            $('.detail-info').append('<p class="content">' + o.data.Content + '</p>');
            $('.detail-info').append('<div class="param-block"><h4>&nbsp;规格参数</h4><p>' + o.data.Params + '</p></div>');
            
        }
    },
};

var ListPage = {
    init: function() {
        ListPage.LoadProductList();
    },
    LoadProductList: function() {
        var obj = {
            Return: 0, data: [
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' }
            ]
        };
        ListPage.LoadProductList_cb(obj);
    },
    LoadProductList_cb: function(o) {
        if (o.Return == 0) {
            $(o.data).each(function(i, _o) {
                var html = '<li data-id="' + _o.Id + '"><img src="' + _o.PhotoUrl + '" />';
                html += '<h4>' + _o.Desp + '</h4>';
                html += '<div class="info-bar"><div class="desp-col">' + _o.Name + '<br/><em>￥' + _o.RealPrice + '</em><s>￥' + _o.Price + '</s></div>';
                html += '<div class="icon-col"><i class="icon iconfont icon-shopcart10"></i></div></div></li>';
                $(".product-list ul").append(html);
            });
            $(".product-list ul li img,h4,.info-bar>.desp-col").on("click", function() { $go("detail.aspx?id=" + $(this).parents("li").attr("data-id")); });
            $(".info-bar>.icon-col").on("click", ListPage.AddProductToCar);
        }
    }
};

var SubjectPage = {
    init: function () {
        SubjectPage.Load();
    },
    Load: function () {
        var obj = {
            Return: 0, data: [
                { Id: 1, Name: '水果', Icon: 'icon-iconfontshipin' },
                { Id: 2, Name: '母婴', Icon: 'icon-iconfonttongzhuangmuying' },
                { Id: 3, Name: '鞋帽', Icon: 'icon-iconfontxiebaopeishi' },
                { Id: 4, Name: '宠物', Icon: 'icon-iconfontgongyichongwu' },
                { Id: 5, Name: '衣服', Icon: 'icon-iconfontfuzhuangneiyi' },
                { Id: 6, Name: '电器', Icon: 'icon-iconfontdiangongdianqi' },
                { Id: 7, Name: '美妆', Icon: 'icon-iconfontmeizhuangrihua' }
            ]
        };
        SubjectPage.Load_cb(obj); SubjectPage.Load_cb(obj); SubjectPage.Load_cb(obj);
    },
    Load_cb: function (o) {
        if (o.Return == 0) {
            var bgcolor = ['64c333', 'fa5c5c', '6347ed', 'f7a831', '3bc7b0', '427def','e54077'];
            $(o.data).each(function (i, _o) {
                var html = '<li data-id="'+ _o.Id +'"><i class="icon iconfont '+ _o.Icon +'"  style= "background-color:#'+ bgcolor[i%7] +';" ></i ><h5>'+ _o.Name +'</h5></li>'
                $("ul").append(html);
            });
            $("li").on("click", function () {
                $go("list.aspx?sid=" + $(this).attr("data-id"));
            })
        }
    }
};

var IndexPage = {
    init: function () {
        IndexPage.LoadBanner();
        IndexPage.LoadSubject();
        IndexPage.LoadActiveProduct();
        IndexPage.LoadTopProduct();
    },
    LoadTopProduct: function() {
        var obj = {
            Return: 0, data: [
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' },
                { Id: 10, Name: '芒果干116g x 3袋', Desp: '为芒果干而生的优质品种', PhotoUrl: 'images/p1.jpg', Price: '69.0', RealPrice: '28.9' }
            ]
        };
        IndexPage.LoadTopProduct_cb(obj);
    },
    LoadTopProduct_cb: function(o) {
        if (o.Return == 0) {
            $(o.data).each(function(i, _o) {
                var html = '<li data-id="' + _o.Id + '"><img src="' + _o.PhotoUrl + '" />';
                html += '<h4>' + _o.Desp + '</h4>';
                html += '<div class="info-bar"><div class="desp-col">' + _o.Name + '<br/><em>￥' + _o.RealPrice + '</em><s>￥' + _o.Price + '</s></div>';
                html += '<div class="icon-col"><i class="icon iconfont icon-shopcart10"></i></div></div></li>';
                $(".product-top-list ul").append(html);
            });
            $(".product-top-list ul li img,h4,.info-bar>.desp-col").on("click", function() { $go("detail.aspx?id=" + $(this).parents("li").attr("data-id")); });
            $(".info-bar>.icon-col").on("click", IndexPage.AddProductToCar);
        }
    },
    AddProductToCar: function() {
        var id = $(this).parents("li").attr("data-id");
        alert("add to shopcar ["+ id +"]")
    },
    LoadActiveProduct: function () {
        var obj = { Return: 0, data: { Id: 9, Name: '芒果干120gx3袋', Desp: '爆卖1000万 吃出大鲜芒的味道', Price: '27.9', PhotoUrl: 'images/active.jpg' } };
        IndexPage.LoadActiveProduct_cb(obj);
    },
    LoadActiveProduct_cb: function(o) {
        if (o.Return == 0) {
            var html = '<div class="title-bar">今日推荐</div>';
            html += '<img src="' + o.data.PhotoUrl + '" />';
            html += '<div class="info-bar">'
            html += '<div class="left-col">' + o.data.Name + '<h6>' + o.data.Desp + '</h6></div>'
            html += '<div class="right-col">￥' + o.data.Price +'</div>'
            html += ' </div>'
            $('.active-panel').append(html);
            $(".active-panel").on("click", function() {$go("detail.aspx?id="+o.data.Id) });
        }
    },
    LoadBanner: function () {
        var obj = {
            Return: 0, data: [{ Id: 1, Name: '香辣鱼尾鱼排', Url: 'images/ad-01.jpg' },
            { Id: 2, Name: '卤鸭掌', Url: 'images/ad-02.jpg' },
            { Id: 3, Name: '味芝元鱼棒', Url: 'images/ad-03.jpg' },
            { Id: 4, Name: '蒙自石榴', Url: 'images/ad-04.jpg' },
            ]
        };
        IndexPage.LoadBanner_cb(obj);
    },
    LoadBanner_cb: function (o) {
        if (o.Return == 0) {
            var html = '<div class="swiper-wrapper">';
            $(o.data).each(function (i, _o) {
                html += '<div class="swiper-slide"><a alt="' + _o.Name + '" href="detail.aspx?id=' + _o.Id + '"><img src="' + _o.Url + '" /></a></div>';
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
        var obj = {
            Return: 0, data: [
                { Id: 1, Name: '水果', Icon: 'icon-iconfontshipin' },
                { Id: 2, Name: '母婴', Icon: 'icon-iconfonttongzhuangmuying' },
                { Id: 3, Name: '鞋帽', Icon: 'icon-iconfontxiebaopeishi' },
                { Id: 4, Name: '宠物', Icon: 'icon-iconfontgongyichongwu' },
                { Id: 5, Name: '衣服', Icon: 'icon-iconfontfuzhuangneiyi' },
                { Id: 6, Name: '电器', Icon: 'icon-iconfontdiangongdianqi' },
                { Id: 7, Name: '美妆', Icon: 'icon-iconfontmeizhuangrihua' }
            ]
        };
        IndexPage.LoadSubject_cb(obj); 
    },
    LoadSubject_cb: function (o) {
        if (o.Return == 0) {
            var bgcolor = ['64c333', 'fa5c5c', '6347ed', 'f7a831', '3bc7b0', '427def', 'e54077'];
            $(o.data).each(function (i, _o) {
                var html = '<div class="category__item" data-id="' + _o.Id + '"><i class="icon iconfont ' + _o.Icon + '"  style= "background-color:#' + bgcolor[i % 7] + ';" ></i ><h5>' + _o.Name + '</h5></div>'
                $(".category-area").append(html);
            });
            var html = '<div class="category__item" data-id="0"><i class="icon iconfont icon-all1"  style= "background-color:#dedede;" ></i ><h5>更多</h5></div>'
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
            if (controlId == 1001) {
                _DRP.hide();                
            } else if (controlId == 1002) {
                CityPiacker.hide();
            } else if (controlId == 1003 || controlId == 1004) {
                $(".hotel-keyword-picker").hide();           
            }
            $(".page").show();
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
