using System.Collections.Generic;
using Entity.Model.Base;

namespace Entity.Model
{
    public class Rol : BaseModel
    {
        public ICollection<Usuario> Usuarios { get; set; }
    }
}
