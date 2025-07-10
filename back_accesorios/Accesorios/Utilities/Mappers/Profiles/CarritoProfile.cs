using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class CarritoProfile : Profile
    {
        public CarritoProfile()
        {
            // Carrito <-> CarritoDto (bidireccional con propiedades especiales)
            CreateMap<Carrito, CarritoDto>()
                .ForMember(dest => dest.UsuarioNombre, opt => opt.MapFrom(src => src.Usuario.Nombre))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ForMember(dest => dest.Productos, opt => opt.MapFrom(src => src.CarritoProductos))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.CarritoProductos.Sum(cp => cp.Subtotal)))
                .ForMember(dest => dest.CantidadProductos, opt => opt.MapFrom(src => src.CarritoProductos.Sum(cp => cp.Cantidad)))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Usuario, opt => opt.Ignore()) // Ignoramos las propiedades de navegación
                .ForMember(dest => dest.CarritoProductos, opt => opt.Ignore());

            // CarritoCreateDto -> Carrito
            CreateMap<CarritoCreateDto, Carrito>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => DateTime.UtcNow));

            // CarritoProducto <-> CarritoProductoDto (bidireccional)
            CreateMap<CarritoProducto, CarritoProductoDto>()
                .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Nombre))
                .ForMember(dest => dest.ProductoImagenUrl, opt => opt.MapFrom(src => src.Producto.ImagenUrl))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Producto, opt => opt.Ignore()) // Ignoramos la navegación
                .ForMember(dest => dest.Carrito, opt => opt.Ignore());

            // CarritoProductoCreateDto -> CarritoProducto
            CreateMap<CarritoProductoCreateDto, CarritoProducto>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.FechaAgregado, opt => opt.MapFrom(src => DateTime.UtcNow));

            // AgregarProductoCarritoDto -> CarritoProducto
            CreateMap<AgregarProductoCarritoDto, CarritoProducto>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.FechaAgregado, opt => opt.MapFrom(src => DateTime.UtcNow));

            // CarritoProductoUpdateDto -> CarritoProducto
            CreateMap<CarritoProductoUpdateDto, CarritoProducto>()
                .ForMember(dest => dest.Cantidad, opt => opt.MapFrom(src => src.Cantidad))
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));
        }
    }
}
