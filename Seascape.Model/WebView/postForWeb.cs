using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.WebView
{
    public class postForWeb
    {
        public int pid { get; set; }
        public int postType { get; set; }
        public Double postFee { get; set; }
        public int postFeeType { get; set; }
        public List<ProductPostForWeb> post { get; set; }
    }
}
