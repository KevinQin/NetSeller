using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Syslog:DbCenter
    {
        public string uName { get; set; }
        public List<sysLog> GetLogList(string sql,string sql_c,out int Count)
        {
            List<sysLog> ls = new List<sysLog>();
            
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
                    try
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            sysLog s = new sysLog
                            {
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                uid = Convert.ToInt32(r["uid"]),
                                workNo = r["workNo"].ToString(),
                                adminName = r["adminName"].ToString(),
                                content = r["content"].ToString(),
                                lType = Convert.ToInt16(r["lType"]),
                                lt = Convert.ToInt16(r["lt"])
                            };
                            if (s.lType > 0 && s.lType < 5)
                            {
                                if (s.workNo.Length > 0)
                                {
                                    List<employee> le = new _Employee().GetEmployeeList(-1, s.workNo, "");
                                    if (le != null && le.Count > 0)
                                    {
                                        s.adminName = "[" + s.workNo + "]" + le[0].name;
                                    }
                                }
                            }
                            else
                            {
                                if (s.lType == 5) 
                                {
                                    s.adminName = "[" + s.workNo + "]" + s.adminName;
                                }
                                
                            }
                            ls.Add(s);
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            return ls;
        }

    }
}
