using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class PedidoBusiness : BaseBusiness<Pedido, PedidoDto>, IPedidoBusiness
    {
        private readonly IPedidoData _pedidoData;
        private readonly IPedidoProductoData _pedidoProductoData;
        private readonly ICarritoData _carritoData;

        public PedidoBusiness(
            IPedidoData pedidoData, 
            IPedidoProductoData pedidoProductoData,
            ICarritoData carritoData,
            IMapper mapper, 
            ILogger<PedidoBusiness> logger) : base(pedidoData, mapper, logger)
        {
            _pedidoData = pedidoData;
            _pedidoProductoData = pedidoProductoData;
            _carritoData = carritoData;
        }

        public async Task<List<PedidoDto>> GetOrdersByUserAsync(int usuarioId)
        {
            var pedidos = await _pedidoData.GetByUsuarioAsync(usuarioId);
            return _mapper.Map<List<PedidoDto>>(pedidos);
        }

        public async Task<List<PedidoDto>> GetOrdersByStatusAsync(string estado)
        {
            var pedidos = await _pedidoData.GetByEstadoAsync(estado);
            return _mapper.Map<List<PedidoDto>>(pedidos);
        }

        public async Task<PedidoDto> GetOrderWithProductsAsync(int pedidoId)
        {
            var pedido = await _pedidoData.GetWithProductsAsync(pedidoId);
            return _mapper.Map<PedidoDto>(pedido);
        }

        public async Task<PedidoDto?> GetOrderByNumberAsync(string numero)
        {
            var pedido = await _pedidoData.GetByNumeroAsync(numero);
            return _mapper.Map<PedidoDto>(pedido);
        }

        public async Task<PedidoDto> CreateOrderAsync(PedidoCreateDto createDto)
        {
            var pedido = _mapper.Map<Pedido>(createDto);
            pedido.Numero = $"PED-{DateTime.UtcNow:yyyyMMddHHmmss}";
            pedido.FechaPedido = DateTime.UtcNow;
            pedido.Estado = "Pendiente";

            var pedidoCreado = await _pedidoData.CreateAsync(pedido);

            // Agregar productos al pedido
            foreach (var productoDto in createDto.Productos)
            {
                var pedidoProducto = new PedidoProducto
                {
                    PedidoId = pedidoCreado.Id,
                    ProductoId = productoDto.ProductoId,
                    Cantidad = productoDto.Cantidad,
                    PrecioUnitario = productoDto.PrecioUnitario,
                    Subtotal = productoDto.PrecioUnitario * productoDto.Cantidad
                };
                await _pedidoProductoData.CreateAsync(pedidoProducto);
            }

            return _mapper.Map<PedidoDto>(pedidoCreado);
        }

        public async Task<PedidoDto> CreateOrderFromCartAsync(CrearPedidoDesdeCarritoDto createDto)
        {
            // Obtener carrito con productos
            var carrito = await _carritoData.GetWithProductsAsync(createDto.CarritoId);
            if (carrito == null || !carrito.CarritoProductos.Any())
                throw new ArgumentException("Carrito vacío o no encontrado");

            // Crear el pedido
            var pedido = new Pedido
            {
                Numero = $"PED-{DateTime.UtcNow:yyyyMMddHHmmss}",
                UsuarioId = createDto.UsuarioId,
                Estado = "Pendiente",
                DireccionEnvio = createDto.DireccionEnvio,
                CiudadEnvio = createDto.CiudadEnvio,
                PaisEnvio = createDto.PaisEnvio,
                TelefonoContacto = createDto.TelefonoContacto,
                MetodoPago = createDto.MetodoPago,
                Notas = createDto.Notas,
                FechaPedido = DateTime.UtcNow,
                Total = carrito.CarritoProductos.Sum(cp => cp.Subtotal),
                Subtotal = carrito.CarritoProductos.Sum(cp => cp.Subtotal)
            };

            var pedidoCreado = await _pedidoData.CreateAsync(pedido);

            // Crear los productos del pedido
            foreach (var carritoProducto in carrito.CarritoProductos)
            {
                var pedidoProducto = new PedidoProducto
                {
                    PedidoId = pedidoCreado.Id,
                    ProductoId = carritoProducto.ProductoId,
                    Cantidad = carritoProducto.Cantidad,
                    PrecioUnitario = carritoProducto.PrecioUnitario,
                    Subtotal = carritoProducto.Subtotal
                };
                await _pedidoProductoData.CreateAsync(pedidoProducto);
            }

            return _mapper.Map<PedidoDto>(pedidoCreado);
        }

        public async Task<PedidoDto> UpdateOrderStatusAsync(PedidoUpdateDto pedidoUpdateDto)
        {
            var pedido = await _pedidoData.GetByIdAsync(pedidoUpdateDto.Id);
            if (pedido == null)
                throw new ArgumentException("Pedido no encontrado");

            await _pedidoData.UpdateEstadoAsync(pedidoUpdateDto.Id, pedidoUpdateDto.Estado);
            
            var updatedPedido = await _pedidoData.GetByIdAsync(pedidoUpdateDto.Id);
            return _mapper.Map<PedidoDto>(updatedPedido);
        }

        public async Task<string> GenerateOrderNumberAsync()
        {
            return await _pedidoData.GenerateOrderNumberAsync();
        }

        public async Task<List<PedidoDto>> GetOrdersByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            var pedidos = await _pedidoData.GetByDateRangeAsync(fechaInicio, fechaFin);
            return _mapper.Map<List<PedidoDto>>(pedidos);
        }

        public async Task<decimal> CalculateOrderTotalAsync(int pedidoId)
        {
            var pedido = await _pedidoData.GetWithProductsAsync(pedidoId);
            if (pedido == null)
                return 0;

            return pedido.PedidoProductos.Sum(pp => pp.Subtotal);
        }

        public async Task<bool> CancelOrderAsync(int pedidoId, string motivo)
        {
            var pedido = await _pedidoData.GetByIdAsync(pedidoId);
            if (pedido == null)
                return false;

            pedido.Estado = "Cancelado";
            pedido.Notas = $"{pedido.Notas} - Cancelado: {motivo}";
            
            return await _pedidoData.UpdateEstadoAsync(pedidoId, "Cancelado");
        }

        public async Task<bool> MarkAsDeliveredAsync(int pedidoId)
        {
            return await _pedidoData.UpdateEstadoAsync(pedidoId, "Entregado");
        }
    }
}
