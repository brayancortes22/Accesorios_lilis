// Web/ServiceExtension/SwaggerExtensions.cs
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace Web.ServiceExtension
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            // Añade soporte para API Explorer (necesario para Swagger)
            services.AddEndpointsApiExplorer();

            // Configura Swagger
            object value = services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Sistema de gestión",
                    Version = "v1",
                    Description = "API para el sistema de gestión"
                });

             

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });

                // Configuración para incluir comentarios XML de documentación
                try
                {
                    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                    if (File.Exists(xmlPath))
                    {
                        c.IncludeXmlComments(xmlPath);
                    }
                }
                catch
                {
                    // Simplemente ignoramos si no hay archivo XML disponible
                }
            });

            return services;
        }
    }
}