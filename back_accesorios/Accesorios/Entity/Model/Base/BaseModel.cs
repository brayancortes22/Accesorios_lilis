using System;

namespace Entity.Model.Base
{
    public abstract class BaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; } = "";
        public bool Active { get; set; } = true;
    }
}
