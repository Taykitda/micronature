import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { INITIAL_POSTS, BRAND_IMAGES } from '../data';
import { MessageSquare, Heart, RefreshCw, Send, PlusCircle, Sparkles, Filter, Smile } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  exp: 'beginner' | 'intermediate' | 'expert';
  notify: boolean;
  bio: string;
}

interface CommunityProps {
  userProfile: UserProfile;
}

export default function Community({ userProfile }: CommunityProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // New Post States
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState('我的室内花园');

  // Comment input state
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  // Fetch posts and their comments from backend on mount
  React.useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to fetch community posts:', err));
  }, []);

  const handleLike = (id: string) => {
    const token = localStorage.getItem('mn_token');
    fetch(`/api/posts/${id}/like`, { 
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to like post');
        return res.json();
      })
      .then(updatedPost => {
        setPosts(posts.map(post => {
          if (post.id === id) {
            return {
              ...post,
              hasLiked: updatedPost.hasLiked,
              likes: updatedPost.likes
            };
          }
          return post;
        }));
      })
      .catch(err => console.error(err));
  };

  const handlesubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      title: title ? title : undefined,
      content,
      tag: selectedTag,
      author: {
        name: userProfile.name,
        avatar: userProfile.avatar,
        role: userProfile.role
      },
      likes: 1,
      commentsCount: 0,
      hasLiked: true
    };

    const token = localStorage.getItem('mn_token');
    fetch('/api/posts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(newPost)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit post');
        return res.json();
      })
      .then(savedPost => {
        setPosts([{ ...savedPost, comments: [] }, ...posts]);
        setContent('');
        setTitle('');
        setIsAdding(false);
      })
      .catch(err => console.error(err));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text?.trim()) return;

    const token = localStorage.getItem('mn_token');
    fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        author: userProfile.name || '匿名园艺师',
        text
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add comment');
        return res.json();
      })
      .then(newComment => {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            const currentComments = p.comments || [];
            return {
              ...p,
              commentsCount: p.commentsCount + 1,
              comments: [...currentComments, { author: newComment.author, text: newComment.text }]
            };
          }
          return p;
        }));
        setCommentInput({ ...commentInput, [postId]: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* 🔮 Left Column: Community Post creator and feed */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-emerald-50 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-950">绿植微生态社区交流圈 (Oasis Oasis Feed)</h3>
            <p className="text-xs text-gray-400">分享你的窗台设计、多肉繁育、智能喷淋改造及疑难杂症求助</p>
          </div>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>发表绿色日志</span>
          </button>
        </div>

        {/* Post creation modal card */}
        {isAdding && (
          <form onSubmit={handlesubmitPost} className="bg-[#fafaf7] p-5 rounded-2xl border border-gray-150 text-xs space-y-4 animate-in slide-in-from-top-4 duration-200">
            <h4 className="font-serif font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" />
              <span>记录或发布求助</span>
            </h4>

            <div className="space-y-1">
              <label className="text-gray-500 font-semibold block">帖子标题 (可选)</label>
              <input 
                type="text" 
                placeholder="给你的日志个点睛的标题吧..." 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white border rounded-xl p-2.5 outline-none focus:border-emerald-650"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-500 font-semibold block">正文内容 *</label>
              <textarea 
                placeholder="今天给多肉浇水了吗？还是刚添置了漂亮的雨林缸？快用诗意的文字写下来与盆友们分享..." 
                value={content} 
                onChange={e => setContent(e.target.value)}
                className="w-full bg-white border rounded-xl p-2.5 h-28 outline-none focus:border-emerald-650 resize-y"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">圈子标签：</span>
                {['我的室内花园', '新手求助', '阳台改造', '神奇的多肉'].map((tag) => (
                  <button 
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${selectedTag === tag ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 font-bold select-none shrink-0 ml-auto">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  瞬时同步至地球社区
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Active Feed list */}
        <div className="space-y-8">
          {posts.map((post) => {
            const comments = post.comments || [];
            return (
              <div key={post.id} className="border-b last:border-none pb-6 last:pb-0 space-y-4 text-xs font-sans">
                
                {/* Author Block */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.author.avatar ? (
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-10 h-10 rounded-full object-cover border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono">
                        {post.author.name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                      <p className="text-[10px] text-gray-400">{post.author.role}</p>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-900 font-semibold px-2.5 py-1 rounded-full text-[10px]">
                    #{post.tag}
                  </span>
                </div>

                {/* Content Block */}
                <div className="space-y-3.5 pl-13">
                  {post.title && <h5 className="font-bold text-sm text-gray-900">{post.title}</h5>}
                  <p className="text-gray-700 leading-relaxed text-xs">{post.content}</p>

                  {post.image && (
                    <div className="rounded-2xl overflow-hidden max-h-80 border bg-stone-50">
                      <img 
                        src={post.image} 
                        alt="Community upload" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex gap-6 items-center pt-2 text-gray-500">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${post.hasLiked ? 'text-rose-600 scale-102' : 'hover:text-rose-600'}`}
                    >
                      <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-gray-450" />
                      <span>{comments.length} 评论</span>
                    </span>
                  </div>

                  {/* Comments thread preview */}
                  {comments.length > 0 && (
                    <div className="bg-gray-50/75 rounded-2xl p-4 border space-y-2.5 mt-3 text-[11px] leading-relaxed">
                      {comments.map((comm, idx) => (
                        <div key={idx} className="space-y-0.5 border-b border-gray-100/50 last:border-none pb-2 last:pb-0">
                          <span className="font-bold text-gray-900">{comm.author}：</span>
                          <span className="text-gray-650">{comm.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick comment input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="text" 
                      placeholder="写一条园艺点评，帮助花友们成长..." 
                      value={commentInput[post.id] || ''} 
                      onChange={e => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 bg-[#fafaf7] text-xs border border-gray-200 rounded-lg p-2 outline-none focus:border-emerald-650"
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="w-8 h-8 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-white flex items-center justify-center transition-opacity shrink-0 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 🔮 Right Column: Community Leaderboard and Guidelines */}
      <div className="lg:col-span-4 bg-[#fafaf7] rounded-3xl p-6 border border-gray-150 space-y-6 text-xs">
        <div className="space-y-2">
          <h4 className="font-serif font-bold text-emerald-950 text-sm">🏆 掌上绿洲贡献荣誉殿堂</h4>
          <p className="text-[11px] text-gray-400">本月生态值增长最高的园艺达人们</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-mono text-emerald-900 font-bold bg-emerald-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              <span className="font-semibold text-gray-900">林间小鹿</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">1280 绿分</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-mono text-amber-900 font-bold bg-amber-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
              <span className="font-semibold text-gray-900">Flora造景师</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">940 绿分</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-mono text-stone-900 font-bold bg-stone-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
              <span className="font-semibold text-gray-900">青青子衿</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">420 绿分</span>
          </div>
        </div>

        <div className="bg-emerald-950 text-white p-4 rounded-2xl space-y-3">
          <h5 className="font-bold flex items-center gap-1">
            <Smile className="w-4 h-4 text-emerald-400" />
            <span>绿色氧气兑换法则</span>
          </h5>
          <p className="text-[10px] leading-relaxed text-emerald-100">
            每发表 1 篇养护周报（加 50 绿分），在社区中解答新手植物萎蔫焦边问题（加 20 绿分）。积累绿分，即可于「造景商城」直接扣减兑换日本进口赤玉土或智能微喷阀。
          </p>
        </div>
      </div>

    </div>
  );
}
