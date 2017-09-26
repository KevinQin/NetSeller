using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.WebView
{
    public class WebOrderInfo
    {
        public string orderNo { get; set; }
        public string contact { get; set; }
        public string tel { get; set; }
        public string addr { get; set; }
        public DateTime addOn { get; set; }
        public Double subPrice { get; set; }
        public Double allPrice { get; set; }
        public Double postFee { get; set; }
        public int isPay { get; set; }
        public int state { get; set; }
        public string memo { get; set; }
        public int aId { get; set; }
        public List<log> log { get; set; }
        public int userId { get; set; }
        public List<WebOrderProduct> product { get; set; }
    }
}
