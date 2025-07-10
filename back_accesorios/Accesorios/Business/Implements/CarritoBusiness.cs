using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class CarritoBusiness : BaseBusiness<Carrito, CarritoDto>, ICarritoBusiness
    {
        private readonly ICarritoData _carritoData;
        private readonly ICarritoProductoData _carritoProductoData;
        private readonly IProductoData _productoData;
        private readonly IPedidoData _pedidoData;
        private readonly IPedidoProductoData _pedidoProductoData;

        public CarritoBusiness(
            ICarritoData carritoData, 
            ICarritoProductoData carritoProductoData,
            IProductoData productoData,
            IPedidoData pedidoData,
            IPedidoProductoData pedidoProductoData,
            IMapper mapper,
            ILogger<CarritoBusiness> logger) : base(carritoData, mapper, logger)
        {
            _carritoData = carritoData;
            _carritoProductoData = carritoProductoData;
            _productoData = productoData;
            _pedidoData = pedidoData;
            _pedidoProductoData = pedidoProductoData;
        }

        public async Task<CarritoDto> GetOrCreateActiveCartAsync(int usuarioId)
        {
            var carrito = await _carritoData.GetActiveCartByUserAsync(usuarioId);
            if (carrito == null)
            {
                carrito = await _carritoData.CreateCartForUserAsync(usuarioId);
            }
            return _mapper.Map<CarritoDto>(carrito);
        }

        public async Task<CarritoProductoDto> AddProductToCartAsync(AgregarProductoCarritoDto agregarProductoDto)
        {
            // Obtener o crear carrito
            var carrito = await GetOrCreateActiveCartAsync(agregarProductoDto.UsuarioId);
            
            // Validar que el producto existe y tiene stock
            var producto = await _productoData.GetByIdAsync(agregarProductoDto.ProductoId);
            if (producto == null)
                throw new ArgumentException("Producto no encontrado");

            if (producto.Stock < agregarProductoDto.Cantidad)
                throw new ArgumentException("Stock insuficiente");

            // Buscar si ya existe el producto en el carrito
            var carritoProductoExistente = await _carritoProductoData.GetByCarritoAndProductoAsync(carrito.Id, agregarProductoDto.ProductoId);
            
            CarritoProducto carritoProducto;
            
            if (carritoProductoExistente != null)
            {
                // Actualizar cantidad
                var nuevaCantidad = carritoProductoExistente.Cantidad + agregarProductoDto.Cantidad;
                if (producto.Stock < nuevaCantidad)
                    throw new ArgumentException("Stock insuficiente para la cantidad total");

                carritoProductoExistente.Cantidad = nuevaCantidad;
                carritoProductoExistente.Subtotal = carritoProductoExistente.PrecioUnitario * nuevaCantidad;
                carritoProducto = await _carritoProductoData.UpdateAsync(carritoProductoExistente);
            }
            else
            {
                // Crear nuevo CarritoProducto
                var nuevoCarritoProducto = new CarritoProducto
                {
                    CarritoId = carrito.Id,
                    ProductoId = agregarProductoDto.ProductoId,
                    Cantidad = agregarProductoDto.Cantidad,
                    PrecioUnitario = producto.Precio,
                    Subtotal = producto.Precio * agregarProductoDto.Cantidad,
                    FechaAgregado = DateTime.UtcNow
                };
                carritoProducto = await _carritoProductoData.CreateAsync(nuevoCarritoProducto);
            }

            return _mapper.Map<CarritoProductoDto>(carritoProducto);
        }

        public async Task<CarritoProductoDto> UpdateCartItemQuantityAsync(CarritoProductoUpdateDto carritoProductoUpdateDto)
        {
            var carritoProducto = await _carritoProductoData.GetByIdAsync(carritoProductoUpdateDto.Id);
            if (carritoProducto == null)
                throw new ArgumentException("Producto no encontrado en el carrito");

            // Validar stock
            var producto = await _productoData.GetByIdAsync(carritoProducto.ProductoId);
            if (producto.Stock < carritoProductoUpdateDto.Cantidad)
                throw new ArgumentException("Stock insuficiente");

            carritoProducto.Cantidad = carritoProductoUpdateDto.Cantidad;
            carritoProducto.Subtotal = carritoProducto.PrecioUnitario * carritoProductoUpdateDto.Cantidad;
            
            var updatedCarritoProducto = await _carritoProductoData.UpdateAsync(carritoProducto);
            return _mapper.Map<CarritoProductoDto>(updatedCarritoProducto);
        }

        public async Task<bool> RemoveProductFromCartAsync(int carritoProductoId)
        {
            return await _carritoProductoData.DeleteAsync(carritoProductoId);
        }

        public async Task<bool> ClearCartAsync(int carritoId)
        {
            var productos = await _carritoProductoData.GetByCarritoAsync(carritoId);
            foreach (var producto in productos)
            {
                await _carritoProductoData.DeleteAsync(producto.Id);
            }
            return true;
        }

        public async Task<CarritoDto> GetActiveCartWithProductsAsync(int usuarioId)
        {
            var carrito = await _carritoData.GetActiveCartWithProductsAsync(usuarioId);
            return _mapper.Map<CarritoDto>(carrito);
        }

        public async Task<PedidoDto> ConvertCartToOrderAsync(CrearPedidoDesdeCarritoDto crearPedidoDto)
        {
            // Obtener carrito con productos
            var carrito = await _carritoData.GetWithProductsAsync(crearPedidoDto.CarritoId);
            if (carrito == null || !carrito.CarritoProductos.Any())
                throw new ArgumentException("Carrito vacío o no encontrado");

            // Crear el pedido
            var pedido = new Pedido
            {
                Numero = $"PED-{DateTime.UtcNow:yyyyMMddHHmmss}",
                UsuarioId = crearPedidoDto.UsuarioId,
                Estado = "Pendiente",
                DireccionEnvio = crearPedidoDto.DireccionEnvio,
                CiudadEnvio = crearPedidoDto.CiudadEnvio,
                PaisEnvio = crearPedidoDto.PaisEnvio,
                TelefonoContacto = crearPedidoDto.TelefonoContacto,
                MetodoPago = crearPedidoDto.MetodoPago,
                Notas = crearPedidoDto.Notas,
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

            // Limpiar el carrito
            await ClearCartAsync(crearPedidoDto.CarritoId);

            return _mapper.Map<PedidoDto>(pedidoCreado);
        }

        public async Task<decimal> CalculateCartTotalAsync(int carritoId)
        {
            var productos = await _carritoProductoData.GetByCarritoAsync(carritoId);
            return productos.Sum(p => p.Subtotal);
        }

        public async Task<int> GetCartItemCountAsync(int carritoId)
        {
            var productos = await _carritoProductoData.GetByCarritoAsync(carritoId);
            return productos.Sum(p => p.Cantidad);
        }
    }
}
