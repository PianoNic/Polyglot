using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Queries
{
    public record GetAllUsersQuery() : IQuery<Result<List<UserDto>>>;

    public class GetAllUsersQueryHandler(PolyglotDbContext dbContext) : IQueryHandler<GetAllUsersQuery, Result<List<UserDto>>>
    {
        public async ValueTask<Result<List<UserDto>>> Handle(GetAllUsersQuery query, CancellationToken cancellationToken)
        {
            var users = await dbContext.Users
                .OrderBy(u => u.DisplayName)
                .ToListAsync(cancellationToken);

            return Result<List<UserDto>>.Success(users.Select(u => u.ToDto()).ToList());
        }
    }
}
