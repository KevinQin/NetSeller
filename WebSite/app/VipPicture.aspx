<%@ Page Language="C#" AutoEventWireup="true" CodeFile="VipPicture.aspx.cs" Inherits="app_VipPicture" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>代言人海报</title>
    <link rel="stylesheet" href="//r.edmp.cc/weui/weui.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/animate/animate.min.css"/>
    <link rel="stylesheet" href="style/iconfont.css" />
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
   <form id="form1" runat="server"></form>
    <div class="container">
        <div class="page uc-page js_show">
            <div class="page__bd" style="height:100%;" >
                <div class="tip-page">
                    <ul>
                        <li><i class="iconfont icon-help"></i>&nbsp;关于VIP会员</li>
                        <li>为什么要成为VIP会员？<p>1、VIP会员可以购买VIP特权商品，价格更优惠。<br/>2、好友购物有返佣，返佣可直接购买商品或提现。</p></li>
                        <li>怎么成为VIP会员？<p>打开相应海报，长按保存至手机，分享到朋友圈或发送给好友，好友通过海报二唯码关注公众号。成功添加9个好友，即可升级为VIP会员。</p></li>
                        <li>
                            <div class="weui-cells weui-cells_checkbox">
                                <label class="weui-cell weui-check__label" for="chkRemember">
                                    <div class="weui-cell__hd">
                                        <input type="checkbox" class="weui-check" name="chkRemember" id="chkRemember">
                                        <i class="weui-icon-checked"></i>
                                    </div>
                                    <div class="weui-cell__bd">
                                        <p>不再显示</p>
                                    </div>
                                </label>
                            </div>
                        </li>
                        <li>
                            <div style="padding:1rem 2rem;">
                                <a href="javascript:;" id="btnKnow" class="weui-btn weui-btn_plain-primary">我知道了</a>
                            </div>                            
                        </li>
                    </ul>
                </div>
                <ul class="pic-list">

                </ul>
            </div>
        </div>
     </div>
</body>
<script src="//r.edmp.cc/jquery/jquery-2.2.3.min.js"></script>
<script src="//r.edmp.cc/jquerycookie/jquery.cookie.js"></script>
<script src="//res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script src="//r.edmp.cc/weui/weui.min.js"></script>
<script src="//r.edmp.cc/seascape/dateclass.js"></script>
<script src="//r.edmp.cc/seascape/common.js"></script>
<script src="script/seller.js"></script>
<script src="script/WeChat.js"></script>
</html>
