using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.WebView
{
    public class ProductFWebInfo
    {
        public int id { get; set; }
        public string pName { get; set; }
        public Double price { get; set; }
        public Double mPrice { get; set; }
        public string desp { get; set; }
        public int storeNum { get; set; }
        public string pInfo { get; set; }
        public List<string> imgUrl { get; set; }
        public UnitFWeb unit { get; set; }
        /*
        public int postType { get; set; }
        public Double postFee { get; set; }
        public int postFeeType { get; set; }
        public List<ProductPostForWeb> post { get; set; }
        */ 
    }
}
