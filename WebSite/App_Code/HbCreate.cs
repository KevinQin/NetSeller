using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Seascape.WxApi;
using System.Net;
using System.Text;
using System.IO;
using LitJson;


/// <summary>
/// HbCreate 的摘要说明
/// </summary>
public class HbCreate
{
    /// <summary>
    /// 生成二维码
    /// </summary>
    /// <param name="uid">二维码编号</param>
    /// <param name="c"></param>
    /// <param name="qrcodeType">0普通二维码1指定海报二维码</param>
    public static string CreateQrcode(string uid, HttpContext c, int qrcodeType)
    {
        string FilePath = c.Server.MapPath("/pic/qrcode/" + uid + ".jpg");
        Comm.WriteLog(c, "FilePath:" + FilePath);
        if (!File.Exists(FilePath))
        {
            if (qrcodeType == 0)
            {
                string Result = new Common("", "").GetQR_Code(Comm.Get_Access_Token(c), FilePath, Convert.ToInt32(uid));
                Comm.WriteLog(c, "Result01:" + Result);
            }
            else
            {
                string Result = new Common("", "").GetQR_Code_Str(Comm.Get_Access_Token(c), FilePath, uid);
                Comm.WriteLog(c, "Result02:" + Result);
            }
        }
        return FilePath;
    }

    /// <summary>
    /// 上传多媒体文件并发送给客户
    /// </summary>
    /// <param name="c"></param>
    /// <param name="openId"></param>
    /// <param name="FilePath"></param>
    public static void SendImage(HttpContext c, string openId, string FilePath)
    {
        string url = string.Format("http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token={0}&type={1}", Comm.Get_Access_Token(c), "image");
        string json = HttpUploadFile(url, FilePath);
        JsonData j = JsonMapper.ToObject(json);
        try
        {
            string media_id = j["media_id"].ToString();
            url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + Comm.Get_Access_Token(c);
            string content = "{\"touser\":\"" + openId + "\",\"msgtype\":\"image\",\"image\":{\"media_id\":\"" + media_id + "\"}}";
            new WxTool().webRequest(url, content);
        }
        catch (Exception e)
        {

        }
    }

    /// <summary>
    /// 生成海报
    /// </summary>
    /// <param name="c"></param>
    /// <returns></returns>
    public string CreateHB(HttpContext c, int uid, string MbNo)
    {
        int[] size = new int[4] { 386, 681, 128, 128 };
        if (MbNo == "04")
        {
            size = new int[4] { 438, 912, 130, 130 };
        }
        if (MbNo == "03")
        {
            size = new int[4] { 356, 838, 128, 128 };
        }
        if (MbNo == "05")
        {
            size = new int[4] { 392, 962, 100, 100 };
        }
        string MbPath = c.Server.MapPath("/pic/template/MB" + MbNo + ".jpg");
        //string FilePath = c.Server.MapPath("/images/mb14.jpg");
        //string UserPath = c.Server.MapPath("/qrcode/userPic/" + uid + ".jpg");
        string CodePath = CreateQrcode(uid.ToString() + "_" + MbNo, c, 1);
        string ResultPath = c.Server.MapPath("/pic/hb/" + uid.ToString() + "_" + MbNo + ".jpg");

        if (File.Exists(ResultPath))
        {
            return ResultPath;
        }

        //下载已有图片
        //DoGetImage(c, photo, uid);

        System.Drawing.Image imgBack = System.Drawing.Image.FromFile(MbPath);
        //System.Drawing.Image imgMb = System.Drawing.Image.FromFile(FilePath);
        // System.Drawing.Image imgUser = System.Drawing.Image.FromFile(UserPath);
        System.Drawing.Image imgc = System.Drawing.Image.FromFile(CodePath);

        //从指定的System.Drawing.Image创建新的System.Drawing.Graphics      
        System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(imgBack.Width, imgBack.Height, System.Drawing.Imaging.PixelFormat.Format32bppArgb);
        System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bmp);
        //头像位置 68 54 180 180
        //头部昵称 109 264
        g.DrawImage(imgBack, 0, 0);
        //g.DrawImage(imgUser, 93, 101, 132, 132);
        //g.DrawImage(imgUser, 122, 200, 110, 110);
        //g.DrawImage(imgUser, 110, 186, 110, 110);
        //g.DrawImage(imgMb, 0, 0, imgMb.Width, imgMb.Height);
        //g.DrawImage(imgc, 220, 320, 184, 184);
        g.DrawImage(imgc, size[0], size[1], size[2], size[3]);
        //g.DrawImage(imgUser, 153, 910, 50, 50);

        bmp.Save(ResultPath, System.Drawing.Imaging.ImageFormat.Jpeg);
        return ResultPath;
    }

    public string DoGetImage(HttpContext c, string photo, int uid)
    {
        string path = c.Server.MapPath("/qrcode/userPic/" + uid + ".jpg");
        if (File.Exists(path))
        {
            return path;
        }
        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(photo);

        req.ServicePoint.Expect100Continue = false;
        req.Method = "GET";
        req.KeepAlive = true;

        req.ContentType = "image/png";
        HttpWebResponse rsp = (HttpWebResponse)req.GetResponse();

        System.IO.Stream stream = null;

        try
        {
            // 以字符流的方式读取HTTP响应
            stream = rsp.GetResponseStream();
            System.Drawing.Image.FromStream(stream).Save(path);
        }
        finally
        {
            // 释放资源
            if (stream != null) stream.Close();
            if (rsp != null) rsp.Close();
        }
        return path;
    }


    public static string HttpUploadFile(string url, string path)//这个方法是两个URL第一个url是条到微信的，第二个是本地图片路径
    {
        // 设置参数
        HttpWebRequest request = WebRequest.Create(url) as HttpWebRequest;
        CookieContainer cookieContainer = new CookieContainer();
        request.CookieContainer = cookieContainer;
        request.AllowAutoRedirect = true;
        request.Method = "POST";
        string boundary = DateTime.Now.Ticks.ToString("X"); // 随机分隔线
        request.ContentType = "multipart/form-data;charset=utf-8;boundary=" + boundary;
        byte[] itemBoundaryBytes = Encoding.UTF8.GetBytes("\r\n--" + boundary + "\r\n");
        byte[] endBoundaryBytes = Encoding.UTF8.GetBytes("\r\n--" + boundary + "--\r\n");

        int pos = path.LastIndexOf("\\");
        string fileName = path.Substring(pos + 1);

        //请求头部信息
        StringBuilder sbHeader = new StringBuilder(string.Format("Content-Disposition:form-data;name=\"file\";filename=\"{0}\"\r\nContent-Type:application/octet-stream\r\n\r\n", fileName));
        byte[] postHeaderBytes = Encoding.UTF8.GetBytes(sbHeader.ToString());

        FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read);
        byte[] bArr = new byte[fs.Length];
        fs.Read(bArr, 0, bArr.Length);
        fs.Close();

        Stream postStream = request.GetRequestStream();
        postStream.Write(itemBoundaryBytes, 0, itemBoundaryBytes.Length);
        postStream.Write(postHeaderBytes, 0, postHeaderBytes.Length);
        postStream.Write(bArr, 0, bArr.Length);
        postStream.Write(endBoundaryBytes, 0, endBoundaryBytes.Length);
        postStream.Close();

        //发送请求并获取相应回应数据
        HttpWebResponse response = request.GetResponse() as HttpWebResponse;
        //直到request.GetResponse()程序才开始向目标网页发送Post请求
        Stream instream = response.GetResponseStream();
        StreamReader sr = new StreamReader(instream, Encoding.UTF8);
        //返回结果网页（html）代码
        string content = sr.ReadToEnd();
        return content;
    }
}