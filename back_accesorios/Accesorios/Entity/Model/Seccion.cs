using System.Collections.Generic;
using Entity.Model.Base;

namespace Entity.Model
{
    public class Seccion : BaseModel
    {
        public ICollection<Producto> Productos { get; set; }
    }
}
