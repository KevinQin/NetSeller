using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seascape.Model.WebView
{
    public class UnitFWeb
    {
        public string unitName { get; set; }
        public List<UnitList> unitList { get; set; }
        public List<ItemList> itemList { get; set; }
    }

    public class UnitList
    {
        public string unitValue { get; set; }
        public List<ItemList> itemList { get; set; }
    }

    public class ItemList
    {
        public string unitValue { get; set; }
        public string itemName { get; set; }
        public string unitNo { get; set; }
        public Double price { get; set; }
        public Double mPrice { get; set; }
        public int uNum { get; set; }
    }
}
