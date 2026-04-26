using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record AdminSettingsDto(
    decimal? MaxPricePerMillionTokens,
    ModelListMode ActiveModelListMode,
    long StartingBalance,
    decimal CostMultiplier,
    decimal CreditsPerUsd);
