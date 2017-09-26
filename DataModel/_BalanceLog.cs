using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _BalanceLog:DbCenter
    {
        public List<balanceLog> GetBalanceList(string orderNo,int uid)
        {
            List<balanceLog> la = new List<balanceLog>();
            string sql = "select * from t_balanceLog where streamNo = '" + orderNo + "' order by id asc";
            if (uid > 0)
            {
                sql = "select * from t_balanceLog where uid = " + uid + " order by id asc";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        try
                        {
                            balanceLog b = new balanceLog
                            {
                                streamNo = r["streamNo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                id = Convert.ToInt32(r["id"]),
                                uid = Convert.ToInt32(r["uid"]),
                                bType = Convert.ToInt16(r["bType"]),
                                enable = Convert.ToInt16(r["enable"]),
                                balance = Convert.ToDouble(r["balance"]),
                                aBalance = Convert.ToDouble(r["aBalance"]),
                                desp = r["desp"].ToString()
                            };
                            if (b.bType == 0)
                            {
                                if (b.enable == 1 || orderNo.Length > 0)
                                {
                                    la.Add(b);
                                }
                            }
                            else
                            {
                                if (b.enable > -1)
                                {
                                    la.Add(b);
                                }
                            }
                        }
                        catch { }
                    }
                }
            }
            return la;
        }

        public List<balanceLog> GetBalanceListForUid(int uid)
        {
            List<balanceLog> la = new List<balanceLog>();
            string sql = "select * from t_balanceLog where uid = " + uid + " order by id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        try
                        {
                            balanceLog b = new balanceLog
                            {
                                streamNo = r["streamNo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                id = Convert.ToInt32(r["id"]),
                                uid = Convert.ToInt32(r["uid"]),
                                bType = Convert.ToInt16(r["bType"]),
                                enable = Convert.ToInt16(r["enable"]),
                                balance = Convert.ToDouble(r["balance"]),
                                aBalance = Convert.ToDouble(r["aBalance"]),
                                desp = r["desp"].ToString()
                            };

                            la.Add(b);
                        }
                        catch { }
                    }
                }
            }
            return la;
        }

        public List<balanceLog> GetBalanceList(string sql, string sql_c, out int Count)
        {
            List<balanceLog> la = new List<balanceLog>();

            int LogCount = 1;
            try
            {
                LogCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                LogCount = 1;
            }
            Count = LogCount;

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        try
                        {
                            balanceLog b = new balanceLog
                            {
                                streamNo = r["streamNo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                id = Convert.ToInt32(r["id"]),
                                uid = Convert.ToInt32(r["uid"]),
                                bType = Convert.ToInt16(r["bType"]),
                                enable = Convert.ToInt16(r["enable"]),
                                balance = Convert.ToDouble(r["balance"]),
                                aBalance = Convert.ToDouble(r["aBalance"]),
                                desp = r["desp"].ToString()
                            };
                            la.Add(b);
                        }
                        catch { }

                    }
                }
            }
            return la;
        }
    }
}
