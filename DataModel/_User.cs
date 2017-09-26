using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _User:DbCenter
    {
        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="OpenID"></param>
        /// <param name="mobile"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public user GetUser(string OpenID, string mobile, int id)
        {
            user u = null;
            string sql = "";
            if (!string.IsNullOrEmpty(mobile))
            {
                sql = "select * from `t_user` where mobile = '" + mobile + "'";
            }
            if (!string.IsNullOrEmpty(OpenID))
            {
                sql = "select * from `t_user` where openid = '" + OpenID + "'";
            }
            if (id > 0)
            {
                sql = "select * from `t_user` where id = " + id;
            }

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        u = new user()
                        {
                            addOn = Convert.ToDateTime(r["addOn"]),
                            area = r["area"].ToString(),
                            contact = r["contact"].ToString(),
                            sex = Convert.ToInt16(r["sex"]),
                            photoUrl = r["photoUrl"].ToString(),
                            nickName = r["nickName"].ToString(),
                            mobile = r["mobile"].ToString(),
                            openId = r["openid"].ToString(),
                            id = Convert.ToInt32(r["id"]),
                            adId = Convert.ToInt32(r["adId"]),
                            uType = Convert.ToInt32(r["uType"]),
                            balance = Convert.ToDouble(r["balance"]),
                            sourceId = Convert.ToInt32(r["sourceId"].ToString())
                        };
                    }
                }
            }
            catch { }
            return u;
        }

        public user GetUserForFid(int fid)
        {
            user u = null;
            string sql = "select * from `t_user` where fid = " + fid;

            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        u = new user()
                        {
                            addOn = Convert.ToDateTime(r["addOn"]),
                            area = r["area"].ToString(),
                            contact = r["contact"].ToString(),
                            sex = Convert.ToInt16(r["sex"]),
                            photoUrl = r["photoUrl"].ToString(),
                            nickName = r["nickName"].ToString(),
                            mobile = r["mobile"].ToString(),
                            openId = r["openid"].ToString(),
                            id = Convert.ToInt32(r["id"]),
                            adId = Convert.ToInt32(r["adId"]),
                            uType = Convert.ToInt32(r["uType"]),
                            balance = Convert.ToDouble(r["balance"]),
                            sourceId = Convert.ToInt32(r["sourceId"].ToString())
                        };
                    }
                }
            }
            catch { }
            return u;
        }

        public List<user> GetUser(string sql, out int UCount)
        {
            string sql_c = sql.Replace("*", "count(*) as t");
            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch {
                Count = 0;
            }
            List<user> lu = new List<user>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            user u = new user()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                area = r["area"].ToString(),
                                contact = r["contact"].ToString(),
                                sex = Convert.ToInt16(r["sex"]),
                                photoUrl = r["photoUrl"].ToString(),
                                nickName = r["nickName"].ToString(),
                                mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                id = Convert.ToInt32(r["id"]),
                                adId = Convert.ToInt32(r["adId"]),
                                uType = Convert.ToInt32(r["uType"]),
                                balance = Convert.ToDouble(r["balance"]),
                                sourceId = Convert.ToInt32(r["sourceId"].ToString())
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

        public List<user> GetUserForMobile(string sql, string sqlid, out int UCount)
        {
            string sql_c = sql.Replace("*", "count(*) as t");
            int Count = 0;
            try
            {
                Count = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                Count = 0;
            }
            List<user> lu = new List<user>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, string> Dic = GetComInfo(sqlid);
                        foreach (DataRow r in dt.Rows)
                        {

                            user u = new user()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                area = r["area"].ToString(),
                                contact = r["contact"].ToString(),
                                sex = Convert.ToInt16(r["sex"]),
                                photoUrl = r["photoUrl"].ToString(),
                                nickName = r["nickName"].ToString(),
                                mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                id = Convert.ToInt32(r["id"]),
                                adId = Convert.ToInt32(r["adId"]),
                                uType = Convert.ToInt32(r["uType"]),
                                balance = Convert.ToDouble(r["balance"]),
                                sourceId = Convert.ToInt32(r["sourceId"].ToString())
                            };
                            if (sqlid.Length > 0 && Dic.ContainsKey(u.id))
                            {
                                try
                                {
                                    u.contact = Dic[u.id].ToString().Split('|')[0];
                                    u.mobile = Dic[u.id].ToString().Split('|')[1];
                                }
                                catch
                                {

                                }
                            }
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            UCount = Count;
            return lu;
        }

        public List<user> GetUserForMobile(int uid)
        {
            string sql = "select * from t_user where source = " + uid + " order by addOn desc";
            List<user> lu = new List<user>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {

                            user u = new user()
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                area = r["area"].ToString(),
                                contact = r["contact"].ToString(),
                                sex = Convert.ToInt16(r["sex"]),
                                photoUrl = r["photoUrl"].ToString(),
                                nickName = r["nickName"].ToString(),
                                mobile = r["mobile"].ToString(),
                                openId = r["openid"].ToString(),
                                id = Convert.ToInt32(r["id"]),
                                adId = Convert.ToInt32(r["adId"]),
                                uType = Convert.ToInt32(r["uType"]),
                                balance = Convert.ToDouble(r["balance"]),
                                sourceId = Convert.ToInt32(r["sourceId"].ToString())
                            };
                            lu.Add(u);
                        }
                    }
                }
            }
            catch { }
            return lu;
        }

        public Dictionary<int, string> GetComInfo(string sqlid)
        {
            Dictionary<int, string> DicCom = new Dictionary<int, string>();
            if (sqlid.Length > 0)
            {
                string sql = "select userId,contact,tel from t_order where userId in(" + sqlid + ")";
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        int uid = 0;
                        foreach (DataRow r in dt.Rows)
                        {
                            uid = Convert.ToInt32(r["userId"]);
                            if (!DicCom.ContainsKey(uid))
                            {
                                DicCom.Add(uid, r["contact"].ToString() + "|" + r["tel"].ToString());
                            }
                        }
                    }
                }
            }
            return DicCom;
        }
    }
}
