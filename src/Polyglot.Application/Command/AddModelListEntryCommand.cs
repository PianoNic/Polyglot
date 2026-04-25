using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Domain;
using Polyglot.Domain.Enums;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Command
{
    public record AddModelListEntryCommand(string ModelId, ModelListType ListType) : ICommand<Result<ModelListEntryDto>>;

    public class AddModelListEntryCommandHandler(PolyglotDbContext dbContext) : ICommandHandler<AddModelListEntryCommand, Result<ModelListEntryDto>>
    {
        public async ValueTask<Result<ModelListEntryDto>> Handle(AddModelListEntryCommand command, CancellationToken cancellationToken)
        {
            var exists = await dbContext.ModelListEntries.AnyAsync(e => e.ModelId == command.ModelId && e.ListType == command.ListType, cancellationToken);
            if (exists)
                return Result<ModelListEntryDto>.Failure($"Model '{command.ModelId}' is already on the {command.ListType} list");

            var entry = new ModelListEntry { ModelId = command.ModelId, ListType = command.ListType };
            dbContext.ModelListEntries.Add(entry);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Result<ModelListEntryDto>.Success(entry.ToDto());
        }
    }
}
