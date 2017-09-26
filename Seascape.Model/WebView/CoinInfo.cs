using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.WebView
{
    public class CoinInfo
    {
        public string photoUrl { get; set; }
        public string nickName { get; set; }
        public string orderNo { get; set; }
        /// <summary>
        /// 0返佣1消费2奖励
        /// </summary>
        public int cType { get; set; }
        public DateTime addOn { get; set; }
        public Double coin { get; set; }
    }
}
