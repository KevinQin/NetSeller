<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Cash.aspx.cs" Inherits="app_Cash" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>收银台</title>
    <link rel="stylesheet" href="//r.edmp.cc/weui/weui.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/animate/animate.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/swiper/swiper-3.4.0.min.css" />
    <link rel="stylesheet" href="style/iconfont.css" />
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server"></form>    
    <div class="container">
        <div class="page detail-page js_show">
            <div class="page__bd" style="margin-top:0;">  
                <div class="weui-cells__title">
                    <div class="title">收货地址</div>
                    <i class="icon iconfont icon-add1" id="btnWechatAddress"></i>
                </div>
                <div class="weui-cells weui-cells_form">                    
                    <div class="weui-cell">
                        <div class="weui-cell__hd">姓名:</div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" required="required" type="text" id="txtName" placeholder="填写收货人姓名"/>
                        </div>
                    </div>
                    <div class="weui-cell">
                         <div class="weui-cell__hd">电话:</div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="text" id="txtMobile" required="required" pattern="[0-9]{11}" placeholder="填写可用的联系电话"/>
                        </div>
                    </div>                     
                    <div class="weui-cell">  
                        <div class="weui-cell__hd">城市:</div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="text" required="required" id="txtCity" placeholder="选择所在城市"/>
                        </div>              
                    </div>
                    <div class="weui-cell">
                        <div class="weui-cell__hd">地址:</div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="text" id="txtAddress" required="required" pattern="\w{5,}" placeholder="填写详情地址"/>
                        </div>              
                    </div>
                     <div class="weui-cell">    
                         <div class="weui-cell__hd">备注:</div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="text" id="txtMemo"  placeholder="您的其它什么要求"/>
                        </div>              
                    </div>
                </div>
                <div class="weui-cells__title">商品信息</div>
                 <div class="shop-list">
                 </div>  
            </div>
            <div class="page__ft">
                <div class="price-info-col">
                    <span>总计：</span><em>-</em>
                    <h6>免运费</h6>
                </div>
                <div class="block-btn-col" id="btnToCash" style="padding-top:.5rem;background-color:#e64340;" >
                    <h4>去付款</h4>
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
