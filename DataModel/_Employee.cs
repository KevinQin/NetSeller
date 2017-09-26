using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _Employee:DbCenter
    {
        
        /// <summary>
        /// 检查用户信息是否正确并返回
        /// </summary>
        /// <param name="mobile"></param>
        /// <param name="pass"></param>
        /// <returns></returns>
        public employee checkUser(string mobile, string pass)
        {
            employee admin = null;
            string sql = "select * from t_employee where tel = '" + mobile + "' and password = '" + pass + "'";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        admin = new employee
                        {
                            id = Convert.ToInt16(r["id"]),
                            tel = r["tel"].ToString(),
                            name = r["name"].ToString(),
                            limits = r["limits"].ToString(),
                            workNo = r["workNo"].ToString(),
                            role = Convert.ToInt16(r["role"])
                        };
                        if (admin.role > 0)
                        {
                            admin.limits = new _AdminRole().GetLimits(admin.role);
                        }

                    }
                }
            }
            catch
            {
            }
            return admin;
        }

        public string UpdatePass(string mobile, string oldPass, string newPass)
        {
            string upPass = "修改失败";
            oldPass = com.seascape.tools.BasicTool.MD5(oldPass);
            newPass = com.seascape.tools.BasicTool.MD5(newPass);
            if (checkUser(mobile, oldPass) != null)
            {
                var o = new
                {
                    password = newPass
                };
                if (new Main().UpdateDb(o, "t_employee", "tel = '" + mobile + "'"))
                {
                    upPass = "OK";
                }
            }
            else
            {
                upPass = "原始密码错误";
            }
            return upPass;
        }

        /// <summary>
        /// 获取员工列表
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public List<employee> GetEmployeeList(int isService, string workNo, string openid)
        {
            List<employee> le = null;
            string sql = "select * from t_employee order by workNo desc";
            if (isService > -1)
            {
                sql = "select * from t_employee where isService = " + isService;
            }
            if (workNo.Length > 0)
            {
                sql = "select * from t_employee where workNo = '" + workNo + "'";
            }
            if (openid.Length > 0)
            {
                sql = "select * from t_employee where openid = '" + openid + "'";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    le = new List<employee>();
                    foreach (DataRow r in dt.Rows)
                    {
                        employee e = new employee
                        {
                            addOn = Convert.ToDateTime(r["addOn"]),
                            id = Convert.ToInt32(r["id"]),
                            isService = Convert.ToInt16(r["isService"]),
                            memo = r["memo"].ToString(),
                            name = r["name"].ToString(),
                            openid = r["openid"].ToString(),
                            password = r["password"].ToString(),
                            photoUrl = r["photoUrl"].ToString(),
                            sex = Convert.ToInt16(r["sex"]),
                            state = Convert.ToInt16(r["state"]),
                            tel = r["tel"].ToString(),
                            workNo = r["workNo"].ToString()
                        };
                        le.Add(e);
                    }
                }
            }
            return le;
        }

        /// <summary>
        /// 获取员工列表
        /// </summary>
        /// <param name="isService"></param>
        /// <param name="workNo"></param>
        /// <returns></returns>
        public List<employee> GetEmployeeListForC(int isService, string workNo, string openid, int cityId)
        {
            List<employee> le = null;
            string keyWord = "";
            string sql = "select * from t_employee order by workNo desc";
            if (isService > -1)
            {
                keyWord += " and isService = " + isService;
            }
            if (workNo.Length > 0)
            {
                keyWord += " and workNo = '" + workNo + "'";
            }
            if (openid.Length > 0)
            {
                keyWord += " and openid = '" + openid + "'";
            }
            if (cityId > 0)
            {
                keyWord += " and cityId = " + cityId;
            }
            if (keyWord.Length > 0)
            {
                sql = "select * from t_employee where 1=1 " + keyWord + " order by workNo desc";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    le = new List<employee>();
                    foreach (DataRow r in dt.Rows)
                    {
                        employee e = new employee
                        {
                            addOn = Convert.ToDateTime(r["addOn"]),
                            id = Convert.ToInt32(r["id"]),
                            isService = Convert.ToInt16(r["isService"]),
                            memo = r["memo"].ToString(),
                            name = r["name"].ToString(),
                            openid = r["openid"].ToString(),
                            password = r["password"].ToString(),
                            photoUrl = r["photoUrl"].ToString(),
                            sex = Convert.ToInt16(r["sex"]),
                            state = Convert.ToInt16(r["state"]),
                            tel = r["tel"].ToString(),
                            workNo = r["workNo"].ToString()
                        };
                        le.Add(e);
                    }
                }
            }
            return le;
        }

        /// <summary>
        /// 获取可用的工号
        /// </summary>
        /// <returns></returns>
        public string getWorkNo()
        {
            string workNo = "";
            string sql = "select * from t_employee order by workNo desc limit 0,1";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        workNo = dt.Rows[0]["workNo"].ToString();
                    }
                }
            }
            catch
            {
            }
            if (workNo.Length > 0)
            {
                workNo = (Convert.ToInt16(workNo) + 1).ToString();
            }
            return workNo;
        }
    }
}
