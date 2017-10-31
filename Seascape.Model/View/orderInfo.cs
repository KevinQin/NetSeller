using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model
{
    public class orderInfo
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public int payType { get; set; }
        public string workNo { get; set; }
        public int userId { get; set; }
        public string contact { get; set; }
        public string tel { get; set; }
        public string addr { get; set; }
        public DateTime addOn { get; set; }
        public DateTime sureOn { get; set; }
        public DateTime arriveOn { get; set; }
        public Double price { get; set; }
        public Double subPrice { get; set; }
        public Double allPrice { get; set; }
        public Double balance { get; set; }
        public Double wxCardFee { get; set; }
        public Double postFee { get; set; }
        public DateTime payOn { get; set; }
        public int isPay { get; set; }
        public int state { get; set; }
        public string memo { get; set; }
        public int isCall { get; set; }
        public string CallInfo { get; set; }
        public int sourceId { get; set; }
        public string getTime { get; set; }
        public DateTime getDate { get; set; }
        public int serviceId { get; set; }
        public string getWorker { get; set; }
        public string getWorkerName { get; set; }
        public string getWorkerTel { get; set; }
        public string sendWorker { get; set; }
        public string sendWorkerName { get; set; }
        public string sendWorkerTel { get; set; }
        public DateTime sendDate { get; set; }
        public DateTime sendOn { get; set; }
        public int oType { get; set; }
        public int pId { get; set; }
        public string activeName { get; set; }
        public string sourceName { get; set; }
        public int isPrint { get; set; }
        public int fid { get; set; }
        public int isFinance { get; set; }
        public DateTime financeOn { get; set; }
        public int cityId { get; set; }

        public string city { get; set; }

        public List<log> log { get; set; }
        public List<orderPList> lp { get; set; }
        public List<attach> la { get; set; }
        public Double userBalance { get; set; }
        public evaluate evaluate { get; set; }
        public user user { get; set; }
    }
}
