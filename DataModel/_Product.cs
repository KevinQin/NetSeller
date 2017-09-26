using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.View;

namespace Seascape.Data
{
    public class _Product:DbCenter
    {

        public List<ProductInfo> GetProduct(string sql)
        {
            List<ProductInfo> ld = new List<ProductInfo>();

            //string sql = "select * from t_product where state = 1 and LENGTH(unitNo)>0  order by dNum asc";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, int> DicNum = new _OrderPList().GetProductNumDic();
                        Dictionary<int, string> Dic = new _Class().GetClassDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            ProductInfo p = new ProductInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                mPrice = Math.Round(Convert.ToDouble(r["mPrice"]), 2),
                                cId = Convert.ToInt16(r["cId"]),
                                id = Convert.ToInt16(r["id"]),
                                imgUrl = r["imgUrl"].ToString(),
                                pName = r["pName"].ToString(),
                                pInfo = r["pInfo"].ToString(),
                                desp = r["desp"].ToString(),
                                price = Math.Round(Convert.ToDouble(r["price"]), 2),
                                allNum = 0,
                                storeNum = Convert.ToInt32(r["storeNum"]),
                                state = Convert.ToInt16(r["state"]),
                                sign = r["sign"].ToString(),
                                pId = Convert.ToInt16(r["pId"])
                            };
                            p.signInfo = new _Sign().GetSign(p.sign);
                            if (DicNum.ContainsKey(p.id))
                            {
                                p.allNum = DicNum[p.id];
                            }
                            List<unit> lu = new _Unit().GetUnitList(p.id);
                            if (lu != null && lu.Count > 0)
                            {
                                p.unit = lu;
                            }
                            if (p.cId > 0)
                            {
                                if (Dic.ContainsKey(p.cId))
                                {
                                    p.cName = Dic[p.cId];
                                }
                            }
                            ld.Add(p);
                        }
                        ld = ld.OrderByDescending(a => a.allNum).ToList();
                    }
                }
            }
            catch
            {
            }
            return ld;
        }

        public List<ProductInfo> GetProductList(string sql,string sql_c,out int Count)
        {
            List<ProductInfo> ld = new List<ProductInfo>();
            int TCount = 1;
            try
            {
                TCount = Convert.ToInt32(helper.GetOne(sql_c));
            }
            catch
            {
                TCount = 0;
            }
            Count = TCount;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, string> Dic = new _Class().GetClassDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            ProductInfo p = new ProductInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                mPrice = Math.Round(Convert.ToDouble(r["mPrice"]), 2),
                                cId = Convert.ToInt16(r["cId"]),
                                id = Convert.ToInt16(r["id"]),
                                imgUrl = r["imgUrl"].ToString(),
                                pName = r["pName"].ToString(),
                                pInfo = r["pInfo"].ToString(),
                                desp = r["desp"].ToString(),
                                price = Math.Round(Convert.ToDouble(r["price"]), 2),
                                allNum = 0,
                                storeNum = Convert.ToInt32(r["storeNum"]),
                                state = Convert.ToInt16(r["state"]),
                                sign = r["sign"].ToString(),
                                pId = Convert.ToInt16(r["pId"]),
                                postType = Convert.ToInt16(r["postType"]),
                                postFee = Convert.ToDouble(r["postFee"])
                            };
                            p.signInfo = new _Sign().GetSign(p.sign);
                            if (p.cId > 0)
                            {
                                if (Dic.ContainsKey(p.cId))
                                {
                                    p.cName = Dic[p.cId];
                                    if (p.cId != p.pId)
                                    {
                                        if (Dic.ContainsKey(p.pId))
                                        {
                                            p.cName = Dic[p.pId] + "-" + p.cName;
                                        }
                                    }
                                }
                            }
                            ld.Add(p);
                        }
                    }
                }
            }
            catch
            {
            }
            return ld;
        }

        public ProductInfo GetProductInfo(int id)
        {
            ProductInfo p = null;

            string sql = "select * from t_product where id = " + id;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        Dictionary<int, int> DicNum = new _OrderPList().GetProductNumDic();
                        Dictionary<int, string> Dic = new _Class().GetClassDic();
                        foreach (DataRow r in dt.Rows)
                        {
                            p = new ProductInfo
                            {
                                addOn = Convert.ToDateTime(r["addOn"]),
                                mPrice = Math.Round(Convert.ToDouble(r["mPrice"]), 2),
                                cId = Convert.ToInt16(r["cId"]),
                                id = Convert.ToInt16(r["id"]),
                                imgUrl = r["imgUrl"].ToString(),
                                pName = r["pName"].ToString(),
                                pInfo = r["pInfo"].ToString(),
                                desp = r["desp"].ToString(),
                                price = Math.Round(Convert.ToDouble(r["price"]), 2),
                                allNum = 0,
                                storeNum = Convert.ToInt32(r["storeNum"]),
                                state = Convert.ToInt16(r["state"]),
                                sign = r["sign"].ToString(),
                                pId = Convert.ToInt16(r["pId"]),
                                postType = Convert.ToInt16(r["postType"]),
                                postFee = Convert.ToDouble(r["postFee"])
                            };
                            if (DicNum.ContainsKey(p.id))
                            {
                                p.allNum = DicNum[p.id];
                            }
                            List<unit> lu = new _Unit().GetUnitList(p.id);
                            if (lu != null && lu.Count > 0)
                            {
                                p.unit = lu;
                            }
                            if (p.postType == 2)
                            {
                                List<productPostInfo> post = new _ProductPost().GetProductPostList(p.id);
                                p.post = post;
                            }
                            if (p.cId > 0)
                            {
                                if (Dic.ContainsKey(p.cId))
                                {
                                    p.cName = Dic[p.cId];
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return p;
        }

        public int CheckProduct(int cId, string pName)
        {
            int p = 0;
            string sql = "select * from t_product where cId = " + cId + " and pName = '" + pName + "'";
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        p = Convert.ToInt16(dt.Rows[0]["id"]);
                    }
                }
            }
            catch
            {
            }
            return p;
        }

    }
}
