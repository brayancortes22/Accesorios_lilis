using AutoMapper;
using Business.Implements;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Utilities.Exceptions;

namespace Business.Implements
{
    public class UsuarioBusiness : ABaseBusiness<Usuario, UsuarioDto>, IUsuarioBusiness
    {
        private readonly IUsuarioData _usuarioData;
        private readonly IRolData _rolData;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UsuarioBusiness(IUsuarioData usuarioData, IRolData rolData, IMapper mapper, IConfiguration configuration)
        {
            _usuarioData = usuarioData;
            _rolData = rolData;
            _mapper = mapper;
            _configuration = configuration;
        }

        public override async Task<List<UsuarioDto>> GetAllAsync()
        {
            try
            {
                var usuarios = await _usuarioData.GetAllAsync();
                return _mapper.Map<List<UsuarioDto>>(usuarios);
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al obtener todos los usuarios", ex);
            }
        }

        public override async Task<UsuarioDto> GetByIdAsync(int id)
        {
            try
            {
                var usuario = await _usuarioData.GetByIdAsync(id);
                if (usuario == null)
                    throw new BusinessException("Usuario no encontrado");

                return _mapper.Map<UsuarioDto>(usuario);
            }
            catch (Exception ex)
            {
                throw new BusinessException($"Error al obtener el usuario con ID {id}", ex);
            }
        }

        public override async Task<UsuarioDto> CreateAsync(UsuarioDto dto)
        {
            try
            {
                // Validar que el email sea único
                if (await _usuarioData.ExistsByEmailAsync(dto.Email))
                    throw new BusinessException("Ya existe un usuario con este email");

                var usuario = _mapper.Map<Usuario>(dto);
                var usuarioCreado = await _usuarioData.CreateAsync(usuario);
                return _mapper.Map<UsuarioDto>(usuarioCreado);
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al crear el usuario", ex);
            }
        }

        public override async Task<UsuarioDto> UpdateAsync(UsuarioDto dto)
        {
            try
            {
                // Verificar que el usuario existe
                var usuarioExistente = await _usuarioData.GetByIdAsync(dto.Id);
                if (usuarioExistente == null)
                    throw new BusinessException("Usuario no encontrado");

                // Validar que el email sea único (excluyendo el usuario actual)
                if (await _usuarioData.ExistsByEmailAsync(dto.Email, dto.Id))
                    throw new BusinessException("Ya existe otro usuario con este email");

                var usuario = _mapper.Map<Usuario>(dto);
                var usuarioActualizado = await _usuarioData.UpdateAsync(usuario);
                return _mapper.Map<UsuarioDto>(usuarioActualizado);
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al actualizar el usuario", ex);
            }
        }

        public override async Task<bool> DeleteAsync(int id)
        {
            try
            {
                return await _usuarioData.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                throw new BusinessException($"Error al eliminar el usuario con ID {id}", ex);
            }
        }

        public override async Task<bool> SoftDeleteAsync(int id)
        {
            try
            {
                return await _usuarioData.SoftDeleteAsync(id);
            }
            catch (Exception ex)
            {
                throw new BusinessException($"Error al desactivar el usuario con ID {id}", ex);
            }
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var usuario = await _usuarioData.GetByEmailAsync(loginDto.Email);
                if (usuario == null)
                    throw new BusinessException("Email o contraseña incorrectos");

                // Verificar contraseña (aquí deberías usar un hash)
                if (!VerifyPassword(loginDto.Password, usuario.PasswordHash))
                    throw new BusinessException("Email o contraseña incorrectos");

                if (!usuario.Active)
                    throw new BusinessException("Usuario inactivo");

                // Generar token JWT
                var token = GenerateJwtToken(usuario);
                var usuarioDto = _mapper.Map<UsuarioDto>(usuario);

                return new LoginResponseDto
                {
                    Usuario = usuarioDto,
                    Token = token
                };
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error en el proceso de login", ex);
            }
        }

        public async Task<UsuarioDto> RegisterAsync(UsuarioCreateDto usuarioCreateDto)
        {
            try
            {
                // Validar que el email sea único
                if (await _usuarioData.ExistsByEmailAsync(usuarioCreateDto.Email))
                    throw new BusinessException("Ya existe un usuario con este email");

                // Verificar que el rol existe
                var rol = await _rolData.GetByIdAsync(usuarioCreateDto.RolId);
                if (rol == null)
                    throw new BusinessException("Rol no válido");

                var usuario = _mapper.Map<Usuario>(usuarioCreateDto);
                usuario.PasswordHash = HashPassword(usuarioCreateDto.PasswordHash);
                usuario.FechaCreacion = DateTime.UtcNow;

                var usuarioCreado = await _usuarioData.CreateAsync(usuario);
                return _mapper.Map<UsuarioDto>(usuarioCreado);
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al registrar el usuario", ex);
            }
        }

        public async Task<UsuarioDto?> GetByEmailAsync(string email)
        {
            try
            {
                var usuario = await _usuarioData.GetByEmailAsync(email);
                return usuario != null ? _mapper.Map<UsuarioDto>(usuario) : null;
            }
            catch (Exception ex)
            {
                throw new BusinessException($"Error al buscar usuario con email {email}", ex);
            }
        }

        public async Task<UsuarioDto> UpdateUserAsync(UsuarioUpdateDto usuarioUpdateDto)
        {
            try
            {
                var usuarioExistente = await _usuarioData.GetByIdAsync(usuarioUpdateDto.Id);
                if (usuarioExistente == null)
                    throw new BusinessException("Usuario no encontrado");

                // Validar email único
                if (await _usuarioData.ExistsByEmailAsync(usuarioUpdateDto.Email, usuarioUpdateDto.Id))
                    throw new BusinessException("Ya existe otro usuario con este email");

                var usuario = _mapper.Map<Usuario>(usuarioUpdateDto);
                usuario.PasswordHash = usuarioExistente.PasswordHash; // Mantener la contraseña actual
                usuario.RolId = usuarioExistente.RolId; // Mantener el rol actual
                usuario.FechaCreacion = usuarioExistente.FechaCreacion; // Mantener fecha de creación

                var usuarioActualizado = await _usuarioData.UpdateAsync(usuario);
                return _mapper.Map<UsuarioDto>(usuarioActualizado);
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al actualizar el usuario", ex);
            }
        }

        public async Task<List<UsuarioDto>> GetByRolAsync(int rolId)
        {
            try
            {
                var usuarios = await _usuarioData.GetByRolAsync(rolId);
                return _mapper.Map<List<UsuarioDto>>(usuarios);
            }
            catch (Exception ex)
            {
                throw new BusinessException($"Error al obtener usuarios del rol {rolId}", ex);
            }
        }

        public async Task<List<UsuarioDto>> GetActiveUsersAsync()
        {
            try
            {
                var usuarios = await _usuarioData.GetActiveUsersAsync();
                return _mapper.Map<List<UsuarioDto>>(usuarios);
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al obtener usuarios activos", ex);
            }
        }

        public async Task<bool> ChangePasswordAsync(int usuarioId, string nuevaPassword)
        {
            try
            {
                var usuario = await _usuarioData.GetByIdAsync(usuarioId);
                if (usuario == null)
                    throw new BusinessException("Usuario no encontrado");

                usuario.PasswordHash = HashPassword(nuevaPassword);
                await _usuarioData.UpdateAsync(usuario);
                return true;
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al cambiar la contraseña", ex);
            }
        }

        public async Task<bool> IsEmailUniqueAsync(string email, int? excludeId = null)
        {
            try
            {
                return !await _usuarioData.ExistsByEmailAsync(email, excludeId);
            }
            catch (Exception ex)
            {
                throw new BusinessException("Error al validar email único", ex);
            }
        }

        #region Private Methods

        private string GenerateJwtToken(Usuario usuario)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nombre),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol.Codigo)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            // Aquí deberías usar BCrypt o similar
            // Por simplicidad, usamos un hash básico (NO usar en producción)
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string hash)
        {
            // Verificar usando BCrypt
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public async Task<IEnumerable<UsuarioDto>> GetByRolIdAsync(int rolId)
        {
            var usuarios = await _usuarioData.GetAllAsync();
            var usuariosPorRol = usuarios.Where(u => u.RolId == rolId);
            return _mapper.Map<IEnumerable<UsuarioDto>>(usuariosPorRol);
        }

        #endregion
    }
}
