using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record AdminSettingsDto(decimal? MaxPricePerMillionTokens, ModelListMode ActiveModelListMode);
