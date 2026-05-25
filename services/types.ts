export type LoyaltyTier =
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND';

export type UserRole =
  | 'USER'
  | 'MERCHANT'
  | 'ADMIN'
  | 'EVENT_ORGANIZER'
  | 'SUPER_ADMIN';

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  birthday: string | null;
  role: UserRole;
  points: number;
  monthlyPoints: number;
  coins: number;
  experiencePoints: number;
  loyaltyTier: LoyaltyTier;
  totalSpent: number;
  referralCode: string;
  emailVerified: boolean;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LeaderboardEntry = {
  userId: string;
  name: string;
  avatar: string | null;
  points: number;
  rank: number;
};

export type LeaderboardPeriod = 'day' | 'week' | 'month' | 'all-time';

export type MyRank = {
  rank: number;
  points: number;
  total: number;
};

export type ProfileStats = {
  points: number;
  monthlyPoints: number;
  coins: number;
  experiencePoints: number;
  loyaltyTier: LoyaltyTier;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  achievementsUnlocked: number;
};

export type Merchant = {
  id: string;
  businessName: string;
  slug: string;
  description: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  logo: string | null;
  coverImage: string | null;
  gallery: string[];
  amenities: string[];
  vibeTags: string[];
};

export type Deal = {
  id: string;
  merchantId: string;
  merchant?: Pick<Merchant, 'id' | 'businessName' | 'logo' | 'address' | 'city' | 'latitude' | 'longitude'>;
  title: string;
  description: string | null;
  discountPercentage: number | null;
  discountAmount: number | null;
  startTime: string | null;
  endTime: string | null;
  images: string[];
  isActive: boolean;
  isBounty: boolean;
  bountyReward: number | null;
  isFlashSale: boolean;
  currentRedemptions: number | null;
  maxRedemptions: number | null;
  viewCount?: number;
  likeCount?: number;
};

export type MenuItem = {
  id: string;
  merchantId: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image: string | null;
  isAvailable: boolean;
  isHappyHour?: boolean;
  isSurprise?: boolean;
};

export type EventType =
  | 'PARTY'
  | 'BAR_CRAWL'
  | 'SPORTS'
  | 'FESTIVAL'
  | 'RSVP'
  | 'WAGBT';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export type EventTicketTier = {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description: string | null;
};

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export type TableBooking = {
  id: string;
  merchantId: string;
  date: string;
  time?: string | null;
  partySize: number;
  status: BookingStatus;
  confirmationCode: string;
  specialRequests?: string | null;
  merchant?: Pick<Merchant, 'id' | 'businessName' | 'logo'>;
};

export type ServiceBooking = {
  id: string;
  serviceId: string;
  date: string;
  time?: string | null;
  status: BookingStatus;
  confirmationCode: string;
  qrCode?: string | null;
  service?: {
    id: string;
    title: string;
    type?: string | null;
    duration?: number | null;
    merchant?: Pick<Merchant, 'id' | 'businessName' | 'logo'>;
  };
};

export type ActivityItem = {
  id: string;
  kind: 'table' | 'service' | 'event';
  title: string;
  sub: string;
  date: string;
  points: number;
  emoji: string;
};

export type PlatformEvent = {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  venue: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  startDate: string;
  endDate: string;
  capacity: number | null;
  images?: string[];
  coverImage?: string | null;
  description?: string | null;
  merchant?: Pick<Merchant, 'id' | 'businessName' | 'logo'>;
  ticketTiers?: EventTicketTier[];
};
