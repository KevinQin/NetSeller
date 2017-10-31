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
        /// 订单总数
        /// </summary>
        public int orderNum { get; set; }
        /// <summary>
        /// 销售产品件数
        /// </summary>
        public int productNum { get; set; }
        /// <summary>
        /// 订单总额
        /// </summary>
        public Double price { get; set; }
        /// <summary>
        /// 金币抵扣总计
        /// </summary>
        public Double coin { get; set; }
        /// <summary>
        /// 应收总计
        /// </summary>
        public Double ysPrice { get; set; }
        /// <summary>
        /// 会员特权产品
        /// </summary>
        public int vipProduct { get; set; }
        /// <summary>
        /// 新增用户数
        /// </summary>
        public int newF { get; set; }

        public int sourceId { get; set; }
        public DateTime addOn { get; set; }
    }
}
