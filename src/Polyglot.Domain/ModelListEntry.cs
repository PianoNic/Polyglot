using Polyglot.Domain.Enums;

namespace Polyglot.Domain
{
    public class ModelListEntry : BaseEntity
    {
        public required string ModelId { get; init; }
        public required ModelListType ListType { get; set; }
    }
}
