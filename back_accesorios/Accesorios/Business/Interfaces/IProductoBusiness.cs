using Entity.Model;
using Entity.Dtos;
using Business.Interfaces;

namespace Business.Interfaces
{
    public interface IProductoBusiness : IBaseBusiness<Producto, ProductoDto>
    {
    }
}
