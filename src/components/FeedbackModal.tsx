import React, { useState } from 'react';
import { X, Send, Star, MessageSquare, Bug, Lightbulb, ThumbsUp } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackData {
  type: 'general' | 'bug' | 'feature' | 'improvement';
  rating: number;
  subject: string;
  message: string;
  email: string;
  page: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    type: 'general',
    rating: 0,
    subject: '',
    message: '',
    email: '',
    page: window.location.pathname
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: <MessageSquare className="w-4 h-4" />, color: 'blue' },
    { id: 'bug', label: 'Bug Report', icon: <Bug className="w-4 h-4" />, color: 'red' },
    { id: 'feature', label: 'Feature Request', icon: <Lightbulb className="w-4 h-4" />, color: 'yellow' },
    { id: 'improvement', label: 'Improvement', icon: <ThumbsUp className="w-4 h-4" />, color: 'green' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would send this to your backend:
      console.log('Feedback submitted:', feedbackData);
      
      setSubmitted(true);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackData({
          type: 'general',
          rating: 0,
          subject: '',
          message: '',
          email: '',
          page: window.location.pathname
        });
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }));
  };

  const getTypeColor = (type: string) => {
    const typeConfig = feedbackTypes.find(t => t.id === type);
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      green: 'bg-green-100 text-green-800 border-green-300'
    };
    return colorMap[typeConfig?.color as keyof typeof colorMap] || colorMap.blue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Send Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Thank You!</h3>
              <p className="text-green-700">
                Your feedback has been submitted successfully. We appreciate your input and will review it carefully.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Current Page */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Page
              </label>
              <input
                type="text"
                value={feedbackData.page}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, page: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="Page URL or name"
              />
            </div>

            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackData(prev => ({ ...prev, type: type.id as any }))}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                      ${feedbackData.type === type.id 
                        ? getTypeColor(type.id) + ' border-current' 
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {type.icon}
                    <span className="font-medium text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Overall Rating (Optional)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className={`
                      p-1 transition-colors duration-200
                      ${star <= feedbackData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}
                    `}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                {feedbackData.rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {feedbackData.rating} out of 5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={feedbackData.subject}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief summary of your feedback"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={feedbackData.message}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Please provide detailed feedback..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {feedbackData.message.length}/1000 characters
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={feedbackData.email}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide your email if you'd like us to follow up with you
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !feedbackData.subject || !feedbackData.message}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
                  ${isSubmitting || !feedbackData.subject || !feedbackData.message
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;