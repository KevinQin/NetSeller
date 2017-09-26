<%@ WebHandler Language="C#" Class="WxHandler" %>

using System;
using System.Web;
using System.IO;
using LitJson;
using System.Text;
using Seascape.Model;
using Seascape.WxApi;
using Seascape.Data;
using Seascape.Data.Tmessage;
using System.Net;

public class WxHandler : IHttpHandler {

    HttpContext context = null;
    public string postStr = "";
    public string FromUserName = "";
    public string ToUserName = "";
    public string Content = "";
    public string AttachContent = "";
    public string pContent = "";
    public string MsgType = "";
    public string nickName = "";
    public string photo = "";
    public int adId = 0;
    public string EventKey = "";
    public string Event = "";
    public int OperType = 0;
    public int uid = 0;
    public user u_src = null;
    public int TMsgType = 1;
    public static int userNum = 9;
    
    //默认URL
    public static string BaseUrl = "http://s.seascapeapp.cn/";
    
    public void ProcessRequest(HttpContext param_context)
    {
        context = param_context;
        //valid();//用于验证
        if (context.Request.HttpMethod.ToLower() == "post")
        {
            System.IO.Stream s = context.Request.InputStream;
            byte[] b = new byte[s.Length];
            s.Read(b, 0, (int)s.Length);
            postStr = System.Text.Encoding.UTF8.GetString(b);
            if (!string.IsNullOrEmpty(postStr))
            {
                responseMsg(postStr, param_context);
            }
        }
    }
 
    /// <summary>
    /// 业务处理
    /// </summary>
    /// <param name="postStr"></param>
    /// <param name="c"></param>
    public void responseMsg(string postStr,HttpContext c)
    {
        System.Xml.XmlDocument postObj = new System.Xml.XmlDocument();
        postObj.LoadXml(postStr);
        Comm.WriteLog(c,"responseMsg:-------" + postStr);
        Comm.WriteLog(c, "XmlObj:-------" + postObj);
        try
        {
            Event = postObj.GetElementsByTagName("Event").Item(0).InnerText;
            FromUserName = postObj.GetElementsByTagName("FromUserName").Item(0).InnerText;
            ToUserName = postObj.GetElementsByTagName("ToUserName").Item(0).InnerText;
            MsgType = postObj.GetElementsByTagName("MsgType").Item(0).InnerText;  
            EventKey = postObj.GetElementsByTagName("EventKey").Item(0).InnerText;
        }
        catch(Exception ex)
        {
            Comm.WriteLog(c, "Exception" + ex.ToString());
        }
        Comm.WriteLog(c, "EventKey:-------" + EventKey);
        switch (MsgType)
        {
            case "text"://文本消息
                Content = "";
                AttachContent = "";
                break;
            case "event"://事件
                Event = Event.ToLower();
                switch (Event)
                {
                    case "subscribe"://关注
                        OperType = OperEventForSubscribe(postObj,context);
                        break;
                    case "unsubscribe"://取消关注
                        OperType = OperEventForUnSubscribe(postObj);
                        break;
                    case "scan"://已关注的扫描二维码
                        OperType = OperEventForScan(postObj);                  
                        break;
                    case "click"://点击菜单
                        OperType = OperEventForClick(postObj, context);        
                        break;                        
                }
                break;
        }

        var time = DateTime.Now;


        if (Content.Length > 0)
        {
            string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
            string content = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + Content + "\"}}";
            Comm.WriteLog(c, new WxTool().webRequest(url, content));
        }

        if (AttachContent.Length > 0)
        {
            string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
            string content = "{\"touser\":\"" + FromUserName + "\",\"msgtype\":\"text\",\"text\":{\"content\":\"" + AttachContent + "\"}}";
            //SendImage(uid, c, FromUserName, photo);
        }

        if (pContent.Length > 0)
        {
            Comm.WriteLog(c, TMsgType.ToString());
            SendMessage(c, pContent, TMsgType, u_src, nickName);
        }
        OperResult(c);
        context.Response.End();
    }
    
    private void OperResult(HttpContext c)
    {
        switch (OperType)
        {
            case 0://文本消息直接转给客服
                var textpl_ = "<xml><ToUserName><![CDATA[" + FromUserName + "]]></ToUserName>" +
                             "<FromUserName><![CDATA[" + ToUserName + "]]></FromUserName>" +
                             "<CreateTime>" + Comm.ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[transfer_customer_service]]></MsgType>" +
                             "</xml> ";
                context.Response.Write(textpl_);
                context.Response.End();                       
                break;
            case 3:
                if (uid > 0)
                {
                    HbCreate.SendImage(c, FromUserName, HbCreate.CreateQrcode(uid.ToString(), c, 0));    
                }
                else
                {
                    Comm.WriteLog(c, "uid==0");
                }
                break;
        }

        var textpl = "<xml><ToUserName><![CDATA[" + FromUserName + "]]></ToUserName>" +
             "<FromUserName><![CDATA[" + ToUserName + "]]></FromUserName>" +
             "<CreateTime>" + Comm.ConvertDateTimeInt(DateTime.Now) + "</CreateTime><MsgType><![CDATA[text]]></MsgType>" +
             "<Content><![CDATA[success]]></Content><FuncFlag>0</FuncFlag></xml> ";
        context.Response.Write("");
    }
    
    
    /// <summary>
    /// 处理点击菜单事件
    /// </summary>
    /// <param name="postObj"></param>
    /// <returns></returns>
    private int OperEventForClick(System.Xml.XmlDocument postObj,HttpContext c)
    {
        string key = postObj.GetElementsByTagName("EventKey").Item(0).InnerText;
        if (key == "Action_DYR")
        {
            user u = new _User().GetUser(FromUserName, "", 0);
            if (u != null)
            {
                string HbImgUrl = new HbCreate().CreateHB(c, u.id, "01");
                if (HbImgUrl.Length > 0)
                {
                    HbCreate.SendImage(c, FromUserName, HbImgUrl);
                }
            }   
        }      
        return 0;
    }
    
    /// <summary>
    /// 处理扫码事件
    /// </summary>
    /// <param name="postObj"></param>
    /// <returns></returns>
    private int OperEventForScan(System.Xml.XmlDocument postObj)
    {
        Content = "欢迎回来！";
        return 0;
    }

    /// <summary>
    /// 取消关注事件
    /// </summary>
    /// <param name="postObj"></param>
    /// <returns></returns>
    private int OperEventForUnSubscribe(System.Xml.XmlDocument postObj)
    {
        var o = new
        {
            isSubscribe = 0
        };
        new Main().UpdateDb(o, "t_user", "openId = '" + FromUserName + "'");
        return 0;
    }
    
    /// <summary>
    /// 处理关注事件
    /// </summary>
    /// <param name="postObj"></param>
    /// <returns></returns>
    private int OperEventForSubscribe(System.Xml.XmlDocument postObj,HttpContext c)
    {
        string EventKey = postObj.GetElementsByTagName("EventKey").Item(0).InnerText.Replace("qrscene_", "");
        int QrCode = 0;
        int oType = 3;
        try
        {
            if (EventKey.IndexOf("_") > -1)
            {
                if (EventKey.Split('_').Length == 2)
                {
                    QrCode = Convert.ToInt32(EventKey.Split('_')[0]);
                    adId = Convert.ToInt16(EventKey.Split('_')[1]);
                }            
            }
            else
            {
                QrCode = Convert.ToInt32(EventKey);
            }
        }
        catch
        {
            QrCode = 0;
        }
        Comm.WriteLog(c,"关注来源" + QrCode);
        user u = new _User().GetUser(FromUserName, "", 0);
        if (u == null)
        {
            string r = "";
            UserInfo ui = UserInfo.getUserInfoByGlobal(Comm.Get_Access_Token(c), FromUserName, out r);
            if (ui != null)
            {
                Comm.WriteLog(c, "openid:" + ui.openid);
                u = new user()
                {
                    nickName = ui.nickname.Replace("'", "").Replace(@"""", ""),
                    photoUrl = ui.headimgurl,
                    area = ui.country + "|" + ui.province + "|" + ui.city,
                    sex = ui.sex,
                    openId = ui.openid,
                    sourceId = QrCode,
                    addOn = DateTime.Now,
                    adId = adId,
                    isSubscribe = 1
                };
                uid = new Main().AddToDbForId(u, "t_user");
                Comm.WriteLog(c, "uid:" + uid);
            }
            nickName = u.nickName;
            Content = "万品微店欢迎您的驾临，我们已经准备好为您提供服务了。";
            Content += "\r\n\r\n下面是您的专属二维码，把二维码发给朋友/朋友圈，获得好友扫码认可，提升人气值，人气值≧9即可解锁会员资格，享受会员超值福利。";
            if (QrCode > 300)
            {
                pContent = "【通知】您的好友{nickName}来支持你了，人气值+1，距离会员资格，还差{num}人气！";
                u_src = new _User().GetUser("", "", QrCode);
                if (u_src != null)
                {
                    if (u_src.uType == 0)
                    {
                        int fire = 0;//new user().GetFire(QrCode);
                        if (fire < userNum)
                        {
                            pContent = pContent.Replace("{nickName}", u.nickName);
                            pContent = pContent.Replace("{num}", (userNum - fire).ToString());
                        }
                        if (fire == userNum)
                        {
                            pContent = "成功啦，您已经获得了9位好友的支持，成功获得会员资格！";
                            var o = new
                            {
                                uType = 1
                            };
                            new Main().UpdateDb(o, "t_user", "id=" + QrCode);
                            TMsgType = 2;
                        }
                    }
                }
                Comm.WriteLog(c, pContent);
            }

        }
        else
        {
            string r = "";
            UserInfo ui = UserInfo.getUserInfoByGlobal(Comm.Get_Access_Token(c), FromUserName, out r);
            if (ui != null && !string.IsNullOrEmpty(ui.nickname))
            {
                var o = new
                {
                    nickName = ui.nickname.Replace("'", "").Replace(@"""", ""),
                    photoUrl = ui.headimgurl,
                    area = ui.country + "|" + ui.province + "|" + ui.city,
                    sex = ui.sex,
                    openId = ui.openid,
                    sourceId = QrCode,
                    addOn = DateTime.Now,
                    isSubscribe = 1
                };
                new Main().UpdateDb(o, "t_user", "id=" + u.id);
            }
            oType = 2;
            Content = "欢迎回来！";
        }
        return oType;
    }


    public void SendMessage(HttpContext c, string content, int TMsgType, user u_src, string nickName)
    {
        string MsgContent = "";
        if (u_src != null)
        {
            if (TMsgType == 2)
            {
                TMsg_Grade tmo = new TMsg_Grade().GetMessageBody(content, "普通会员", "VIP会员", "[万品微店]", out MsgContent);
                Comm.SendTemplateMessage(c, tmo, new TMsg_Grade().Key(), u_src.openId, BaseUrl + "c_uc.html", MsgContent);
            }
            else
            {
                Comm.WriteLog(c,u_src.openId);
                TMsg_Care tmo = new TMsg_Care().GetMessageBody(content, nickName, DateTime.Now.ToString("yyyy-MM-dd"), "[万品微店]", out MsgContent);
                Comm.SendTemplateMessage(c, tmo, new TMsg_Care().Key(), u_src.openId, BaseUrl + "c_uc.html", MsgContent);
            }   
        }
    }

   

    
    
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }


    public void valid()
    {
        var echostr = context.Request["echoStr"].ToString();
        if (checkSignature() && !string.IsNullOrEmpty(echostr))
        {
            context.Response.Write(echostr);
            context.Response.End();//推送...不然微信平台无法验证token
        }
    }

    public bool checkSignature()
    {
        var signature = context.Request["signature"].ToString();
        var timestamp = context.Request["timestamp"].ToString();
        var nonce = context.Request["nonce"].ToString();
        var token = "1796699EE40D4CE7B0EC5003B9D0CA26";
        string[] ArrTmp = { token, timestamp, nonce };
        Array.Sort(ArrTmp);     //字典排序
        string tmpStr = string.Join("", ArrTmp);
        tmpStr = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(tmpStr, "SHA1");
        tmpStr = tmpStr.ToLower();
        if (tmpStr == signature)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public string GetSha1(System.Collections.Generic.List<string> codelist)
    {
        codelist.Sort();
        var combostr = string.Empty;
        for (int i = 0; i < codelist.Count; i++)
        {
            combostr += codelist[i];
        }
        return EncryptToSHA1(combostr);
    }

    public string EncryptToSHA1(string str)
    {
        System.Security.Cryptography.SHA1CryptoServiceProvider sha1 = new System.Security.Cryptography.SHA1CryptoServiceProvider();
        byte[] str1 = System.Text.Encoding.UTF8.GetBytes(str);
        byte[] str2 = sha1.ComputeHash(str1);
        sha1.Clear();
        (sha1 as IDisposable).Dispose();
        return Convert.ToBase64String(str2);
    }
}