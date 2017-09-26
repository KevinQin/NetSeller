using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _CountAll:DbCenter
    {
        

        public List<countAll> GetCountList(string DateS, string DateE,int sourceId)
        {
            List<countAll> lc = new List<countAll>();
            DateTime dt = Convert.ToDateTime(DateS);
            DateTime dte = Convert.ToDateTime(DateE);
            Dictionary<string, countAll> dic = GetDic(DateS, DateE, sourceId);

            for (int i = 0; i < 10000; i++)
            {
                countAll c = new countAll();
                c.dates = dt.AddDays(i);
                if (dic.ContainsKey(c.dates.ToString("yyyy-MM-dd")))
                {
                    c = dic[c.dates.ToString("yyyy-MM-dd")];
                    lc.Add(c);
                }
                else
                {
                    lc.Add(Count(c.dates.ToString("yyyy-MM-dd"), sourceId));
                }
                if (c.dates == dte)
                {
                    i = 10000;
                }
            }
            return lc;
        }

        public countAll Count(string Date, int sourceId)
        {
            string keyWord = "";
            if (sourceId > 0)
            {
                //keyWord = " and sourceId = " + sourceId;
            }
            Dictionary<string, Double> Dic = new _Unit().GetUnitDic();
            countAll c = new countAll();
            try
            {
                //订单数
                c.orderNum = Convert.ToInt16(helper.GetOne("SELECT count(id) as t from t_order where date(addOn) = '" + Date + "' and state < 9 " + keyWord));
                //产品件数
                c.productNum = Convert.ToInt16(helper.GetOne("Select sum(pNum) as p from t_orderPlist where orderNo in(SELECT orderNo from t_order where date(addOn) = '" + Date + "' and state < 9 " + keyWord + ") and enable = 0"));
                //花店数
                c.flowerNum = Convert.ToInt16(helper.GetOne("SELECT count(distinct fid) as t from t_order where date(addOn) = '" + Date + "' and state < 9 " + keyWord));
                c.newF = Convert.ToInt16(helper.GetOne("SELECT count(id) as t from t_flower where date(addOn) = '" + Date + "' and enable = 0 " + keyWord));
                //金额总计
                try
                {
                    c.price = Convert.ToDouble(helper.GetOne("SELECT sum(allPrice) as t from t_order where date(addOn) = '" + Date + "' and state < 9" + keyWord));
                }
                catch
                {
                    c.price = 0;
                }

                c.cb = getCb(Date, sourceId, Dic);
                //运费总计
                try
                {
                    c.yf = Convert.ToDouble(helper.GetOne("SELECT dbfee+yfee+thfee from t_fee where date(fDate) = '" + Date + "' and enable = 0" + keyWord));
                }
                catch
                {
                    c.yf = 0;
                }

                try
                {
                    c.lr = c.price - c.yf - c.cb;
                }
                catch
                {
                    c.lr = 0;
                }

                c.dates = Convert.ToDateTime(Date);

                if (Convert.ToDateTime(Date).AddDays(3) >= DateTime.Now)
                {

                }
                else
                {
                    c.sourceId = sourceId;
                    c.addOn = DateTime.Now;
                    new Main().AddToDb(c, "t_count_all");
                }
            }
            catch
            {

            }
            return c;
        }


        public Dictionary<string, countAll> GetDic(string DateS, string DateE, int sourceId)
        {
            string keyWord = "";
            if (sourceId > 0)
            {
                //keyWord = " and sourceId = " + sourceId;
            }
            Dictionary<string, countAll> dic = new Dictionary<string, countAll>();
            string sql = "select * from t_count_all where date(dates) >= '" + DateS + "' and date(dates) <= '" + DateE + "'" + keyWord;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (!dic.ContainsKey(Convert.ToDateTime(r["dates"]).ToString("yyyy-MM-dd")))
                            {
                                countAll c = new countAll
                                {
                                    dates = Convert.ToDateTime(r["dates"]),
                                    orderNum = Convert.ToInt16(r["orderNum"]),
                                    productNum = Convert.ToInt16(r["productNum"]),
                                    flowerNum = Convert.ToInt16(r["flowerNum"]),
                                    newF = Convert.ToInt16(r["newF"]),
                                    price = Convert.ToDouble(r["price"]),
                                    cb = Convert.ToDouble(r["cb"]),
                                    yf = Convert.ToDouble(r["yf"]),
                                    lr = Convert.ToDouble(r["lr"]),
                                    addOn = Convert.ToDateTime(r["addon"])
                                };
                                dic.Add(Convert.ToDateTime(r["dates"]).ToString("yyyy-MM-dd"), c);
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return dic;
        }

        public Double getCb(string Date, int sourceId, Dictionary<string, Double> Dic)
        {
            string keyWord = "";
            Double cb = 0;
            if (sourceId > 0)
            {
                keyWord = " and sourceId = " + sourceId;
            }
            using (DataTable dt = helper.GetDataTable("Select unitNo,pNum from t_orderPlist where orderNo in(SELECT orderNo from t_order where date(addOn) = '" + Date + "' and state < 9 " + keyWord + ") and enable = 0"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        if (Dic.ContainsKey(r["unitNo"].ToString()))
                        {
                            cb += Convert.ToInt16(r["pNum"]) * Dic[r["unitNo"].ToString()];
                        }
                    }
                }
            }
            return cb;
        }

    }
}
