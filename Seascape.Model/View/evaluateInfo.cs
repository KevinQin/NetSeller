using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.View
{
    public class evaluateInfo
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public int grade { get; set; }
        public int enable { get; set; }
        public DateTime addOn { get; set; }
        public string memo { get; set; }
        public int uid { get; set; }
        public int pid { get; set; }

        public user user { get; set; }
        public List<attach> attach { get; set; }
        public string pName { get; set; }
    }
}
