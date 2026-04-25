using Polyglot.Application.Dtos;
using Polyglot.Domain;

namespace Polyglot.Application.Mappers
{
    public static class ModelListEntryMapper
    {
        public static ModelListEntryDto ToDto(this ModelListEntry entry) =>
            new(entry.Id, entry.ModelId, entry.ListType);
    }
}
