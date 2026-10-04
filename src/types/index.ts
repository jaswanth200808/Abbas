export type ItemCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair';
export type ItemMode = 'borrow' | 'rent' | 'both';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  campus: string;
  studentId: string;
  department: string;
  year: string;
  isVerified: boolean;
  trustScore: number;
  rating: number;
  reviewCount: number;
  itemsListedCount: number;
  itemsBorrowedCount: number;
  successfulReturnsCount: number;
  phone: string;
  backupPhone?: string;
  backupPhoneLabel?: string;
  upiId?: string;
  qrCode?: string;
  qrLabel?: string;
  joinedDate: string;
}

export interface Review {
  id: string;
  targetId: string;
  targetType: 'item' | 'user';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  role: 'borrower' | 'owner';
  date: string;
  image?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: ItemCondition;
  mode: ItemMode;
  rentPricePerDay: number;
  securityDeposit: number;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  ownerTrustScore: number;
  location: string;
  availableFrom: string;
  availableUntil: string;
  isAvailable: boolean;
  urgentToday?: boolean;
  freeToBorrow?: boolean;
  createdAt: string;
  views: number;
  reviews: Review[];
  contactPreference?: string;
  ownerPhone?: string;
  backupPhone?: string;
  backupPhoneLabel?: string;
  showPhoneToBorrowers?: boolean;
  ownerQrCode?: string;
  ownerUpiId?: string;
  ownerQrLabel?: string;
  returnReceiverName?: string;
  returnReceiverPhone?: string;
  returnReceiverLocation?: string;
}

export interface RentalRequest {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  category: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterTrustScore: number;
  requesterRating: number;
  requesterCampus: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  type: 'borrow' | 'rent';
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyPrice: number;
  totalPrice: number;
  securityDeposit: number;
  message: string;
  status: RequestStatus;
  rejectionReason?: string;
  createdAt: string;
  borrowerReviewed?: boolean;
  ownerReviewed?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  itemId?: string;
  itemTitle?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'status' | 'message' | 'trust';
  read: boolean;
  createdAt: string;
  actionTab?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
