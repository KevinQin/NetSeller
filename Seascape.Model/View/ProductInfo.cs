using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Seascape.Model.View;

namespace Seascape.Model
{
    public class ProductInfo
    {
        public int id { get; set; }
        public int pId { get; set; }
        public int cId { get; set; }
        public string pName { get; set; }
        public Double price { get; set; }
        public Double mPrice { get; set; }
        public DateTime addOn { get; set; }
        public string desp { get; set; }
        public string pInfo { get; set; }
        public string imgUrl { get; set; }
        public int storeNum { get; set; }
        public int allNum { get; set; }
        public int enable { get; set; }
        public int state { get; set; }
        public string sign { get; set; }
        public List<unit> unit { get; set; }
        public string signInfo { get; set; }
        public string cName { get; set; }
        public int isHot { get; set; }
        public int postType { get; set; }
        public Double postFee { get; set; }
        public int postFeeType { get; set; }
        public List<productPostInfo> post { get; set; }
    }
}
