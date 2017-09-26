using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class smsCode
    {
        public int id { get; set; }
        public string mobile { get; set; }
        public string code { get; set; }
        public DateTime addOn { get; set; }
        public int enable { get; set; }
    }
}
