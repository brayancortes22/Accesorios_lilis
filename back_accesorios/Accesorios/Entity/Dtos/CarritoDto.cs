using Entity.Dtos.Base;
using System.Collections.Generic;

namespace Entity.Dtos
{
    public class CarritoDto : BaseDto
    {
        public int UsuarioId { get; set; }
        public string Estado { get; set; }
        public List<CarritoProductoDto> Productos { get; set; }
    }
}
