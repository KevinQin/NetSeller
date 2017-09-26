using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class attach
    {
        public int id { get; set; }
        /// <summary>
        /// 订单号
        /// </summary>
        public string orderNo { get; set; }
        /// <summary>
        /// 产品ID
        /// </summary>
        public int pid { get; set; }
        /// <summary>
        /// 附件类型
        /// </summary>
        public int aType { get; set; }
        /// <summary>
        /// 附件地址
        /// </summary>
        public string aSrc { get; set; }
        /// <summary>
        /// 显示排序
        /// </summary>
        public int descNum { get; set; }
        /// <summary>
        /// 附件上传时间
        /// </summary>
        public DateTime addOn { get; set; }

    }
}
