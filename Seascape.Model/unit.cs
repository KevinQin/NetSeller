using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class unit
    {
        public int id { get; set; }
        public int pId { get; set; }
        public string unitNo { get; set; }
        public Double price { get; set; }
        public Double mPrice { get; set; }
        public int uNum { get; set; }
        public int sNum { get; set; }
        public string uImg { get; set; }
        public DateTime addOn { get; set; }
        public int fID { get; set; }
        public string fName { get; set; }
        public int sID { get; set; }
        public string sName { get; set; }
        public string pNo { get; set; }
    }
}
