using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Data.Tmessage
{
    //OPENTM202119869 订单提交成功通知
    public class TMsg_Order
    {
        public MessageValue first { get; set; }
        /// <summary>
        /// 产品名称
        /// </summary>
        public MessageValue keyword1 { get; set; }
        /// <summary>
        /// 订单金额
        /// </summary>
        public MessageValue keyword2 { get; set; }
        /// <summary>
        /// 下单时间
        /// </summary>
        public MessageValue keyword3 { get; set; }
        /// <summary>
        /// 订单编号
        /// </summary>
        public MessageValue keyword4 { get; set; }
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
        public TMsg_Order GetMessageBody(string first, string keyword1, string keyword2, string keyword3,string keyword4, string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",产品名称:" + keyword1);
            sb.Append(",订单金额:" + keyword2);
            sb.Append(",下单时间:" + keyword3);
            sb.Append(",订单编号:" + keyword4);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Order s = new TMsg_Order
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                keyword1 = new MessageValue { value = keyword1, color = "" },
                keyword2 = new MessageValue { value = keyword2, color = "" },
                keyword3 = new MessageValue { value = keyword3, color = "" },
                keyword4 = new MessageValue { value = keyword4, color = "" },
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
            return "3iEAXHry5SdiW7jY0yp3hFyKV2t5r6bJG_IPwyv3liw";
        }
    }
}
