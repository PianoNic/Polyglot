using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record AdjustCreditsDto(long Amount, CreditAdjustmentMode Mode);
