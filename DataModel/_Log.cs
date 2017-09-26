using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Log:DbCenter
    {
        
        /// <summary>
        /// 获取日志列表
        /// </summary>
        /// <param name="OrderNo"></param>
        /// <returns></returns>
        public List<log> GetLogList(string OrderNo)
        {
            List<log> lp = new List<log>();
            string sql = "select * from t_log where OrderNo = '" + OrderNo + "' and (lType = 0 or lType = 1) order by addOn asc,id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    lp = new List<log>();
                    foreach (DataRow r in dt.Rows)
                    {
                        log p = new log();
                        p.content = r["content"].ToString();
                        p.uId = Convert.ToInt32(r["uid"].ToString());
                        p.adminID = Convert.ToInt16(r["adminID"].ToString());
                        p.addOn = Convert.ToDateTime(r["addOn"].ToString());
                        p.lType = Convert.ToInt16(r["lType"].ToString());
                        p.uName = "--";
                        p.eName = "--";
                        if (p.uId > 0)
                        {
                            try
                            {
                                user u = new _User().GetUser("", "", p.uId);
                                if (u != null)
                                {
                                    p.uName = u.contact;
                                }
                            }
                            catch { }
                        }
                        lp.Add(p);
                    }
                }
            }
            return lp;
        }


        public List<log> GetLogForAdmin(string OrderNo)
        {
            List<log> lp = new List<log>();
            string sql = "select * from t_log where OrderNo = '" + OrderNo + "' order by addOn asc,id asc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    lp = new List<log>();
                    foreach (DataRow r in dt.Rows)
                    {
                        log p = new log();
                        p.content = r["content"].ToString();
                        p.uId = Convert.ToInt32(r["uid"].ToString());
                        p.adminID = Convert.ToInt16(r["adminID"].ToString());
                        p.addOn = Convert.ToDateTime(r["addOn"].ToString());
                        p.lType = Convert.ToInt16(r["lType"].ToString());
                        p.uName = "--";
                        p.eName = "--";
                        if (p.uId > 0)
                        {
                            try
                            {
                                //if (p.lType == 0)
                                {
                                    user u = new _User().GetUser("", "", p.uId);
                                    if (u != null)
                                    {
                                        p.uName = u.contact;
                                        if (p.uName.Length == 0)
                                        {
                                            p.uName = u.nickName;
                                        }
                                    }
                                }

                            }
                            catch { }
                        }
                        lp.Add(p);
                    }
                }
            }
            return lp;
        }
    }
}
