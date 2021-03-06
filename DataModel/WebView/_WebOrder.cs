﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.WebView;

namespace Seascape.Data.WebView
{
    public class _WebOrder:DbCenter
    {
        /// <summary>
        /// 获取订单列表
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public List<WebOrderList> GetOrderList(string sql,int uid)
        {
            List<WebOrderList> lo = new List<WebOrderList>();
            
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, string> imgDic = GetProductImg();
                    List<orderPList> lp = GetOrderProduct(uid, "");
                    foreach (DataRow r in dt.Rows)
                    {
                        WebOrderList o = null;
                        try
                        {
                            o = new WebOrderList
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                orderNo = r["orderNo"].ToString(),
                                state = Convert.ToInt16(r["state"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2)
                            };
                            List<WebOrderProduct> p = new List<WebOrderProduct>();
                            if (lp != null && lp.Count > 0)
                            {
                                foreach (orderPList item in lp)
                                {
                                    if (item.orderNo == o.orderNo)
                                    {
                                        WebOrderProduct wp = new WebOrderProduct
                                        {
                                            pName = item.pName,
                                            id = item.pid,
                                            pNum = item.pNum,
                                            unitNo = item.unitNo,
                                            price = item.price,
                                            imgUrl = ""
                                        };
                                        if (imgDic.ContainsKey(item.pid))
                                        {
                                            if (imgDic[item.pid].Length > 0)
                                            {
                                                wp.imgUrl = imgDic[item.pid].Split('@')[0];
                                            }
                                        }
                                        wp.unitInfo = new _Unit().GetUnitItem(item.unitNo);
                                        p.Add(wp);
                                    }
                                }
                                o.product = p;
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

        public Dictionary<int, string> GetProductImg()
        {
            Dictionary<int, string> lc = new Dictionary<int, string>();
            string sql = "select id,imgUrl from t_product";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            if (!lc.ContainsKey(Convert.ToInt16(r["id"])))
                            {
                                lc.Add(Convert.ToInt16(r["id"]), r["imgUrl"].ToString());
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return lc;
        }

        public List<orderPList> GetOrderProduct(int uid,string orderNo)
        {
            List<orderPList> lc = new List<orderPList>();
            string sql = "select * from t_orderPList where orderNo in(select orderNo from t_order where userId = " + uid + ") and enable = 0";
            if (orderNo.Length > 0)
            {
                sql = "select * from t_orderPList where orderNo = '" + orderNo + "' and enable = 0";
            }
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            orderPList b = new orderPList
                            {
                                orderNo = r["orderNo"].ToString(),
                                price = Math.Round(Convert.ToDouble(r["price"]), 2),
                                pid = Convert.ToInt16(r["pid"]),
                                pNum = Convert.ToInt16(r["pNum"]),
                                pName = r["pName"].ToString(),
                                unitNo = r["unitNo"].ToString(),
                                isEvaluate = Convert.ToInt16(r["isEvaluate"])
                            };
                            lc.Add(b);
                        }
                    }
                }
            }
            catch
            {
            }
            return lc;
        }

        /// <summary>
        /// 获取订单详情
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public WebOrderInfo GetOrderInfo(string orderNo)
        {
            WebOrderInfo w = null;
            string sql = "select * from t_order where orderNo = '" + orderNo + "'";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    Dictionary<int, string> imgDic = GetProductImg();
                    List<orderPList> lp = GetOrderProduct(0, orderNo);
                    DataRow r = dt.Rows[0];
                    {
                        try
                        {
                            w = new WebOrderInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"].ToString()),
                                allPrice = Convert.ToDouble(r["allPrice"].ToString()),
                                orderNo = r["orderNo"].ToString(),
                                state = Convert.ToInt16(r["state"].ToString()),
                                isPay = Convert.ToInt16(r["isPay"].ToString()),
                                userId = Convert.ToInt32(r["userId"]),
                                addr = r["addr"].ToString(),
                                tel = r["tel"].ToString(),
                                contact = r["contact"].ToString(),
                                pId = Convert.ToInt16(r["pId"]),
                                postFee = Convert.ToInt16(r["postFee"]),
                                memo = r["memo"].ToString(),
                                subPrice = Math.Round(Convert.ToDouble(r["subPrice"].ToString()), 2)
                            };

                            List<WebOrderProduct> p = new List<WebOrderProduct>();
                            if (lp != null && lp.Count > 0)
                            {
                                foreach (orderPList item in lp)
                                {
                                    if (item.orderNo == w.orderNo)
                                    {
                                        WebOrderProduct wp = new WebOrderProduct
                                        {
                                            id = item.pid,
                                            pName = item.pName,
                                            pNum = item.pNum,
                                            imgUrl = "",
                                            unitInfo = "",
                                            unitNo = item.unitNo,
                                            price = item.price,
                                            isEvaluate = 0
                                        };
                                        if (imgDic.ContainsKey(item.pid))
                                        {
                                            if (imgDic[item.pid].Length > 0)
                                            {
                                                wp.imgUrl = imgDic[item.pid].Split('@')[0];
                                            }
                                        }
                                        wp.isEvaluate = item.isEvaluate;
                                        wp.unitInfo = new _Unit().GetUnitItem(item.unitNo);
                                        p.Add(wp);
                                    }
                                }
                            }
                            w.product = p;
                            //日志列表
                            List<log> log = new _Log().GetLogList(w.orderNo);
                            if (log != null && log.Count > 0)
                            {
                                w.log = log;
                            }
                        }
                        catch
                        {
                            w = null;
                        }
                    }
                }
                return w;
            }
        }

        /// <summary>
        /// 库存处理
        /// </summary>
        /// <param name="orderNo"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public bool GetProductStock(string orderNo,int type)
        {
            bool stock = false;
            string sql = "select * from t_orderPList where orderNo = '" + orderNo + "' and enable = 0";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            orderPList b = new orderPList
                            {
                                orderNo = r["orderNo"].ToString(),
                                price = Math.Round(Convert.ToDouble(r["price"]), 2),
                                pid = Convert.ToInt16(r["pid"]),
                                pNum = Convert.ToInt16(r["pNum"]),
                                pName = r["pName"].ToString(),
                                unitNo = r["unitNo"].ToString(),
                                isEvaluate = Convert.ToInt16(r["isEvaluate"])
                            };
                            if (type == 0)
                            {
                                var o = new
                                {

                                };
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return stock;
        }
    }
}
