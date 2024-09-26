import { TicketDto } from 'src/ticket/ticket.dto/ticket.dto';
import { UserTicketsDto } from 'src/ticket/ticket.dto/ticket.user.dto';

export const groupBy = (arr: TicketDto[]): UserTicketsDto[] => {
  const grouped = arr.reduce(
    (result: UserTicketsDto, currentItem: TicketDto) => {
      const { eventId } = currentItem;
      if (!result[eventId]) {
        result[eventId] = [];
      }
      result[eventId].push(currentItem);
      return result;
    },
    {} as UserTicketsDto,
  );

  return Object.entries(grouped).map(([eventId, tickets]) => ({
    id: eventId,
    ticketSet: tickets,
  }));
};
