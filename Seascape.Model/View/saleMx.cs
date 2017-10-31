using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class saleMx
    {
        public ProductInfo product { get; set; }
        public int pNum { get; set; }
        public string unitNo { get; set; }
        public unit unit { get; set; }
    }
}
