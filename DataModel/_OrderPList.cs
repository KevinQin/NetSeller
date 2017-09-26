using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _OrderPList:DbCenter
    {


        /// <summary>
        /// 获取订单产品列表
        /// </summary>
        /// <param name="orderNo"></param>
        /// <returns></returns>
        public List<orderPList> GetOrderPList(string orderNo)
        {
            List<orderPList> la = new List<orderPList>();
            string sql = "select * from t_orderplist where orderNo = '" + orderNo + "'  and enable = 0 order by id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderPList b = new orderPList
                        {
                            id = Convert.ToInt16(r["id"]),
                            price = Math.Round(Convert.ToDouble(r["price"]),2),
                            pid = Convert.ToInt16(r["pid"]),
                            pNum = Convert.ToInt16(r["pNum"]),
                            pName = r["pName"].ToString(),
                            unitNo = r["unitNo"].ToString()
                        };
                        la.Add(b);
                    }
                }
            }
            return la;
        }

        /// <summary>
        /// 获取产品总价
        /// </summary>
        /// <param name="orderNo"></param>
        /// <returns></returns>
        public Double GetAllPrice(string orderNo)
        {
            Double p = 0;
            string sql = "select sum(price*pNum) as p from t_orderplist where enable = 0 and orderNo = '" + orderNo + "'";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    DataRow r = dt.Rows[0];
                    {
                        p = Math.Round(Convert.ToDouble(r["p"]),2);
                    }
                }
            }
            return p;
        }

        /// <summary>
        /// 获取销量字典
        /// </summary>
        /// <returns></returns>
        public Dictionary<int,int> GetProductNumDic()
        {
            Dictionary<int, int> Dic = new Dictionary<int, int>();
            string sql = "select pid,sum(pNum) as p from t_orderplist where enable = 0 group by pid";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        if (!Dic.ContainsKey(Convert.ToInt16(r["pid"])))
                        {
                            Dic.Add(Convert.ToInt16(r["pid"]), Convert.ToInt32(r["p"]));
                        }
                    }
                }
            }
            return Dic;
        }
    }
}
