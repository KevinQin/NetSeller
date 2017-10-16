using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using com.seascape.tools;

/// <summary>
/// WeChat 的摘要说明
/// </summary>
public class WeChat
{
    static string BASE_URL = "http://s.seascapeapp.cn/";

    public WeChat()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }

    public static void InitConifg(Page page)
    {
        string urlPath = page.Request.Url.AbsoluteUri;
        if (urlPath.IndexOf("#") > -1)
        {
            urlPath = urlPath.Split('#')[0];
        }
        urlPath = urlPath.Replace("&", "%26");
        string Url = BASE_URL + "/service/handler.ashx?fn=100&Url=" + urlPath;
        string Para = BasicTool.webRequest(Url);
        Object wxObj = new { appid = "", timestamp = "", nonce = "", signature = "" };
        if (Para.Split('|').Length == 4)
        {
            string[] Paras = Para.Split('|');
            wxObj = new { appId = Paras[3].ToString(), timestamp = Paras[1].ToString(), nonceStr = Paras[2].ToString(), signature = Paras[0].ToString() };
        }
        if (!page.ClientScript.IsStartupScriptRegistered(page.GetType(), "jsmode"))
        {
            page.ClientScript.RegisterStartupScript(page.GetType(), "jsmode", "<script>var WxConfigInfo=" + LitJson.JsonMapper.ToJson(wxObj) + ";</script>");
        }
    }

    public static void InitPayConfig(Page page, string orderno)
    {
        string strPayConfig = BasicTool.webRequest(BASE_URL + "/service/Handler.ashx?fn=99&orderno=" + orderno);
        Object PayConfig = new { appid = "", timestamp = "", nonce = "", signature = "", package = "" };
        if (strPayConfig.Split('|').Length == 5)
        {
            string[] payPar = strPayConfig.Split('|');
            PayConfig = new { appid = payPar[0].ToString(), timestamp = payPar[4].ToString(), nonce = payPar[1].ToString(), signature = payPar[3].ToString(), package = payPar[2].ToString() };
            if (!page.ClientScript.IsStartupScriptRegistered(page.GetType(), "jspaymode"))
            {
                page.ClientScript.RegisterStartupScript(page.GetType(), "jspaymode", "<script>var WxPayConfigInfo=" + LitJson.JsonMapper.ToJson(PayConfig) + ";</script>");
            }
        }
        else
        {           
            page.Response.Redirect("orderdetail.aspx?orderno=" + orderno);
        }
    }


    public static bool SendTemplateMsg(string orderno,OrderState state) {
        return true;
    }

    public enum OrderState {
        InOrder=0,
        Confirmated =1,
        Payed_Fee =2,
        Payed_G=3,
        PreCancel=4,
        Canceled =5,
        Refund =6,
        Unkonw =9
    }
}