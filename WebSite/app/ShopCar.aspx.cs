﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class app_ShopCar : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        WeChat.InitConifg(this);
    }
}