using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Models;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Queries
{
    // Returns the publishable key and the catalogue of purchasable credit products
    // for the buy-credits UI. Never exposes secret keys.
    public record GetBillingProductsQuery() : IQuery<Result<BillingConfigDto>>;

    public class GetBillingProductsQueryHandler(IStripeBillingService billing)
        : IQueryHandler<GetBillingProductsQuery, Result<BillingConfigDto>>
    {
        public ValueTask<Result<BillingConfigDto>> Handle(GetBillingProductsQuery query, CancellationToken cancellationToken)
        {
            var dto = new BillingConfigDto
            {
                Configured = billing.IsConfigured,
                PublishableKey = billing.PublishableKey,
                Products = billing.GetProducts()
                    .Select(p => new StripeProductDto
                    {
                        PriceId = p.PriceId,
                        Name = p.Name,
                        Credits = p.Credits,
                        Mode = p.Mode,
                    })
                    .ToList(),
            };

            return ValueTask.FromResult(Result<BillingConfigDto>.Success(dto));
        }
    }
}
