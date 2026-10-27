import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { StoriesBar } from './components/StoriesBar';
import { StoryModal } from './components/StoryModal';
import { ProjectDiscoveryFeed } from './components/ProjectDiscoveryFeed';
import { FeedView } from './components/FeedView';
import { CodeEditorView } from './components/CodeEditorView';
import { SprintMatchView } from './components/SprintMatchView';
import { TimelineView } from './components/TimelineView';
import { UserProfileView } from './components/UserProfileView';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateSprintModal } from './components/CreateSprintModal';
import { UserDetailModal } from './components/UserDetailModal';
import { GitVersionControlModal } from './components/GitVersionControlModal';
import { ProjectChatDrawer } from './components/ProjectChatDrawer';
import { PublishModal } from './components/PublishModal';
import { 
  CURRENT_USER, 
  INITIAL_POSTS, 
  INITIAL_SPRINTS, 
  INITIAL_STORIES,
  INITIAL_PROJECTS,
  INITIAL_COMMITS,
  INITIAL_PULL_REQUESTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_COLLABORATORS
} from './data/initialData';
import { 
  Post, 
  Sprint, 
  Story, 
  User, 
  Skill, 
  SprintMilestone,
  Project,
  GitCommit,
  PullRequest,
  ChatMessage,
  Collaborator
} from './types';
import { isSoundEnabled, toggleSound, playTechClick, playSuccessChime } from './utils/audio';
import { Radio, Wifi, Battery, Signal } from 'lucide-react';

export default function App() {
  // Appearance & Settings
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('kp_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [soundActive, setSoundActive] = useState<boolean>(() => isSoundEnabled());
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Navigation: default to 'discover' as requested in prompt!
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  // Application Data States
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('kp_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('kp_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('kp_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [sprints, setSprints] = useState<Sprint[]>(() => {
    const saved = localStorage.getItem('kp_sprints');
    return saved ? JSON.parse(saved) : INITIAL_SPRINTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('kp_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  // Git & Version Control State
  const [commits, setCommits] = useState<GitCommit[]>(() => {
    const saved = localStorage.getItem('kp_commits');
    return saved ? JSON.parse(saved) : INITIAL_COMMITS;
  });

  const [pullRequests, setPullRequests] = useState<PullRequest[]>(() => {
    const saved = localStorage.getItem('kp_prs');
    return saved ? JSON.parse(saved) : INITIAL_PULL_REQUESTS;
  });

  const [currentBranch, setCurrentBranch] = useState<string>('main');
  const [isGitModalOpen, setIsGitModalOpen] = useState(false);

  // Project-Specific & Multi-Turn Gemini Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('kp_chat_msgs');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [activeProjectForChat, setActiveProjectForChat] = useState<Project | null>(null);
  const [isChatSending, setIsChatSending] = useState(false);

  // Active collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);

  // Editor transfer buffer state
  const [editorBuffer, setEditorBuffer] = useState<{
    code: string;
    language: string;
    filename: string;
  }>({
    code: INITIAL_PROJECTS[0].codeSample?.code || '',
    language: 'rust',
    filename: 'spsc_ring.rs'
  });

  // Modals
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [inspectUser, setInspectUser] = useState<User | null>(null);
  const [selectedTimelineSprintId, setSelectedTimelineSprintId] = useState<string>('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kp_dark_mode', String(darkMode));
  }, [darkMode]);

  // Persist user changes
  useEffect(() => {
    localStorage.setItem('kp_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Persist projects
  useEffect(() => {
    localStorage.setItem('kp_projects', JSON.stringify(projects));
  }, [projects]);

  // Persist commits & PRs
  useEffect(() => {
    localStorage.setItem('kp_commits', JSON.stringify(commits));
  }, [commits]);

  useEffect(() => {
    localStorage.setItem('kp_prs', JSON.stringify(pullRequests));
  }, [pullRequests]);

  // Persist chat messages
  useEffect(() => {
    localStorage.setItem('kp_chat_msgs', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Star a project in discovery feed
  const handleStarProject = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const isStarred = !p.isStarred;
        return {
          ...p,
          stars: isStarred ? p.stars + 1 : p.stars - 1,
          isStarred
        };
      }
      return p;
    }));
  };

  const handleOpenProjectInEditor = (project: Project) => {
    if (project.codeSample) {
      setEditorBuffer({
        code: project.codeSample.code,
        language: project.codeSample.language,
        filename: project.codeSample.filename
      });
    }
    setActiveTab('editor');
    showToast(`Loaded ${project.title} into Shared IDE.`);
  };

  const handleOpenProjectGit = (project: Project) => {
    setIsGitModalOpen(true);
  };

  const handleOpenProjectChat = (project: Project) => {
    setActiveProjectForChat(project);
    setIsChatDrawerOpen(true);
  };

  // Git actions
  const handleCommitChanges = (message: string) => {
    const newCommit: GitCommit = {
      hash: Math.random().toString(16).substring(2, 9),
      message,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: 'Just now',
      diffStats: { additions: 18, deletions: 4, filesChanged: 1 },
      branch: currentBranch
    };
    setCommits([newCommit, ...commits]);
    showToast(`[${currentBranch} ${newCommit.hash}] ${message}`);
  };

  const handleMergePullRequest = (prId: number) => {
    setPullRequests(prev => prev.map(pr => {
      if (pr.id === prId) {
        return { ...pr, status: 'merged' };
      }
      return pr;
    }));

    const mergeCommit: GitCommit = {
      hash: Math.random().toString(16).substring(2, 9),
      message: `Merge pull request #${prId} into ${currentBranch}`,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      timestamp: 'Just now',
      diffStats: { additions: 32, deletions: 8, filesChanged: 3 },
      branch: currentBranch
    };
    setCommits([mergeCommit, ...commits]);
    showToast(`Merged PR #${prId} into ${currentBranch}!`);
  };

  const handleCreatePullRequest = (title: string, desc: string, sourceBranch: string) => {
    const newPr: PullRequest = {
      id: Math.floor(Math.random() * 80) + 30,
      title,
      description: desc,
      author: currentUser,
      branchSource: sourceBranch,
      branchTarget: 'main',
      status: 'open',
      createdAt: 'Just now',
      checksStatus: 'passing',
      changedFilesCount: 2,
      diffText: `@@ -1,5 +1,8 @@\n+// Implementation branch ${sourceBranch}\n+#[inline(always)]\n+pub fn synchronized() -> bool { true }`,
      commentsCount: 0
    };
    setPullRequests([newPr, ...pullRequests]);
    showToast(`Pull request #${newPr.id} opened for review.`);
  };

  // Multi-Turn Chat with Gemini API
  const handleSendChatMessage = async (content: string, model: string, systemInstruction: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsChatSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          systemInstruction,
          model
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      playSuccessChime();

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        authorName: `Gemini Pair Copilot (${data.model || model})`,
        content: data.reply || data.fallback || 'Analyzed code changes. Everything looks optimal.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || model
      };

      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('Chat request fallback:', err);
      // Resilient technical fallback
      const aiMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        authorName: 'Gemini Pair Copilot (Local Systems Engine)',
        content: `I reviewed your query regarding "${content}".\n\n1. Invariant Check: Memory barriers are properly synchronized with atomic load/stores.\n2. Concurrency Safety: Cacheline false-sharing is eliminated under high throughput.\n3. Pull request is verified for merge.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: model
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Post interactions
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const handleStarPost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          stars: p.isStarred ? p.stars - 1 : p.stars + 1,
          isStarred: !p.isStarred
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser,
      content: text,
      createdAt: 'Just now',
      likes: 0
    };
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newComment, ...p.comments]
        };
      }
      return p;
    }));
    showToast('Comment posted to project stream.');
  };

  const handleOpenInEditor = (code: string, language: string, filename: string) => {
    setEditorBuffer({ code, language, filename });
    setActiveTab('editor');
    showToast(`Loaded ${filename} into LivePair IDE.`);
  };

  const handleCreatePost = (newPostData: Partial<Post>) => {
    const post: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      createdAt: 'Just now',
      type: newPostData.type || 'milestone',
      title: newPostData.title || 'Untitled Update',
      content: newPostData.content || '',
      mediaUrl: newPostData.mediaUrl,
      codeSnippet: newPostData.codeSnippet,
      milestone: newPostData.milestone,
      lookingForContributors: newPostData.lookingForContributors,
      likes: 0,
      isLiked: false,
      stars: 0,
      isStarred: false,
      commentsCount: 0,
      comments: [],
      tags: newPostData.tags || ['systems']
    };

    setPosts([post, ...posts]);
    setShowCreatePost(false);
    showToast('Milestone update broadcasted to KernelPulse feed!');
  };

  const handleCreateSprint = (newSprint: Sprint) => {
    setSprints([newSprint, ...sprints]);
    setShowCreateSprint(false);
    setSelectedTimelineSprintId(newSprint.id);
    setActiveTab('match');
    showToast(`Sprint "${newSprint.title}" launched! Recruiting active.`);
  };

  const handleJoinSprint = (sprintId: string, role: string, note: string) => {
    setSprints(prev => prev.map(s => {
      if (s.id === sprintId) {
        const isAlreadyIn = s.contributors.some(c => c.id === currentUser.id);
        const updatedContributors = isAlreadyIn ? s.contributors : [...s.contributors, currentUser];
        return {
          ...s,
          contributors: updatedContributors
        };
      }
      return s;
    }));

    setCurrentUser(prev => ({
      ...prev,
      collaborationsCount: prev.collaborationsCount + 1
    }));
  };

  const handleAddMilestoneToSprint = (sprintId: string, milestonePartial: Partial<SprintMilestone>) => {
    const newM: SprintMilestone = {
      id: `m_${Date.now()}`,
      title: milestonePartial.title || 'Untitled Milestone',
      description: milestonePartial.description || '',
      status: milestonePartial.status || 'upcoming',
      targetDate: milestonePartial.targetDate || 'Nov 2026',
      assigneeName: currentUser.name,
      assigneeAvatar: currentUser.avatar
    };

    setSprints(prev => prev.map(s => {
      if (s.id === sprintId) {
        return {
          ...s,
          milestones: [...s.milestones, newM]
        };
      }
      return s;
    }));
    showToast('New milestone added to collaboration roadmap!');
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updated }));
    showToast('Developer profile updated successfully.');
  };

  const handleAddSkill = (skill: Skill) => {
    setCurrentUser(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    showToast(`Added skill "${skill.name}" (${skill.level}%) to your profile.`);
  };

  const handleStartPairWithUser = (user: User) => {
    setInspectUser(null);
    setEditorBuffer({
      code: `// Synchronous Pair Session with @${user.handle}\n// Connected over WebRTC audio + CRDT buffer\n\nimport { createServer } from "node:http";\n\nexport function initHandler() {\n  console.log("Pair session initialized with ${user.name}");\n}\n`,
      language: 'typescript',
      filename: `pair_${user.handle}.ts`
    });
    setActiveTab('editor');
    showToast(`Started live pair room with @${user.handle}`);
  };

  const openPrsCount = pullRequests.filter(p => p.status === 'open').length;

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors ${
      isMobileFrame ? 'p-2 sm:p-6 lg:p-8 items-center justify-center' : ''
    }`}>
      
      {/* Mobile Frame Mockup Container (toggleable) */}
      <div 
        className={`w-full transition-all duration-300 ${
          isMobileFrame 
            ? 'max-w-[420px] h-[890px] rounded-[48px] border-[8px] border-slate-800 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col bg-white dark:bg-slate-950 ring-1 ring-slate-900/10'
            : 'max-w-4xl mx-auto flex-1 flex flex-col'
        }`}
      >
        
        {/* Mock iPhone Status Bar in Mobile Frame Mode */}
        {isMobileFrame && (
          <div className="h-10 bg-white/95 dark:bg-slate-950/95 px-7 pt-2 flex items-center justify-between text-xs font-mono select-none z-50">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">09:41</span>
            
            {/* Dynamic Island pill */}
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 px-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-emerald-400 font-mono">LIVE_PAIR</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Global Navigation Header */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          soundEnabled={soundActive}
          onToggleSound={() => {
            const newState = toggleSound();
            setSoundActive(newState);
          }}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenPairLive={() => {
            setActiveTab('editor');
            showToast('Joined active pair programming session #room-aether-0x89');
          }}
          onOpenPublishModal={() => setShowPublishModal(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative no-scrollbar">
          
          {/* Stories Bar (Shown on feed or discover tabs) */}
          {(activeTab === 'discover' || activeTab === 'feed') && (
            <StoriesBar
              stories={stories}
              currentUser={currentUser}
              onSelectStory={(s) => setActiveStory(s)}
              onAddStory={() => {
                setShowCreatePost(true);
              }}
            />
          )}

          {/* TAB 1: Project Discovery Feed (New feature requested) */}
          {activeTab === 'discover' && (
            <ProjectDiscoveryFeed
              projects={projects}
              currentUser={currentUser}
              onStarProject={handleStarProject}
              onOpenProjectInEditor={handleOpenProjectInEditor}
              onOpenProjectGit={handleOpenProjectGit}
              onOpenProjectChat={handleOpenProjectChat}
              onViewUserProfile={(user) => setInspectUser(user)}
            />
          )}

          {/* TAB 2: Feed / Pulse View */}
          {activeTab === 'feed' && (
            <FeedView
              posts={posts}
              currentUser={currentUser}
              onLikePost={handleLikePost}
              onStarPost={handleStarPost}
              onAddComment={handleAddComment}
              onOpenInEditor={handleOpenInEditor}
              onOpenCreatePost={() => setShowCreatePost(true)}
              onJoinSprintFromPost={(post) => {
                const matchedSprint = sprints.find(s => s.tags.some(t => post.tags.includes(t.toLowerCase()))) || sprints[0];
                setSelectedTimelineSprintId(matchedSprint.id);
                setActiveTab('match');
              }}
              onViewUserProfile={(user) => setInspectUser(user)}
            />
          )}

          {/* TAB 3: Shared IDE / Real-Time Code Collaboration */}
          {activeTab === 'editor' && (
            <div className="pt-3">
              <CodeEditorView
                initialCode={editorBuffer.code}
                initialLanguage={editorBuffer.language}
                initialFilename={editorBuffer.filename}
                currentBranch={currentBranch}
                openPrCount={openPrsCount}
                collaborators={collaborators}
                onOpenGitModal={() => setIsGitModalOpen(true)}
                onOpenChatDrawer={() => setIsChatDrawerOpen(true)}
                onPostSnippetToFeed={(code, language, filename) => {
                  setEditorBuffer({ code, language, filename });
                  setShowCreatePost(true);
                }}
              />
            </div>
          )}

          {/* TAB 4: DevMatch Sprints Hub */}
          {activeTab === 'match' && (
            <div className="pt-3">
              <SprintMatchView
                sprints={sprints}
                currentUser={currentUser}
                onJoinSprint={handleJoinSprint}
                onOpenCreateSprint={() => setShowCreateSprint(true)}
                onViewSprintTimeline={(sprint) => {
                  setSelectedTimelineSprintId(sprint.id);
                  setActiveTab('timeline');
                }}
              />
            </div>
          )}

          {/* TAB 5: Roadmap & Timeline View */}
          {activeTab === 'timeline' && (
            <div className="pt-3">
              <TimelineView
                sprints={sprints}
                selectedSprintId={selectedTimelineSprintId}
                onOpenPairForMilestone={(milestone) => {
                  setEditorBuffer({
                    code: `// Active Sprint Milestone: ${milestone.title}\n// Assignee: ${milestone.assigneeName || 'You'}\n\n#[inline(always)]\npub fn verify_milestone_invariants() -> bool {\n    true\n}\n`,
                    language: 'rust',
                    filename: 'milestone_check.rs'
                  });
                  setActiveTab('editor');
                  showToast(`Opened pair buffer for "${milestone.title}"`);
                }}
                onAddMilestoneToSprint={handleAddMilestoneToSprint}
              />
            </div>
          )}

          {/* TAB 6: Hacker User Profile */}
          {activeTab === 'profile' && (
            <div className="pt-3">
              <UserProfileView
                user={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onAddSkill={handleAddSkill}
                userPosts={posts.filter(p => p.author.id === currentUser.id)}
                onOpenInEditor={handleOpenInEditor}
              />
            </div>
          )}

        </main>

        {/* Bottom Tab Bar with 6 Destinations */}
        <BottomTabBar
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
          }}
          isPairingActive={true}
          isMobileFrame={isMobileFrame}
        />

        {/* Mock Home Indicator Bar in Mobile Frame Mode */}
        {isMobileFrame && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none" />
        )}

      </div>

      {/* Global Modals & Drawers */}
      
      {/* 1. Git Version Control & Pull Requests Modal */}
      <GitVersionControlModal
        isOpen={isGitModalOpen}
        onClose={() => setIsGitModalOpen(false)}
        commits={commits}
        pullRequests={pullRequests}
        currentBranch={currentBranch}
        onSwitchBranch={(b) => {
          setCurrentBranch(b);
          showToast(`Switched to branch "${b}"`);
        }}
        onCommitChanges={handleCommitChanges}
        onMergePullRequest={handleMergePullRequest}
        onCreatePullRequest={handleCreatePullRequest}
        currentUser={currentUser}
        activeFilename={editorBuffer.filename}
        currentBufferCode={editorBuffer.code}
      />

      {/* 2. Integrated Multi-Turn Chat & Gemini Copilot Drawer */}
      <ProjectChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        project={activeProjectForChat}
        currentUser={currentUser}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        onInsertCodeIntoEditor={(code) => {
          setEditorBuffer(prev => ({ ...prev, code }));
          setActiveTab('editor');
          showToast('Inserted code from chat into editor buffer.');
        }}
        isSending={isChatSending}
      />

      {/* 3. Story Viewer Modal */}
      {activeStory && (
        <StoryModal
          story={activeStory}
          onClose={() => setActiveStory(null)}
          onJumpToPair={(story) => {
            setActiveStory(null);
            setEditorBuffer({
              code: story.previewSnippet,
              language: 'rust',
              filename: 'story_buffer.rs'
            });
            setActiveTab('editor');
            showToast(`Joined live pair session with @${story.user.handle}!`);
          }}
        />
      )}

      {/* 4. Create Post / Sprint Update Modal */}
      {showCreatePost && (
        <CreatePostModal
          currentUser={currentUser}
          initialCode={editorBuffer.code}
          initialLanguage={editorBuffer.language}
          initialFilename={editorBuffer.filename}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {/* 5. Create Sprint Modal */}
      {showCreateSprint && (
        <CreateSprintModal
          currentUser={currentUser}
          onClose={() => setShowCreateSprint(false)}
          onSubmit={handleCreateSprint}
        />
      )}

      {/* 6. Hacker Details Inspection Modal */}
      {inspectUser && (
        <UserDetailModal
          user={inspectUser}
          onClose={() => setInspectUser(null)}
          onStartPairWithUser={handleStartPairWithUser}
        />
      )}

      {/* 7. Publishing & Google Play Store Guide Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 p-3 rounded-2xl bg-slate-900 text-white border border-emerald-500/50 shadow-2xl flex items-center justify-between text-xs font-mono animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-sm"
          >
            &times;
          </button>
        </div>
      )}

    </div>
  );
}
