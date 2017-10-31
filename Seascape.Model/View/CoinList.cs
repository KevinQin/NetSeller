using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.View
{
    public class CoinList
    {
        public string photoUrl { get; set; }
        public string nickName { get; set; }
        public string contact { get; set; }
        public string mobile { get; set; }
        public string unitNo { get; set; }
        public userBank bank { get; set; }
        public int state { get; set; }
        public DateTime addOn { get; set; }
        public Double coin { get; set; }
        public string memo { get; set; }
        public DateTime operOn { get; set; }
    }
}
