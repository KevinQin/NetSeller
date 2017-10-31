<%@ Page Language="C#" AutoEventWireup="true" CodeFile="GetCash.aspx.cs" Inherits="app_GetCash" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>申请提现</title>
    <link rel="stylesheet" href="//r.edmp.cc/weui/weui.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/animate/animate.min.css"/>
    <link rel="stylesheet" href="style/iconfont.css" />
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
   <form id="frmEdit" runat="server">
    <div class="container">
        <div class="page register-page js_show">
            <div class="page__bd"  >                
                <div class="weui-cells__title">
                    <div class="title">提现账户</div>
                    <i class="icon iconfont icon-edit" id="btnEditInfo"></i>
                </div>
                <div class="weui-cells weui-cells_form"> 
                     <div class="weui-cell">   
                        <div class="weui-cell__hd">
                            账户：
                        </div>
                        <div class="weui-cell__bd">
                            <span id="txtBankName"></span>
                        </div>
                    </div>
                     <div class="weui-cell">                        
                        <div class="weui-cell__hd">
                            户名：
                        </div>
                        <div class="weui-cell__bd">
                            <span id="txtName"></span>
                        </div>
                    </div>
                    <div class="weui-cell">                       
                       <div class="weui-cell__hd">
                            账号：
                        </div>
                        <div class="weui-cell__bd">
                            <span  id="txtCardNo"></span>
                        </div>
                    </div>   
                </div>
                <div class="weui-cells__title">当前可提现<span>-</span>元</div>
                <div class="weui-cells weui-cells_form"> 
                    <div class="weui-cell"> 
                         <div class="weui-cell__hd">
                            金额：
                        </div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="tel" required="required" id="txtPrice" placeholder="填写提现金额"/>
                        </div>
                    </div>
                     <div class="weui-cell weui-cell_vcode">
                         <div class="weui-cell__hd">
                            手机：
                        </div>
                        <div class="weui-cell__bd">
                         <span id="txtMobile"></span>
                        </div>
                        <div class="weui-cell__ft">
                            <button type="button" class="weui-vcode-btn" id="btnGetCode" style="font-size:1rem;">获取验证码</button>
                        </div>
                    </div>
                     <div class="weui-cell"> 
                         <div class="weui-cell__hd">
                            验证码：
                        </div>
                        <div class="weui-cell__bd">
                            <input class="weui-input" type="text" required="required" id="txtCode" placeholder="填写验证码"/>
                        </div>
                    </div>
                   </div>                
                <div class="btn-row">                    
                    <a href="javascript:;" id="btnOk" class="weui-btn weui-btn_plain-primary weui-btn_plain-disabled">确定</a>
                    <a href="javascript:;" id="btnCancel" class="weui-btn weui-btn_default">取消</a>
                </div>
            </div>
        </div>
     </div>
   </form>
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
