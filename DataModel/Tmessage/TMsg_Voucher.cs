using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Data.Tmessage
{
    public class TMsg_Voucher
    {
        //TM00507
        public MessageValue first { get; set; }
        /// <summary>
        /// 订单号
        /// </summary>
        public MessageValue orderTicketStore { get; set; }
        /// <summary>
        /// 日期
        /// </summary>
        public MessageValue orderTicketRule { get; set; }
        /// <summary>
        /// 后缀
        /// </summary>
        public MessageValue remark { get; set; }

        /// <summary>
        /// 获取模板消息体
        /// </summary>
        /// <param name="first"></param>
        /// <param name="keyword1"></param>
        /// <param name="keyword2"></param>
        /// <param name="keyword3"></param>
        /// <param name="keyword4"></param>
        /// <param name="remark"></param>
        /// <returns></returns>
        public TMsg_Voucher GetMessageBody(string first, string orderTicketStore, string orderTicketRule, string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",适用店铺:" + orderTicketStore);
            sb.Append(",使用规则:" + orderTicketRule);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Voucher s = new TMsg_Voucher
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                orderTicketStore = new MessageValue { value = orderTicketStore, color = "" },
                orderTicketRule = new MessageValue { value = orderTicketRule, color = "" },
                remark = new MessageValue { value = remark, color = "#428bca" }
            };
            return s;
        }

        /// <summary>
        /// 模板消息ID
        /// </summary>
        /// <returns></returns>
        public string Key()
        {
            return "XCYk0y66kT_EaUQoKP5MtTpa_hG1kdUle8LK24hBCsM";
        }
    }
}
