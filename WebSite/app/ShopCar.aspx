<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ShopCar.aspx.cs" Inherits="app_ShopCar" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>购物车</title>
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
                <div class="stand-bar">
                    <div class="back-col"></div>
                    <div class="title-col">购物车</div>
                    <div class="icon-col">编辑</div>
                </div>
            </div>
            <div class="page__bd" style="margin-top:2.5rem;">
                <div class="blank-shop"></div>                
            </div>
            <div class="page__ft">
                <div class="check-col weui-cells_checkbox">
                    <label class="weui-cell weui-check__label" for="chkAll">
                        <div class="weui-cell__hd">
                            <input type="checkbox" name="chkAll" class="weui-check" id="chkAll">
                            <i class="weui-icon-checked"></i>
                        </div>
                        <div class="weui-cell__bd">
                            <p>全选</p>
                        </div>
                    </label>
                </div>
                <div class="price-info-col">
                    <span>应付：</span><em>-</em>
                    <h6>总价：-，优惠：-</h6>
                </div>
                <div class="block-btn-col">
                    <h4>去结算</h4><span>共-件</span>
                </div>
                <div class="btn-col" style="display:none;">                    
                    <button id="btnToCash" class="weui-btn weui-btn_mini weui-btn_warn">删除</button>
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
