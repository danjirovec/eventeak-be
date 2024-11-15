import { registerEnumType } from '@nestjs/graphql';

export enum Category {
  Movie = 'Movie',
  Concert = 'Concert',
  Talk = 'Talk',
  Quiz = 'Quiz',
  Theater = 'Theater',
  Exhibition = 'Exhibition',
  Festival = 'Festival',
  Workshop = 'Workshop',
  Performance = 'Performance',
  Dance = 'Dance',
}

registerEnumType(Category, {
  name: 'Category',
});

export enum Language {
  Czech = 'Czech',
  English = 'English',
  Slovak = 'Slovak',
  Spanish = 'Spanish',
  Russian = 'Russian',
  Mandarin = 'Mandarin',
  French = 'French',
  Arabic = 'Arabic',
  Japanese = 'Japanese',
  Portuguese = 'Portuguese',
  German = 'German',
}

registerEnumType(Language, {
  name: 'Language',
});

export enum Role {
  Admin,
  Customer,
}

registerEnumType(Role, {
  name: 'Role',
});

export enum Type {
  Root = 'Root',
  Leaf = 'Leaf',
}

registerEnumType(Type, {
  name: 'Type',
});

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  CZK = 'CZK',
}

registerEnumType(Currency, {
  name: 'Currency',
});

export enum MembershipState {
  Active = 'Active',
  Renewal = 'Renewal',
}

registerEnumType(MembershipState, {
  name: 'MembershipState',
});

export enum PaymentType {
  Membership = 'Membership',
  Ticket = 'Ticket',
}

registerEnumType(PaymentType, {
  name: 'PaymentType',
});
