<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ShareProduct.aspx.cs" Inherits="app_ShareProduct" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>评价晒单</title>
    <link rel="stylesheet" href="//r.edmp.cc/weui/weui.min.css"/>
    <link rel="stylesheet" href="//r.edmp.cc/animate/animate.min.css"/>
    <link rel="stylesheet" href="style/iconfont.css" />
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server"></form>    
    <div class="container">
        <div class="page order-page js_show">
            <div class="page__bd comment-bd">
                <div class="point-row">
                    <div class="img-h-col">
                        <img id="imgPro" src="images/def.gif" />
                    </div>
                    <div class="point-col">
                        <h4>评分</h4>
                        <div class="point-items">                            
                        </div>
                    </div>
                </div>
                <div class="content-area">
                    <textarea class="weui-input" id="txtContent" placeholder="请输入您的评价信息"></textarea>                    
                </div>
                <div class="pic-area">
                    <div class="img-col" id="btnCamera" style="display:none;">
                        <i class="iconfont icon-iconfontshumajiadian"></i>
                    </div>
                </div>
                <div class="btn-row">
                    <button type="button" id="btnOK" class="weui-btn weui-btn_warn">提交</button>
                </div>
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