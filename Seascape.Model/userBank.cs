using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model
{
    public class userBank
    {
        public int id { get; set; }
        public int uid { get; set; }
        public string openId { get; set; }
        public string cardName { get; set; }
        public string cardNo { get; set; }
        public string userName { get; set; }
        public string mobile { get; set; }
        public DateTime addOn { get; set; }
        public int enable { get; set; }
    }
}
