import React, { useState } from 'react';
import { X, Star, ThumbsUp, ShieldCheck, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewModal: React.FC = () => {
  const { currentUser, selectedRequest, selectedItem, closeModal, addReview } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState<'borrower' | 'owner'>('borrower');
  const [comment, setComment] = useState(
    'Item was in excellent condition and the handover was very smooth and punctual!'
  );
  const [imageUrl, setImageUrl] = useState('');

  if (!selectedRequest && !selectedItem) return null;

  const targetItemId = selectedRequest ? selectedRequest.itemId : selectedItem!.id;
  const targetItemTitle = selectedRequest ? selectedRequest.itemTitle : selectedItem!.title;
  const targetOwnerName = selectedRequest 
    ? (currentUser.id === selectedRequest.requesterId ? selectedRequest.ownerName : selectedRequest.requesterName)
    : selectedItem!.ownerName;
  const isBorrower = selectedRequest ? currentUser.id === selectedRequest.requesterId : true;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({
      targetId: targetItemId,
      targetType: 'item',
      rating,
      comment: comment.trim(),
      role: selectedRequest ? (isBorrower ? 'borrower' : 'owner') : role,
      requestId: selectedRequest?.id,
      image: imageUrl.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 relative">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-amber-100 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
            <span>✨ Community Trust & Rating</span>
          </div>
          <h2 className="text-xl font-bold">Rate & Review Item</h2>
          <p className="text-xs text-amber-100 mt-1">
            Share your rating and feedback for "{targetItemTitle}" by {targetOwnerName}.
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Star selector */}
          <div className="text-center py-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Your Star Rating
            </div>
            
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-200 fill-slate-100 dark:text-slate-700 dark:fill-slate-800'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
              {rating === 5 && '🌟 Outstanding (5/5)! Pristine condition & smooth handover'}
              {rating === 4 && '👍 Great (4/5)! Very good experience & reliable'}
              {rating === 3 && '👌 Good (3/5)! Standard campus exchange'}
              {rating === 2 && '⚠️ Fair (2/5)! Minor condition or timing issues'}
              {rating === 1 && '👎 Poor (1/5)! Not as described'}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Review & Experience Comment
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-850 outline-hidden resize-none text-slate-800 dark:text-slate-100"
              placeholder="How was the item's condition? Was the handover easy and reliable?"
            />
          </div>

          {/* Photo Upload Option */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Attach Photo (Optional)</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold lowercase">Show returned condition</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-850 outline-hidden text-slate-800 dark:text-slate-100"
              />
            </div>
            {imageUrl && (
              <div className="mt-2.5 relative inline-block">
                <img src={imageUrl} alt="Review attachment preview" className="w-20 h-20 object-cover rounded-xl border-2 border-amber-300 shadow-sm" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm hover:bg-rose-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Trust boost notification */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ratings update the item score and owner trust rating in real time.</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Submit Rating</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
