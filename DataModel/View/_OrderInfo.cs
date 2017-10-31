using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

namespace Seascape.Data
{
    public class _OrderInfo:DbCenter
    {
       
        public int GetActiveOrder(int uid,int pid)
        {
            int OrderNum = 0;
            string sql = "select count(id) as t from t_order where userId = " + uid + " and pId = " + pid + " and state < 9";
            try
            {
                OrderNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public int GetActiveOrder(string tel, int aid)
        {
            int OrderNum = 0;
            string sql = "select count(id) as t from t_order where tel = '" + tel + "' and aId = " + aid + " and state < 9";
            try
            {
                OrderNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public int GetOrderCount(int uid)
        {
            int OrderNum = 0;
            string sql = "select count(id) as t from t_order where userId = " + uid + " and state > 3 and state < 9";
            try
            {
                OrderNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public int IsOrder(int fid)
        {
            int OrderNum = 0;
            string sql = "select count(id) as t from t_order where fid = " + fid + " and state < 9";
            try
            {
                OrderNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public int GetOrderCount(string unitNo)
        {
            int OrderNum = 0;
            string sql = "select sum(pNum) as t from t_orderpList where unitNo = '" + unitNo + "' and enable = 0 and orderNo in(select orderNo from t_order where state < 9)";
            try
            {
                OrderNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public int GetGetOrder(string workNo)
        {
            int OrderNum = 0;
            string sql = "select count(id) as t from t_order where getWorker = '" + workNo + "' and state = 3 and date(getDate) = CURDATE()";
            try
            {
                OrderNum = Convert.ToInt16(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public List<orderInfo> GetOrderList(int uid,string workNo,string orderNo)
        {
            List<orderInfo> lo = new List<orderInfo>();
            string sql = "select * from t_order where userId = " + uid + " order by id asc";
            if (workNo.Length > 0)
            {
                sql = "select * from t_order where workNo = '" + workNo + "'  order by id asc";
                if (workNo == "100")
                {
                    sql = "select * from t_order where state = 0  or (state > 0 and addOn >='" + DateTime.Now.AddDays(-2) + "') order by id asc";
                }
            }
            if (orderNo.Length > 0)
            {
                sql = "select * from t_order where orderNo = '" + orderNo + "' order by id asc";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                            }
                            catch
                            {
                            }
                            List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                            user user = new _User().GetUser("", "", o.userId);
                            if (user != null)
                            {
                                o.user = user;
                            }
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }


        public List<orderInfo> GetOrderListForWork(string workNo, int state, string date)
        {
            List<orderInfo> lo = new List<orderInfo>();
            string sql = "select * from t_order where date(sendDate) >= '" + DateTime.Now.Date.AddDays(-2) + "' and state = 2 and workNo = '" + workNo + "'  order by fid asc";
            if (workNo == "100")
            {
                sql = "select * from t_order where state=0 or state = 2 order by fid asc";
            }
            if (state > 2)
            {
                sql = "select * from t_order where date(sendDate) >= '" + date + "' and state = " + state + " and workNo = '" + workNo + "'  order by fid asc";
                if (workNo == "100")
                {
                    sql = "select * from t_order where date(sendDate) >= '" + date + "' and state = " + state + " order by fid asc";
                }
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                            }
                            catch
                            {
                            }
                            
                            List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                            user user = new _User().GetUser("", "", o.userId);
                            if (user != null)
                            {
                                o.user = user;
                            }
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }
        /// <summary>
        /// 获取订单列表--配送员
        /// </summary>
        /// <param name="uid"></param>
        /// <param name="workNo"></param>
        /// <param name="orderNo"></param>
        /// <returns></returns>
        public List<orderInfo> GetOrderList(string workNo, int state)
        {
            List<orderInfo> lo = new List<orderInfo>();
            string sql = "select * from t_order where getWorker = '" + workNo + "' and state = 3  order by addOn desc";
            if (state == 6)
            {
                sql = "select * from t_order where sendWorker = '" + workNo + "' and state = 6  order by addOn desc";
            }
            if (state == 8)
            {
                sql = "select * from t_order where (sendWorker = '" + workNo + "' or getWorker = '" + workNo + "') and state > 3 order by arriveOn desc limit 0,20";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                            }
                            catch
                            {
                            }
                            List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }

        public orderInfo GetOrderInfo(string orderNo, int id)
        {
            orderInfo lo = null;
            string sql = "select * from t_order where id = " + id + " order by addOn desc";
            if (orderNo.Length > 0)
            {
                sql = "select * from t_order where orderNo = '" + orderNo + "' order by addOn desc";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                            }
                            catch
                            {
                            }
                            List<log> logl = new _Log().GetLogList(o.orderNo);
                            if (logl != null && logl.Count > 0)
                            {
                                o.log = logl;
                            }
                             List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                            o.user = new _User().GetUser("", "", o.userId);
                            /*
                            List<evaluate> evaluateList = new evaluate().GetEvaluateList(o.orderNo);
                            if (evaluateList != null && evaluateList.Count > 0)
                            {
                                o.evaluate = evaluateList[0];
                            }
                             */
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo = o;
                        }
                    }
                }
                return lo;
            }
        }

        /// <summary>
        /// 获取订单详情-PC端
        /// </summary>
        /// <param name="orderNo"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public orderInfo GetOrderInfoForPC(string orderNo, int id)
        {
            orderInfo lo = null;
            string sql = "select * from t_order where id = " + id + " order by addOn desc";
            if (orderNo.Length > 0)
            {
                sql = "select * from t_order where orderNo = '" + orderNo + "' order by addOn desc";
            }
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                            }
                            catch
                            {
                            }
                            List<log> logl = new _Log().GetLogForAdmin(o.orderNo);
                            if (logl != null && logl.Count > 0)
                            {
                                o.log = logl;
                            }
                            List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                            /*
                            List<attach> la = new _Attach().GetAttachList(o.orderNo, 0,"",0);
                            if (la != null && la.Count > 0)
                            {
                                o.la = la;
                            }
                            */ 
                            o.user = new _User().GetUser("", "", o.userId);
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo = o;
                        }
                    }
                }
                return lo;
            }
        }

        /// <summary>
        /// 获取订单列表-PC端
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="workNo"></param>
        /// <param name="orderNo"></param>
        /// <param name="serviceId"></param>
        /// <returns></returns>
        public List<orderInfo> GetOrderListForPC(string sql, string sql_c, out int OCount)
        {
            List<orderInfo> lo = new List<orderInfo>();

            int OrderCount = 1;
            try
            {
                OrderCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch {
                OrderCount = 1;
            }
            OCount = OrderCount;

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                                
                            }
                            catch
                            {
                            }
                            List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                           user user = new _User().GetUser("", "", o.userId);
                            if (user != null)
                            {
                                o.user = user;
                            }
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }

        public List<orderInfo> GetOrderListForPrint(string sql)
        {
            List<orderInfo> lo = new List<orderInfo>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                            }
                            catch
                            {
                            }
                            List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                            user user = new _User().GetUser("", "", o.userId);
                            if (user != null)
                            {
                                o.user = user;
                                //o.contact = "[" + user.flower.fName + "]" + o.contact;
                            }
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }

        public List<orderInfo> GetOrderListForPC(string sql)
        {
            List<orderInfo> lo = new List<orderInfo>();

            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        orderInfo o = null;
                        try
                        {
                            o = new orderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                addr = r["addr"].ToString(),
                                contact = r["contact"].ToString(),
                                workNo = r["workNo"].ToString(),
                                id = Convert.ToInt32(r["id"].ToString()),
                                memo = r["memo"].ToString(),
                                orderNo = r["orderNo"].ToString(),
                                payOn = Convert.ToDateTime(r["payOn"].ToString()),
                                state = Convert.ToInt16(r["state"].ToString()),
                                tel = r["tel"].ToString(),
                                userId = Convert.ToInt16(r["userId"].ToString()),
                                payType = Convert.ToInt16(r["payType"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                isCall = Convert.ToInt16(r["isCall"].ToString()),
                                CallInfo = r["CallInfo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2),
                                price = Convert.ToDouble(r["price"].ToString()),
                                balance = Convert.ToDouble(r["balance"]),
                                wxCardFee = Convert.ToDouble(r["wxCardFee"]),
                                postFee = Convert.ToDouble(r["postFee"]),
                                sourceId = Convert.ToInt16(r["sourceId"].ToString()),
                                serviceId = Convert.ToInt16(r["serviceId"].ToString()),
                                getTime = r["getTime"].ToString(),
                                getDate = Convert.ToDateTime(r["getDate"]),
                                getWorker = r["getWorker"].ToString(),
                                sendWorker = r["sendWorker"].ToString(),
                                oType = Convert.ToInt16(r["oType"].ToString()),
                                pId = Convert.ToInt16(r["pId"].ToString()),
                                fid = Convert.ToInt16(r["fid"].ToString()),
                                cityId = Convert.ToInt16(r["cityId"].ToString()),
                                isPrint = Convert.ToInt16(r["isPrint"].ToString()),
                                isFinance = Convert.ToInt16(r["isFinance"].ToString())
                            };
                            try
                            {
                                o.financeOn = Convert.ToDateTime(r["financeOn"]);
                                o.sureOn = Convert.ToDateTime(r["sureOn"].ToString());
                                o.sendOn = Convert.ToDateTime(r["sendOn"].ToString());
                                o.arriveOn = Convert.ToDateTime(r["arriveOn"]);
                                o.getDate = Convert.ToDateTime(r["getDate"].ToString());
                                o.sendDate = Convert.ToDateTime(r["sendDate"].ToString());
                            }
                            catch
                            {
                            }
                            List<orderPList> lp = new _OrderPList().GetOrderPList(o.orderNo);
                            if (lp != null && lp.Count > 0)
                            {
                                o.lp = lp;
                            }
                            user user = new _User().GetUser("", "", o.userId);
                            if (user != null)
                            {
                                o.user = user;
                            }
                        }
                        catch
                        {
                            o = null;
                        }
                        if (o != null)
                        {
                            lo.Add(o);
                        }
                    }
                }
                return lo;
            }
        }
    }
}
