<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Pay.aspx.cs" Inherits="app_Pay" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="format-detection" content="telephone=no" />
    <title>收银台</title>
    <link rel="stylesheet" href="//r.edmp.cc/weui/weui.min.css" />
    <link rel="stylesheet" href="//r.edmp.cc/animate/animate.min.css" />
    <link rel="stylesheet" href="//r.edmp.cc/swiper/swiper-3.4.0.min.css" />
    <link rel="stylesheet" href="style/iconfont.css" />
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server"></form>
    <div class="container">
        <div class="page detail-page js_show">
            <div class="page__hd" style="background-color:#fafafa;margin-top:5rem;">
                <h1 class="page__title" style="font-size:1.4em;padding-bottom:1rem;">订单支付</h1>
            </div>
            <div class="page__bd" style="margin-top:8rem;">
                <div class="weui-form-preview">
                    <div class="weui-form-preview__hd">
                        <label class="weui-form-preview__label">付款金额</label>
                        <em class="weui-form-preview__value" id="txtPrice">-</em>
                    </div>
                    <div class="weui-form-preview__bd">
                        <div class="weui-form-preview__item">
                            <label class="weui-form-preview__label">商品</label>
                            <span class="weui-form-preview__value" id="txtProduct">-</span>
                        </div>
                        <div class="weui-form-preview__item">
                            <label class="weui-form-preview__label">订单号</label>
                            <span class="weui-form-preview__value" id="txtOrderno">-</span>
                        </div>
                        <div class="weui-form-preview__item">
                            <label class="weui-form-preview__label">收款方</label>
                            <span class="weui-form-preview__value"  id="txtCompany">-</span>
                        </div>
                    </div>
                    <div class="weui-form-preview__ft" style="display:none;">
                        <a class="weui-form-preview__btn weui-form-preview__btn_default" href="javascript:">辅助操作</a>
                        <button type="submit" class="weui-form-preview__btn weui-form-preview__btn_primary" href="javascript:">操作</button>
                    </div>
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
