<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Xml;
using System.Text;
using System.IO;
using LitJson;
using com.seascape.tools;
using Seascape.Model;
using Seascape.Model.View;
using Seascape.Model.WebView;
using Seascape.Data;
using Seascape.Data.WebView;
using Seascape.WxApi;
using Seascape.Data.Tmessage;

public class Handler : IHttpHandler
{
    public static string HjKeyValue = "Seascape.Fast.Fix";
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret");    
    //微信支付商户
    public static string mch_id = com.seascape.tools.BasicTool.GetConfigPara("mch_id");
    //微信支付提交服务器IP
    public static string client_ip = com.seascape.tools.BasicTool.GetConfigPara("client_ip");
    //合作伙伴默认每单提取金额
    public static int partnerRedNum = 20*100;

    public static string MsgUrl = "";
    
    public void ProcessRequest(HttpContext c)
    {
        string Result = "";
        new Main().AddTestLog("PayCallBack", "-------");
        Result = OperPayResult(c);//处理支付结果
        new Main().AddTestLog("Result", Result);
        c.Response.ContentType = "text/plain";
        c.Response.Write(Result);
    }

    
    /// <summary>
    /// 处理支付返回结果
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string OperPayResult(HttpContext c)
    {  
        XmlDocument Xml = new XmlDocument();
        string Xmls = ConvertStream(c);
        new Main().AddTestLog("PayCallBack-Xmls", Xmls);
        Xml.LoadXml(Xmls);
        string appid = Xml.DocumentElement.SelectSingleNode("appid").InnerText;
        string mch_id = Xml.DocumentElement.SelectSingleNode("mch_id").InnerText;
        string nonce_str = Xml.DocumentElement.SelectSingleNode("nonce_str").InnerText;
        string sign = Xml.DocumentElement.SelectSingleNode("sign").InnerText;
        string result_code = Xml.DocumentElement.SelectSingleNode("result_code").InnerText;
        string openid = Xml.DocumentElement.SelectSingleNode("openid").InnerText;
        string is_subscribe = Xml.DocumentElement.SelectSingleNode("is_subscribe").InnerText;
        string trade_type = Xml.DocumentElement.SelectSingleNode("trade_type").InnerText;
        string bank_type = Xml.DocumentElement.SelectSingleNode("bank_type").InnerText;
        string total_fee = Xml.DocumentElement.SelectSingleNode("total_fee").InnerText;
        string transaction_id = Xml.DocumentElement.SelectSingleNode("transaction_id").InnerText;
        string out_trade_no = Xml.DocumentElement.SelectSingleNode("out_trade_no").InnerText;
        string time_end = Xml.DocumentElement.SelectSingleNode("time_end").InnerText;
        string attach = Xml.DocumentElement.SelectSingleNode("attach").InnerText;
        new Main().AddTestLog("attach", attach);
        string OrderNo = out_trade_no.Split('_')[0];
        try
        {
            {
                orderInfo order = new _OrderInfo().GetOrderInfo(OrderNo, 0);
                int uid = 0;
                if (order != null)
                {
                    uid = order.userId;
                }
                if (result_code == "SUCCESS")
                {
                    new Main().AddTestLog("keyValue", BasicTool.MD5(OrderNo + HjKeyValue).ToUpper());
                    if (attach == BasicTool.MD5(OrderNo + HjKeyValue).ToUpper())
                    {
                        var o7 = new
                        {
                            payOn = DateTime.Now,
                            isPay = 1,
                            state = 1
                        };
                        new Main().UpdateDb(o7, "t_order", "OrderNo = '" + OrderNo + "'");
                        var op = new
                        {
                            enable = 1,
                            out_trade_no = out_trade_no,
                            transaction_id = transaction_id,
                            total_fee = Math.Round(Convert.ToDouble(total_fee), 2)
                        };
                        new Main().UpdateDb(op, "t_wxPay", "OrderNo = '" + OrderNo + "'");
                        AddLog(OrderNo, "支付完成，本次收款<em>￥" + op.total_fee / 100.0 + "元</em>", uid, "", 0);
                        BasicTool.webRequest(MsgUrl + "?fn=92&orderNo=" + OrderNo);
                    }
                }
                else
                {
                    string return_msg = Xml.DocumentElement.SelectSingleNode("return_msg").InnerText;
                    var op = new
                    {
                        enable = 2,
                        ReturnMsg = result_code
                    };
                    new Main().UpdateDb(op, "t_wxPay", "OrderNo = '" + OrderNo + "'");
                    AddLog(OrderNo, "支付失败[" + return_msg + "]", uid, "", 0);
                }                
            }
        }
        catch
        {
            
        }
        StringBuilder s = new StringBuilder();
        s.Append("<xml>");
        s.Append("<return_code><![CDATA[SUCCESS]]></return_code>");
        s.Append("<return_msg><![CDATA[OK]]></return_msg>");
        s.Append("</xml>");
        return s.ToString();
    }
    
    /// <summary>
    /// 输入流转字符串
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string ConvertStream(HttpContext c)
    {
        System.IO.Stream sm = c.Request.InputStream;//获取post数据
        int len = (int)sm.Length;//post数据的长度
        byte[] inputByts = new byte[len];//存储post数据
        sm.Read(inputByts, 0, len);//将post数据写入数组
        sm.Close();//关闭流
        string data = Encoding.GetEncoding("utf-8").GetString(inputByts);//转换为unicode字符串  
        return data;
    }

    /// <summary>
    /// 添加日志
    /// </summary>
    /// <param name="OrderNo"></param>
    /// <param name="Content"></param>
    /// <param name="uid"></param>
    /// <param name="cid"></param>
    /// <param name="aid"></param>
    public void AddLog(string OrderNo, string Content, int uid, string workNo, int lType)
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
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}