using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model
{
    public class uLog
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public string workNo { get; set; }
        public DateTime addOn { get; set; }
        public string pName { get; set; }
        public int pid { get; set; }
        public int pNumS { get; set; }
        public int pNumD { get; set; }
        public Double price { get; set; }
        public string unitNo { get; set; }
        public int operType { get; set; }
        public string reason { get; set; }
    }
}
