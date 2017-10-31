using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _UserBank:DbCenter
    {
        public userBank GetBankInfo(string openId)
        {
            userBank lu = null;
            try
            {
                using (DataTable dt = helper.GetDataTable("select * from t_user_bank where openId = '" + openId + "'"))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        {

                            lu = new userBank()
                            {
                                id = Convert.ToInt16(r["id"]),
                                uid = Convert.ToInt16(r["uid"]),
                                cardName = r["cardName"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                cardNo = r["cardNo"].ToString(),
                                userName = r["userName"].ToString(),
                                mobile = r["mobile"].ToString(),
                                openId = r["openId"].ToString()
                            };
                        }
                    }
                }
            }
            catch { }
            return lu;
        }
    }
}
