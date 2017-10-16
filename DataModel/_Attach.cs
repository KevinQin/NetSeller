using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Attach:DbCenter
    {
        /// <summary>
        /// 获取附件列表
        /// </summary>
        /// <param name="OrderNo"></param>
        /// <param name="Pid"></param>
        /// <returns></returns>
        public List<attach> GetAttachList(string OrderNo, int Pid,string unitNo,int uid)
        {
            List<attach> la = new List<attach>();
            string sql = "select * from t_attach where orderNo = '" + OrderNo + "' and unitNo = '" + unitNo + "' order by id asc";
            if (OrderNo.Length == 0)
            {
                sql = "select * from t_attach where pid = " + Pid + " and uid = " + uid + " order by descNum asc";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        attach a = new attach
                        {
                            aSrc = r["aSrc"].ToString(),
                            aType = Convert.ToInt16(r["aType"])
                        };
                        //attach a = new attach { addOn = Convert.ToDateTime(r["addon"]), pid = Convert.ToInt16(r["pid"]), orderNo = r["orderNo"].ToString(), descNum = Convert.ToInt16(r["descNum"]), aType = Convert.ToInt16(r["aType"]), aSrc = r["aSrc"].ToString(), id = Convert.ToInt32(r["id"]) };
                        //la.Add(r["aSrc"].ToString());
                        la.Add(a);
                    }
                }
            }
            return la;
        }

        public List<string> GetAttachList()
        {
            List<string> la = new List<string>();
            string sql = "select * from t_attach";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        //attach a = new attach { addOn = Convert.ToDateTime(r["addon"]), pid = Convert.ToInt16(r["pid"]), orderNo = r["orderNo"].ToString(), descNum = Convert.ToInt16(r["descNum"]), aType = Convert.ToInt16(r["aType"]), aSrc = r["aSrc"].ToString(), id = Convert.ToInt32(r["id"]) };
                        la.Add(r["aSrc"].ToString());
                    }
                }
            }
            return la;
        }
    }
}
