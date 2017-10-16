using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Post:DbCenter
    {
        public List<postProvice> GetProvice()
        {
            List<postProvice> la = new List<postProvice>();
            string sql = "select * from t_post_provice order by id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            postProvice a = new postProvice { provice = r["provice"].ToString() };
                            la.Add(a);
                        }
                    }
                }
            }
            catch
            {
            }
            return la;
        }

        public string GetProvice(string ids)
        {
            string provice = "";
            string sql = "select * from t_post_provice order by id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if((","+ids).IndexOf(","+r["id"]+",")>-1)
                            {
                                provice += r["provice"].ToString() + ",";
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return provice;
        }

        public List<post> GetPost()
        {
            List<post> la = new List<post>();
            string sql = "select * from t_post where enable = 0 order by id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            post a = new post
                            {
                                id = Convert.ToInt16(r["id"]),
                                postName = r["postName"].ToString(),
                                provice = r["provice"].ToString(),
                                postFee = Convert.ToDouble(r["postFee"]),
                                postType = Convert.ToInt16(r["postType"])
                            };
                            la.Add(a);
                        }
                    }
                }
            }
            catch
            {
            }
            return la;
        }

        public Dictionary<int,string> GetPostDic()
        {
            Dictionary<int, string> Dic = new Dictionary<int, string>();
            string sql = "select * from t_post where enable = 0 order by id asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            Dic.Add(Convert.ToInt16(r["id"]), r["provice"].ToString());
                        }
                    }
                }
            }
            catch
            {
            }
            return Dic;
        }

        public int CheckPost(string postName)
        {
            int hid = 0;
            string sql = "select * from t_post where postName = '" + postName + "' and enable = 0";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    hid = Convert.ToInt16(dt.Rows[0]["Id"]);
                }
            }
            return hid;
        }
    }
}
