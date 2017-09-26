using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _ULog:DbCenter
    {
        public List<uLog> GetULogList(string sql, string sql_c, out int OCount)
        {
            List<uLog> lo = new List<uLog>();

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
                    Dictionary<string, Double> Dic = new _Unit().GetUnitDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        uLog o = new uLog()
                        {
                            id = Convert.ToInt32(r["id"]),
                            orderNo = r["orderNo"].ToString(),
                            workNo = r["workNo"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            pName = r["pName"].ToString(),
                            pid = Convert.ToInt16(r["pid"]),
                            pNumD = Convert.ToInt16(r["pNumD"])
                        };
                        lo.Add(o);
                    }
                }
                return lo;
            }
        }
    }
}
