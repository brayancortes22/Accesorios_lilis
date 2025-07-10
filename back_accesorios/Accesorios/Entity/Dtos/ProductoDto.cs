using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class ProductoDto : BaseDto
    {
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string ImagenUrl { get; set; }
        public int SeccionId { get; set; }
        public string SeccionNombre { get; set; }
        public bool EsEncargo { get; set; }
        public string Material { get; set; } // <-- CAMPO AGREGADO
    }
}
