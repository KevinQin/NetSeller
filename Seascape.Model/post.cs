using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model
{
    public class post
    {
        public int id { get; set; }
        public string postName { get; set; }
        public string provice { get; set; }
        public int enable { get; set; }
        public Double postFee { get; set; }
        public int postType { get; set; }
    }
}
