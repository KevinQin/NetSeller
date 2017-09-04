<%@ Page Language="VB" AutoEventWireup="false" CodeFile="List.aspx.vb" Inherits="app_List" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>商品列表</title>
    <link rel="stylesheet" href="//r.edmp.cc/weui/weui.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/animate/animate.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/swiper/swiper-3.4.0.min.css" />
    <link rel="stylesheet" href="style/iconfont.css" />
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server"></form>    
    <div class="container">
        <div class="page detail-page tabbar js_show">
            <div class="page__hd">
                <div class="search-bar">
                    <input type="text" placeholder="喜欢的商品" value="" id="txtKeyWord" />
                    <a href="javascript:;">搜索</a>
                </div>
            </div>
            <div class="page__bd" style="height:100%;">
                <div class="product-list"><ul></ul></div>
            </div> 
            <div class="shopCarIcon">
                <i class="icon iconfont icon-shopcart10"></i>
                <span class="weui-badge" style="position: absolute;top: -.4em;right: 0;">8</span>
            </div>
        </div>       
    </div>
</body>
<script src="//r.edmp.cc/jquery/jquery-2.2.3.min.js"></script>
<script src="//r.edmp.cc/jquerycookie/jquery.cookie.js"></script>
<script src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script src="//r.edmp.cc/weui/weui.min.js"></script>
<script src="//r.edmp.cc/swiper/swiper-3.4.0.jquery.min.js"></script>
<script src="//r.edmp.cc/seascape/dateclass.js"></script>
<script src="//r.edmp.cc/seascape/common.js"></script>
<script src="script/seller.js"></script>
<script src="script/WeChat.js"></script>
</html>


