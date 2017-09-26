using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Item:DbCenter
    {
        public List<itemInfo> GetItemList(int cId)
        {
            List<itemInfo> lc = new List<itemInfo>();
            string sql = "select * from t_config_item where cId = " + cId + " and enable > -1 order by id asc";
            if (cId == 0)
            {
                sql = "select * from t_config_item where enable > -1 order by id asc";
            }
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, string> Dic = new _Class().GetClassDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            itemInfo c = new itemInfo()
                            {
                                id = Convert.ToInt32(r["id"]),
                                cId = Convert.ToInt16(r["cId"]),
                                itemName = r["itemName"].ToString(),
                                itemValue = r["itemValue"].ToString(),
                                itemDesp = r["itemDesp"].ToString(),
                                pName = ""
                            };
                            if (Dic.ContainsKey(c.cId))
                            {
                                c.pName = Dic[c.cId];
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
        public Dictionary<int, itemConfig> GetClassDic()
        {
            Dictionary<int, itemConfig> lc = new Dictionary<int, itemConfig>();
            string sql = "select * from t_config_item";
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
                                itemConfig c = new itemConfig()
                                {
                                    id = Convert.ToInt32(r["id"]),
                                    cId = Convert.ToInt16(r["cId"]),
                                    itemName = r["itemName"].ToString(),
                                    itemValue = r["itemValue"].ToString(),
                                    itemDesp = r["itemDesp"].ToString()
                                };
                                lc.Add(Convert.ToInt16(r["id"]), c);
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

        public int CheckClass(string itemName, int cId)
        {
            int hid = 0;
            string sql = "select * from t_config_item where cId = " + cId + " and itemName = '" + itemName + "' and enable = 0";
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
