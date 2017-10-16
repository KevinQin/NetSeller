using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.View;
using Seascape.Model.WebView;

namespace Seascape.Data
{
    public class _Unit:DbCenter
    {
        

        public List<unit> GetUnitList(int Pid)
        {
            List<unit> la = new List<unit>();
            string sql = "select * from t_unit where pid = " + Pid + " order by fID asc, addOn asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        unit a = new unit
                        {
                            id = Convert.ToInt16(r["id"]),
                            pId = Convert.ToInt16(r["pId"]),
                            price = Convert.ToDouble(r["price"]),
                            mPrice = Convert.ToDouble(r["mPrice"]),
                            uNum = Convert.ToInt16(r["uNum"]),
                            sNum = Convert.ToInt16(r["sNum"]),
                            uImg = r["uImg"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            unitNo = r["unitNo"].ToString(),
                            fID = Convert.ToInt16(r["fID"]),
                            fName = r["fName"].ToString(),
                            sID = Convert.ToInt16(r["sID"]),
                            sName = r["sName"].ToString(),
                            pNo = r["pNo"].ToString()
                        };
                        la.Add(a);
                    }
                }
            }
            return la;
        }

        public List<UnitInfo> GetUnitInfoList(int Pid)
        {
            List<UnitInfo> la = new List<UnitInfo>();
            string sql = "select * from t_unit where pid = " + Pid + " order by fID asc, addOn asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, itemConfig> Dic = new _Item().GetClassDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        UnitInfo a = new UnitInfo
                        {
                            price = Convert.ToDouble(r["price"]),
                            mPrice = Convert.ToDouble(r["mPrice"]),
                            uNum = Convert.ToInt16(r["uNum"]),
                            unitNo = r["unitNo"].ToString(),
                            fID = Convert.ToInt16(r["fID"]),
                            fName = r["fName"].ToString(),
                            sID = Convert.ToInt16(r["sID"]),
                            sName = r["sName"].ToString()
                        };
                        if (a.fID > 0 && Dic.ContainsKey(a.fID))
                        {
                            a.fValue = Dic[a.fID].itemName;
                        }
                        if (a.sID > 0 && Dic.ContainsKey(a.sID))
                        {
                            a.sValue = Dic[a.sID].itemName;
                        }
                        la.Add(a);
                    }
                }
            }
            return la;
        }

        public List<UnitPrice> GetUnitPriceList(string unitNos)
        {
            if (unitNos.EndsWith(","))
            {
                unitNos = unitNos.Substring(0, unitNos.Length - 1);
            }
            unitNos = unitNos.Replace(",", "','");
            List<UnitPrice> la = new List<UnitPrice>();
            string sql = "select * from t_unit where unitNo in('" + unitNos + "') and pid in(select id from t_product where enable = 0 and state = 1)";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        UnitPrice a = new UnitPrice
                        {
                            price = Convert.ToDouble(r["price"]),
                            uNum = Convert.ToInt16(r["uNum"]),
                            unitNo = r["unitNo"].ToString(),
                        };

                        la.Add(a);
                    }
                }
            }
            return la;
        }

        public unit GetUnitInfo(string unitNo)
        {
            unit lu = null;
            try
            {
                using (DataTable dt = helper.GetDataTable("select * from t_unit where unitNo = '"+unitNo+"'"))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        {

                            lu = new unit()
                            {
                                id = Convert.ToInt16(r["id"]),
                                pId = Convert.ToInt16(r["pId"]),
                                price = Convert.ToDouble(r["price"]),
                                mPrice = Convert.ToDouble(r["mPrice"]),
                                uNum = Convert.ToInt16(r["uNum"]),
                                sNum = Convert.ToInt16(r["sNum"]),
                                uImg = r["uImg"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                unitNo = r["unitNo"].ToString(),
                                fID = Convert.ToInt16(r["isJc"]),
                                fName = r["fName"].ToString(),
                                sID = Convert.ToInt16(r["jcNum"]),
                                sName = r["sName"].ToString(),
                                pNo = r["jcUnitNo"].ToString()
                            };
                        }
                    }
                }
            }
            catch { }
            return lu;
        }

        public string GetUnitItem(string unitNo)
        {
            string item = "";
            try
            {
                using (DataTable dt = helper.GetDataTable("select * from t_unit where unitNo = '" + unitNo + "'"))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        item = r["fName"].ToString() + "" + r["sName"].ToString();
                    }
                }
            }
            catch { }
            return item;
        }

        public Dictionary<string,Double> GetUnitDic()
        {
            Dictionary<string, Double> Dic = new Dictionary<string, double>();
            string sql = "select * from t_unit where enable = 0";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        if (!Dic.ContainsKey(r["unitNo"].ToString()))
                        {
                            Dic.Add(r["unitNo"].ToString(), Convert.ToDouble(r["jPrice"]));
                        }
                    }
                }
            }
            return Dic;
        }

    }
}
