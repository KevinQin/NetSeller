﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Seascape.Model;
using Seascape.Model.WebView;
using Seascape.Model.View;

namespace Seascape.Data.WebView
{
    public class _ProductFWeb : DbCenter
    {
        /// <summary>
        /// 获取前端展示产品列表
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public List<ProductFWeb> GetProductList(string sql)
        {
            List<ProductFWeb> ld = new List<ProductFWeb>();
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        foreach (DataRow r in dt.Rows)
                        {
                            ProductFWeb p = new ProductFWeb
                            {
                                mPrice = Math.Round(Convert.ToDouble(r["mPrice"]), 2),
                                id = Convert.ToInt16(r["id"]),
                                imgUrl = r["imgUrl"].ToString(),
                                pName = r["pName"].ToString(),
                                desp = r["desp"].ToString(),
                                price = Math.Round(Convert.ToDouble(r["price"]), 2),
                            };
                            //只返回一张
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

        /// <summary>
        /// 获取前端展示产品详情
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public ProductFWebInfo GetProductInfo(int id)
        {
            ProductFWebInfo p = null;
            string sql = "select * from t_product where id = " + id;
            try
            {
                using (DataTable dt = helper.GetDataTable(sql))
                {
                    if (dt != null && dt.Rows.Count > 0)
                    {
                        DataRow r = dt.Rows[0];
                        {
                            p = new ProductFWebInfo
                            {
                                mPrice = Math.Round(Convert.ToDouble(r["mPrice"]), 2),
                                id = Convert.ToInt16(r["id"]),
                                pName = r["pName"].ToString(),
                                desp = r["desp"].ToString(),
                                pInfo = r["pInfo"].ToString(),
                                storeNum = Convert.ToInt32(r["storeNum"]),
                                price = Math.Round(Convert.ToDouble(r["price"]), 2),
                                postType = Convert.ToInt16(r["postType"]),
                                postFee = Convert.ToDouble(r["postFee"])
                            };
                            
                            //图片列表
                            List<string> ls = new List<string>();
                            string[] img = r["imgUrl"].ToString().Split('@');
                            foreach (string item in img)
                            {
                                if (item.Length > 0)
                                {
                                    ls.Add(item);
                                }
                            }
                            p.imgUrl = ls;

                            //产品规格
                            UnitFWeb unit = new UnitFWeb();
                            List<UnitInfo> lu = new _Unit().GetUnitInfoList(p.id);                           
                            Dictionary<string, int> Dic = new Dictionary<string, int>();
                            if (lu.Count > 0)
                            {
                                unit.unitName = lu[0].fValue;
                                List<UnitList> unitList = new List<UnitList>();
                                foreach (UnitInfo units in lu)
                                {
                                    if (!Dic.ContainsKey(units.fName))
                                    {
                                        UnitList ulist = new UnitList
                                        {
                                            unitValue = units.fName
                                        };
                                        List<ItemList> itemList = new List<ItemList>();
                                        foreach (UnitInfo uniti in lu)
                                        {
                                            if (uniti.fName == ulist.unitValue)
                                            {
                                                ItemList item = new ItemList
                                                {
                                                    unitValue = uniti.sValue,
                                                    itemName = uniti.sName,
                                                    price = uniti.price,
                                                    mPrice = uniti.mPrice,
                                                    unitNo = uniti.unitNo,
                                                    uNum = uniti.uNum
                                                };
                                                itemList.Add(item);
                                            }
                                        }
                                        ulist.itemList = itemList;
                                        Dic.Add(ulist.unitValue, 1);
                                        unitList.Add(ulist);
                                    }
                                }
                                unit.unitList = unitList;                                
                            }

                            //运费方案
                            if (p.postType == 2)
                            {
                                List<ProductPostForWeb> post = new _ProductPost().GetProductPostForWebList(p.id);
                                p.post = post;
                            }

                            p.unit = unit;
                        }
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