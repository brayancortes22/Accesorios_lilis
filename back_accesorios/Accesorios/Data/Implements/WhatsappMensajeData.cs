using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class WhatsappMensajeData : BaseModelData<WhatsappMensaje>, IWhatsappMensajeData
    {
        public WhatsappMensajeData(ApplicationDbContext context) : base(context) { }
    }
}
