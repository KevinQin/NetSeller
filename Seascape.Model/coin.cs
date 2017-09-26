using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model
{
    public class coin
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public string unitNo { get; set; }
        public Double coinValue { get; set; }
        public int cType { get; set; }
        public DateTime addOn { get; set; }
        public string openId { get; set; }
        public string srcOpenId { get; set; }
        public int state { get; set; }
    }
}
