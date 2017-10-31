<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Detail.aspx.cs" Inherits="app_Detail" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>商品详情</title>
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
            <div class="page__bd" style="margin-top:0;">  
                <div class="swiper-container swiper-container-p"></div>
                <div class="detail-info"></div>
            </div>
            <div class="page__ft">
                <div class="cart-col">
                    <i class="icon iconfont icon-shopcart10"></i>
                    <span class="weui-badge" style="display:none;"></span>
                </div>
                <div class="fav-col" style="display:none;">
                     <i class="icon iconfont icon-favorite"></i>
                </div>
                <div class="btn-col">
                    <button id="btnAddToCart" class="weui-btn weui-btn_mini weui-btn_plain-primary">加入购物车</button>
                    <button id="btnToCash" class="weui-btn weui-btn_mini weui-btn_warn">立即购买</button>
                </div>
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