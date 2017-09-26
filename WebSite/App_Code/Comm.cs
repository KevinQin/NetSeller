using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Seascape.WxApi;
using Seascape.Model;
using Seascape.Data;
using Seascape.Data.Tmessage;
/// <summary>
/// Comm 的摘要说明
/// </summary>
public class Comm
{
    //微信公众号相关
    public static string appid = com.seascape.tools.BasicTool.GetConfigPara("appid");
    public static string secret = com.seascape.tools.BasicTool.GetConfigPara("secret");    
	public Comm()
	{
		//
		// TODO: 在此处添加构造函数逻辑
		//
	}

    /// <summary>
    /// 获取全局Access_Token
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public static string Get_Access_Token(HttpContext c)
    {
        string Access_Token = "";
        if (c.Cache["Global_Access_Token"]==null)
        {
            Access_Token = new Common(appid, secret).Get_Access_Token();
            c.Cache.Add("Global_Access_Token", Access_Token, null, System.DateTime.UtcNow.AddMinutes(100), TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Normal, null);
        }
        else
        {
            Access_Token = c.Cache["Global_Access_Token"].ToString();
        }
        return Access_Token;
    }

    /// <summary>
    /// 添加参数日志
    /// </summary>
    /// <param name="c"></param>
    public static void AddQueryLog(HttpContext c)
    {
        int F = string.IsNullOrEmpty(c.Request["fn"]) ? 0 : Convert.ToInt16(c.Request["fn"]);
        new Main().AddTestLog_B("[M]F", F.ToString());
        string Query = "";
        foreach (string p in c.Request.Params.AllKeys)
        {
            Query += p + ":" + c.Request[p].ToString() + "&";
            if (p.IndexOf("ALL_HTTP") != -1)
            {
                break;
            }
        }
        new Main().AddTestLog_B("[M]Query-" + F.ToString(), Query.ToString());
    }

    /// <summary>
    /// 时间戳转时间
    /// </summary>
    /// <param name="timeStamp"></param>
    /// <returns></returns>
    public static DateTime UnixTimeToTime(string timeStamp)
    {
        DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
        long lTime = long.Parse(timeStamp + "0000000");
        TimeSpan toNow = new TimeSpan(lTime);
        return dtStart.Add(toNow);
    }

    /// <summary>
    /// 获取时间戳
    /// </summary>
    /// <param name="time"></param>
    /// <returns></returns>
    public static int ConvertDateTimeInt(System.DateTime time)
    {
        System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
        return (int)(time - startTime).TotalSeconds;
    }

    /// <summary>
    /// 发送模板消息
    /// </summary>
    /// <param name="o"></param>
    /// <param name="key"></param>
    /// <param name="openid"></param>
    /// <param name="url"></param>
    public static void SendTemplateMessage(HttpContext c, object o, string key, string openid, string url, string MsgContent)
    {
        TMessage t = new TMessage
        {
            touser = openid,
            data = o,
            template_id = key,
            url = url,
            topcolor = ""
        };
        try
        {
            templateMsg tmp = new templateMsg
            {
                msgId = key,
                msgBody = LitJson.JsonMapper.ToJson(o),
                msgUrl = url,
                openId = openid,
                sendTime = DateTime.Now,
                msgContent = MsgContent,
                orderNo = ""
            };
            new Main().AddToDb(tmp, "t_templateMsg");
        }
        catch (Exception e)
        {
            Comm.WriteLog(c,e.Message);
        }
        new TMessage().Send_TemplateMsg(t, Get_Access_Token(c));
    }


    /// <summary>
    /// 新增日志文件
    /// </summary>
    /// <param name="strMemo"></param>
    public static void WriteLog(HttpContext c, string strMemo)
    {
        string filename = c.Server.MapPath("/") + "/log/" + DateTime.Now.ToString("yyMMdd") + ".txt";
        strMemo = "[" + DateTime.Now.ToString("MM-dd HH:mm:ss") + "]" + strMemo;
        System.IO.StreamWriter sr = null;
        try
        {
            if (!System.IO.File.Exists(filename))
            {
                sr = System.IO.File.CreateText(filename);
            }
            else
            {
                sr = System.IO.File.AppendText(filename);
            }
            sr.WriteLine(strMemo);
        }
        catch
        {
        }
        finally
        {
            if (sr != null)
                sr.Close();
        }
    }
}