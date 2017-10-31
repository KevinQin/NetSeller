using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Finance:DbCenter
    {
        
        /// <summary>
        /// 获取财务列表
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="workNo"></param>
        /// <param name="orderNo"></param>
        /// <param name="serviceId"></param>
        /// <returns></returns>
        public List<finance> GetFinanceList(string sql, string sql_c, out int OCount)
        {
            List<finance> lo = new List<finance>();

            int OrderCount = 1;
            try
            {
                OrderCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                OrderCount = 1;
            }
            OCount = OrderCount;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    //Dictionary<string, Double> Dic = new _Unit().GetUnitDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        finance o = new finance();
                        try
                        {
                            o.addOn = Convert.ToDateTime(r["addOn"].ToString());
                            o.allPrice = Convert.ToDouble(r["allPrice"].ToString());
                            o.balance = Convert.ToDouble(r["balance"]);
                            o.id = Convert.ToInt32(r["id"].ToString());
                            o.state = Convert.ToInt16(r["state"].ToString());
                            o.orderNo = r["orderNo"].ToString();
                            o.payOn = Convert.ToDateTime(r["payOn"].ToString());
                            o.userId = Convert.ToInt16(r["userId"].ToString());
                            o.payType = Convert.ToInt16(r["payType"].ToString());
                            o.subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2);
                            o.price = Convert.ToDouble(r["price"].ToString());
                            //o.cbPrice = GetCbPrice(o.orderNo, Dic);
                            //user u = new _User().GetUser("", "", o.userId);
                            o.userName = r["contact"].ToString() + "<br/>" + r["tel"].ToString();
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }

        /// <summary>
        /// 获取财务列表
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="workNo"></param>
        /// <param name="orderNo"></param>
        /// <param name="serviceId"></param>
        /// <returns></returns>
        public List<finance> GetFinanceListForExport(string sql)
        {
            List<finance> lo = new List<finance>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<string, Double> Dic = new _Unit().GetUnitDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        finance o = new finance();
                        try
                        {
                            o.addOn = Convert.ToDateTime(r["addOn"].ToString());
                            o.allPrice = Convert.ToDouble(r["allPrice"].ToString());
                            o.balance = Convert.ToDouble(r["balance"]);
                            o.id = Convert.ToInt32(r["id"].ToString());
                            o.state = Convert.ToInt16(r["state"].ToString());
                            o.orderNo = r["orderNo"].ToString();
                            o.payOn = Convert.ToDateTime(r["payOn"].ToString());
                            o.userId = Convert.ToInt16(r["userId"].ToString());
                            o.payType = Convert.ToInt16(r["payType"].ToString());
                            o.subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2);
                            o.price = Convert.ToDouble(r["price"].ToString());
                            o.cbPrice = GetCbPrice(o.orderNo, Dic);
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }

        public Double GetCbPrice(string orderNo, Dictionary<string, Double> Dic)
        {
            Double cbprice = 0;
            Double jPrice = 0;
            List<orderPList> op = new _OrderPList().GetOrderPList(orderNo);
            foreach (orderPList item in op)
            {
                //if (item.enable == 0)
                {
                    if (Dic.ContainsKey(item.unitNo))
                    {
                        jPrice = Dic[item.unitNo];
                        cbprice += item.pNum * jPrice;
                    }
                }
            }
            return cbprice;
        }
    }
}
