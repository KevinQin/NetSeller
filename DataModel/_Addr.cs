using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    /// <summary>
    /// 常用地址
    /// </summary>
    public class _Addr:DbCenter
    {
        /// <summary>
        /// 获取常用地址列表
        /// </summary>
        /// <param name="uId"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public List<addr> GetAddr(int uId, int id,int isDefault)
        {
            List<addr> la = new List<addr>();
            string sql = "select * from t_addr where uId = " + uId + " order by useOn desc";
            if (isDefault == 1)
            {
                sql = "select * from t_addr where uId = " + uId + " order by useOn desc limit 0,1 ";
            }
            if (id > 0)
            {
                sql = "select * from t_addr where id = " + id;
            }

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            addr a = new addr { address = r["address"].ToString(), city = r["city"].ToString(), area = r["area"].ToString(), contact = r["contact"].ToString(), id = Convert.ToInt32(r["id"]), mobile = r["mobile"].ToString(), street = r["street"].ToString(), uId = Convert.ToInt32(r["uId"]), addOn = Convert.ToDateTime(r["addOn"]) };
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

        public List<addr> GetAddr(string tel)
        {
            List<addr> la = new List<addr>();
            string sql = "select * from t_addr where mobile = '" + tel + "' order by useOn desc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            addr a = new addr { address = r["address"].ToString(), city = r["city"].ToString(), area = r["area"].ToString(), contact = r["contact"].ToString(), id = Convert.ToInt32(r["id"]), mobile = r["mobile"].ToString(), street = r["street"].ToString(), uId = Convert.ToInt32(r["uId"]), addOn = Convert.ToDateTime(r["addOn"]) };
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

        public List<addr> GetAddr(string tel, string contact, string address)
        {
            List<addr> la = new List<addr>();
            string sql = "select * from t_addr where address = '" + address + "' and contact = '" + contact + "' and mobile = '" + tel + "' order by useOn desc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            addr a = new addr { address = r["address"].ToString(), city = r["city"].ToString(), area = r["area"].ToString(), contact = r["contact"].ToString(), id = Convert.ToInt32(r["id"]), mobile = r["mobile"].ToString(), street = r["street"].ToString(), uId = Convert.ToInt32(r["uId"]), addOn = Convert.ToDateTime(r["addOn"]) };
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
    }
}
