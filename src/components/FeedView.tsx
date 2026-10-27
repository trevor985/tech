import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Star, 
  Play, 
  Code2, 
  Copy, 
  Check, 
  Users, 
  GitFork, 
  CheckCircle2, 
  Send,
  Plus,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Post, User } from '../types';
import { playTechClick, playSuccessChime } from '../utils/audio';

interface FeedViewProps {
  posts: Post[];
  currentUser: User;
  onLikePost: (postId: string) => void;
  onStarPost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenInEditor: (code: string, language: string, filename: string) => void;
  onOpenCreatePost: () => void;
  onJoinSprintFromPost: (post: Post) => void;
  onViewUserProfile?: (user: User) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  onLikePost,
  onStarPost,
  onAddComment,
  onOpenInEditor,
  onOpenCreatePost,
  onJoinSprintFromPost,
  onViewUserProfile
}) => {
  const [filter, setFilter] = useState<'all' | 'milestones' | 'snippets' | 'sprints'>('all');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'milestones') return post.type === 'milestone';
    if (filter === 'snippets') return !!post.codeSnippet;
    if (filter === 'sprints') return !!post.lookingForContributors?.active;
    return true;
  });

  const handleCopyCode = (snippet: { code: string }, id: string) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedSnippetId(id);
    playSuccessChime();
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}#post-${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedShareId(postId);
    playSuccessChime();
    setTimeout(() => setCopiedShareId(null), 2000);
  };

  const submitComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
    playSuccessChime();
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Feed Filter & Create CTA */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between gap-2">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto no-scrollbar border border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => {
                playTechClick(800);
                setFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Pulse
            </button>
            <button
              onClick={() => {
                playTechClick(800);
                setFilter('milestones');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === 'milestones'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Milestones
            </button>
            <button
              onClick={() => {
                playTechClick(800);
                setFilter('snippets');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === 'snippets'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Code Snippets
            </button>
            <button
              onClick={() => {
                playTechClick(800);
                setFilter('sprints');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filter === 'sprints'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sprint Calls
            </button>
          </div>

          {/* New Post Button */}
          <button
            onClick={() => {
              playTechClick(900);
              onOpenCreatePost();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-tight shadow-md shadow-emerald-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Post Update</span>
            <span className="sm:hidden">Post</span>
          </button>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-4 px-3 sm:px-4">
        {filteredPosts.map((post) => {
          const isCommenting = activeCommentPostId === post.id;

          return (
            <article
              key={post.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden transition-all text-left"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => onViewUserProfile && onViewUserProfile(post.author)}
                >
                  <div className="relative">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    {post.author.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                        {post.author.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        @{post.author.handle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{post.createdAt}</span>
                      {post.type === 'milestone' && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Milestone Reached
                          </span>
                        </>
                      )}
                      {post.lookingForContributors?.active && (
                        <>
                          <span>·</span>
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            Sprint Recruiting
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags preview */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Title & Content */}
              <div className="p-4 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Attached Media / Showcase (if present) */}
              {post.mediaUrl && (
                <div className="relative w-full aspect-video bg-slate-950 overflow-hidden border-y border-slate-100 dark:border-slate-800">
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Code Snippet Box with IDE Launch affordance */}
              {post.codeSnippet && (
                <div className="mx-4 my-2 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-left">
                  <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-200 font-medium">
                        {post.codeSnippet.filename}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        [{post.codeSnippet.language}]
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(post.codeSnippet!, post.id)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedSnippetId === post.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          playTechClick(900);
                          onOpenInEditor(
                            post.codeSnippet!.code, 
                            post.codeSnippet!.language, 
                            post.codeSnippet!.filename
                          );
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-[11px] font-medium transition-all"
                        title="Fork and edit live with real-time pairing"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Pair in IDE</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto max-h-56">
                    <pre className="whitespace-pre">{post.codeSnippet.code}</pre>
                  </div>
                </div>
              )}

              {/* Milestone Progress Bar (if milestone) */}
              {post.milestone && (
                <div className="mx-4 my-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {post.milestone.label}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {Math.round((post.milestone.current / post.milestone.total) * 100)}% ({post.milestone.current}/{post.milestone.total})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${(post.milestone.current / post.milestone.total) * 100}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Target: {post.milestone.targetDate}</span>
                    <span className="text-emerald-500 font-medium">On Schedule</span>
                  </div>
                </div>
              )}

              {/* Looking for Contributors Callout */}
              {post.lookingForContributors?.active && (
                <div className="mx-4 my-2 p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-500/30 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono uppercase tracking-wide">
                      <Users className="w-3.5 h-3.5" />
                      <span>{post.lookingForContributors.openSeats} Open Contributor Seats</span>
                    </div>
                    <button
                      onClick={() => {
                        playTechClick(880);
                        onJoinSprintFromPost(post);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold tracking-tight shadow-sm transition-all"
                    >
                      Join Sprint &rarr;
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                    {post.lookingForContributors.sprintGoal}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.lookingForContributors.roles.map(role => (
                      <span 
                        key={role}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Bar (Star, Like, Comments, Share) */}
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  {/* Upvote / Star */}
                  <button
                    onClick={() => {
                      playTechClick(900);
                      onStarPost(post.id);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-mono font-medium transition-colors ${
                      post.isStarred 
                        ? 'text-amber-500' 
                        : 'hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${post.isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{post.stars}</span>
                  </button>

                  {/* Like / Heart */}
                  <button
                    onClick={() => {
                      playTechClick(850);
                      onLikePost(post.id);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-mono font-medium transition-colors ${
                      post.isLiked 
                        ? 'text-rose-500' 
                        : 'hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  {/* Comments Toggle */}
                  <button
                    onClick={() => {
                      playTechClick(750);
                      setActiveCommentPostId(isCommenting ? null : post.id);
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono font-medium hover:text-emerald-500 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>

                {/* Share Link */}
                <button
                  onClick={() => handleShare(post.id)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Copy link to post"
                >
                  {copiedShareId === post.id ? (
                    <span className="text-emerald-500 font-mono text-[11px]">Link Copied</span>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Comments Section (Expandable) */}
              {isCommenting && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No comments yet. Start the discussion!</p>
                    ) : (
                      post.comments.map(c => (
                        <div key={c.id} className="text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 dark:text-slate-200">
                              @{c.author.handle}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{c.createdAt}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <input
                      type="text"
                      placeholder="Comment or suggest a patch..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </article>
          );
        })}
      </div>

    </div>
  );
};
