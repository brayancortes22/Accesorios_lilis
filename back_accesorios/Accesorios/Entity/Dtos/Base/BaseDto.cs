using System;

namespace Entity.Dtos.Base
{
    /// <summary>
    /// Clase base para los DTOs que contiene propiedades comunes
    /// </summary>
    public abstract class BaseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

    }
}
