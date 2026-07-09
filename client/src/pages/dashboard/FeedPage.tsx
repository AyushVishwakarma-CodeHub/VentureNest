import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, FeedPost, PostComment } from '@/services/postService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

export function FeedPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [postContent, setPostContent] = useState('');
  
  // Track which post ID has comments section expanded
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // 1. Fetch Feed posts
  const { data: postsRes, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postService.getPosts(),
  });

  const posts = postsRes?.data || [];

  // 2. Fetch comments for expanded post
  const { data: commentsRes } = useQuery({
    queryKey: ['comments', expandedCommentsPostId],
    queryFn: () => expandedCommentsPostId ? postService.getComments(expandedCommentsPostId) : Promise.resolve({ success: true, message: '', data: [] as PostComment[] }),
    enabled: !!expandedCommentsPostId,
  });

  const comments = commentsRes?.data || [];

  // 3. Create Post Mutator
  const createPostMutation = useMutation({
    mutationFn: (content: string) => postService.createPost(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostContent('');
      toast.success('Post published to feed');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to publish post');
    }
  });

  // 4. Like Post Mutator (updates optimistic counter)
  const likeMutation = useMutation({
    mutationFn: (postId: string) => postService.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error('Failed to toggle like');
    }
  });

  // 5. Add Comment Mutator
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => 
      postService.addComment(postId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCommentInputs((prev) => ({ ...prev, [variables.postId]: '' }));
      toast.success('Comment added');
    },
    onError: () => {
      toast.error('Failed to post comment');
    }
  });

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    createPostMutation.mutate(postContent);
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    addCommentMutation.mutate({ postId, content: commentText });
  };

  const handleCommentInputChange = (postId: string, val: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: val }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Sparkles className="text-primary" /> Venture Network Feed
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Share milestones, search for co-founders, or write announcements for investors.
        </p>
      </div>

      {/* Write Post Box */}
      {user && (
        <Card className="p-4 border border-gray-200/60 bg-white/50 dark:border-gray-800/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl space-y-3">
          <div className="flex gap-3 items-start">
            <Avatar className="h-10 w-10 border border-gray-150 dark:border-gray-850">
              <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`} alt={user.firstName} />
            </Avatar>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's happening? Share milestone launches or capital raises..."
              rows={3}
              className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800/80 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none resize-none font-medium"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleCreatePostSubmit}
              disabled={createPostMutation.isPending || !postContent.trim()}
              className="gap-1.5 font-bold h-9 py-0 text-xs rounded-xl"
            >
              <Send size={12} /> Post Update
            </Button>
          </div>
        </Card>
      )}

      {/* Feed List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No feed updates published yet. Be the first to share an update!
          </div>
        ) : (
          posts.map((post) => (
            <Card 
              key={post._id}
              className="p-5 md:p-6 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 rounded-3xl space-y-4 hover:shadow-md transition-all duration-300"
            >
              {/* Author header info */}
              <div className="flex gap-3 items-start justify-between">
                <div className="flex gap-3 items-center">
                  <Avatar className="h-10 w-10 border border-gray-150 dark:border-gray-800">
                    <img src={post.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author.firstName}`} alt={post.author.firstName} />
                  </Avatar>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-950 dark:text-white leading-tight">
                      {post.author.firstName} {post.author.lastName}
                    </h3>
                    <p className="text-xs text-gray-450 dark:text-gray-400 font-semibold truncate max-w-[250px] mt-0.5">
                      {post.author.headline || `${post.author.role} at Startup Pitch Hub`}
                    </p>
                  </div>
                </div>
                <Badge className="text-[9px] uppercase px-2 py-0.5 rounded-full font-bold">
                  {post.author.role}
                </Badge>
              </div>

              {/* Post Content */}
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
                {post.content}
              </p>

              {/* Post Date */}
              <span className="text-[10px] text-gray-400 block">
                {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>

              {/* Likes & Comments Action counters footer */}
              <div className="flex items-center gap-6 border-t border-gray-100 dark:border-gray-850 pt-4 mt-2">
                <button
                  onClick={() => likeMutation.mutate(post._id)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    post.isLiked 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-500 hover:text-red-500 dark:text-gray-400'
                  }`}
                >
                  <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                  {post.likesCount} Likes
                </button>

                <button
                  onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post._id ? null : post._id)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    expandedCommentsPostId === post._id 
                      ? 'text-primary' 
                      : 'text-gray-500 hover:text-primary dark:text-gray-400'
                  }`}
                >
                  <MessageSquare size={16} />
                  {post.commentsCount} Comments
                </button>
              </div>

              {/* Collapsible Comments Section */}
              {expandedCommentsPostId === post._id && (
                <div className="border-t border-gray-100 dark:border-gray-850 pt-4 space-y-4 animate-in slide-down duration-200">
                  
                  {/* Write comment input */}
                  {user && (
                    <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="flex gap-2">
                      <input
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                        placeholder="Write a comment reply..."
                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-slate-800 px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
                      />
                      <Button type="submit" size="sm" className="h-8 text-[10px] px-3 font-semibold rounded-lg" disabled={addCommentMutation.isPending}>
                        Reply
                      </Button>
                    </form>
                  )}

                  {/* Comment items list */}
                  <div className="space-y-3">
                    {comments.length === 0 ? (
                      <p className="text-center py-2 text-xs text-gray-400">No replies written yet. Be the first to comment.</p>
                    ) : (
                      comments.map((comm: PostComment) => (
                        <div key={comm._id} className="flex gap-2.5 items-start p-2 rounded-2xl bg-gray-50/50 dark:bg-slate-800/20 border border-gray-150/40 dark:border-gray-800/40">
                          <Avatar className="h-6 w-6 border">
                            <img src={comm.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comm.author.firstName}`} alt={comm.author.firstName} />
                          </Avatar>
                          <div className="flex-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-950 dark:text-white">
                                {comm.author.firstName} {comm.author.lastName}
                              </span>
                              <span className="text-[9px] text-gray-400 font-normal">
                                {new Date(comm.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mt-1 font-medium leading-relaxed">
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
export default FeedPage;
