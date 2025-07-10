using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class PedidoProfile : Profile
    {
        public PedidoProfile()
        {
            // Pedido <-> PedidoDto (bidireccional)
            CreateMap<Pedido, PedidoDto>()
                .ForMember(dest => dest.UsuarioNombre, opt => opt.MapFrom(src => src.Usuario.Nombre))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ForMember(dest => dest.Productos, opt => opt.MapFrom(src => src.PedidoProductos))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Usuario, opt => opt.Ignore()) // Ignoramos las propiedades de navegación
                .ForMember(dest => dest.PedidoProductos, opt => opt.Ignore());

            // PedidoCreateDto -> Pedido
            CreateMap<PedidoCreateDto, Pedido>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.FechaPedido, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => "Pendiente"));

            // PedidoProducto <-> PedidoProductoDto (bidireccional)
            CreateMap<PedidoProducto, PedidoProductoDto>()
                .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Nombre))
                .ForMember(dest => dest.ProductoImagenUrl, opt => opt.MapFrom(src => src.Producto.ImagenUrl))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Producto, opt => opt.Ignore()) // Ignoramos la navegación
                .ForMember(dest => dest.Pedido, opt => opt.Ignore());

            // PedidoProductoCreateDto -> PedidoProducto
            CreateMap<PedidoProductoCreateDto, PedidoProducto>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => true));

            // CrearPedidoDesdeCarritoDto -> Pedido
            CreateMap<CrearPedidoDesdeCarritoDto, Pedido>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.FechaPedido, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => "Pendiente"));

            // PedidoUpdateDto -> Pedido
            CreateMap<PedidoUpdateDto, Pedido>()
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado))
                .ForMember(dest => dest.FechaEntrega, opt => opt.MapFrom(src => src.FechaEntrega))
                .ForMember(dest => dest.Notas, opt => opt.MapFrom(src => src.Notas))
                .ForMember(dest => dest.ReferenciaPago, opt => opt.MapFrom(src => src.ReferenciaPago));
        }
    }
}
