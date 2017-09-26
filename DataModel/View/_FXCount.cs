using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _FXCount : DbCenter
    {
        public List<fxCount> GetFlowerCount(string keyword)
        {
            List<fxCount> lo = new List<fxCount>();
            using (DataTable dt = helper.GetDataTable("select fid,count(id) as orderNum,sum(allPrice) as price from t_order where "+keyword+" group by fid order by price desc"))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        fxCount o = new fxCount()
                        {
                            fid = Convert.ToInt16(r["fid"]),
                            orderNum = Convert.ToInt32(r["orderNum"]),
                            price = Convert.ToDouble(r["price"]),
                            fName = ""
                        };
                        try
                        {
                            o.pNum = Convert.ToInt32(helper.GetOne("select sum(pNum) as t from t_orderplist where enable = 0 and orderNo in(select orderNo from t_order where fid = " + o.fid + " and " + keyword + ")"));
                        }
                        catch
                        {
                            o.pNum = 0;
                        }
                        lo.Add(o);
                    }
                }
                return lo;
            }
        }
    }
}
