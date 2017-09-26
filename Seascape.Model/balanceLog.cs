using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class balanceLog
    {
        public int id { get; set; }
        public string streamNo { get; set; }
        public int uid { get; set; }
        public DateTime addOn { get; set; }
        public string orderNo { get; set; }
        public Double balance { get; set; }
        public int bType { get; set; }
        public int enable { get; set; }
        public double aBalance { get; set; }
        public DateTime payOn { get; set; }
        public string desp { get; set; }
    }
}
