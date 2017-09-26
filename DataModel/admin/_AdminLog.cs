using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _AdminLog:DbCenter
    {
        public List<adminLog> GetLog(string keyWord)
        {
            List<adminLog> ll = new List<adminLog>();
            string sql = "select * from t_admin_log where 1=1 " + keyWord + " order by addOn desc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            adminLog l = new adminLog { addOn = Convert.ToDateTime(r["addOn"]), id = Convert.ToInt16(r["id"]), content = r["content"].ToString(), adminID = Convert.ToInt16(r["adminID"].ToString()), adminName = r["adminName"].ToString(), orderNo = r["orderNo"].ToString() };
                            ll.Add(l);
                        }
                    }
                }
            }
            catch
            {
            }
            return ll;
        }
    }
}
