import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';

// Modals
import { PostItemModal } from './components/PostItemModal';
import { RequestModal } from './components/RequestModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportModal } from './components/ReportModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { OwnerProfileModal } from './components/OwnerProfileModal';
import { EditItemModal } from './components/EditItemModal';
import { OwnerScannerModal } from './components/OwnerScannerModal';
import { CheckCircle2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const { activeModal, scannerModalData, selectedItem, closeModal, toastMessage } = useApp();

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navbar with responsive mobile menu & live persona switcher */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} />}
        {activeTab === 'browse' && <BrowsePage />}
        {activeTab === 'my-requests' && <MyRequestsPage setActiveTab={setActiveTab} />}
        {activeTab === 'my-listings' && <MyListingsPage setActiveTab={setActiveTab} />}
        {activeTab === 'messages' && <MessagesPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Campus Community Footer - Only displayed on Home landing page */}
      {activeTab === 'home' && <Footer setActiveTab={setActiveTab} />}

      {/* Interactive Modals */}
      {activeModal === 'postItem' && <PostItemModal />}
      {activeModal === 'requestItem' && <RequestModal />}
      {activeModal === 'itemDetail' && (
        <ItemDetailModal onNavigateToMessages={() => setActiveTab('messages')} />
      )}
      {activeModal === 'review' && <ReviewModal />}
      {activeModal === 'report' && <ReportModal />}
      {activeModal === 'howItWorks' && <HowItWorksModal />}
      {activeModal === 'ownerProfile' && (
        <OwnerProfileModal onNavigateToMessages={() => setActiveTab('messages')} />
      )}
      {activeModal === 'editItem' && <EditItemModal />}
      {activeModal === 'ownerScanner' && (
        <OwnerScannerModal 
          item={scannerModalData?.item || selectedItem || undefined} 
          owner={scannerModalData?.owner || undefined} 
          suggestedAmount={scannerModalData?.amount}
          mode={scannerModalData?.mode}
          onClose={closeModal} 
        />
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-400/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
