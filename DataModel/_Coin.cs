﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.WebView;

namespace Seascape.Data
{
    public class _Coin:DbCenter
    {
        public Double GetCoin(string openId)
        {
            Double OrderNum = 0;
            string sql = "select sum(coin) as t from t_coin where openId = '" + openId + "' and (state = 2 or state = 8)";
            try
            {
                OrderNum = Convert.ToDouble(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public Double GetCoinForUse(string openId)
        {
            Double OrderNum = 0;
            string sql = "select sum(coin) as t from t_coin where openId = '" + openId + "' and (state = 2 or state = 8) and (cType = 1 or cType = 3)";
            try
            {
                OrderNum = Convert.ToDouble(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        public Double GetCoinForCash(string openId)
        {
            Double OrderNum = 0;
            string sql = "select sum(coin) as t from t_coin where openId = '" + openId + "' and state = 0 and cType = 3";
            try
            {
                OrderNum = Convert.ToDouble(helper.GetOne(sql));
            }
            catch
            {
                OrderNum = 0;
            }
            return OrderNum;
        }

        /// <summary>
        /// 获取订单列表
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public List<CoinInfo> GetCoinList(string sql)
        {
            List<CoinInfo> lo = new List<CoinInfo>();
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    string openId = "";
                    foreach (DataRow r in dt.Rows)
                    {
                        CoinInfo o = new CoinInfo 
                        { 
                            orderNo = r["orderNo"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            coin = Convert.ToDouble(r["coin"]),
                            cType = Convert.ToInt16(r["cType"])
                        };
                        openId = r["srcOpenId"].ToString();
                        if (openId.Length > 0)
                        {
                            user u = new _User().GetUser(openId, "", 0);
                            o.nickName = u.nickName;
                            o.photoUrl = u.photoUrl;
                        }
                        lo.Add(o);
                    }
                }
                return lo;
            }
        }
    }
}
