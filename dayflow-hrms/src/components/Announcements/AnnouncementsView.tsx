import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Pin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Tag,
  X
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { formatDate } from '../../utils/formatters';
import { Announcement } from '../../types';

export const AnnouncementsView: React.FC = () => {
  const { currentUser, isAdmin, announcements, addAnnouncement } = useHR();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [category, setCategory] = useState<'Company Update' | 'Policy' | 'Holiday' | 'Event'>('Company Update');
  const [pinned, setPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      category,
      priority,
      pinned,
    });

    setShowModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Organization Notices & Bulletin</h2>
          <p className="text-xs text-gray-500">
            Company-wide updates, policy broadcasts, town hall schedules, and holiday announcements
          </p>
        </div>

        {isAdmin && (
          <button
            id="create-announcement-btn"
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition-all ${
              item.pinned ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-200'
            }`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {item.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      <Pin className="w-3 h-3 rotate-45" />
                      Pinned Notice
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.priority === 'Urgent'
                        ? 'bg-red-50 text-red-700'
                        : item.priority === 'High'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {item.category}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {formatDate(item.createdAt.split(' ')[0])}
                </span>
              </div>

              {/* Title & Body */}
              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{item.content}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>Author: {item.author} ({item.authorRole})</span>
              <span className="text-[11px]">Visible to All Staff</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Post New Company Notice</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Headline / Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Company Retreat 2026 Announced"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white"
                  >
                    <option value="Company Update">Company Update</option>
                    <option value="Policy">Policy</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Notice Content:</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write notice details and instructions here..."
                  required
                  rows={4}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-announcement"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="pin-announcement" className="font-medium text-gray-700">
                  Pin this announcement to top of dashboard
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
              >
                Broadcast Notice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
