using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.View;
using Seascape.Model.WebView;

namespace Seascape.Data
{
    public class _ProductPost:DbCenter
    {
        public List<productPostInfo> GetProductPostList(int Pid)
        {
            List<productPostInfo> la = new List<productPostInfo>();
            string sql = "select * from t_product_post where pid = " + Pid;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, string> Dic = new _Post().GetPostDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        productPostInfo a = new productPostInfo
                        {
                            id = Convert.ToInt16(r["id"]),
                            pId = Convert.ToInt16(r["pId"]),
                            postFee = Convert.ToDouble(r["postFee"]),
                            postID = Convert.ToInt16(r["postID"]),
                            provice = ""
                        };
                        if (Dic.ContainsKey(a.postID))
                        {
                            a.provice = new _Post().GetProvice(Dic[a.postID]);
                        }
                        
                        la.Add(a);
                    }
                }
            }
            return la;
        }

        public List<ProductPostForWeb> GetProductPostForWebList(int Pid)
        {
            List<ProductPostForWeb> la = new List<ProductPostForWeb>();
            string sql = "select * from t_product_post where pid = " + Pid;
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, string> Dic = new _Post().GetPostDic();
                    foreach (DataRow r in dt.Rows)
                    {
                        ProductPostForWeb a = new ProductPostForWeb
                        {
                            postFee = Convert.ToDouble(r["postFee"]),
                            provice = ""
                        };
                        if (Dic.ContainsKey(Convert.ToInt16(r["postID"])))
                        {
                            a.provice = new _Post().GetProvice(Dic[Convert.ToInt16(r["postID"])]);
                        }

                        la.Add(a);
                    }
                }
            }
            return la;
        }
    }
}
