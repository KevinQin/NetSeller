using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.WebView;

namespace Seascape.Data.WebView
{
    public class _WebUser:DbCenter
    {
        public List<WebUser> GetUserList(string sql, string sql_c, out int UCount)
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
            List<WebUser> lu = new List<WebUser>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            WebUser u = new WebUser()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                photoUrl = r["photoUrl"].ToString(),
                                nickName = r["nickName"].ToString(),
                                openId = r["openid"].ToString(),
                                id = Convert.ToInt32(r["id"]),
                                isSubscribe = Convert.ToInt16(r["isSubscribe"])
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

        public int GetUserCount(int uid)
        {
            int UserNum = 0;
            string sql = "select count(id) as t from t_user where sourceId = " + uid;
            try
            {
                UserNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                UserNum = 0;
            }
            return UserNum;
        }
    }
}
