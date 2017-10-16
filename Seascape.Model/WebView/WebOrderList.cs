using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.WebView
{
    public class WebOrderList
    {
        public string orderNo { get; set; }
        public DateTime addOn { get; set; }
        public Double subPrice { get; set; }
        public Double allPrice { get; set; }
        public int isPay { get; set; }
        public int state { get; set; }

        public List<WebOrderProduct> product { get; set; }
    }

    public class WebOrderProduct
    {
        public int id { get; set; }
        public string pName { get; set; }
        public string imgUrl { get; set; }
        public int pNum { get; set; }
        public string unitInfo { get; set; }
        public int isEvaluate { get; set; }
        public string unitNo { get; set; }
        public Double price { get; set; }
    }
}
