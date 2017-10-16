using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.WebView;

namespace Seascape.Data
{
    public class _Content:DbCenter
    {
        public List<content> GetContentList(string sql)
        {
            List<content> lp = new List<content>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        content b = new content
                        {
                            id = Convert.ToInt16(r["id"]),
                            cId = Convert.ToInt16(r["cId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            title = r["title"].ToString(),
                            contents = r["contents"].ToString(),
                            isHot = Convert.ToInt16(r["isHot"]),
                            adminId = Convert.ToInt16(r["adminId"]),
                            imgUrl = r["imgUrl"].ToString(),
                            isHref = Convert.ToInt16(r["isHref"]),
                            hrefUrl = r["hrefUrl"].ToString(),
                            enable = Convert.ToInt16(r["enable"]),
                            hbSize = r["hbSize"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public List<WebHb> GetHbList(string sql)
        {
            List<WebHb> lp = new List<WebHb>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        WebHb b = new WebHb
                        {
                            id = Convert.ToInt16(r["id"]),
                            title = r["title"].ToString(),
                            imgUrl = r["imgUrl"].ToString()
                        };
                        lp.Add(b);
                    }
                }
            }
            return lp;
        }

        public content GetContent(int id)
        {
            content c = null;
            using (DataTable dt = helper.GetDataTable("select * from t_content where id = " + id + " and enable > -1"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    DataRow r = dt.Rows[0];
                    {
                        c = new content
                        {
                            id = Convert.ToInt16(r["id"]),
                            cId = Convert.ToInt16(r["cId"]),
                            cType = Convert.ToInt16(r["cType"]),
                            title = r["title"].ToString(),
                            contents = r["contents"].ToString(),
                            isHot = Convert.ToInt16(r["isHot"]),
                            adminId = Convert.ToInt16(r["adminId"]),
                            imgUrl = r["imgUrl"].ToString(),
                            isHref = Convert.ToInt16(r["isHref"]),
                            hrefUrl = r["hrefUrl"].ToString(),
                            enable = Convert.ToInt16(r["enable"]),
                            hbSize = r["hbSize"].ToString(),
                            addOn = Convert.ToDateTime(r["AddOn"])
                        };
                    }
                }
            }
            return c;
        }

        public int CheckContent(string title, int cId)
        {
            int hid = 0;
            string sql = "select * from t_content where cId = " + cId + " and title = '" + title + "' and enable > -1";
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
