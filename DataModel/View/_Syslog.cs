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
                        Dictionary<int, string> Dic = new _AdminUser().GetAdminUserDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            sysLog s = new sysLog
                            {
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                uid = Convert.ToInt32(r["uid"]),
                                adminId = Convert.ToInt16(r["adminId"]),
                                adminName = r["adminName"].ToString(),
                                content = r["content"].ToString(),
                                lType = Convert.ToInt16(r["lType"]),
                                lt = Convert.ToInt16(r["lt"])
                            };
                            if (s.lType > 0 && s.lType < 5)
                            {
                                if (s.adminId > 0)
                                {
                                    if (Dic.ContainsKey(s.adminId))
                                    {
                                        s.adminName = "[后台]" + Dic[s.adminId];
                                    }
                                }
                            }
                            else
                            {
                                if (s.lType == 5) 
                                {
                                    s.adminName = "[后台]" + s.adminName;
                                }
                                else
                                {
                                    if (s.uid > 0)
                                    {
                                        user u = new _User().GetUser("", "", s.uid);
                                        if (u != null)
                                        {
                                            s.adminName = "[用户]" + u.contact;
                                        }
                                    }
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
