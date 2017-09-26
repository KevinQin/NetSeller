using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Sign:DbCenter
    {

        public List<sign> GetSignList(int sType)
        {
            List<sign> la = new List<sign>();
            string sql = "select * from t_sign where enable = 0 order by addOn desc ";
            if (sType > -1)
            {
                sql = "select * from t_sign where sType = " + sType + " and enable = 0 order by addOn desc";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        sign a = new sign
                        {
                            id = Convert.ToInt16(r["id"]),
                            sType = Convert.ToInt16(r["sType"]),
                            enable = Convert.ToInt16(r["enable"]),
                            sName = r["sName"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"])
                        };
                        la.Add(a);
                    }
                }
            }
            return la;
        }

        public List<sign> GetSignList(string sql, string sql_c, out int UCount)
        {
            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                Count = 0;
            }
            List<sign> lu = new List<sign>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        //Dictionary<int, string> Dic = GetComInfo(sqlid);
                        foreach (DataRow r in dt.Rows)
                        {

                            sign u = new sign()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                sName = r["sName"].ToString(),
                                id = Convert.ToInt16(r["id"]),
                                sType = Convert.ToInt16(r["sType"]),
                            };
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            UCount = Count;
            return lu;
        }

        public Dictionary<int,string> GetSignDiv()
        {
            Dictionary<int, string> la = new Dictionary<int, string>();
            string sql = "select * from t_sign where enable = 0 order by addOn desc ";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        if (!la.ContainsKey(Convert.ToInt16(r["id"])))
                        {
                            la.Add(Convert.ToInt16(r["id"]), r["sName"].ToString());
                        }
                    }
                }
            }
            return la;
        }

        public string GetSign(string signs)
        {
            string sign = "";
            Dictionary<int, string> la = new _Sign().GetSignDiv();
            string[] sArr = signs.Split(',');
            foreach (string sid in sArr)
            {
                if (sid.Length > 0)
                {
                    if (la.ContainsKey(Convert.ToInt16(sid)))
                    {
                        sign += la[Convert.ToInt16(sid)] + ",";
                    }
                }
            }
            return sign;
        }

        public int CheckSign(string sName)
        {
            int p = 0;
            string sql = "select * from t_sign where sName = " + sName + " and enable = 0";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        p = Convert.ToInt16(dt.Rows[0]["id"]);
                    }
                }
            }
            catch
            {
            }
            return p;
        }
    }
}
