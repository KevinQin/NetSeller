<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Web.SessionState;
using System.Text;
using System.Text.RegularExpressions;
using LitJson;
using com.seascape.tools;


public class Handler:IHttpHandler,IRequiresSessionState {
    //分页大小
    public static int perPage = 10;
    public static string MsgUrl = "http://ns.seascapeapp.cn/service/handler.ashx";
    public static string BaseUrl = "http://ns.seascapeapp.cn/";
    public static bool DisableCache = false;
    public static string DefaultWrokNo = "100";

    static Response response;
    HttpContext _c;

    public void ProcessRequest(HttpContext c) {
        response = new Response();
        _c = c;
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
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
        string Result = response.Fail("System Exception[" + f + "]", 1);
        Log.D("[A]Request-[FN:" + f + "]", c);
        try
        {
            switch (f)
            {
                case 5:
                    Result = GetLocation(c);//获取地理位置
                    break;
                case 999:
                    Result = test(c);
                    break;
                default:
                    break;
            }
        }
        catch (Exception e)
        {
            Result = e.Message.ToString();
        }
        Log.D("[A]Result-" + f + ":" + Result.ToString(), c);
        return ReplaceTableName(Result);
    }



    public string GetLocation(HttpContext c) {
        double latitude = Convert.ToDouble(c.Request["latitude"]);
        double longitude = Convert.ToDouble(c.Request["longitude"]);
        return getFormattedAddress(latitude, longitude);
    }

    private string getFormattedAddress(double latitude, double longitude)
    {
        try
        {
            string url = "http://maps.google.cn/maps/api/geocode/json?latlng={0},{1}&sensor=true&language=zh-CN";
            string json = BasicTool.webRequest(string.Format(url, latitude, longitude));
            LitJson.JsonData allData = LitJson.JsonMapper.ToObject(json);
            LitJson.JsonData resultData = allData["results"];
            LitJson.JsonData firstData = resultData[0];
            string formatAddress = firstData["formatted_address"].ToString();
            formatAddress = formatAddress.Split(' ')[0].Replace("中国", "").Trim();
            int len = firstData["address_components"].Count;
            //string Address = firstData["address_components"][0]["long_name"].ToString();
            string prov = firstData["address_components"][len-3]["long_name"].ToString();
            string city = firstData["address_components"][len-4]["long_name"].ToString();
            string dist = firstData["address_components"][len-5]["long_name"].ToString();
            string Address = formatAddress.Replace(prov, "").Replace(city, "").Replace(dist, "");
            if (formatAddress.ToUpper().IndexOf("unnamed") > -1) {
                Address = "";
                if (city != "") { Address += city; }
                if (dist != "") { Address += dist; }
                if (Address == "") { Address = prov; }
            }
            object obj = new { Full = formatAddress, A=Address, P = prov, C = city, D = dist };
            return response.Success(obj);
        }
        catch (Exception ex)
        {
            return response.Fail("can not get location");
        }
    }

    /// <summary>
    /// 得到用户IP
    /// </summary>
    /// <param name="r">Request对象</param>
    /// <returns></returns>
    public static string getIp(HttpRequest r)
    {
        string Ip = string.Empty;
        if (r.ServerVariables["HTTP_VIA"] != null)
        {
            if (r.ServerVariables["HTTP_X_FORWARDED_FOR"] == null)
            {
                if (r.ServerVariables["HTTP_CLIENT_IP"] != null)
                    Ip = r.ServerVariables["HTTP_CLIENT_IP"].ToString();
                else
                    if (r.ServerVariables["REMOTE_ADDR"] != null)
                    Ip = r.ServerVariables["REMOTE_ADDR"].ToString();
                else
                    Ip = "0.0.0.0";
            }
            else
                Ip = r.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
        }
        else if (r.ServerVariables["REMOTE_ADDR"] != null)
        {
            Ip = r.ServerVariables["REMOTE_ADDR"].ToString();
        }
        else
        {
            Ip = "0.0.0.0";
        }
        return Ip;
    }

    public string GetOrderNo()
    {
        return string.Format("{0}{1:00}", DateTime.Now.ToString("yyMMddHHmmss"), new Random().Next(99));
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

    private string ReplaceTableName(string str)
    {
        Regex reg = new Regex(",\\\"TABLENAME\\\":\\\"\\w*\\\"");
        str = reg.Replace(str, "");
        return str;
    }

    private string test(HttpContext c) {
            return "";
    }

}