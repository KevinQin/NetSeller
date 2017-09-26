using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;

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
    }
}
