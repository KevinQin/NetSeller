using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.WebView
{
    public class WebUser
    {
        public int id { get; set; }
        public string openId { get; set; }
        public string photoUrl { get; set; }
        public string nickName { get; set; }
        public DateTime addOn { get; set; }
        public int isSubscribe { get; set; }
    }
}
