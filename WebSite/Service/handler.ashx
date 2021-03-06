﻿<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Seascape.Model;
using Seascape.Model.View;
using Seascape.Model.WebView;
using Seascape.Data;
using Seascape.Data.WebView;
using Seascape.Data.Tmessage;
using LitJson;
using System.Collections.Generic;
using com.seascape.tools;
using Seascape.WxApi;
using System.Text;

public class Handler : IHttpHandler {

    //微信支付商户
    public static string mch_id = com.seascape.tools.BasicTool.GetConfigPara("mch_id");
    //微信支付接收返回地址
    public static string notify_url = com.seascape.tools.BasicTool.GetConfigPara("notify_url");
    //微信支付提交服务器IP
    public static string client_ip = com.seascape.tools.BasicTool.GetConfigPara("client_ip");
    //微信支付密钥
    public static string keyValue = com.seascape.tools.BasicTool.GetConfigPara("keyValue");
    public static string HjKeyValue = "Seascape.Fast.Fix";

    //微信公众号相关
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret");    
    
    //分页大小
    public static int perPage = 10;
    public static string BaseUrl = "http://s.seascapeapp.cn/app/";
    
    //成为VIP会员要有的好友数
    public static int vipUserNum = 9;

    public static string DefaultOpenId = "100";
    public static string _orderNo = "";
    public static Response response;
    public static Double FyRadio = 0.1;
    public static Double FyRadio_FX = 0.2;

    public void ProcessRequest (HttpContext c) {
        response = new Response();
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        _orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        Comm.AddQueryLog(c);
        c.Response.ContentType = "text/plain";
        c.Response.Write(GetResult(F, c));
    }

    
    /// <summary>
    /// 功能导航
    /// </summary>
    /// <param name="f"></param>
    /// <returns></returns>
    public string GetResult(int f, HttpContext c)
    {
        string Result = Sys_Result.GetR(1, "System Exception[" + f + "]");
        try
        {
            switch (f)
            {
                case 1:
                    Result = getOpenId(c);//获取OPENID
                    break;
                case 2:
                    Result = getMember(c);//获取会员信息
                    break;
                case 3:
                    Result = GetAddrInfo(c);//获取常用地址列表
                    break;
                case 4:
                    Result = AddAddr(c);//添加常用地址
                    break;
                case 5:
                    Result = DelAddr(c);//删除常用地址
                    break;
                case 11:
                    Result = AddEvaluate(c);//添加评价
                    break;            
                case 12:
                    Result = GetEvalueateList(c);//获取评价列表
                    break;
                case 15:
                    Result = AddComplaint(c);//添加投诉
                    break;
                case 19:
                    Result = GetActiveNum(c);//获取活动情况
                    break;
                case 21:
                    Result = GetOrderInfoForId(c);//通过订单编号获取订单详情
                    break;
                case 23:
                    Result = BindUserMobile(c);//绑定用户手机号码
                    break;
                case 96:
                    Result = CreateCode(c);//用户二维码生成
                    break;
                case 98:
                    Result = InitMenu(c);//初始化菜单
                    break;
                case 99:
                    Result = GetPayInfo(c);//获取支付相关信息
                    break;
                case 100:
                    Result = WxConfig(c);//微信Config
                    break;
                case 101:
                    Result = GetClass(c);//获取分类列表
                    break;
                case 102:
                    Result = GetProductList(c);//获取产品列表
                    break;
                case 103:
                    Result = AddOrder(c);//添加订单
                    break;
                case 104:
                    Result = GetOrderList(c);//获取订单列表
                    break;
                case 105:
                    Result = GetOrderInfo(c);//获取订单详情
                    break;
                case 106:
                    Result = GetProductInfo(c);//获取产品详情
                    break;
                case 107:
                    Result = UpdateOrder(c);//修改订单状态
                    break;
                case 108:
                    Result = GetUnitPrice(c);//获取库存价格列表
                    break;
                case 109:
                    Result = GetPostPrice(c);//获取运费方案
                    break;
                case 110:
                    Result = GetUseCoin(c);//获取可用余额
                    break;
                case 111:
                    Result = GetCoinList(c);//获取佣金列表
                    break;
                case 112:
                    Result = GetUserList(c);//获取好友列表
                    break;
                case 113:
                    Result = GetHbList(c);//获取代言人海报列表
                    break;
                case 114:
                    Result = CreateHb(c);//生成海报
                    break;
                case 115:
                    Result = SendHb(c);//发送海报
                    break;
                case 116:
                    Result = GetUserCount(c);//获取好友人数和成为VIP会员的要求
                    break;
                case 117:
                    Result = GetUserCoin(c);//获取用户佣金数量
                    break;
                case 118:
                    Result = ToCash(c);//申请提现
                    break;
                case 119:
                    Result = operUserBank(c);//添加修改用户银行卡
                    break;
                case 120:
                    Result = GetUserBank(c);//获取用户银行卡信息
                    break;
                case 121:
                    Result = SendSmsCode(c);//获取短信验证码
                    break;
                case 122:
                    Result = GetContentList(c);//获取广告列表
                    break;
                case 123:
                    Result = GetContentInfo(c);//获取广告详情
                    break;
                case 124:
                    Result = SaleService(c);//售后服务
                    break;
            }
        }
        catch(Exception e)
        {
            Result = response.Fail(e.Message.ToString());
        }
        new Main().AddTestLog_B("[M]Result-"+f, Result.ToString());
        return Result;
    }

    
    /// <summary>
    /// 通过Code获取OpenID
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getOpenId(HttpContext c)
    {
        string code = string.IsNullOrEmpty(c.Request["code"]) ? "" : c.Request["code"].ToString();
        //string source = string.IsNullOrEmpty(c.Request["source"]) ? "" : c.Request["source"].ToString();
        new Main().AddTestLog("code", code);
        Common.appid = appid;
        Common.secret = secret;
        access_token_UserInfo at = Common.Get_access_token_UserInfo(code);
        if (!string.IsNullOrEmpty(at.openid))
        {
            new Main().AddTestLog("openid", at.openid);
            {
                //------------------写用户------------------
                user u = new _User().GetUser(at.openid, "", 0);
                if (u != null)
                {
                }
                else
                {
                    u = new user();
                    string r = "";
                    UserInfo ui = UserInfo.getUserInfoByCode(at.access_token, at.openid, out r);
                    new Main().AddTestLog("r", r);
                    if (ui != null && !string.IsNullOrEmpty(ui.nickname))
                    {
                        //source = source.Replace("i", "1");
                        u.nickName = ui.nickname.Replace("'", "").Replace(@"""", "");
                        u.photoUrl = ui.headimgurl;
                        u.area = ui.country + "|" + ui.province + "|" + ui.city;
                        u.sex = ui.sex;
                        u.openId = ui.openid;
                        //u.source = source;
                        u.mobile = "";
                        u.contact = "";
                        u.addOn = DateTime.Now;
                        new Main().AddToDb(u, "t_user");
                    }
                }
            }
            //------------------------------------------

            //return Sys_Result.GetR(0, at.openid);
            return response.Success(at.openid);
        }
        else
        {
            new Main().AddTestLog("openid", at.errcode.ToString());
            //return Sys_Result.GetR(1, at.errcode.ToString());
            return response.Fail(at.errcode.ToString());
        }
    }


    /// <summary>
    /// 获取用户信息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string getMember(HttpContext c)
    {
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        //string source = string.IsNullOrEmpty(c.Request["source"]) ? "" : c.Request["source"].ToString();
        if (openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                //var o = new { Return = 0, Msg = "", data = u };
                //return LitJson.JsonMapper.ToJson(o);
                return response.Success(u);
                
            }
            else
            {
                u = new user();
                string r = "";
                UserInfo ui = UserInfo.getUserInfoByGlobal(Comm.Get_Access_Token(c), openId, out r);
                new Main().AddTestLog("r", r);
                if (ui != null && !string.IsNullOrEmpty(ui.nickname))
                {
                    u.nickName = ui.nickname.Replace("'", "").Replace(@"""", "");
                    u.photoUrl = ui.headimgurl;
                    u.area = ui.country + "|" + ui.province + "|" + ui.city;
                    u.sex = ui.sex;
                    u.openId = ui.openid;
                    //u.source = source;
                    u.mobile = "";
                    u.contact = "";
                    u.addOn = DateTime.Now;
                    //var o = new { Return = 0, Msg = "", Data = u };
                    new Main().AddToDb(u, "t_user");
                    return response.Success(u);
                }
                else
                {
                    //var o = new { Return = 0, Msg = "",Data = u };
                    return response.Success(u);
                }
            }
        }
        return response.Fail("");
    }

        
    /// <summary>
    /// 微信认证
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string WxConfig(HttpContext c)
    {
        Common.WxConfig w = InitJsApi(c);
        if (w != null)
        {
            return w.signature + "|" + w.timestamp + "|" + w.nonce + "|" + w.appid;
        }
        else
        {
            return "";
        }
    }


    
    /// <summary>
    /// 保存订单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddOrder(HttpContext c)
    {
        //用户信息
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt16(c.Request["uid"].ToString());
        int oType = string.IsNullOrEmpty(c.Request["oType"]) ? 0 : Convert.ToInt16(c.Request["oType"].ToString());
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        string tel = string.IsNullOrEmpty(c.Request["tel"]) ? "" : c.Request["tel"].ToString();
        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        string addr = string.IsNullOrEmpty(c.Request["addr"]) ? "" : c.Request["addr"].ToString();
        string memo = string.IsNullOrEmpty(c.Request["memo"]) ? "" : c.Request["memo"].ToString();

        //产品信息
        Double price = string.IsNullOrEmpty(c.Request["allPrice"]) ? 0 : Convert.ToDouble(c.Request["allPrice"].ToString());
        Double subPrice = string.IsNullOrEmpty(c.Request["subPrice"]) ? 0 : Convert.ToDouble(c.Request["subPrice"].ToString());
        Double postFee = string.IsNullOrEmpty(c.Request["postFee"]) ? 0 : Convert.ToDouble(c.Request["postFee"].ToString());
        
        //购物车列表
        string shopping = string.IsNullOrEmpty(c.Request["shopping"]) ? "" : c.Request["shopping"].ToString();
        int isVip = string.IsNullOrEmpty(c.Request["isVip"]) ? 0 : Convert.ToInt16(c.Request["isVip"].ToString());
      
        //获取来源信息
        int sourceId = 0;
        int uType = 0;
        user u = new _User().GetUser(openId, "", 0);
        if (u != null)
        {
            if (u.id == uid)
            {
                try
                {
                    uType = u.uType;
                    sourceId = u.sourceId;
                }
                catch
                {
                    sourceId = 0;
                }                
            }
            else
            {
                return response.Fail("用户不存在"); 
            }
        }
        else
        {
            return response.Fail("用户不存在");
        }
              
        string orderNo = DateTime.Now.ToString("yyMMddHHmmss") + uid.ToString().PadLeft(5,'0');
        
        //检查库存
        int pid = 0;//会员特权产品ID
        Double tempPrice = 0;
        string[] pArr = shopping.Split(',');
        Dictionary<int, string> ProductDic = new Dictionary<int, string>();
        foreach (string item in pArr)
        {
            //pid@unitNo@pNum@price
            if (item.Length > 0)
            {
                string[] iArr = item.Split('@');
                ProductInfo pd = new _Product().GetProductInfo(Convert.ToInt16(iArr[0]));
                if (pd != null)
                {
                    unit tempunit = null;
                    foreach (unit uitem in pd.unit)
                    {
                        if (uitem.unitNo == iArr[1])
                        {
                            pid = uitem.pId;
                            tempunit = uitem;
                            if (!ProductDic.ContainsKey(pd.id))
                            {
                                ProductDic.Add(pd.id, pd.pName);
                            }
                            break;
                        }
                    }
                    if (tempunit != null)
                    {
                        if ((tempunit.uNum - tempunit.sNum) < Convert.ToInt16(iArr[2]))
                        {
                            return Sys_Result.GetR(1, "所选产品[" + pd.pName + "-" + tempunit.fName + tempunit.sName + "]库存不够，目前剩余" + (tempunit.uNum - tempunit.sNum) + "请重新选择！");
                        }
                        if (Math.Round(tempunit.price,2) != Math.Round(Convert.ToDouble(iArr[3]),2))
                        {
                            return Sys_Result.GetR(1, "所选产品[" + pd.pName + "-" + tempunit.fName + tempunit.sName + "]价格有变动，请重新选择！");
                        }
                        try
                        {
                            tempPrice += tempunit.price * Convert.ToInt16(iArr[2]);
                        }
                        catch { }                        
                    }
                    else
                    {
                        return Sys_Result.GetR(1, "所选产品不存在！");
                    }
                }
                else
                {
                    return Sys_Result.GetR(1, "所选产品不存在！");
                }
            }
        }

        if (pid > 0 && isVip > 0)
        {
            int orderNum = new _OrderInfo().GetActiveOrder(uid, pid);
            if (orderNum > 0)
            {
                return response.Fail("每个特权商品只能购买一次，您已购买过！");
            }
        }
        else
        {
            pid = 0;
        }

        if (subPrice > 0)
        {
            Double Coin = new _Coin().GetCoin(openId);
            if (Coin < subPrice)
            {
                return response.Fail("抵用币不足，请重新提交");
            }
        }

        //来源
        int srcUType = 0;
        string srcOpenId = "";
        if (sourceId > 0)
        {
            user src_user = new _User().GetUser("", "", sourceId);
            if (src_user != null)
            {
                srcUType = src_user.uType;
                if (src_user.uType == 1)
                {
                    srcOpenId = src_user.openId;
                }
            }
        }
        
        
        int isPay = 0;
        int payType = 0;
        
        //if (p != null)
        {
            order o = new order
            {
                //用户信息
                userId = uid,
                contact = contact,
                tel = tel,
                addr = addr,
                memo = memo,
                sourceId = sourceId,
                //价格信息
                postFee = postFee,
                allPrice = tempPrice+postFee,
                subPrice = subPrice,
                isPay = isPay,
                payType = payType,
                //基础信息
                addOn = DateTime.Now,
                sendDate = DateTime.Now.AddDays(1).Date,
                serviceId = 1,
                oType = oType,
                pId = pid,
                orderNo = orderNo
            };

            if (o.allPrice == o.subPrice)
            {
                o.isPay = 1;
                o.payOn = DateTime.Now;
                o.state = 1;
            }

            if (o.price < 0)
            {
                o.price = 0;
            }

            
            if (new Main().AddToDb(o, "t_order"))
            {
                _orderNo = o.orderNo;
                string productMx = "";
                //添加产品信息
                string tempName = "";
                string tempOpenId = "";
                int tempUType = 0;
                Double tempFyRadio = 0;
                foreach (string item in pArr)
                {
                    if (item.Length > 0)
                    {
                        //pid@unitNo@pNum@price@openID
                        //添加产品列表
                        tempName = "";
                        string[] iArr = item.Split('@');
                        if (ProductDic.ContainsKey(Convert.ToInt16(iArr[0])))
                        {
                            tempName = ProductDic[Convert.ToInt16(iArr[0])];
                        }
                        orderPList op = new orderPList
                        {
                            pid = Convert.ToInt16(iArr[0]),
                            pName = tempName,
                            pNum = Convert.ToInt16(iArr[2]),
                            addOn = DateTime.Now,
                            orderNo = o.orderNo,
                            unitNo = iArr[1],
                            price = Convert.ToDouble(iArr[3])
                        };
                        productMx += tempName + "[" + Math.Round(op.price, 1) + "*" + op.pNum + "],";
                        new Main().AddToDb(op, "t_orderpList");

                        //添加分佣
                        Double tempRadio = 0;
                        tempOpenId = iArr[4];
                        tempUType = 0;
                        //判断是否为从分享的产品过来
                        if (tempOpenId.Length > 0)
                        {
                            //判断用户是否是会员
                            user tempUser = new _User().GetUser(tempOpenId, "", 0);
                            if (tempUser == null)
                            {
                                tempOpenId = "";
                            }
                            else
                            {
                                tempUType = tempUser.uType;
                                if (tempUser.uType == 0)
                                {
                                    tempOpenId = "";
                                }
                            }
                        }
                        if (tempOpenId.Length == 0)
                        {
                            //不是分享的产品，判断是否有上级
                            if (srcOpenId.Length > 0 && srcUType > 0)
                            {
                                tempOpenId = srcOpenId;
                                tempUType = srcUType;
                            }
                        }
                        //tempPrice为产品本身价格
                        if (tempPrice > subPrice && tempOpenId.Length > 0)
                        {
                            tempFyRadio = FyRadio;
                            if (tempUType == 2)
                            {
                                tempFyRadio = FyRadio_FX;
                            }
                            if (subPrice > 0)//是否使用了折扣
                            {
                                tempRadio = (tempPrice - subPrice) / tempPrice;//所有产品平分金币
                                coin coin = new coin
                                {
                                    addOn = DateTime.Now,
                                    openId = u.openId,
                                    srcOpenId = tempOpenId,
                                    coinValue = Convert.ToInt16(iArr[2]) * Convert.ToDouble(iArr[3]) * FyRadio * tempFyRadio,
                                    orderNo = o.orderNo,
                                    unitNo = iArr[1]
                                };
                                new Main().AddToDb(coin, "t_coin");
                            }
                            else
                            {
                                coin coin = new coin
                                {
                                    addOn = DateTime.Now,
                                    openId = u.openId,
                                    srcOpenId = tempOpenId,
                                    coinValue = Convert.ToInt16(iArr[2]) * Convert.ToDouble(iArr[3]) * tempFyRadio,
                                    orderNo = o.orderNo,
                                    unitNo = iArr[1]
                                };
                                new Main().AddToDb(coin, "t_coin");
                            }
                        }
                    }
                }
                
                //扣减币
                if (subPrice > 0)
                {
                    coin coin = new coin
                    {
                        addOn = DateTime.Now,
                        openId = u.openId,
                        srcOpenId = "",
                        coinValue = 0-subPrice,
                        orderNo = o.orderNo,
                        cType = 1,
                        state = 2
                    };
                    new Main().AddToDb(coin, "t_coin");
                }
                   
                //添加订单日志
                AddLog(o.orderNo, "提交订单", uid, "", 0);
                
                //给用户发送提交订单成功模板消息
                orderInfo order_t = new _OrderInfo().GetOrderInfo(o.orderNo, 0);
                string MsgContent = "";
                if (u != null)
                {
                    /*
                    string MsgContent = "";
                    string detailUrl = "orderlist.html";
                    TMsg_Order tmo = new TMsg_Order().GetMessageBody("尊敬的" + o.contact + "，您好，您的订单已支付成功！", "万品微店", o.allPrice.ToString() + "元", DateTime.Now.ToString("yyyy-MM-dd HH:mm"), o.orderNo, "[万品微店]", out MsgContent);
                    SendTemplateMessage(c, tmo, new TMsg_Order().Key(), u.openId, BaseUrl + detailUrl + "?orderno=" + o.orderNo + "&ot=1", MsgContent);
                    */
                    TMsg_Work tmo = new TMsg_Work().GetMessageBody("尊敬的" + o.contact + "，您好，您的订单已下单完成，订单总价：" + Math.Round(o.allPrice,1) + "，采购明细：" + productMx + "，感谢您选择万品微店！", order_t.id.ToString(), DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[万品微店]", out MsgContent);
                    Comm.SendTemplateMessage(c, tmo, new TMsg_Work().Key(), u.openId, BaseUrl + "orderdetail.aspx?orderno=" + o.orderNo, MsgContent);
                    //AddLog(o.orderNo, "给用户发送模板消息：" + MsgContent, 0, DefaultWrokNo, 2);
                }
                //首次下单，绑定用户联系人和联系电话
                if (u != null)
                {
                    if (u.mobile.Length == 0)
                    {
                        var ou = new
                        {
                            mobile = tel,
                            contact = contact
                        };
                        new Main().UpdateDb(ou, "t_user", "id=" + u.id);
                    }
                }

                var temp_o = new
                {
                    OrderNo = o.orderNo,
                    isPay = o.isPay,
                    price = o.allPrice - o.subPrice,
                    isSubcribe = u.isSubscribe
                };
                //return JsonMapper.ToJson(temp_o);
                return response.Success(temp_o);
            }
        }
        return response.Fail("保存订单失败，请稍后再试");
    }

   
    /// <summary>
    /// 获取订单列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetOrderList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        int state = string.IsNullOrEmpty(c.Request["state"]) ? -1 : Convert.ToInt16(c.Request["state"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"];
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u.id == uid)
            {
                string sql = "select * from t_order where userId = " + uid + " order by id desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
                if (state > -1)
                {
                    sql = "select * from t_order where userId = " + uid + " and state = " + state + " order by id desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
                }
                List<WebOrderList> lo = new _WebOrder().GetOrderList(sql,uid);
                if (lo != null && lo.Count > 0)
                {
                    return response.Success(lo);
                }   
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取佣金列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetCoinList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int cType = string.IsNullOrEmpty(c.Request["cType"]) ? -1 : Convert.ToInt32(c.Request["cType"]);
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"];
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u.id == uid)
            {
                string sql = "select * from t_coin where openId = '" + openId + "' and (state = 2 or state = 8) order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
                if (cType > -1)
                {
                    sql = "select * from t_coin where openId = '" + openId + "' and cType = " + cType + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
                }
                List<CoinInfo> lo = new _Coin().GetCoinList(sql);
                return response.Success(lo);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取好友列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUserList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 1 : Convert.ToInt16(c.Request["page"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"];
        if (uid > 0 && openId.Length > 0)
        {
            if (page == 0)
            {
                page = 1;
                perPage = 10000;
            }
            user u = new _User().GetUser(openId, "", 0);
            if (u.id == uid)
            {
                string sql = "select * from t_user where sourceId = " + uid + " order by addOn desc limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
                string sql_c = "select count(*) as t from t_user where sourceId = " + uid;
                int count = 0;
                List<WebUser> lo = new _WebUser().GetUserList(sql, sql_c, out count);
                if (lo != null && lo.Count > 0)
                {
                    return response.Success(lo,count);
                }
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取好友人数
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUserCount(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"];
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u.id == uid)
            {
                int count = new _WebUser().GetUserCount(uid);
                return response.Success(count, vipUserNum);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取用户佣金数量
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUserCoin(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"];
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u.id == uid)
            {
                Double coin = new _Coin().GetCoin(openId);
                Double coin_use = new _Coin().GetCoinForUse(openId);
                return response.Success(coin, coin_use);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    
    /// <summary>
    /// 获取代言人海报列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetHbList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt16(c.Request["uid"].ToString());
        string sql = "select * from t_content where cType = 1 and enable = 1 order by isHot desc,addOn desc";
        List<WebHb> lo = new _Content().GetHbList(sql);
        if (lo != null && lo.Count > 0)
        {
            return response.Success(lo);
        }
        return Sys_Result.GetR(1, "");
    }

    
    /// <summary>
    /// 获取活动参与情况
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetActiveNum(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int pid = string.IsNullOrEmpty(c.Request["pid"]) ? 0 : Convert.ToInt32(c.Request["pid"]);
        if (uid > 0 && pid > 0)
        {
            int orderNum = new _OrderInfo().GetActiveOrder(uid, pid);
            if (orderNum > 0)
            {
                return Sys_Result.GetR(1, "");
            }
        }
        return Sys_Result.GetR(0, "");
    }

    /// <summary>
    /// 获取可用余额
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUseCoin(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    Double coin = new _Coin().GetCoin(openId);
                    return response.Success(coin);
                }
            }
        }
        return Sys_Result.GetR(0, "");
    }

    /// <summary>
    /// 申请提现
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ToCash(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        Double cash = string.IsNullOrEmpty(c.Request["cash"]) ? 0 : Convert.ToInt32(c.Request["cash"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        string code = string.IsNullOrEmpty(c.Request["code"]) ? "" : c.Request["code"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string Code_Temp = new _SmsCode().GetSmsCode(mobile);
        if (code.Length < 6 || Code_Temp.Length < 6 || code != Code_Temp)
        {
            return response.Fail("验证码错误");
        }
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    Double coin_ok = new _Coin().GetCoin(openId);
                    Double coin_cash = new _Coin().GetCoinForCash(openId);
                    Double coin_use = coin_ok - coin_cash;
                    if (Math.Round(coin_use,2) >= Math.Round(cash,2))
                    {
                        coin co = new coin
                        {
                            addOn = DateTime.Now,
                            coinValue = cash,
                            cType = 3,
                            state = 0,
                            openId = openId
                        };
                        if (new Main().AddToDb(co, "t_coin"))
                        {
                            return response.Success("提交申请完成");        
                        }
                    }
                    
                }
            }
        }
        return Sys_Result.GetR(0, "");
    }

    /// <summary>
    /// 发送短信
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendSmsCode(HttpContext c)
    {
        string mobile = c.Request["mobile"] == null ? "" : c.Request["mobile"].ToString();
        string openID = c.Request["openID"] == null ? "" : c.Request["openID"].ToString();
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt32(c.Request["uId"]);
        int Code = new Random().Next(100000, 999999);
        if (uId > 0 && openID.Length > 0 && mobile.Length > 0)
        {
            user u = new _User().GetUser(openID, "", 0);
            if (u != null)
            {
                if (u.id == uId)
                {
                    try
                    {
                        int SmsCodeNum_Day = new _SmsCode().GetSmsCount(mobile);
                        if (SmsCodeNum_Day > 5)
                        {
                            return Sys_Result.GetR(1, "请勿频繁获取验证码");
                        }
                        else
                        {
                            //cn.com.seascape.emp.SMSAPI s = new cn.com.seascape.emp.SMSAPI();
                            //s.SendMessage(smsUser, smsPass, mobile, smsMsg.Replace("{Code}", Code.ToString()), "");
                            //string PostUrl = "http://59.49.19.109:8016/weixin/TrainHandler.ashx?Fn=3&mobile=" + mobile + "&msg=" + smsMsg.Replace("{Code}", Code.ToString());
                            //BasicTool.webRequest(PostUrl);
                            //Sms.sendSms(mobile, "");
                            smsCode sc = new smsCode
                            {
                                code = Code.ToString(),
                                mobile = mobile,
                                openId = openID,
                                uid = uId,
                                addOn = DateTime.Now
                            };
                            if (new Main().AddToDb(sc, "t_smsCode"))
                            {
                                return response.Success("OK");
                            }
                        }
                    }
                    catch
                    {

                    }                    
                }
            }
        }
        return Sys_Result.GetR(1, "短信发送失败，请稍后再试");
    }

    /// <summary>
    /// 获取广告列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetContentList(HttpContext c)
    {
        string sql = "select * from t_content where enable > 0 and cType = 0 order by isHot desc, addOn desc limit 0,4";
        {
            List<content> lo = new _Content().GetContentList(sql);
            if (lo != null && lo.Count > 0)
            {
                return response.Success(lo);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取广告详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetContentInfo(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt32(c.Request["id"]);
        {
            content content = new _Content().GetContent(id);
            if (content != null)
            {
                return response.Success(content);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 生成海报并获取链接
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateHb(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int hbId = string.IsNullOrEmpty(c.Request["hbId"]) ? 0 : Convert.ToInt32(c.Request["hbId"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    string ResultUrl = GetCreateHBUrl(c, uid, hbId);
                    if (ResultUrl.Length > 0)
                    {
                        return response.Success(ResultUrl, hbId);
                    }
                }
            }
        }
        return response.Fail("生成失败");
    }

    /// <summary>
    /// 生成海报
    /// </summary>
    /// <param name="c"></param>
    /// <param name="uid"></param>
    /// <param name="hbId"></param>
    /// <returns></returns>
    public string GetCreateHBUrl(HttpContext c,int uid,int hbId)
    {
        content content = new _Content().GetContent(hbId);
        if (content != null)
        {
            string imgUrl = content.imgUrl;
            string sizes = content.hbSize;
            try
            {
                int left = 0;
                int top = 0;
                int size = 0;
                left = Convert.ToInt16(sizes.Split('|')[1]);
                top = Convert.ToInt16(sizes.Split('|')[0]);
                size = Convert.ToInt16(sizes.Split('|')[2]);
                int[] sizeArr = new int[4] { left, top, size, size };
                if (imgUrl.Length > 0 && size > 0)
                {
                    string resultUrl = new HbCreate().CreateHBForUser(c, uid, hbId, sizeArr, imgUrl);
                    if (resultUrl.Length > 0)
                    {
                        return resultUrl;
                    }
                }

            }
            catch
            {

            }
        }
        return "";
    }

    /// <summary>
    /// 发送海报给客户
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SendHb(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int hbId = string.IsNullOrEmpty(c.Request["hbId"]) ? 0 : Convert.ToInt32(c.Request["hbId"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u != null)
            {
                if (u.id == uid)
                {
                    string ResultUrl = GetCreateHBUrl(c, uid, hbId);
                    if (ResultUrl.Length > 0)
                    {
                        HbCreate.SendImage(c, openId, c.Server.MapPath(ResultUrl));
                        return response.Success("发送完成");
                    }
                }
            }
        }
        return response.Fail("生成失败");
    }
   
    /// <summary>
    /// 获取订单详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetOrderInfo(HttpContext c)
    {
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"].ToString();
        if (orderNo.Length > 0)
        {
            WebOrderInfo lo = new _WebOrder().GetOrderInfo(orderNo);
            if (lo != null)
            {
                return response.Success(lo);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 通过编号获取订单详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetOrderInfoForId(HttpContext c)
    {
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt32(c.Request["id"]);
        if (id > 0)
        {
            orderInfo lo = new _OrderInfo().GetOrderInfo("", id);
            if (lo != null)
            {
                var o = new { Return = 0, Msg = "", orderno = lo.orderNo };
                return JsonMapper.ToJson(o);
            }
        }
        return Sys_Result.GetR(1, "");
    }
    
    /// <summary>
    /// 添加评价
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddEvaluate(HttpContext c)
    {
        string OrderNo = c.Request["OrderNo"] == null ? "" : c.Request["OrderNo"].ToString().Replace("#", "");
        string memo = c.Request["memo"] == null ? "" : c.Request["memo"].ToString();
        string unitNo = c.Request["unitNo"] == null ? "" : c.Request["unitNo"].ToString();
        string openId = c.Request["openId"] == null ? "" : c.Request["openId"].ToString();
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int pid = string.IsNullOrEmpty(c.Request["pid"]) ? 0 : Convert.ToInt32(c.Request["pid"]);
        int grade = string.IsNullOrEmpty(c.Request["grade"]) ? 0 : Convert.ToInt16(c.Request["grade"]);
        user u = new _User().GetUser(openId, "", 0);
        if (u != null && u.id == uid)
        {
            int eType = 0;
            if(OrderNo.Length==0){
                eType=1;
            }
            if (new _Evaluate().IsEvaluate(OrderNo, pid, uid, eType, unitNo))
            {
                return Sys_Result.GetR(1, "该记录已评价过");
            }
            else
            {
                evaluate e = new evaluate
                {
                    orderNo = OrderNo,
                    memo = memo,
                    grade = grade,
                    addOn = DateTime.Now,
                    uid = uid,
                    pid = pid,
                    unitNo = unitNo
                    
                };
                if (new Main().AddToDb(e, "t_evaluate"))
                {

                    //处理评价上传的图片信息
                    string aSrc = string.IsNullOrEmpty(c.Request["aSrc"]) ? "" : c.Request["aSrc"].ToString();

                    aSrc = aSrc + "|";
                    string[] SrcArr = aSrc.Split('|');
                    string tempSrc = "";
                    int srcNum = 0;
                    try
                    {
                        foreach (string src in SrcArr)
                        {
                            if (src.Length > 10)
                            {
                                int RNum = new Random().Next(100, 999);
                                string dates = DateTime.Now.ToString("yyMMdd");
                                if (System.IO.Directory.Exists(c.Server.MapPath("~") + "/attach/" + dates) == false)//如果不存在就创建file文件夹
                                {
                                    System.IO.Directory.CreateDirectory(c.Server.MapPath("~") + "/attach/" + dates);
                                }
                                string localPath = c.Server.MapPath("~") + "/attach/" + dates + "/" + OrderNo + "_" + RNum + "_" + srcNum + ".jpg";
                                tempSrc = new WxTool().downloadMedia(src, localPath, Comm.Get_Access_Token(c));
                                if (tempSrc.Length > 0)
                                {
                                    attach a = new attach
                                    {
                                        aSrc = "/attach/" + dates + "/" + OrderNo + "_" + RNum + "_" + srcNum + ".jpg",
                                        descNum = 0,
                                        orderNo = OrderNo,
                                        pid = pid,
                                        unitNo = unitNo,
                                        aType = 1
                                    };
                                    new Main().AddToDb(a, "t_attach");
                                    CreateImg(c, a.aSrc);
                                    srcNum++;
                                }
                            }

                        }
                    }
                    catch (Exception ex) { }

                    //修改数据库状态
                    var o = new
                    {
                        isEvaluate = 1
                    };
                    new Main().UpdateDb(o, "t_orderpList", "orderNo = '" + OrderNo + "' and pid = " + pid);
                    AddLog(OrderNo, "用户已评价完成", uid, "", 0);

                    //user u = new user().GetUser("", "", uid);
                    //if (u != null && !string.IsNullOrEmpty(u.contact))
                    //{
                    //    string MsgContent = "";
                    //    TMsg_Evaluate tmo = new TMsg_Evaluate().GetMessageBody("尊敬的" + u.contact + "，您好", "您本次的评价我们已收到！", "海景快修服务", "[海景快修 400-999-0351]", out MsgContent);
                    //    SendTemplateMessage(c, tmo, new TMsg_Evaluate().Key(), u.openId, BaseUrl + "orderdetail.html?f=wx&orderno=" + OrderNo, MsgContent);
                    //}
                    return Sys_Result.GetR(0, "添加完成");
                }
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取评价列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetEvalueateList(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        int pid = string.IsNullOrEmpty(c.Request["pid"]) ? 0 : Convert.ToInt32(c.Request["pid"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"];
        string unitNo = string.IsNullOrEmpty(c.Request["unitNo"]) ? "" : c.Request["unitNo"];
        string orderNo = string.IsNullOrEmpty(c.Request["orderNo"]) ? "" : c.Request["orderNo"];
        if (pid > 0 || orderNo.Length > 0)
        {
            Double radio = 100;
            List<WebEvaluate> el = new _Evaluate().GetEvaluateList(orderNo, pid,unitNo, out radio);
            return response.Success(el,radio);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 生成缩略图
    /// </summary>
    /// <param name="c"></param>
    /// <param name="imgUrl"></param>
    /// <returns></returns>
    public bool CreateImg(HttpContext c,string imgUrl)
    {
        string path = c.Server.MapPath("~");
        string[] ps = imgUrl.Split('.');
        string path2 = path + ps[0] + "_s.jpg";
        string url2 = "~" + ps[0] + "_s.jpg";
        return new ImageScale(path + imgUrl).GetReducedImage(100, 100, path2); 
    }
    
    /// <summary>
    /// 用户二维码生成
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateCode(HttpContext c)
    {
        string access_token = Comm.Get_Access_Token(c);
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt16(c.Request["uid"]);
        if (uid > 0)
        {
            string FilePath = c.Server.MapPath("/pic/qrCode/" + uid + ".jpg");
            int SceneID = uid;
            string Result = new Common(appid, secret).GetQR_Code(access_token, FilePath, SceneID);
            return Sys_Result.GetR(0, Result);
        }
        return Sys_Result.GetR(1, "");
    }
    
   
    /// <summary>
    /// 退款操作
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public void OrderRefund(WebOrderInfo wo)
    {
        string orderNo = wo.orderNo;
        Double allPrice = wo.allPrice - wo.subPrice;
        wxPay wp = new _WxPay().GetWxPay(orderNo);
        if (wp != null)
        {
            WxPayRefund wr = new WxPayRefund
            {
                addOn = DateTime.Now,
                appid = appid,
                mch_id = mch_id,
                nonce_str = BasicTool.MD5(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + new Random().Next(1000, 9999).ToString()),
                total_fee = Convert.ToInt32(wp.total_fee),
                out_refund_no = wp.out_trade_no,
                out_trade_no = wp.out_trade_no,
                transaction_id = wp.transaction_id,
                refundOn = DateTime.Now,
                refund_fee = Convert.ToInt32(wp.total_fee),
                op_user_id = mch_id,
                OrderNo = orderNo,
                KeyValue = keyValue
            };
            string r = "";
            string errMsg = new WxPayRefund().WxRefund(wr, out r);
            wr.errMsg = errMsg;
            if (errMsg == "0")
            {
                errMsg = "提交成功";
            }
            new Main().AddTestLog("WxRefund", r);
            new Main().AddTestLog("errMsg", errMsg);
            if (new Main().AddToDb(wr, "t_wxpay_refund"))
            {
                if (wr.errMsg == "0")
                {
                    var o_Refund = new
                    {
                        state = 10
                    };
                    if (new Main().UpdateDb(o_Refund, "t_order", "orderNo = '" + orderNo + "'"))
                    {
                        AddLog(orderNo, "执行退款申请，退款金额：" + Math.Round(Convert.ToDouble(wr.total_fee / 100), 2).ToString() + "元,退款申请结果：" + errMsg, wo.userId, "", 1);
                    }
                }
                else
                {
                    AddLog(orderNo, "执行退款申请，退款申请失败，请联系客服", wo.userId, "", 1);
                }
            }
        }
    }

   
    /// <summary>
    /// 投诉添加
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddComplaint(HttpContext c)
    {
        string tel = c.Request["tel"] == null ? "" : c.Request["tel"].ToString();
        string openid = c.Request["openid"] == null ? "" : c.Request["openid"].ToString();
        string content = c.Request["content"] == null ? "" : c.Request["content"].ToString();
        if (openid.Length > 0)
        {
            int uid = 0;
            user u = new _User().GetUser(openid, "", 0);
            if (u != null && !string.IsNullOrEmpty(u.openId))
            {
                uid = u.id;
            }
            complaint cm = new complaint { userId = uid, addOn = DateTime.Now, tel = tel, Content = content };
            if (new Main().AddToDb(cm, "t_Complaint"))
            {
                return Sys_Result.GetR(0, "");
            }
        }
        return Sys_Result.GetR(1, "");
    }
    
    /// <summary>
    /// 获取用户常用地址列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetAddrInfo(HttpContext c)
    {
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt16(c.Request["uId"].ToString());
        int isDefault = string.IsNullOrEmpty(c.Request["isDefault"]) ? 0 : Convert.ToInt16(c.Request["isDefault"].ToString());
        if (uId > 0)
        {
            List<addr> la = new _Addr().GetAddr(uId, 0, isDefault);
            if (la != null && la.Count > 0)
            {
                return response.Success(la);
            }
        }
        return Sys_Result.GetR(1, "无记录");
    }

    /// <summary>
    /// 删除常用地址
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string DelAddr(HttpContext c)
    {
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt16(c.Request["uId"].ToString());
        int id = string.IsNullOrEmpty(c.Request["id"]) ? 0 : Convert.ToInt16(c.Request["id"].ToString());
        if (uId > 0 && id > 0)
        {
            if (new Main().DelDb("t_addr", " id = " + id))
            {
                return Sys_Result.GetR(0, "");
            }
        }
        return Sys_Result.GetR(1, "删除失败");
    }

    /// <summary>
    /// 添加常用地址
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string AddAddr(HttpContext c)
    {
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt16(c.Request["uId"].ToString());
        string contact = string.IsNullOrEmpty(c.Request["contact"]) ? "" : c.Request["contact"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string area = string.IsNullOrEmpty(c.Request["area"]) ? "" : c.Request["area"].ToString();
        string city = string.IsNullOrEmpty(c.Request["city"]) ? "太原" : c.Request["city"].ToString();
        string street = string.IsNullOrEmpty(c.Request["street"]) ? "" : c.Request["street"].ToString();
        string address = string.IsNullOrEmpty(c.Request["address"]) ? "" : c.Request["address"].ToString();
        if (uId > 0)
        {
            try
            {
                addr ad = new addr
                {
                    address = address,
                    contact = contact,
                    mobile = mobile,
                    uId = uId,
                    area = area,
                    city = city,
                    street = street,
                    addOn = DateTime.Now,
                    useOn = DateTime.Now
                };
                int adid = new Main().AddToDbForId(ad, "t_addr");
                if (adid > 0)
                {
                    var o = new { Return = 0, Msg = "", id = adid };
                    return JsonMapper.ToJson(o);
                }
            }
            catch { }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 添加银行卡信息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string operUserBank(HttpContext c)
    {
        int uId = string.IsNullOrEmpty(c.Request["uId"]) ? 0 : Convert.ToInt16(c.Request["uId"].ToString());
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"].ToString();
        string mobile = string.IsNullOrEmpty(c.Request["mobile"]) ? "" : c.Request["mobile"].ToString();
        string cardName = string.IsNullOrEmpty(c.Request["cardName"]) ? "" : c.Request["cardName"].ToString();
        string cardNo = string.IsNullOrEmpty(c.Request["cardNo"]) ? "" : c.Request["cardNo"].ToString();
        string userName = string.IsNullOrEmpty(c.Request["userName"]) ? "" : c.Request["userName"].ToString();

        cardName = c.Server.UrlDecode(cardName);
        userName = c.Server.UrlDecode(userName);
        
        if (uId > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u.id == uId)
            {
                userBank ub = new _UserBank().GetBankInfo(openId);
                if (ub == null)
                {
                    ub = new userBank()
                    {
                        cardName = cardName,
                        cardNo = cardNo,
                        userName = userName,
                        openId = openId,
                        uid = uId,
                        addOn = DateTime.Now,
                        mobile = mobile
                    };
                    if (new Main().AddToDb(ub, "t_user_bank"))
                    {
                        return response.Success("OK");
                    }
                }
                else
                {
                    var o = new
                    {
                        cardName = cardName,
                        cardNo = cardNo,
                        userName = userName,
                        mobile = mobile
                    };
                    if (new Main().UpdateDb(o, "t_user_bank", "openId = '" + openId + "'"))
                    {
                        return response.Success("OK");
                    }  
                }
            }
        }
        return response.Fail("更新失败，请稍后再试！");
    }

    /// <summary>
    /// 获取用户银行卡信息
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUserBank(HttpContext c)
    {
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt32(c.Request["uid"]);
        string openId = string.IsNullOrEmpty(c.Request["openId"]) ? "" : c.Request["openId"];
        if (uid > 0 && openId.Length > 0)
        {
            user u = new _User().GetUser(openId, "", 0);
            if (u.id == uid)
            {
                Double coin = new _Coin().GetCoin(openId);
                userBank ub = new _UserBank().GetBankInfo(openId);
                if (ub != null)
                {
                    return response.Success(ub,coin);
                }
            }
        }
        return response.Fail("无记录");
    }
    
    /// <summary>
    /// 手机绑定
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string BindUserMobile(HttpContext c)
    {
        string openid = c.Request["openid"] == null ? "" : c.Request["openid"].ToString();
        string code = c.Request["code"] == null ? "" : c.Request["code"].ToString();
        string pName = c.Request["pName"] == null ? "" : c.Request["pName"].ToString();
        string mobile = c.Request["mobile"] == null ? "" : c.Request["mobile"].ToString();
        string Code_Temp = new _SmsCode().GetSmsCode(mobile);
        if (Code_Temp.Length == 4)
        {
            if (Code_Temp != code)
            {
                return Sys_Result.GetR(1, "验证码错误");
                
            }
        }
        else
        {
            return Sys_Result.GetR(1, "验证码错误");
        }

        user u = new _User().GetUser(openid, "", 0);
        if (u != null)
        {
            var o = new
            {
                contact = pName,
                mobile = mobile
            };
            if (new Main().UpdateDb(o, "t_user", "openid='" + openid + "'"))
            {
                return Sys_Result.GetR(0, "");
            }
        }
        return Sys_Result.GetR(1, "绑定失败，未找见用户");
    }
    
    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="OrderNo"></param>
    /// <param name="Content"></param>
    /// <param name="uid"></param>
    /// <param name="cid"></param>
    /// <param name="aid"></param>
    public void AddLog(string OrderNo, string Content, int uid,string workNo,int lType)
    {
        log l = new log
        {
            addOn = DateTime.Now,
            uId = uid,
            lType = lType,
            content = Content,
            orderNo = OrderNo
        };
        new Main().AddToDb(l, "t_log");
    }

   
    /// <summary>
    /// 获取支付相关信息--字符串
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetPayInfo(HttpContext c)
    {
        string OrderNo = c.Request["OrderNo"] == null ? "" : c.Request["OrderNo"].ToString();
        orderInfo o = new _OrderInfo().GetOrderInfo(OrderNo, 0);
        if (o.state < 9)
        {
            wxPay p = new _WxPay().GetWxPay(OrderNo);
            if (p != null)
            {
                WxPay.WxPayConfig wc = OperPay(OrderNo, p.payServiceId);
                return wc.appid + "|" + wc.nonce + "|" + wc.package + "|" + wc.signature + "|" + wc.timestamp;
            }
            else
            {
                WxPay.WxPayConfig wc = OperPay(OrderNo, "");
                return wc.appid + "|" + wc.nonce + "|" + wc.package + "|" + wc.signature + "|" + wc.timestamp;
            }
        }
        else
        {
            return "Order Cancel";
        }
    }

    /// <summary>
    /// 处理支付
    /// </summary>
    /// <param name="OrderNo"></param>
    /// <param name="prepayID"></param>
    /// <returns></returns>
    public WxPay.WxPayConfig OperPay(string OrderNo, string prepayID)
    {
        WxPay.WxPayConfig wp = null;
        List<orderInfo> lo = new _OrderInfo().GetOrderList(0, "", OrderNo);
        if (lo != null && lo.Count > 0)
        {
            Double price = lo[0].allPrice;
            Double subPrice = lo[0].subPrice;
            price = price - subPrice;
            string body = "小食品";
            int userId = lo[0].userId;
            user u = new _User().GetUser("", "", userId);
            if (u == null)
            {
                return null;
            }
            if (prepayID.Length == 0)
            {
                WxPay w = new WxPay();
                w.appid = appid;
                w.body = body;
                w.detail = body;
                w.mch_id = mch_id;
                w.nonce_str = BasicTool.MD5(OrderNo + DateTime.Now).ToUpper();
                w.notify_url = notify_url;
                w.openid = u.openId;
                w.out_trade_no = OrderNo + "_" + new Random().Next(100, 999);
                w.spbill_create_ip = client_ip;
                w.total_fee = Convert.ToInt32(price * 100);
                w.KeyValue = keyValue;
                w.trade_type = "JSAPI";
                w.attach = BasicTool.MD5(OrderNo + HjKeyValue).ToUpper();
                string errMsg = "";
                prepayID = new WxPay().Get_prepay_id(w,out errMsg);
                new Main().AddTestLog_B("[M]Pay-Return:", errMsg.ToString());
                if (prepayID.Length > 0)
                {
                    wxPay p = new wxPay
                    {
                        orderNo = OrderNo,
                        payOn = DateTime.Now,
                        payServiceId = prepayID,
                        price = price,
                        returnMsg = "",
                        state = 0
                    };
                    new Main().AddToDb(p, "t_wxPay");
                }
            }

            if (prepayID.Length > 0)
            {
                return new WxPay().Get_Config_Pay("prepay_id=" + prepayID, appid, keyValue);
            }
        }
        return wp;
    }

    
    /// <summary>
    /// 发送菜单
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string InitMenu(HttpContext c)
    {
        string errmsg = "ERR";
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{");
            sb.Append("    \"button\": [");
            sb.Append("        {");
            sb.Append("            \"type\": \"view\", ");
            sb.Append("            \"name\": \"进入商城\", ");
            sb.Append("            \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72bba0f3cbe6e8ca&redirect_uri=http%3a%2f%2fs.seascapeapp.cn%2fapp%2findex.aspx&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");
            sb.Append("        }, ");
            sb.Append("        {");
            sb.Append("            \"type\": \"view\", ");
            sb.Append("            \"name\": \"代言人\", ");
            sb.Append("            \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72bba0f3cbe6e8ca&redirect_uri=http%3a%2f%2fs.seascapeapp.cn%2fapp%2fvippicture.aspx&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");            
            sb.Append("        }, ");
            sb.Append("        {");
            sb.Append("            \"type\": \"view\", ");
            sb.Append("            \"name\": \"服务中心\", ");
            sb.Append("            \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72bba0f3cbe6e8ca&redirect_uri=http%3a%2f%2fs.seascapeapp.cn%2fapp%2fuc.aspx&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");                        
            sb.Append("        }");
            /*
            sb.Append("        {");
            sb.Append("           \"name\": \"优惠活动\", ");
            sb.Append("            \"sub_button\": [");            
            sb.Append("                 {");
            sb.Append("                     \"type\": \"view\", ");
            sb.Append("                      \"name\": \"首单五折\", ");
            sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc79aa72caccf9da2&redirect_uri=http%3a%2f%2fshoes.4009990351.com%2factiveOrder.html&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");
            sb.Append("                  }, ");
            sb.Append("                 {");
            sb.Append("                     \"type\": \"view\", ");
            sb.Append("                      \"name\": \"推荐有礼\", ");
            sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc79aa72caccf9da2&redirect_uri=http%3a%2f%2fshoes.4009990351.com%2fload.html&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect\"");
            sb.Append("                  },");
            sb.Append("                 {");
            sb.Append("                     \"type\": \"view\", ");
            sb.Append("                      \"name\": \"充值返现\", ");
            sb.Append("                      \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc79aa72caccf9da2&redirect_uri=http%3a%2f%2fshoes.4009990351.com%2fload.html&response_type=code&scope=snsapi_userinfo&state=2#wechat_redirect\"");
            sb.Append("                  },");
            sb.Append("                 {");
            sb.Append("                     \"type\": \"view\", ");
            sb.Append("                      \"name\": \"保时捷游戏\", ");
            sb.Append("                      \"url\": \"http://shoes.4009990351.com/baoshijie.aspx\"");
            sb.Append("                  } ");                     
            sb.Append("            ]");
            sb.Append("        },");            
            sb.Append("        {");
            sb.Append("           \"name\": \"服务中心\", ");
            sb.Append("            \"sub_button\": [");
            sb.Append("                {");
            sb.Append("                    \"type\": \"view\", ");
            sb.Append("                    \"name\": \"个人中心\", ");
            sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc79aa72caccf9da2&redirect_uri=http%3a%2f%2fshoes.4009990351.com%2fuc.html&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");
            sb.Append("                }, ");
            /*
            sb.Append("                {");
            sb.Append("                    \"type\": \"view\", ");
            sb.Append("                    \"name\": \"我的订单\", ");
            sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc79aa72caccf9da2&redirect_uri=http%3a%2f%2fshoes.4009990351.com%2forder.html&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");
            sb.Append("                }, ");
            
            sb.Append("                {");
            sb.Append("                    \"type\": \"view\", ");
            sb.Append("                    \"name\": \"订单导入\", ");
            sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc79aa72caccf9da2&redirect_uri=http%3a%2f%2fshoes.4009990351.com%2fmoveOrder.html&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");
            sb.Append("                }, ");
            sb.Append("                {");
            sb.Append("                    \"type\": \"view\", ");
            sb.Append("                    \"name\": \"投诉建议\", ");
            sb.Append("                    \"url\": \"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc79aa72caccf9da2&redirect_uri=http%3a%2f%2fshoes.4009990351.com%2fcomplain.html&response_type=code&scope=snsapi_userinfo&state=i#wechat_redirect\"");
            sb.Append("                }, ");            
            sb.Append("                {");
            sb.Append("                    \"type\": \"view\", ");
            sb.Append("                    \"name\": \"关于皮具护理\", ");
            sb.Append("                    \"url\": \"http://mp.weixin.qq.com/s?__biz=MzIyNjA1NDcyNw==&mid=400329392&idx=2&sn=5b40792999a6a93ce427e3e85ed3300e&scene=1&srcid=1112nAV5tOs81JSxcTeL2UoR&from=groupmessage&isappinstalled=0#wechat_redirect\"");
            sb.Append("                }, ");            
            sb.Append("                {");
            sb.Append("                    \"type\": \"view\", ");
            sb.Append("                    \"name\": \"关于我们\", ");
            sb.Append("                    \"url\": \"http://mp.weixin.qq.com/s?__biz=MzIyNjA1NDcyNw==&mid=211545470&idx=1&sn=5c660e3edf73d91013a71fc5510c953b&scene=18#rd\"");
            sb.Append("                }");
            sb.Append("            ]");
            sb.Append("        }");
            */ 
            sb.Append("    ]");
            sb.Append("}");
            string ACCESS_TOKEN = Comm.Get_Access_Token(c);
            string GetUrl = " https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + ACCESS_TOKEN;
            string JsonStr = new Common(appid,secret).webRequest(GetUrl, sb.ToString());
            JsonData jd = JsonMapper.ToObject(JsonStr);
            if (jd["errcode"].ToString() == "0")
            {
                return "{Return:0,Msg:'OK'}";
            }
            else
            {
                try
                {
                    errmsg = "[" + jd["errcode"].ToString() + "]" + jd["errmsg"].ToString();
                }
                catch { }
            }
        }
        return "{Return:1,Msg:'" + errmsg + "'}";
    }

    /// <summary>
    /// 获取分类列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetClass(HttpContext c)
    {
        List<classInfo> la = new _Class().GetClassList(0, 0);
        if (la != null && la.Count > 0)
        {
            return response.Success(la);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取产品列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetProductList(HttpContext c)
    {
        int pid = string.IsNullOrEmpty(c.Request["pid"]) ? 0 : Convert.ToInt16(c.Request["pid"].ToString());
        int page = string.IsNullOrEmpty(c.Request["page"]) ? 0 : Convert.ToInt16(c.Request["page"].ToString());
        int type = string.IsNullOrEmpty(c.Request["type"]) ? 0 : Convert.ToInt16(c.Request["type"].ToString());
        string key = string.IsNullOrEmpty(c.Request["key"]) ? "" : c.Request["key"].ToString();
        string keyword = "";
        if (pid > 0)
        {
            keyword = " and pid = " + pid;
        }
        if (type > 0)
        {
            keyword = " and sign like '%" + type + ",%'";
        }
        if (key.Length > 0)
        {
            keyword = " and pName like '%" + key + "%' ";
        }
        string sql = "select * from t_product where state = 1 " + keyword + " order by isHot desc,allNum desc";
        if (type == 100)
        {
            sql += " limit " + Convert.ToInt16((page - 1) * perPage) + "," + perPage;
        }
        List<ProductFWeb> lo = new _ProductFWeb().GetProductList(sql);
        if (lo != null && lo.Count > 0)
        {
            return response.Success(lo);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取产品详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetProductInfo(HttpContext c)
    {
        int pid = string.IsNullOrEmpty(c.Request["pid"]) ? 0 : Convert.ToInt16(c.Request["pid"].ToString());
        ProductFWebInfo pf = new _ProductFWeb().GetProductInfo(pid);
        if (pf != null)
        {
            return response.Success(pf);
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取库存价格详情
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetUnitPrice(HttpContext c)
    {
        string unitNo = string.IsNullOrEmpty(c.Request["unitNo"]) ? "" : c.Request["unitNo"].ToString();
        if (unitNo.Length > 0)
        {
            List<UnitPrice> pf = new _Unit().GetUnitPriceList(unitNo);
            if (pf != null && pf.Count > 0)
            {
                return response.Success(pf);
            }            
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 获取运费价格列表
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string GetPostPrice(HttpContext c)
    {
        string pids = string.IsNullOrEmpty(c.Request["pids"]) ? "" : c.Request["pids"].ToString();
        if (pids.Length > 0)
        {
            List<postForWeb> pf = new _ProductFWeb().GetPostInfo(pids);
            List<post> post = new _Post().GetPost();
            Double postFee = 0;
            string provice = "";
            foreach (post item in post)
            {
                if (item.postType == 1)
                {
                    postFee = item.postFee;
                }
                if (item.postType == 2)
                {
                    provice = item.provice;
                }
            }
            if (pf != null && pf.Count > 0)
            {
                var o = new
                {
                    postFee = postFee,
                    provice = provice
                };
                return response.Success(pf, o);
            }
        }
        return Sys_Result.GetR(1, "");
    }

    /// <summary>
    /// 修改状态
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string UpdateOrder(HttpContext c)
    {
        string OrderNo = c.Request["OrderNo"] == null ? "" : c.Request["OrderNo"].ToString().Replace("#", "");
        int State = string.IsNullOrEmpty(c.Request["State"]) ? -1 : Convert.ToInt16(c.Request["State"].ToString());
        string openId = c.Request["openId"] == null ? "" : c.Request["openId"].ToString().Replace("#", "");
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt16(c.Request["uid"].ToString());
        if (OrderNo.Length > 0 && State > -1)
        {
            WebOrderInfo wo = new _WebOrder().GetOrderInfo(OrderNo);
            user u = new _User().GetUser(openId, "", 0);
            if (u != null && u.id == uid && wo != null)
            {
                var o = new
                {
                    state = State
                };
                if (new Main().UpdateDb(o, "t_order", "orderNo = '" + OrderNo + "'"))
                {
                    if (State == 8)
                    {
                        AddLog(OrderNo, "收货完成", uid, "", 0);
                    }
                    if (State == 9)
                    {
                        AddLog(OrderNo, "取消订单", uid, "", 0);
                        //微信支付自动退款
                        if (wo.isPay == 1)
                        {
                            try
                            {
                                OrderRefund(wo);
                                string MsgContent = "";
                                TMsg_Work tmo = new TMsg_Work().GetMessageBody("订单取消完成", OrderNo, DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[感谢您的支持]", out MsgContent);
                                Comm.SendTemplateMessage(c, tmo, new TMsg_Work().Key(), openId, BaseUrl + "/app/z_detail.html?no=" + OrderNo, MsgContent);
                            }
                            catch
                            {

                            }
                        }
                    }

                }
                return Sys_Result.GetR(0, "OK");
            }
        }
        return Sys_Result.GetR(1, "");
    }


    /// <summary>
    /// 处理售后
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string SaleService(HttpContext c)
    {
        string OrderNo = c.Request["OrderNo"] == null ? "" : c.Request["OrderNo"].ToString().Replace("#", "");
        string unitNo = c.Request["unitNo"] == null ? "" : c.Request["unitNo"].ToString();
        string openId = c.Request["openId"] == null ? "" : c.Request["openId"].ToString().Replace("#", "");
        int uid = string.IsNullOrEmpty(c.Request["uid"]) ? 0 : Convert.ToInt16(c.Request["uid"].ToString());
        if (OrderNo.Length > 0)
        {
            WebOrderInfo wo = new _WebOrder().GetOrderInfo(OrderNo);
            user u = new _User().GetUser(openId, "", 0);
            if (u != null && u.id == uid && wo != null)
            {
                string product = "";
                foreach (WebOrderProduct item in wo.product)
                {
                    if (item.unitNo == unitNo)
                    {
                        product = item.pName + "[" + item.pNum + "*" + item.price + "]";
                        break;
                    }
                }
                string MsgContent = "";
                TMsg_Work tmo = new TMsg_Work().GetMessageBody("客户[" + wo.contact + "," + wo.tel + "]申请售后服务,产品" + product, OrderNo, DateTime.Now.ToString("yyyy-MM-dd HH:mm"), "[感谢您的支持]", out MsgContent);
                Comm.SendTemplateMessage(c, tmo, new TMsg_Work().Key(), DefaultOpenId, "", MsgContent);
                return Sys_Result.GetR(0, "OK");
            }
        }
        return Sys_Result.GetR(1, "");
    }
   
    /// <summary>
    /// 初始化微信JS
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public Common.WxConfig InitJsApi(HttpContext c)
    {
        try
        {
            string Urls = c.Request["Url"] == null ? "" : c.Request["Url"].ToString();
            bool isFail = string.IsNullOrEmpty(c.Request["isFail"]) ? false : true;
            if (Urls.IndexOf("#") != -1)
            {
                Urls = Urls.Split('#')[0].ToString();
            }
            Urls = Urls.Replace("%26", "&");
            Urls = Urls.Replace("|", "%7C");
            string jsApi_ticket = "";
            string Access_Token = "";
            if (isFail || c.Cache["Para_JsApiTicket"] == null || c.Cache["Para_JsApiTicket"].ToString().Length == 0)
            {
                Access_Token = Comm.Get_Access_Token(c);
                //获取网页调用临时票据
                string r = "";
                jsApi_ticket = new Common(appid, secret).Get_jsapi_ticket(Access_Token, out r);
                new Main().AddTestLog("r", r);
                new Main().AddTestLog("jsApi_ticket", jsApi_ticket);
                c.Cache.Add("Para_JsApiTicket", jsApi_ticket, null, System.DateTime.UtcNow.AddMinutes(100), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
            }
            else
            {
                jsApi_ticket = c.Cache["Para_JsApiTicket"].ToString();
            }


            string TempS = "";
            new Main().AddTestLog("isFail-Urls", isFail.ToString() + Urls);
            Common.WxConfig w = Common.Get_Config_(Urls, jsApi_ticket, out TempS);
            new Main().AddTestLog("TempS", TempS);
            return w;
        }
        catch
        {
            return null;
        }


    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}