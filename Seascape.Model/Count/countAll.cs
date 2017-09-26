using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class countAll
    {
        public int id { get; set; }
        public DateTime dates { get; set; }
        /// <summary>
        /// 订单数
        /// </summary>
        public int orderNum { get; set; }
        /// <summary>
        /// 花店数
        /// </summary>
        public int flowerNum { get; set; }
        /// <summary>
        /// 件数
        /// </summary>
        public int productNum { get; set; }
        /// <summary>
        /// 订单总额
        /// </summary>
        public Double price { get; set; }
        /// <summary>
        /// 成本总计
        /// </summary>
        public Double cb { get; set; }
        /// <summary>
        /// 运费总计
        /// </summary>
        public Double yf { get; set; }
        /// <summary>
        /// 利润总计
        /// </summary>
        public Double lr { get; set; }
        /// <summary>
        /// 新增用户数
        /// </summary>
        public int newF { get; set; }

        public int sourceId { get; set; }
        public DateTime addOn { get; set; }
    }
}
