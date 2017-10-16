using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class app_Pay : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            WeChat.InitConifg(this);
            string orderno = Request["orderno"].ToString();
            WeChat.InitPayConfig(this, orderno);
        }
        catch (Exception ex)
        { }
    }
}