import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, ChatRoom, ChatMessage } from '@/services/chatService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, Shield, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

export function ChatPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // 1. Fetch user chat rooms
  const { data: chatsRes, isLoading: chatsLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatService.getChats(),
  });

  const chats = chatsRes?.data || [];

  // 2. Fetch messages for active room
  const { data: messagesRes, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', activeChat?._id],
    queryFn: () => activeChat ? chatService.getMessages(activeChat._id) : Promise.resolve({ success: true, message: '', data: [] as ChatMessage[] }),
    enabled: !!activeChat,
  });

  // Sync query data with local state for real-time additions
  useEffect(() => {
    if (messagesRes?.data) {
      setMessages(messagesRes.data);
    }
  }, [messagesRes]);

  // 3. Connect to socket.io
  useEffect(() => {
    // API endpoint host is root server port
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket client connected:', socketRef.current.id);
    });

    // Handle incoming messages
    socketRef.current.on('message_received', (newMsg: ChatMessage) => {
      if (activeChat && newMsg.chat === activeChat._id) {
        setMessages((prev) => [...prev, newMsg]);
        // Update latest message in sidebar
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      } else {
        // Trigger generic toast for messages from other rooms
        toast.success(`New message from ${newMsg.sender.firstName}`);
        queryClient.invalidateQueries({ queryKey: ['chats'] });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [activeChat, queryClient]);

  // 4. Handle room joining/leaving
  useEffect(() => {
    if (!socketRef.current || !activeChat) return;

    // Join room
    socketRef.current.emit('join_chat', activeChat._id);

    return () => {
      if (socketRef.current && activeChat) {
        socketRef.current.emit('leave_chat', activeChat._id);
      }
    };
  }, [activeChat]);

  // Scroll to bottom helper
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5. Send message mutator
  const sendMutation = useMutation({
    mutationFn: (text: string) => activeChat ? chatService.sendMessage(activeChat._id, text) : Promise.reject(),
    onSuccess: () => {
      setInputText('');
    },
    onError: () => {
      toast.error('Failed to dispatch message');
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMutation.mutate(inputText);
  };

  if (chatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] max-w-6xl mx-auto flex rounded-3xl overflow-hidden border border-gray-200/60 dark:border-gray-850 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Sidebar List */}
      <div className="w-80 border-r border-gray-200/60 dark:border-gray-850 flex flex-col bg-white/20 dark:bg-slate-900/10">
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-850">
          <h2 className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-primary" size={20} /> Messages
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              No threads started. Start a chat from discovery logs or profiles.
            </div>
          ) : (
            chats.map((chat) => {
              const recipient = chat.participants.find((p) => String(p._id) !== String(user?._id));
              if (!recipient) return null;

              const isActive = activeChat?._id === chat._id;
              
              return (
                <button
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/10 border border-primary/20 dark:bg-primary/20' 
                      : 'hover:bg-gray-100/50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <Avatar className="h-10 w-10 border border-gray-150 dark:border-gray-800">
                    <img src={recipient.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${recipient.firstName}`} alt={recipient.firstName} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-950 dark:text-white truncate">
                        {recipient.firstName} {recipient.lastName}
                      </span>
                      <Badge className="text-[8px] uppercase px-1 py-0 rounded-md">
                        {recipient.role}
                      </Badge>
                    </div>
                    {chat.latestMessage ? (
                      <p className="text-xs text-gray-450 dark:text-gray-400 truncate mt-0.5 font-medium">
                        {chat.latestMessage.sender.firstName}: {chat.latestMessage.text}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 truncate mt-0.5">Start conversation...</p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Messaging Panel */}
      <div className="flex-1 flex flex-col bg-white/10 dark:bg-slate-900/5">
        {activeChat ? (
          <>
            {/* Active Header */}
            {(() => {
              const recipient = activeChat.participants.find((p) => String(p._id) !== String(user?._id));
              if (!recipient) return null;

              return (
                <div className="p-4 border-b border-gray-200/50 dark:border-gray-850 flex items-center gap-3 bg-white/20 dark:bg-slate-900/20">
                  <Avatar className="h-10 w-10 border border-gray-150 dark:border-gray-800">
                    <img src={recipient.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${recipient.firstName}`} alt={recipient.firstName} />
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-950 dark:text-white leading-tight">
                      {recipient.firstName} {recipient.lastName}
                    </h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      {recipient.headline || `${recipient.role} at Startup Pitch Hub`}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Scrollable messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = String(msg.sender._id) === String(user?._id);

                return (
                  <div 
                    key={msg._id} 
                    className={`flex gap-3 max-w-[70%] items-end ${isMine ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {!isMine && (
                      <Avatar className="h-7 w-7 border">
                        <img src={msg.sender.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender.firstName}`} alt={msg.sender.firstName} />
                      </Avatar>
                    )}
                    <div className="space-y-0.5">
                      <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        isMine 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-400 block px-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Input Form footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200/50 dark:border-gray-850 bg-white/20 dark:bg-slate-900/20 flex gap-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 px-4 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
              />
              <Button type="submit" size="sm" className="h-10 w-10 p-0 rounded-xl" disabled={sendMutation.isPending}>
                <Send size={16} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Start a Chat Room</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm">
              Select a thread on the left sidebar to load your conversation logs, or visit our discover network feed to open new message tunnels.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ChatPage;
