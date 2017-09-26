using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Class:DbCenter
    {
        public List<classInfo> GetClassList(int parId, int cType)
        {
            List<classInfo> lc = new List<classInfo>();
            string sql = "select * from t_class where parId = " + parId + " and cType = " + cType + " and enable > -1 order by descNum asc,cName asc";
            if (parId == -1)
            {
                sql = "select * from t_class where cType = " + cType + " and enable > -1 order by descNum asc,cName asc";
            }
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, string> Dic = GetClassDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            classInfo c = new classInfo()
                            {
                                id = Convert.ToInt32(r["id"]),
                                leavel = Convert.ToInt16(r["leavel"]),
                                cName = r["cName"].ToString(),
                                imgUrl = r["imgUrl"].ToString(),
                                parId = Convert.ToInt16(r["parId"]),
                                descNum = Convert.ToInt16(r["descNum"]),
                                cType = Convert.ToInt16(r["cType"]),
                                mainId = Convert.ToInt16(r["mainId"]),
                                pName = ""
                            };
                            if (Dic.ContainsKey(c.parId))
                            {
                                c.pName = Dic[c.parId];
                            }
                            lc.Add(c);
                        }
                    }
                }
            }
            catch
            {
            }
            return lc;
        }

        /// <summary>
        /// 获取分类字典
        /// </summary>
        /// <returns></returns>
        public Dictionary<int, string> GetClassDic()
        {
            Dictionary<int, string> lc = new Dictionary<int, string>();
            string sql = "select * from t_class";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (!lc.ContainsKey(Convert.ToInt16(r["id"])))
                            {
                                lc.Add(Convert.ToInt16(r["id"]), r["cName"].ToString());
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return lc;
        }

        public int CheckClass(string className, int parId)
        {
            int hid = 0;
            string sql = "select * from t_class where parId = " + parId + " and cName = '" + className + "'";
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
