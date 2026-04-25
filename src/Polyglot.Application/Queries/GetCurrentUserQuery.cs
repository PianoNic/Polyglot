using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Queries
{
    public record GetCurrentUserQuery() : IQuery<Result<UserDto>>;

    public class GetCurrentUserQueryHandler(IUserService userService, PolyglotDbContext dbContext) : IQueryHandler<GetCurrentUserQuery, Result<UserDto>>
    {
        public async ValueTask<Result<UserDto>> Handle(GetCurrentUserQuery query, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user is null)
                return Result<UserDto>.Failure("User not found");

            return Result<UserDto>.Success(user.ToDto());
        }
    }
}
