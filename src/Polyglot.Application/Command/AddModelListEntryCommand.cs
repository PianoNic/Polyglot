using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Domain.Enums;

namespace Polyglot.Application.Command
{
    public record AddModelListEntryCommand(string ModelId, ModelListType ListType) : ICommand<Result<ModelListEntryDto>>;

    public class AddModelListEntryCommandHandler(IModelListRepository modelListRepository) : ICommandHandler<AddModelListEntryCommand, Result<ModelListEntryDto>>
    {
        public async ValueTask<Result<ModelListEntryDto>> Handle(AddModelListEntryCommand command, CancellationToken cancellationToken)
        {
            var entry = await modelListRepository.AddAsync(command.ModelId, command.ListType, cancellationToken);
            return Result<ModelListEntryDto>.Success(entry.ToDto());
        }
    }
}
