﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seascape.Model
{
    public class adminLog
    {
        public int id { get; set; }
        public string adminName { get; set; }
        public int adminID { get; set; }
        public string content { get; set; }
        public string orderNo { get; set; }
        public DateTime addOn { get; set; }
    }
}
