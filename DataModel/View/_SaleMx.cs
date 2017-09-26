using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _SaleMx:DbCenter
    {
        /// <summary>
        /// 获取出库单列表
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="workNo"></param>
        /// <param name="orderNo"></param>
        /// <param name="serviceId"></param>
        /// <returns></returns>
        public List<saleMx> GetFinanceList(string sql)
        {
            List<saleMx> lo = new List<saleMx>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<string, Double> Dic = new _Unit().GetUnitDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        saleMx o = new saleMx()
                        {
                            pid = Convert.ToInt16(r["pid"]),
                            pNum = Convert.ToInt32(r["pNum"])
                        };
                        o.product = new _Product().GetProductInfo(o.pid);
                        lo.Add(o);
                    }
                }
                return lo;
            }
        }
    }

    public class SaleMxF : DbCenter
    {
        public unit unit { get; set; }
        public int pNum { get; set; }
        public Double price { get; set; }
        public string unitNo { get; set; }

        /// <summary>
        /// 获取财务出库单列表
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="workNo"></param>
        /// <param name="orderNo"></param>
        /// <param name="serviceId"></param>
        /// <returns></returns>
        public List<SaleMxF> GetFinanceList(string sql)
        {
            List<SaleMxF> lo = new List<SaleMxF>();
            List<SaleMxF> lot = new List<SaleMxF>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<string, Double> Dic = new _Unit().GetUnitDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        SaleMxF o = new SaleMxF()
                        {
                            unitNo = r["unitNo"].ToString(),
                            pNum = Convert.ToInt32(r["pNum"]),
                            price = Convert.ToDouble(r["price"].ToString())
                        };
                        o.unit = new _Unit().GetUnitInfo(o.unitNo);
                        lo.Add(o);
                    }

                    Dictionary<string, SaleMxF> DicT = new Dictionary<string, SaleMxF>();
                    List<SaleMxF> los = new List<SaleMxF>();
                    foreach (SaleMxF item in lo)
                    {
                        if (DicT.ContainsKey(item.unitNo+"|"+item.price))
                        {
                        }
                        else
                        {
                            DicT.Add(item.unitNo+"|"+item.price, item);
                            los.Add(item);
                        }
                    }
                    int pNum = 0;
                    foreach (SaleMxF item in los)
                    {
                        SaleMxF o = new SaleMxF()
                        {
                            unitNo = item.unitNo,
                            price = item.price,
                            unit = item.unit
                        };
                        pNum = 0;
                        foreach (SaleMxF items in lo)
                        {
                            if (items.unitNo == item.unitNo && items.price == item.price)
                            {
                                pNum += items.pNum;
                            }
                        }
                        o.pNum = pNum;
                        lot.Add(o);
                    }
                    lot = lot.OrderByDescending(a => a.pNum).ToList();
                }
                return lot;
            }
        }
    }
}
