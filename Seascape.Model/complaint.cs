using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class complaint
    {
        public int id { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public int userId { get; set; }
        /// <summary>
        /// 用户名称
        /// </summary>
        public int Model { get; set; }
        /// <summary>
        /// 投诉内容
        /// </summary>
        public string Content { get; set; }
        /// <summary>
        /// 投诉创建时间
        /// </summary>
        public DateTime addOn { get; set; }
        /// <summary>
        /// 是否已处理
        /// </summary>
        public int isHandle { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime handleOn { get; set; }
        /// <summary>
        /// 处理人
        /// </summary>
        public int handleEmployeeId { get; set; }
        /// <summary>
        /// 处理结果
        /// </summary>
        public string handleResult { get; set; }
        /// <summary>
        /// 用户联系电话
        /// </summary>
        public string tel { get; set; }
    }
}
