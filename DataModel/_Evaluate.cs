using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Data.WebView;
using Seascape.Model;
using Seascape.Model.View;
using Seascape.Model.WebView;

namespace Seascape.Data
{
    public class _Evaluate:DbCenter
    {
        public List<WebEvaluate> GetEvaluateList(string orderNo, int pid, string unitNo, out Double radio)
        {
            Double tradio = 100;
            List<WebEvaluate> lp = new List<WebEvaluate>();
            string sql = "select a.orderNo,a.uid,a.addOn,a.memo,a.grade,a.unitNo,b.nickName,b.photoUrl from t_evaluate as a join t_user as b on a.uid = b.id where a.pid = " + pid + " and a.enable = 0 order by a.addOn desc";
            if (orderNo.Length > 0)
            {
                if (unitNo.Length > 0)
                {
                    sql = "select a.orderNo,a.uid,a.addOn,a.memo,a.grade,a.unitNo,b.nickName,b.photoUrl from t_evaluate as a join t_user as b on a.uid = b.id where  a.unitNo = '" + unitNo + "' and a.orderNo = '" + orderNo + "' and a.enable = 0 order by a.addOn desc";
                }
                else
                {
                    sql = "select a.orderNo,a.uid,a.addOn,a.memo,a.grade,a.unitNo,b.nickName,b.photoUrl from t_evaluate as a join t_user as b on a.uid = b.id where a.orderNo = '" + orderNo + "' and a.enable = 0 order by a.addOn desc";
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
                        p.attach = new _Attach().GetAttachList(p.orderNo, pid, r["unitNo"].ToString(), Convert.ToInt32(r["uid"]));
                        lp.Add(p);
                        if (p.orderNo.Length > 0)
                        {
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

        public List<evaluateInfo> GetEvaluateList(string sql, string sql_c, out int Count)
        {
            List<evaluateInfo> la = new List<evaluateInfo>();

            int LogCount = 1;
            try
            {
                LogCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                LogCount = 1;
            }
            Count = LogCount;

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        try
                        {
                            evaluateInfo b = new evaluateInfo
                            {
                                id = Convert.ToInt32(r["id"]),
                                enable = Convert.ToInt16(r["enable"]),
                                grade = Convert.ToInt16(r["grade"]),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addON"]),
                                uid = Convert.ToInt32(r["uid"]),
                                pid = Convert.ToInt32(r["pid"])
                            };

                            user user = new _User().GetUser("", "", b.uid);
                            b.user = user;

                            List<attach> attach = new _Attach().GetAttachList(b.orderNo, b.pid, r["unitNo"].ToString(), Convert.ToInt32(r["uid"]));
                            b.attach = attach;

                            b.pName = new _Product().GetProductName(b.pid);
                            
                            la.Add(b);
                        }
                        catch { }

                    }
                }
            }
            return la;
        }


        public bool IsEvaluate(string orderNo, int pid, int uid, int eType, string unitNo)
        {
            bool IsE = false;
            string sql = "select * from t_evaluate where orderNo = '" + orderNo + "' and unitNo = '" + unitNo + "'";
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
