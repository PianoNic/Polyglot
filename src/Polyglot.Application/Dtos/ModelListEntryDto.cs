using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record ModelListEntryDto(Guid Id, string ModelId, ModelListType ListType);
