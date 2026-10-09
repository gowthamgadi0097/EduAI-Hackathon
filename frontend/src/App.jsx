import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Brain, BookOpen, LayoutDashboard, MessageCircle, NotebookPen, ClipboardList,
  LogOut, Sparkles, ArrowRight, Send, Clock3, CheckCircle2, Menu, X, GraduationCap,
  Plus, LockKeyhole, Mail, UserRound, LoaderCircle, ChevronRight, Lightbulb
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}, token = '') {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed. Please try again.');
  return data;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tutor', label: 'AI Tutor', icon: MessageCircle },
  { id: 'notes', label: 'Study Notes', icon: NotebookPen },
  { id: 'quiz', label: 'Quiz Maker', icon: ClipboardList },
];

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const data = await request(`/auth/${mode}`, {
        method: 'POST', body: JSON.stringify({ name, email, password })
      });
      onAuth(data);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <div className="auth-shell">
    <div className="auth-art">
      <div className="brand brand-light"><span className="brand-icon"><Brain size={23}/></span><span>EduAI</span></div>
      <div className="art-copy">
        <span className="eyebrow light-eyebrow"><Sparkles size={14}/> YOUR PERSONAL AI LEARNING COMPANION</span>
        <h1>Make learning<br/><em>feel effortless.</em></h1>
        <p>Understand difficult concepts, create better notes, and prepare for every exam with a little help from AI.</p>
        <div className="art-points">
          <div><span><CheckCircle2 size={17}/></span> Learn at your own pace</div>
          <div><span><CheckCircle2 size={17}/></span> Turn questions into understanding</div>
          <div><span><CheckCircle2 size={17}/></span> Build confidence, one day at a time</div>
        </div>
      </div>
      <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
      <div className="floating-card"><div className="float-icon"><Lightbulb size={20}/></div><div><b>Small steps, big progress</b><small>Your next breakthrough starts here.</small></div><Sparkles className="float-sparkle" size={18}/></div>
      <div className="auth-footer">A smarter way to study. Built for curious minds.</div>
    </div>
    <div className="auth-main">
      <div className="auth-top-mobile"><div className="brand"><span className="brand-icon"><Brain size={22}/></span>EduAI</div></div>
      <div className="auth-form-wrap">
        <div className="welcome-tag"><span className="status-dot"></span> YOUR LEARNING SPACE</div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}<span className="heading-period">.</span></h2>
        <p className="auth-subtitle">{mode === 'login' ? 'Pick up where your curiosity left off.' : 'Start your journey to smarter learning.'}</p>
        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && <label>Your name<div className="input-wrap"><UserRound size={18}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Gowtham" autoComplete="name" required minLength={2}/></div></label>}
          <label>Email address<div className="input-wrap"><Mail size={18}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div></label>
          <label>Password<div className="input-wrap"><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : 1} required/></div></label>
          {error && <div className="alert-error">{error}</div>}
          <button className="primary-btn auth-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={18}/> : mode === 'login' ? 'Sign in to EduAI' : 'Create account'} {!busy && <ArrowRight size={18}/>}</button>
        </form>
        <div className="auth-switch">{mode === 'login' ? "New to EduAI?" : 'Already have an account?'} <button onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>{mode==='login'?'Create an account':'Sign in'}</button></div>
        <div className="secure-note"><LockKeyhole size={14}/> Your learning space is private and secure.</div>
      </div>
      <div className="auth-bottom">© 2026 EduAI · Learn with purpose</div>
    </div>
  </div>;
}

function Sidebar({ active, setActive, user, logout, mobileOpen, setMobileOpen }) {
  return <>
    {mobileOpen && <div className="mobile-scrim" onClick={()=>setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen?'sidebar-open':''}`}>
      <div className="brand"><span className="brand-icon"><Brain size={22}/></span><span>EduAI</span><span className="brand-dot">.</span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{navItems.map(item=><button key={item.id} className={`nav-item ${active===item.id?'active':''}`} onClick={()=>{setActive(item.id);setMobileOpen(false)}}><item.icon size={19}/><span>{item.label}</span>{active===item.id&&<ChevronRight className="nav-chevron" size={16}/>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-spark"><Sparkles size={17}/></div><b>Keep growing</b><p>Every question is a step forward.</p><div className="upgrade-line"><span></span></div><small>YOUR POTENTIAL IS LIMITLESS</small></div>
        <div className="profile-row"><div className="avatar">{(user?.name||'S').slice(0,1).toUpperCase()}</div><div className="profile-info"><b>{user?.name || 'Student'}</b><span>{user?.email}</span></div><button className="icon-button logout-btn" onClick={logout} title="Sign out"><LogOut size={17}/></button></div>
      </div>
    </aside>
  </>;
}

function Dashboard({ user, history, setActive }) {
  const count = history.length;
  const quizzes = history.filter(x=>x.type==='quiz').length;
  const recent = history.slice(0,4);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
  return <div className="page-content">
    <div className="page-heading-row"><div><div className="eyebrow"><span className="tiny-spark">✳</span> YOUR LEARNING OVERVIEW</div><h1>{greeting}, {user?.name?.split(' ')[0] || 'Learner'}<span className="heading-period">.</span></h1><p className="muted">A little progress each day adds up to big results.</p></div><div className="date-chip"><Clock3 size={15}/>{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</div></div>
    <section className="hero-banner"><div className="hero-text"><span className="hero-pill"><Sparkles size={13}/> YOUR AI STUDY PARTNER</span><h2>Curiosity is your<br/><em>superpower.</em></h2><p>What would you like to understand today? Start with a question, a topic, or a fresh idea.</p><button className="hero-btn" onClick={()=>setActive('tutor')}>Ask your AI tutor <ArrowRight size={17}/></button></div><div className="hero-visual"><div className="hero-glow"></div><div className="hero-ring ring-a"></div><div className="hero-ring ring-b"></div><div className="hero-orb"><Brain size={76} strokeWidth={1.2}/><Sparkles className="orb-spark spark-a" size={22}/><Sparkles className="orb-spark spark-b" size={15}/></div><div className="mini-float mini-float-top"><Lightbulb size={16}/><span>Ideas into insight</span></div><div className="mini-float mini-float-bottom"><BookOpen size={16}/><span>Learn something new</span></div></div></section>
    <div className="section-title-row"><div><h3>Your learning space</h3><p className="muted small">Choose a tool to get started</p></div><span className="section-caption"><Sparkles size={14}/> POWERED BY AI</span></div>
    <div className="tool-grid">
      <button className="tool-card tool-lilac" onClick={()=>setActive('tutor')}><div className="tool-top"><span className="tool-icon"><MessageCircle size={21}/></span><span className="tool-arrow"><ArrowRight size={17}/></span></div><h3>AI Tutor</h3><p>Ask anything. Get clear explanations, examples, and a little extra clarity.</p><span className="tool-link">Ask a question <ArrowRight size={14}/></span></button>
      <button className="tool-card tool-peach" onClick={()=>setActive('notes')}><div className="tool-top"><span className="tool-icon"><NotebookPen size={21}/></span><span className="tool-arrow"><ArrowRight size={17}/></span></div><h3>Study Notes</h3><p>Turn long chapters and complicated material into useful revision notes.</p><span className="tool-link">Create notes <ArrowRight size={14}/></span></button>
      <button className="tool-card tool-mint" onClick={()=>setActive('quiz')}><div className="tool-top"><span className="tool-icon"><ClipboardList size={21}/></span><span className="tool-arrow"><ArrowRight size={17}/></span></div><h3>Quiz Maker</h3><p>Practice what you know with questions made for your learning goals.</p><span className="tool-link">Build a quiz <ArrowRight size={14}/></span></button>
    </div>
    <div className="section-title-row recent-heading"><div><h3>Recently explored</h3><p className="muted small">Your learning journey, all in one place</p></div><button className="text-link" onClick={()=>setActive('history')}>View history <ArrowRight size={15}/></button></div>
    <div className="recent-card">
      {recent.length===0 ? <div className="empty-state"><div className="empty-icon"><BookOpen size={22}/></div><b>Your story starts here</b><p>Once you use an AI learning tool, your activity will show up here.</p><button className="subtle-btn" onClick={()=>setActive('tutor')}>Start learning <ArrowRight size={15}/></button></div> : recent.map(item=><ActivityRow key={item._id} item={item} />)}
    </div>
    <div className="bottom-note"><span className="note-icon"><Sparkles size={16}/></span><span><b>Remember:</b> You don't have to learn everything at once. Just keep asking good questions.</span></div>
  </div>;
}

function ActivityRow({ item }) {
  const icon = item.type==='tutor' ? <MessageCircle size={17}/> : item.type==='notes' ? <NotebookPen size={17}/> : <ClipboardList size={17}/>;
  const label = item.type==='tutor' ? 'AI Tutor' : item.type==='notes' ? 'Study Notes' : 'Quiz Maker';
  return <div className="activity-row"><div className={`activity-icon ${item.type}`}>{icon}</div><div className="activity-main"><b>{label}</b><span>{item.prompt}</span></div><time>{new Date(item.createdAt).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</time></div>;
}

function ToolHeader({ eyebrow, title, subtitle, icon: Icon }) {
  return <div className="tool-page-heading"><div className="tool-page-icon"><Icon size={24}/></div><div><div className="eyebrow">{eyebrow}</div><h1>{title}<span className="heading-period">.</span></h1><p className="muted">{subtitle}</p></div></div>;
}

function TutorPage({ token, onSaved }) {
  const [question,setQuestion]=useState('');
  const [answer,setAnswer]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function submit(e){e.preventDefault();if(!question.trim())return;setBusy(true);setError('');setAnswer('');try{const data=await request('/learning/tutor',{method:'POST',body:JSON.stringify({question})},token);setAnswer(data.answer);onSaved();}catch(err){setError(err.message)}finally{setBusy(false)}}
  return <div className="page-content tool-page"><ToolHeader eyebrow="LEARN THROUGH CONVERSATION" title="AI Tutor" subtitle="No question is too small. Let's work it out together." icon={MessageCircle}/>
    <div className="workspace-grid"><div className="input-panel"><div className="panel-top"><span className="panel-number">01</span><div><h3>What are you curious about?</h3><p>Ask a question or tell me what you're finding difficult.</p></div></div><form onSubmit={submit}><label className="field-label">YOUR QUESTION</label><textarea className="big-textarea" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="For example: Explain neural networks with a simple real-life example..." rows={7} maxLength={6000} required/><div className="textarea-meta"><span>{question.length}/6000 characters</span><span><Sparkles size={13}/> Clear questions get clearer answers</span></div><button className="primary-btn full-btn" disabled={busy||question.trim().length<3}>{busy?<><LoaderCircle className="spin" size={17}/> Thinking through it...</>:<>Ask EduAI <Send size={16}/></>}</button></form>{error&&<div className="alert-error">{error}</div>}<div className="suggestion-title">NEED AN IDEA?</div><div className="suggestions">{['Explain machine learning simply','How does photosynthesis work?','Help me understand calculus'].map(s=><button key={s} onClick={()=>setQuestion(s)}>{s}<ArrowRight size={13}/></button>)}</div></div>
      <div className="response-panel"><div className="response-top"><span className="response-live"><span className="status-dot"/> AI RESPONSE</span><Sparkles size={18}/></div>{answer?<div className="markdown-output"><ReactMarkdown>{answer}</ReactMarkdown></div>:<div className="response-empty"><div className="response-illustration"><Brain size={42}/><Sparkles size={16} className="response-spark"/></div><h3>Your answer will appear here</h3><p>You'll get a thoughtful explanation with helpful examples, right when you need it.</p><div className="response-tip"><Lightbulb size={16}/><span><b>Study tip</b><br/>Ask follow-up questions until it clicks.</span></div></div>}</div></div>
  </div>;
}

function NotesPage({ token, onSaved }) {
  const [topic,setTopic]=useState('');const [text,setText]=useState('');const [notes,setNotes]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  async function submit(e){e.preventDefault();setBusy(true);setError('');setNotes('');try{const data=await request('/learning/notes',{method:'POST',body:JSON.stringify({topic,text})},token);setNotes(data.notes);onSaved();}catch(err){setError(err.message)}finally{setBusy(false)}}
  return <div className="page-content tool-page"><ToolHeader eyebrow="MAKE KNOWLEDGE STICK" title="Study Notes" subtitle="Less overwhelm, more understanding. Build your own revision guide." icon={NotebookPen}/>
    <div className="workspace-grid"><div className="input-panel"><div className="panel-top"><span className="panel-number">01</span><div><h3>What are you studying?</h3><p>Add a topic, paste your class notes, or both.</p></div></div><form onSubmit={submit}><label className="field-label">TOPIC OR CHAPTER</label><input className="text-input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Introduction to Artificial Intelligence" maxLength={300}/><label className="field-label spaced-label">PASTE YOUR STUDY MATERIAL <span className="optional">(optional)</span></label><textarea className="big-textarea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste textbook paragraphs, lecture notes, or your own notes here..." rows={7} maxLength={10000}/><div className="textarea-meta"><span>{text.length}/10000 characters</span><span><BookOpen size={13}/> Made for revision</span></div><button className="primary-btn full-btn" disabled={busy||(!topic.trim()&&text.trim().length<30)}>{busy?<><LoaderCircle className="spin" size={17}/> Organizing your notes...</>:<>Generate study notes <Sparkles size={16}/></>}</button></form>{error&&<div className="alert-error">{error}</div>}<div className="privacy-hint"><LockKeyhole size={14}/> Your study activity is saved to your account.</div></div>
      <div className="response-panel notes-response"><div className="response-top"><span className="response-live"><span className="status-dot"/> YOUR REVISION GUIDE</span><NotebookPen size={18}/></div>{notes?<div className="markdown-output"><ReactMarkdown>{notes}</ReactMarkdown></div>:<div className="response-empty"><div className="response-illustration notes-art"><NotebookPen size={40}/><Sparkles size={16} className="response-spark"/></div><h3>Your notes, made clearer</h3><p>EduAI will organize your material into key ideas, definitions, and a quick revision section.</p><div className="sample-outline"><span><CheckCircle2 size={15}/> Key concepts</span><span><CheckCircle2 size={15}/> Simple explanations</span><span><CheckCircle2 size={15}/> Quick revision points</span></div></div>}</div></div>
  </div>;
}

function QuizPage({ token, onSaved }) {
  const [topic,setTopic]=useState('');const [count,setCount]=useState('5');const [questions,setQuestions]=useState([]);const [answers,setAnswers]=useState({});const [submitted,setSubmitted]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  async function submit(e){e.preventDefault();setBusy(true);setError('');setQuestions([]);setAnswers({});setSubmitted(false);try{const data=await request('/learning/quiz',{method:'POST',body:JSON.stringify({topic,count:Number(count)})},token);setQuestions(data.questions);onSaved();}catch(err){setError(err.message)}finally{setBusy(false)}}
  const score=questions.reduce((sum,q,i)=>sum+(Number(answers[i])===q.answerIndex?1:0),0);
  return <div className="page-content tool-page"><ToolHeader eyebrow="PRACTICE MAKES PROGRESS" title="Quiz Maker" subtitle="Turn what you've learned into confidence with a quick practice quiz." icon={ClipboardList}/>
    <div className="quiz-layout"><div className="input-panel quiz-config"><div className="panel-top"><span className="panel-number">01</span><div><h3>Build your practice quiz</h3><p>Choose a topic and let EduAI prepare the questions.</p></div></div><form onSubmit={submit}><label className="field-label">SUBJECT OR TOPIC</label><input className="text-input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Python fundamentals" maxLength={300} required minLength={2}/><label className="field-label spaced-label">NUMBER OF QUESTIONS</label><div className="count-options">{['3','5','8','10'].map(n=><button type="button" className={count===n?'count-active':''} onClick={()=>setCount(n)} key={n}>{n}</button>)}</div><button className="primary-btn full-btn quiz-generate" disabled={busy||topic.trim().length<2}>{busy?<><LoaderCircle className="spin" size={17}/> Preparing your quiz...</>:<>Generate quiz <Sparkles size={16}/></>}</button></form>{error&&<div className="alert-error">{error}</div>}<div className="quiz-info"><div><span className="quiz-info-icon"><Clock3 size={16}/></span><span><b>Learn at your pace</b><small>No timer, no pressure.</small></span></div><div><span className="quiz-info-icon"><Brain size={16}/></span><span><b>Understand the why</b><small>See explanations after submitting.</small></span></div></div></div>
      <div className="quiz-area">{questions.length===0?<div className="quiz-empty"><div className="quiz-empty-art"><ClipboardList size={44}/></div><h3>Your next challenge awaits</h3><p>Your quiz will appear here, with multiple-choice questions and explanations to help you learn from every answer.</p><div className="quiz-preview"><span>A</span><span>B</span><span>C</span><span>D</span><small>Multiple-choice practice</small></div></div>:<div className="quiz-questions"><div className="quiz-result-header"><div><span className="eyebrow">YOUR PRACTICE SESSION</span><h3>{topic}</h3><p className="muted small">{questions.length} questions · Take your time</p></div>{submitted&&<div className="score-badge">{score}/{questions.length}<small>SCORE</small></div>}</div>{questions.map((q,i)=><div className="question-card" key={i}><div className="question-number">QUESTION {String(i+1).padStart(2,'0')}</div><h4>{q.question}</h4><div className="answer-options">{q.options.map((option,j)=><button key={j} disabled={submitted} className={`answer-option ${Number(answers[i])===j?'answer-selected':''} ${submitted&&j===q.answerIndex?'answer-correct':''} ${submitted&&Number(answers[i])===j&&j!==q.answerIndex?'answer-wrong':''}`} onClick={()=>setAnswers({...answers,[i]:String(j)})}><span className="option-letter">{String.fromCharCode(65+j)}</span><span>{option}</span>{submitted&&j===q.answerIndex&&<CheckCircle2 size={17}/>}</button>)}</div>{submitted&&<div className="explanation"><Lightbulb size={15}/><span><b>Why:</b> {q.explanation}</span></div>}</div>)}{!submitted?<button className="primary-btn full-btn" disabled={Object.keys(answers).length!==questions.length} onClick={()=>setSubmitted(true)}>Check my answers <CheckCircle2 size={17}/></button>:<button className="primary-btn full-btn" onClick={()=>{setQuestions([]);setSubmitted(false);setAnswers({})}}>Create another quiz <Plus size={17}/></button>}</div>}</div></div>
  </div>;
}

function HistoryPage({ history }) {
  return <div className="page-content tool-page"><ToolHeader eyebrow="YOUR LEARNING JOURNEY" title="Learning History" subtitle="Look back at the questions and topics you've explored." icon={Clock3}/><div className="history-card">{history.length===0?<div className="empty-state"><div className="empty-icon"><BookOpen size={22}/></div><b>No activity yet</b><p>Use AI Tutor, Study Notes, or Quiz Maker to begin building your learning history.</p></div>:history.map(item=><ActivityRow key={item._id} item={item}/>)}</div></div>;
}

export default function App() {
  const [auth,setAuth]=useState(()=>({token:localStorage.getItem('eduai_token')||'',user:null}));
  const [active,setActive]=useState('dashboard');
  const [history,setHistory]=useState([]);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [loading,setLoading]=useState(Boolean(localStorage.getItem('eduai_token')));
  const [globalError,setGlobalError]=useState('');

  function logout(){localStorage.removeItem('eduai_token');setAuth({token:'',user:null});setHistory([]);setActive('dashboard');}
  function onAuth(data){localStorage.setItem('eduai_token',data.token);setAuth(data);setGlobalError('');}
  async function loadData(token=auth.token){
    try {const [me,hist]=await Promise.all([request('/auth/me',{},token),request('/learning/history',{},token)]);setAuth(prev=>({...prev,token,user:me.user}));setHistory(hist.items||[]);setGlobalError('');}
    catch(err){if(err.message.toLowerCase().includes('session')||err.message.toLowerCase().includes('sign in')||err.message.toLowerCase().includes('account not found'))logout();else setGlobalError(err.message);}
    finally{setLoading(false);}
  }
  useEffect(()=>{if(auth.token)loadData(auth.token);else setLoading(false);},[]);
  async function refreshHistory(){try{const data=await request('/learning/history',{},auth.token);setHistory(data.items||[]);}catch(err){setGlobalError(err.message);}}
  if(loading)return <div className="loading-screen"><div className="brand"><span className="brand-icon"><Brain size={22}/></span>EduAI</div><LoaderCircle className="spin" size={28}/><p>Preparing your learning space...</p></div>;
  if(!auth.token||!auth.user)return <AuthScreen onAuth={data=>{onAuth(data);setLoading(true);loadData(data.token);}}/>;
  return <div className="app-shell">
    <Sidebar active={active} setActive={setActive} user={auth.user} logout={logout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
    <main className="main-area"><header className="topbar"><button className="icon-button mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X size={21}/>:<Menu size={21}/>}</button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><b>{navItems.find(x=>x.id===active)?.label||'Learning History'}</b></div><div className="topbar-right"><span className="online-pill"><span className="status-dot"/> AI READY</span><div className="top-avatar">{auth.user.name.slice(0,1).toUpperCase()}</div></div></header>
      {globalError&&<div className="global-alert"><span>{globalError}</span><button onClick={()=>setGlobalError('')}><X size={15}/></button></div>}
      {active==='dashboard'&&<Dashboard user={auth.user} history={history} setActive={setActive}/>}
      {active==='tutor'&&<TutorPage token={auth.token} onSaved={refreshHistory}/>}
      {active==='notes'&&<NotesPage token={auth.token} onSaved={refreshHistory}/>}
      {active==='quiz'&&<QuizPage token={auth.token} onSaved={refreshHistory}/>}
      {active==='history'&&<HistoryPage history={history}/>}
      <footer className="app-footer"><span>Made for curious minds <span className="footer-heart">✦</span></span><span>EduAI · Learn a little better, every day.</span></footer>
    </main>
  </div>;
}
