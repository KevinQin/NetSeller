using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model
{
    public class content
    {
        public int id { get; set; }
        public int cId { get; set; }
        public string title { get; set; }
        public int cType { get; set; }
        public string imgUrl { get; set; }
        public int isHref { get; set; }
        public string hrefUrl { get; set; }
        public string contents { get; set; }
        public int isHot { get; set; }
        public DateTime addOn { get; set; }
        public int adminId { get; set; }
        public int enable { get; set; }
        public string hbSize { get; set; }
    }
}
