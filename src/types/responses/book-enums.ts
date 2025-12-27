/**
 * Book Response Enums
 */

export enum UserType {
  Guest = 0,
  Bride = 1,
  Groom = 2,
  Owner = 3,
  Admin = 4,
  FamilyMember = 5,
  LocalGuider = 6,
  ProviderUser = 7,
  WeddingPlanner = 8,
}

export enum BookClass {
  Event = 0,
  Budget = 1,
  Guest = 2,
  Item = 3,
  Note = 4,
  Occasion = 5,
  Service = 6,
  Todo = 7,
}

export enum GuestStatus {
  None = 0,
  Pending = 1,
  OnlyCeremony = 2,
  OnlyReception = 3,
  Confirmed = 4,
  Canceled = 5,
}

export enum GuestRelevant {
  Others = 0,
  Bride = 1,
  Groom = 2,
}

export enum GuestTitle {
  NoFormalities = 0,
  Rev = 1,
  Sir = 2,
  Mr = 3,
  Mister = 4,
  Mrs = 5,
  Ms = 6,
  Miss = 7,
  Madam = 8,
}

export enum ReminderType {
  None = 0,
}

export enum ProvidingType {
  BickUp = 0,
  Dilivary = 1,
  Online = 2,
}

export enum ServiceType {
  Rent = 0,
  Buy = 1,
  RentOrBuy = 2,
}

export enum ServiceClass {
  None = 0,
  WeddingHall = 1,
  WeddingPlanner = 2,
  WeddingCar = 3,
  Photographer = 4,
  PhotoSetion = 5,
  MakeupArtist = 6,
  WeddingDress = 7,
  FlowerBouquet = 8,
  Invitations = 9,
  Mazoons = 10,
  BeautyCenter = 11,
  Catering = 12,
  WeddingCake = 13,
  Dress = 14,
  Videography = 15,
  Jewelry = 16,
  Travel = 17,
  DJ = 18,
  CeremonyMusic = 19,
  EngagementDress = 25,
  HennaOutfit = 26,
  PhotoSection = 27,
}

export enum ServiceStatus {
  Pending = 0,
  Active = 1,
  Suspended = 2,
  NotAvilable = 3,
}

export enum PriceType {
  Fixed = 0,
  Free = 1,
  From = 2,
}

export enum DiscountType {
  FixedAmount = 0,
  Percentage = 1,
  Number = 2,
  BuyAndGet = 3,
}

export enum ProviderStatus {
  Pending = 0,
  Active = 1,
  Suspended = 2,
  NotAvilable = 3,
}

export enum ProviderRate {
  Standard = 0,
  Selver = 1,
  Gold = 2,
  Royal = 3,
  Elite = 4,
}

export enum ReservationStatus {
  None = 0,
  Created = 1,
  Pending = 2,
  Confirmed = 3,
  Rejected = 4,
  TestRequested = 5,
  TestAccepted = 6,
  TestRejected = 7,
  RejectedByClient = 8,
  Completed = 9,
  Cancelled = 10,
  Draft = 11,
}

export enum OccasionType {
  Wedding = 0,
  Engagement = 1,
  Henna = 2,
  Crown = 3,
}

export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export enum SocialStatus {
  Unknown = 0,
  Single = 1,
  InRelationship = 2,
  Engaged = 3,
  Married = 4,
  Divorced = 5,
  Widowed = 6,
}

export enum PersonalType {
  National = 0,
  Passport = 1,
}


