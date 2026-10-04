import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Item, Message, NotificationItem, RentalRequest, Review, User } from '../types';
import { INITIAL_ITEMS, INITIAL_MESSAGES, INITIAL_REQUESTS, MOCK_USERS } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  items: Item[];
  requests: RentalRequest[];
  messages: Message[];
  notifications: NotificationItem[];
  activeModal: string | null;
  selectedItem: Item | null;
  selectedRequest: RentalRequest | null;
  viewedUser: User | null;
  preferredRequestType: 'borrow' | 'rent';
  searchQuery: string;
  selectedCategory: string;
  toastMessage: string | null;
  // Actions
  switchUser: (userId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  openPostItemModal: () => void;
  openRequestModal: (item: Item, type?: 'borrow' | 'rent') => void;
  openDetailModal: (item: Item) => void;
  openEditItemModal: (item: Item) => void;
  openOwnerProfileModal: (userIdOrUser: string | User | Item) => void;
  openReviewModal: (requestOrItem?: RentalRequest | Item) => void;
  openReportModal: (item: Item) => void;
  openHowItWorksModal: () => void;
  openScannerModal: (params?: { item?: Item; owner?: User; mode?: 'view' | 'camera'; amount?: number }) => void;
  scannerModalData: { item?: Item; owner?: User; mode?: 'view' | 'camera'; amount?: number } | null;
  closeModal: () => void;
  showToast: (msg: string) => void;
  // Item Management
  addItem: (itemData: Partial<Item>) => void;
  updateItem: (item: Item) => void;
  deleteItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  // Request Management
  createRequest: (data: {
    itemId: string;
    type: 'borrow' | 'rent';
    startDate: string;
    endDate: string;
    message: string;
    totalDays: number;
    dailyPrice: number;
    totalPrice: number;
    securityDeposit: number;
  }) => void;
  updateRequestStatus: (requestId: string, status: RentalRequest['status'], reason?: string) => void;
  markReturned: (requestId: string) => void;
  // Reviews
  addReview: (reviewData: {
    targetId: string;
    targetType: 'item' | 'user';
    rating: number;
    comment: string;
    role: 'borrower' | 'owner';
    requestId?: string;
    image?: string;
  }) => void;
  // Messages
  sendMessage: (recipientId: string, recipientName: string, text: string, itemId?: string, itemTitle?: string) => void;
  // Verification & Safety
  verifyStudent: () => void;
  updateCurrentUser: (userData: Partial<User>) => void;
  reportIssue: (itemId: string, category: string, comment: string) => void;
  resetDemoData: () => void;
  // Data Persistence & Backup
  saveAllDataToStorage: () => void;
  exportAllDataJSON: () => void;
  importAllDataJSON: (jsonString: string) => boolean;
  lastSavedTime: string;
  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('rent_reuse_users');
    if (!saved) return MOCK_USERS;
    try {
      const parsed: User[] = JSON.parse(saved);
      if (!parsed.some(u => u.id === 'user_abbas')) {
        return [MOCK_USERS[0], ...parsed];
      }
      return parsed;
    } catch {
      return MOCK_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('rent_reuse_active_uid') || 'user_abbas';
  });

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('rent_reuse_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [requests, setRequests] = useState<RentalRequest[]>(() => {
    const saved = localStorage.getItem('rent_reuse_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('rent_reuse_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('rent_reuse_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'notif_1',
        userId: 'user_rahul',
        title: 'New Rental Request!',
        message: 'Priya Patel requested to rent your Casio fx-991EX Calculator.',
        type: 'request',
        read: false,
        createdAt: '10 mins ago',
        actionTab: 'my-listings'
      },
      {
        id: 'notif_2',
        userId: 'user_priya',
        title: 'Welcome to RENT & REUSE 🎉',
        message: 'Campus verification active. Find study gear, drafters, or borrow books for free.',
        type: 'trust',
        read: true,
        createdAt: '1 hour ago'
      }
    ];
  });

  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('rent_reuse_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('rent_reuse_dark_mode', String(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [scannerModalData, setScannerModalData] = useState<{ item?: Item; owner?: User; mode?: 'view' | 'camera'; amount?: number } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [preferredRequestType, setPreferredRequestType] = useState<'borrow' | 'rent'>('borrow');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('rent_reuse_users', JSON.stringify(allUsers));
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('rent_reuse_active_uid', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('rent_reuse_items', JSON.stringify(items));
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('rent_reuse_requests', JSON.stringify(requests));
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('rent_reuse_messages', JSON.stringify(messages));
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('rent_reuse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      showToast(`Switched persona to ${target.name} (${target.year})`);
    }
  };

  const openPostItemModal = () => {
    setActiveModal('postItem');
  };

  const openRequestModal = (item: Item, type?: 'borrow' | 'rent') => {
    setSelectedItem(item);
    if (type) {
      setPreferredRequestType(type);
    } else {
      setPreferredRequestType(item.mode === 'borrow' ? 'borrow' : 'rent');
    }
    setActiveModal('requestItem');
  };

  const openDetailModal = (item: Item) => {
    setSelectedItem(item);
    setActiveModal('itemDetail');
  };

  const openEditItemModal = (item: Item) => {
    setSelectedItem(item);
    setActiveModal('editItem');
  };

  const openOwnerProfileModal = (userIdOrUser: string | User | Item) => {
    let targetUser: User | undefined;
    if (typeof userIdOrUser === 'string') {
      targetUser = allUsers.find(u => u.id === userIdOrUser);
    } else if ('ownerId' in userIdOrUser) {
      targetUser = allUsers.find(u => u.id === userIdOrUser.ownerId);
      if (!targetUser) {
        targetUser = {
          id: userIdOrUser.ownerId,
          name: userIdOrUser.ownerName,
          email: `${userIdOrUser.ownerName.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
          avatar: userIdOrUser.ownerAvatar,
          college: 'National Institute of Engineering',
          campus: userIdOrUser.location,
          studentId: `NIE-${userIdOrUser.ownerId.slice(-4).toUpperCase()}`,
          department: 'Engineering Student',
          year: 'Senior',
          isVerified: true,
          trustScore: userIdOrUser.ownerTrustScore || 95,
          rating: userIdOrUser.ownerRating || 4.9,
          reviewCount: 15,
          itemsListedCount: 3,
          itemsBorrowedCount: 5,
          successfulReturnsCount: 8,
          phone: userIdOrUser.ownerPhone || '+91 98765 43210',
          backupPhone: (userIdOrUser as Item).backupPhone || '+91 91234 56780',
          backupPhoneLabel: (userIdOrUser as Item).backupPhoneLabel || 'Roommate (Rohan - Room 204)',
          joinedDate: 'August 2024'
        };
      }
    } else {
      targetUser = userIdOrUser as User;
    }

    if (targetUser) {
      setViewedUser(targetUser);
      setActiveModal('ownerProfile');
    }
  };

  const openReviewModal = (requestOrItem?: RentalRequest | Item) => {
    if (!requestOrItem) {
      setActiveModal('review');
      return;
    }
    if ('requesterId' in requestOrItem) {
      setSelectedRequest(requestOrItem as RentalRequest);
    } else {
      setSelectedItem(requestOrItem as Item);
      setSelectedRequest(null);
    }
    setActiveModal('review');
  };

  const openReportModal = (item: Item) => {
    setSelectedItem(item);
    setActiveModal('report');
  };

  const openHowItWorksModal = () => {
    setActiveModal('howItWorks');
  };

  const openScannerModal = (params?: { item?: Item; owner?: User; mode?: 'view' | 'camera'; amount?: number }) => {
    setScannerModalData(params || null);
    setActiveModal('ownerScanner');
  };

  const closeModal = () => {
    setActiveModal(null);
    setScannerModalData(null);
  };

  const addItem = (itemData: Partial<Item>) => {
    const newItem: Item = {
      id: `item_${Date.now()}`,
      title: itemData.title || 'Untitled Item',
      description: itemData.description || 'No description provided.',
      category: itemData.category || 'other',
      condition: itemData.condition || 'Good',
      mode: itemData.mode || 'both',
      rentPricePerDay: itemData.rentPricePerDay || 0,
      securityDeposit: itemData.securityDeposit || 0,
      images: itemData.images && itemData.images.length > 0
        ? itemData.images
        : ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'],
      ownerId: currentUser.id,
      ownerName: itemData.ownerName || currentUser.name,
      ownerAvatar: itemData.ownerAvatar || currentUser.avatar,
      ownerRating: currentUser.rating,
      ownerTrustScore: currentUser.trustScore,
      location: itemData.location || currentUser.campus,
      availableFrom: itemData.availableFrom || new Date().toISOString().split('T')[0],
      availableUntil: itemData.availableUntil || '2026-12-31',
      isAvailable: true,
      urgentToday: !!itemData.urgentToday,
      freeToBorrow: itemData.mode === 'borrow' || itemData.rentPricePerDay === 0,
      createdAt: new Date().toISOString().split('T')[0],
      views: 1,
      reviews: [],
      contactPreference: itemData.contactPreference || 'In-app Chat',
      ownerPhone: itemData.ownerPhone || currentUser.phone,
      backupPhone: itemData.backupPhone || currentUser.backupPhone,
      backupPhoneLabel: itemData.backupPhoneLabel || currentUser.backupPhoneLabel || 'Roommate / Backup Contact',
      showPhoneToBorrowers: itemData.showPhoneToBorrowers ?? true,
      ownerQrCode: itemData.ownerQrCode,
      ownerUpiId: itemData.ownerUpiId,
      ownerQrLabel: itemData.ownerQrLabel,
      returnReceiverName: itemData.returnReceiverName,
      returnReceiverPhone: itemData.returnReceiverPhone,
      returnReceiverLocation: itemData.returnReceiverLocation
    };

    setItems(prev => [newItem, ...prev]);

    // Update user itemsListedCount
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, itemsListedCount: u.itemsListedCount + 1 } : u));

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    showToast('Your item has been successfully listed!');
    closeModal();
  };

  const updateItem = (updated: Item) => {
    setItems(prev => {
      const newList = prev.map(it => it.id === updated.id ? updated : it);
      localStorage.setItem('rent_reuse_items', JSON.stringify(newList));
      return newList;
    });
    setSelectedItem(updated);
    showToast('Item & photo updated successfully!');
    closeModal();
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(it => it.id !== itemId));
    showToast('Item listing removed.');
  };

  const toggleItemAvailability = (itemId: string) => {
    setItems(prev => prev.map(it => {
      if (it.id === itemId) {
        const nextState = !it.isAvailable;
        showToast(nextState ? 'Item is now marked Available.' : 'Item is marked Unavailable.');
        return { ...it, isAvailable: nextState };
      }
      return it;
    }));
  };

  const createRequest = ({
    itemId,
    type,
    startDate,
    endDate,
    message,
    totalDays,
    dailyPrice,
    totalPrice,
    securityDeposit
  }: {
    itemId: string;
    type: 'borrow' | 'rent';
    startDate: string;
    endDate: string;
    message: string;
    totalDays: number;
    dailyPrice: number;
    totalPrice: number;
    securityDeposit: number;
  }) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newReq: RentalRequest = {
      id: `req_${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0],
      category: item.category,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      requesterTrustScore: currentUser.trustScore,
      requesterRating: currentUser.rating,
      requesterCampus: `${currentUser.department}, ${currentUser.campus}`,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      ownerAvatar: item.ownerAvatar,
      type,
      startDate,
      endDate,
      totalDays,
      dailyPrice,
      totalPrice,
      securityDeposit,
      message,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setRequests(prev => [newReq, ...prev]);

    // Send an automated initial conversation line
    sendMessage(
      item.ownerId,
      item.ownerName,
      `[Request Sent for ${item.title}] ${message}`,
      item.id,
      item.title
    );

    // Add notification for the item owner
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        userId: item.ownerId,
        title: `New ${type === 'borrow' ? 'Borrow' : 'Rent'} Request!`,
        message: `${currentUser.name} requested "${item.title}" for ${totalDays} day(s).`,
        type: 'request',
        read: false,
        createdAt: 'Just now',
        actionTab: 'my-listings'
      },
      ...prev
    ]);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    showToast('Request sent successfully! Status: PENDING');
    closeModal();
  };

  const updateRequestStatus = (requestId: string, status: RentalRequest['status'], reason?: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          rejectionReason: reason || r.rejectionReason
        };
      }
      return r;
    }));

    const req = requests.find(r => r.id === requestId);
    if (req) {
      // Notify requester
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          userId: req.requesterId,
          title: `Request ${status.toUpperCase()}!`,
          message: `${req.ownerName} has ${status.toLowerCase()} your request for "${req.itemTitle}".`,
          type: 'status',
          read: false,
          createdAt: 'Just now',
          actionTab: 'my-requests'
        },
        ...prev
      ]);

      if (status === 'ACCEPTED') {
        try {
          confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 } });
        } catch {
          // ignore
        }
        showToast(`Request accepted! Requester notified.`);
      } else if (status === 'ACTIVE') {
        showToast('Item handover completed. Rental is now ACTIVE.');
      } else if (status === 'REJECTED') {
        showToast('Request declined.');
      }
    }
  };

  const markReturned = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'COMPLETED' } : r));

    // Increase successful returns count for both users
    setAllUsers(prev => prev.map(u => {
      if (u.id === req.requesterId) {
        return {
          ...u,
          successfulReturnsCount: u.successfulReturnsCount + 1,
          itemsBorrowedCount: u.itemsBorrowedCount + 1,
          trustScore: Math.min(100, u.trustScore + 1)
        };
      }
      if (u.id === req.ownerId) {
        return {
          ...u,
          trustScore: Math.min(100, u.trustScore + 1)
        };
      }
      return u;
    }));

    try {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    showToast('Item marked as RETURNED! Thank you for reusing. Please leave a review.');

    // Prompt review modal
    const updatedReq = { ...req, status: 'COMPLETED' as const };
    openReviewModal(updatedReq);
  };

  const addReview = ({
    targetId,
    targetType,
    rating,
    comment,
    role,
    requestId,
    image
  }: {
    targetId: string;
    targetType: 'item' | 'user';
    rating: number;
    comment: string;
    role: 'borrower' | 'owner';
    requestId?: string;
    image?: string;
  }) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      targetId,
      targetType,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      rating,
      comment,
      role,
      date: new Date().toISOString().split('T')[0],
      image
    };

    // If it's an item review
    if (targetType === 'item') {
      setItems(prev => prev.map(it => {
        if (it.id === targetId) {
          const updatedRev = [newRev, ...it.reviews];
          const avg = Number((updatedRev.reduce((acc, c) => acc + c.rating, 0) / updatedRev.length).toFixed(1));
          return {
            ...it,
            reviews: updatedRev,
            ownerRating: avg
          };
        }
        return it;
      }));
    }

    // If linked to request, mark that user reviewed
    if (requestId) {
      setRequests(prev => prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            borrowerReviewed: role === 'borrower' ? true : r.borrowerReviewed,
            ownerReviewed: role === 'owner' ? true : r.ownerReviewed
          };
        }
        return r;
      }));
    }

    showToast('Review submitted successfully! Trust score updated.');
    closeModal();
  };

  const sendMessage = (recipientId: string, recipientName: string, text: string, itemId?: string, itemTitle?: string) => {
    const sortedIds = [currentUser.id, recipientId].sort();
    const convId = `${sortedIds[0]}_${sortedIds[1]}`;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId,
      recipientName,
      text,
      timestamp: 'Just now',
      itemId,
      itemTitle
    };

    setMessages(prev => [...prev, newMsg]);

    // Send a polite simulated auto-response if chatting with another demo user
    if (recipientId !== currentUser.id) {
      setTimeout(() => {
        const autoReplies = [
          `Hi ${currentUser.name}! Yes, that works for me. Let me know when you arrive on campus.`,
          `Awesome, noted! The item is in great condition and ready for handover.`,
          `Sounds great! Let's meet near the main block reception.`
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyMsg: Message = {
          id: `msg_${Date.now() + 1}`,
          conversationId: convId,
          senderId: recipientId,
          senderName: recipientName,
          senderAvatar: allUsers.find(u => u.id === recipientId)?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          recipientId: currentUser.id,
          recipientName: currentUser.name,
          text: randomReply,
          timestamp: 'Just now',
          itemId,
          itemTitle
        };
        setMessages(m => [...m, replyMsg]);
      }, 1500);
    }
  };

  const verifyStudent = () => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          isVerified: true,
          trustScore: Math.min(100, u.trustScore + 5)
        };
      }
      return u;
    }));

    try {
      confetti({ particleCount: 75, spread: 80 });
    } catch {
      // ignore
    }
    showToast('Student ID Verified successfully! Trust badge unlocked (+5 Trust Score).');
  };

  const updateCurrentUser = (userData: Partial<User>) => {
    setAllUsers(prevUsers => {
      const updated = prevUsers.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, ...userData };
        }
        return u;
      });
      localStorage.setItem('rent_reuse_users', JSON.stringify(updated));
      return updated;
    });

    // Also update any listings owned by this user
    setItems(prevItems => {
      const updated = prevItems.map(item => {
        if (item.ownerId === currentUser.id) {
          return {
            ...item,
            ownerName: userData.name ?? item.ownerName,
            ownerAvatar: userData.avatar ?? item.ownerAvatar,
            ownerPhone: userData.phone ?? item.ownerPhone,
            location: userData.campus ?? item.location
          };
        }
        return item;
      });
      localStorage.setItem('rent_reuse_items', JSON.stringify(updated));
      return updated;
    });

    showToast('Profile details updated successfully!');
  };

  const reportIssue = (itemId: string, category: string, comment: string) => {
    showToast(`Issue reported (${category}). Campus safety team will review item #${itemId.slice(-4)}.`);
    closeModal();
  };

  const saveAllDataToStorage = () => {
    try {
      localStorage.setItem('rent_reuse_users', JSON.stringify(allUsers));
      localStorage.setItem('rent_reuse_active_uid', currentUserId);
      localStorage.setItem('rent_reuse_items', JSON.stringify(items));
      localStorage.setItem('rent_reuse_requests', JSON.stringify(requests));
      localStorage.setItem('rent_reuse_messages', JSON.stringify(messages));
      localStorage.setItem('rent_reuse_notifications', JSON.stringify(notifications));
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
      showToast(`💾 All website data permanently saved to browser storage at ${now}!`);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch {
      showToast('Error saving data to local storage. Storage quota may be exceeded.');
    }
  };

  const exportAllDataJSON = () => {
    try {
      const backupData = {
        appName: 'RENT & REUSE Campus Peer-to-Peer Sharing Platform',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        currentUserId,
        users: allUsers,
        items,
        requests,
        messages,
        notifications
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('download', `rent-and-reuse-database-backup-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('📦 Database snapshot exported as JSON backup file!');
    } catch {
      showToast('Failed to export data backup.');
    }
  };

  const importAllDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.items || !Array.isArray(data.items)) {
        showToast('Invalid backup file: missing items dataset.');
        return false;
      }
      if (data.users && Array.isArray(data.users)) {
        setAllUsers(data.users);
        localStorage.setItem('rent_reuse_users', JSON.stringify(data.users));
      }
      if (data.currentUserId) {
        setCurrentUserId(data.currentUserId);
        localStorage.setItem('rent_reuse_active_uid', data.currentUserId);
      }
      if (data.items && Array.isArray(data.items)) {
        setItems(data.items);
        localStorage.setItem('rent_reuse_items', JSON.stringify(data.items));
      }
      if (data.requests && Array.isArray(data.requests)) {
        setRequests(data.requests);
        localStorage.setItem('rent_reuse_requests', JSON.stringify(data.requests));
      }
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
        localStorage.setItem('rent_reuse_messages', JSON.stringify(data.messages));
      }
      if (data.notifications && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        localStorage.setItem('rent_reuse_notifications', JSON.stringify(data.notifications));
      }
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
      showToast('🎉 Backup database restored successfully! All data loaded.');
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      } catch {
        // ignore
      }
      return true;
    } catch {
      showToast('Failed to parse JSON file. Please ensure it is a valid backup file.');
      return false;
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem('rent_reuse_items');
    localStorage.removeItem('rent_reuse_requests');
    localStorage.removeItem('rent_reuse_messages');
    localStorage.removeItem('rent_reuse_users');
    localStorage.removeItem('rent_reuse_notifications');
    setItems(INITIAL_ITEMS);
    setRequests(INITIAL_REQUESTS);
    setMessages(INITIAL_MESSAGES);
    setAllUsers(MOCK_USERS);
    setCurrentUserId('user_abbas');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    showToast('Platform reset to initial hackathon demo state!');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        items,
        requests,
        messages,
        notifications,
        activeModal,
        selectedItem,
        selectedRequest,
        viewedUser,
        preferredRequestType,
        searchQuery,
        selectedCategory,
        toastMessage,
        switchUser,
        setSearchQuery,
        setSelectedCategory,
        openPostItemModal,
        openRequestModal,
        openDetailModal,
        openEditItemModal,
        openOwnerProfileModal,
        openReviewModal,
        openReportModal,
        openHowItWorksModal,
        openScannerModal,
        scannerModalData,
        closeModal,
        showToast,
        addItem,
        updateItem,
        deleteItem,
        toggleItemAvailability,
        createRequest,
        updateRequestStatus,
        markReturned,
        addReview,
        sendMessage,
        verifyStudent,
        updateCurrentUser,
        reportIssue,
        resetDemoData,
        saveAllDataToStorage,
        exportAllDataJSON,
        importAllDataJSON,
        lastSavedTime,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
