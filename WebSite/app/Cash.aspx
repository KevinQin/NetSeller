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
                    <div id="addrTip" style="display:none; color:#e64340;font-size:.8rem;padding:.3rem .8rem;">提示：西藏、新疆、内蒙暂不发货</div>
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
                    <div class="weui-cell" style="padding-top:0;padding-bottom:0;">
                        <div class="weui-cell__hd">地址:</div>
                        <div class="weui-cell__bd">
                            <textarea class="weui-input" id="txtAddress" required="required" pattern="\w{5,}" placeholder="填写详情地址"></textarea>
                        </div>              
                    </div>
                     <div class="weui-cell" style="padding-top:0;padding-bottom:0;">    
                         <div class="weui-cell__hd">备注:</div>
                        <div class="weui-cell__bd">
                            <textarea class="weui-input" id="txtMemo" placeholder="您的其它什么要求"></textarea>
                        </div>              
                    </div>
                </div>
                <div id="goldTitle" class="weui-cells__title" style="display:none;">
                    <div class="title">可用优惠</div>
                    <i style="font-style:normal;color:#e64340;" id="goldTip">共有-个金币</i>      
                </div>
                <div id="goldForm" class="weui-cells weui-cells_form"  style="display:none;">
                    <div class="weui-cell weui-cell_switch">
                        <div class="weui-cell__bd" style="font-size:11pt;color:#000;">使用金币抵扣</div>
                        <div class="weui-cell__ft">
                            <input class="weui-switch" id="chkUseGold" type="checkbox"/>
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
                <div class="block-btn-col" id="btnToCash" style="padding-top:.5rem;background-color:#d8d8d8" >
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
<script src="script/citydata.js"></script>
<script src="script/seller.js"></script>
<script src="script/WeChat.js"></script>
</html>
