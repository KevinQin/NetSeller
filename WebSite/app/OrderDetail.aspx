<%@ Page Language="C#" AutoEventWireup="true" CodeFile="OrderDetail.aspx.cs" Inherits="app_OrderDetail" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>订单详情</title>
    <link rel="stylesheet" href="//r.edmp.cc/weui/weui.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/animate/animate.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/swiper/swiper-3.4.0.min.css" />
    <link rel="stylesheet" href="style/iconfont.css" />
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server"></form>    
    <div class="container">
        <div class="page order-page js_show">
            <div class="page__bd order-detail">
                <div class="state-bar"></div>
                <div class="address-bar">
                    <div class="icon-col"><i class="iconfont icon-map"></i></div>
                    <div class="info-col"><h4></h4><h6></h6></div>
                </div>
                <div class="product-list">
                    <div class="list-title-bar">
                        <i class="iconfont icon-viewlist"></i> 商品信息
                    </div>
                    <ul></ul>
                </div>
                <div class="order-info"></div>
                <div class="price-panel"></div>
                <div class="log-panel"></div>
            </div>
            <div class="page__ft_detail">
                <div class="left-col">
                    <a href="orderlist.aspx">更多订单</a>
                    <span id="btnDelete">删除订单</span>
                </div>
                <div class="right-col">
                    <button type="button" class="weui-btn weui-btn_mini weui-btn_plain-primary" id="btnPay">立即支付</button>
                    <button type="button" class="weui-btn weui-btn_mini weui-btn_plain-primary" id="btnConform">确认收货</button>
                    <button type="button" class="weui-btn weui-btn_mini weui-btn_plain-default" id="btnCancel">取消订单</button>
                    <button type="button" class="weui-btn weui-btn_mini weui-btn_plain-default" id="btnShare">评价晒单</button>
                    <button type="button" class="weui-btn weui-btn_mini weui-btn_plain-default" id="btnBuyAgain">再次购买</button>                    
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