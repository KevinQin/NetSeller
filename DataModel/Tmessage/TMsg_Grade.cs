using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Data.Tmessage
{
    //会员等级变更通知
    public class TMsg_Grade
    {
        public MessageValue first { get; set; }
        /// <summary>
        /// 原先等级
        /// </summary>
        public MessageValue keyword1 { get; set; }
        /// <summary>
        /// 当前等级
        /// </summary>
        public MessageValue keyword2 { get; set; }
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
        public TMsg_Grade GetMessageBody(string first, string keyword1, string keyword2, string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",原先等级:" + keyword1);
            sb.Append(",当前等级:" + keyword2);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Grade s = new TMsg_Grade
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                keyword1 = new MessageValue { value = keyword1, color = "" },
                keyword2 = new MessageValue { value = keyword2, color = "" },
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
            return "zF-AEebyVMeimIHSxHltRN7JauObnU3ZimZIEuo3DLI";
        }
    }
}
