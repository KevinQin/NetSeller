using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.WebView;

namespace Seascape.Data
{
    public class _Evaluate:DbCenter
    {
        public List<WebEvaluate> GetEvaluateList(string orderNo, int pid,out Double radio)
        {
            Double tradio = 100;
            List<WebEvaluate> lp = new List<WebEvaluate>();
            string sql = "select a.orderNo,a.addOn,a.memo,a.grade,b.nickName,b.photoUrl from t_evaluate as a join t_user as b on a.uid = b.id where a.pid = " + pid + " and a.enable = 0 order by a.addOn desc";
            if (orderNo.Length > 0)
            {
                if (pid > 0)
                {
                    sql = "select * from t_evaluate where  pid = " + pid + " and orderNo = '" + orderNo + "' and enable = 0 order by addOn desc";
                }
                else
                {
                    sql = "select * from t_evaluate where orderNo = '" + orderNo + "' and enable = 0 order by addOn desc";
                }
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    int grade = 0;
                    int gradeNum = 0;
                    foreach (DataRow r in dt.Rows)
                    {
                        WebEvaluate p = new WebEvaluate
                        {
                            grade = Convert.ToInt16(r["grade"]),
                            memo = r["memo"].ToString(),
                            orderNo = r["orderNo"].ToString(),
                            nickName = r["nickName"].ToString(),
                            photoUrl = r["photoUrl"].ToString(),
                            addOn = Convert.ToDateTime(r["addON"])
                        };
                        lp.Add(p);
                        if(p.orderNo.Length>0){
                            grade += p.grade;
                            gradeNum++;
                        }
                    }
                    tradio = (grade * 100) / (gradeNum * 5);
                }
            }
            radio = tradio;
            return lp;
        }


        public bool IsEvaluate(string orderNo, int pid,int uid,int eType)
        {
            bool IsE = false;
            string sql = "select * from t_evaluate where orderNo = '" + orderNo + "' and pid = " + pid;
            if (eType == 1)
            {
                sql = "select * from t_evaluate where uid = " + uid + " and pid = " + pid;
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    IsE = true;
                }
            }
            return IsE;
        }

    }
}
