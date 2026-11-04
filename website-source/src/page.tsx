import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PageFlip } from "./vendor/page-flip.js";
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CodeXml as Github, List, Moon, Sun, X, Copy, Maximize2, Minimize2 } from "lucide-react";
import { contentSchema, type Content } from "./content-model";
import initialContent from "./resume-content.json";
import { PROJECT_NOTES, SKILL_GROUPS } from "./book-editorial";

const CHAPTERS = [
  { title: "序 · 认识伍星", page: 1, end: 2, color: "#b27347" },
  { title: "一 · 工程工具箱", page: 3, end: 4, color: "#577a6c" },
  { title: "二 · 项目实验室", page: 5, end: 14, color: "#b55e3f" },
  { title: "三 · 走进现场", page: 15, end: 16, color: "#5c7488" },
  { title: "四 · 成长的回响", page: 17, end: 18, color: "#a18b49" },
  { title: "续 · 记录与联系", page: 19, end: 20, color: "#82708b" },
];
const TOTAL = 22;
const pad = (n: number) => String(n).padStart(2, "0");

function StarMap({ cover = false }: { cover?: boolean }) {
  return <svg className={cover ? "star-map cover-map" : "star-map"} viewBox="0 0 400 300" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth=".7" opacity=".35"><ellipse cx="200" cy="145" rx="156" ry="80" transform="rotate(-28 200 145)"/><ellipse cx="200" cy="145" rx="103" ry="120" transform="rotate(35 200 145)"/><circle cx="200" cy="145" r="111" strokeDasharray="2 7"/><path d="M44 145h312M200 22v247"/></g>
    <path d="m78 183 80-91 53 74 80-65 36 97-116-32-39 71-94-54Z" stroke="currentColor" strokeWidth="1.4"/>
    {[[78,183],[158,92],[211,166],[291,101],[327,198],[172,237]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={i===2?6:3.3} fill="currentColor"/><circle cx={x} cy={y} r={i===2?13:8} stroke="currentColor" opacity=".35"/></g>)}
    <path d="m344 47 2-7 2 7 7 2-7 2-2 7-2-7-7-2Z" fill="currentColor"/><text x="29" y="273" fill="currentColor" fontSize="8" letterSpacing="2">MODEL · BUILD · EXPLORE</text><text x="270" y="32" fill="currentColor" fontSize="8" letterSpacing="1">WX / FIELD NOTES</text>
  </svg>;
}

function Diagram({ kind }: { kind: string }) {
  return <svg className={`project-diagram diagram-${kind}`} viewBox="0 0 400 150" fill="none" aria-hidden="true"><defs><pattern id={`grid-${kind}`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".12"/></pattern></defs><rect width="400" height="150" fill={`url(#grid-${kind})`}/>
    {kind === "memory" ? <g stroke="currentColor" strokeWidth="1.5"><rect x="151" y="20" width="98" height="112" rx="18"/><rect x="166" y="35" width="68" height="49" rx="5"/><path d="M180 102h40m-40 6h40M191 57v6m9-11v16m9-12v8M80 76h54m132 0h54"/><circle cx="77" cy="76" r="18"/><circle cx="326" cy="76" r="18"/><path d="M70 76h14m-7-7v14M320 76l5 5 8-10"/><text x="56" y="114">VOICE</text><text x="297" y="114">MEMORY</text></g>
    : kind === "motor" || kind === "pendulum" ? <g stroke="currentColor" strokeWidth="1.5">{kind === "motor" ? <><circle cx="200" cy="76" r="53"/><circle cx="200" cy="76" r="36" strokeDasharray="5 5"/><circle cx="200" cy="76" r="12"/><path d="m200 76 30-25M60 76h70m140 0h70m-280 0 12-7m-12 7 12 7"/><text x="24" y="112">SETPOINT</text><text x="302" y="112">FEEDBACK</text><path d="M82 119v16h228v-16"/></> : <><path d="M60 125h280M170 125v-14h60v14"/><path d="m200 111 32-44-40-29 27-23" strokeWidth="3"/>{[[200,111],[232,67],[192,38],[219,15]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill="var(--page)"/>)}<path d="M90 70c15-45 43-45 60-20M272 39c23 4 33 19 29 36" strokeDasharray="3 4"/><text x="57" y="31">PPO / CONTROL</text></>}</g>
    : kind === "wave" || kind === "field" || kind === "air" ? <g stroke="currentColor" strokeWidth="1.5"><path d="M40 118h320M40 20v98" opacity=".4"/>{[0,1,2].map(i=><path key={i} d={`M45 ${75+i*14} C75 ${-25+i*14} 105 ${175-i*14} 135 ${75+i*8} S195 ${-25+i*16} 225 ${75+i*8} S285 ${175-i*15} 315 ${75+i*4} S345 25 355 70`} opacity={1-i*.25}/>)}<text x="278" y="140">{kind === "wave" ? "SIGNAL / FFT" : kind === "field" ? "EC-FDTD / 18 GHz" : "FLOW / PHASE"}</text></g>
    : kind === "robot" ? <g stroke="currentColor" strokeWidth="1.5"><path d="M48 25h105v27h80V25h118v99H245V95h-89v29H48Z"/><path d="M80 95V60h47v20h140V52h51v43" strokeDasharray="5 5"/>{[[80,95],[127,60],[196,80],[267,52],[318,95]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="6" fill="var(--page)"/><text x={x-3} y={y+3} fontSize="7">{i+1}</text></g>)}<rect x="182" y="65" width="29" height="29" rx="7"/><circle cx="197" cy="79" r="6"/></g>
    : <g stroke="currentColor" strokeWidth="1.4"><rect x="109" y="17" width="182" height="117" rx={kind === "layout" ? 0 : 7}/><rect x="166" y="50" width="68" height="52" rx="3"/>{[0,1,2,3,4].map(i=><g key={i}><path d={`M${174+i*13} 34v16m0 52v16M150 ${57+i*10}h16m68 0h17`}/><circle cx={125+i*37} cy="27" r="2.5"/><circle cx={125+i*37} cy="123" r="2.5"/></g>)}<path d="M70 48h39m182 58h39M138 76h-16v30h37m90-68h28v47h-19"/><text x="181" y="80" fontSize="10">{kind === "board" ? "JETSON" : kind === "layout" ? "RDL" : "STM32"}</text></g>}
  </svg>;
}

function Paper({ number, label, children, className = "" }: { number: number; label: string; children: ReactNode; className?: string }) {
  return <article className={`paper ${className}`} data-number={number} aria-label={`第 ${number} 页：${label}`}><div className="paper-inner"><div className="paper-header"><span>伍星的工程手记</span><span>{label}</span></div><div className="paper-body">{children}</div><footer className="paper-footer"><span>WU XING · PERSONAL ARCHIVE</span><span>{pad(number)}</span></footer></div></article>;
}
function Title({ kicker, children }: { kicker: string; children: ReactNode }) { return <div className="page-title"><span className="eyebrow">{kicker}</span><h2>{children}</h2></div>; }

function BookPages({ content }: { content: Content }) {
  const p = content.profile;
  return <>
    <article className="paper cover front-cover" data-density="hard" aria-label="伍星的工程手记封面"><div className="cover-edge"/><div className="cover-content"><div className="cover-topline"><span>PERSONAL ARCHIVE</span><span>VOL. 01</span></div><div className="cover-title"><span className="cover-small">一本关于探索与创造的</span><h2>工程手记</h2><span className="cover-english">A NOTEBOOK OF<br/>THINGS IN THE MAKING</span></div><StarMap cover/><div className="cover-author"><strong>{p.name}<span>WU XING</span></strong><span>控制工程 · 2027 届</span></div><button className="cover-open" data-action="open">点击打开这本书 <ArrowRight size={17}/></button><span className="cover-bottom">保持好奇，把想法做成真实。</span></div></article>
    <Paper number={1} label="序 / 关于我" className="about-page"><Title kicker="PROLOGUE / HELLO">你好，我是伍星<span className="heading-dot">。</span></Title><div className="portrait-note"><div className="portrait-frame"><img src="/avatar-wuxing.jpg" alt="伍星的照片"/><span>WU XING / 杭州</span></div><div className="portrait-caption"><span className="handwritten">很高兴，<br/>在这里遇见你。</span><span className="tiny-stamp">ENGINEER<br/>IN THE MAKING</span></div></div><p className="intro-lead">用代码连接模型、<br/>硬件与真实问题。</p><p className="body-copy">{p.bio}</p><div className="page-note">{p.role}<br/>{p.location}</div></Paper>
    <Paper number={2} label="序 / 求学历程"><Title kicker="LEARNING JOURNEY">一路学习，一路生长</Title><div className="education-timeline"><section><span className="timeline-dot"/><div className="meta">2024.09 — 2027.06 预计</div><h3>中国计量大学</h3><strong>控制工程 · 工学硕士</strong><p>机电工程学院</p><p>基于分子动力学的复杂系统建模、数值仿真与数据分析。</p><div className="course-note">最优控制 / 数值计算 / 智能控制与仿真 / 图像处理与模式识别</div></section><section><span className="timeline-dot"/><div className="meta">2024.06 毕业</div><h3>怀化学院</h3><strong>电气工程及其自动化 · 工学学士</strong><p>机电工程学院</p><div className="course-note">自动控制原理 / C 语言程序设计 / 单片机原理及应用 / PLC 原理与应用</div></section></div><div className="margin-thought">从理解一个模型，<br/>到让一个系统真正运转。</div></Paper>
    {[0,1].map(n=><Paper key={n} number={3+n} label="一 / 工程工具箱"><Title kicker={`TOOLKIT / ${pad(n+1)}`}>{n===0?"让系统感知与行动":"让想法走向实现"}</Title><div className="skill-groups">{SKILL_GROUPS.slice(n*2,n*2+2).map((g,i)=><section className="skill-group" key={g.name}><span className="skill-number">0{n*2+i+1}</span><h3>{g.name}</h3><div className="skill-tags">{g.items.map(s=><span key={s}>{s}</span>)}</div></section>)}</div><div className="toolkit-illustration"><Diagram kind={n===0?"motor":"pcb"}/></div><p className="small-note">工具是起点，理解问题、完成验证才是目的。</p></Paper>)}
    {content.projects.map((project,i)=>{const note=PROJECT_NOTES[project.id];return <Paper key={project.id} number={5+i} label={`二 / 项目 ${pad(i+1)}`} className="project-page"><div className="project-top"><span className="project-code">EXPERIMENT {pad(i+1)}</span><span>{project.date}</span></div><h2 className="project-title">{note?.shortTitle||project.title}</h2><span className="category-label">{project.category}</span><Diagram kind={note?.visual||"pcb"}/><div className="project-brief"><p><b>问题</b>{note?.challenge||project.summary}</p><p><b>实现</b>{note?.approach||project.body.split("\n\n")[1]}</p><p><b>验证</b>{note?.result||"详见完整项目笔记。"}</p></div><div className="project-bottom"><div className="result-metric"><strong>{note?.metric}</strong><span>{note?.metricLabel}</span></div><button className="paper-link" data-action="project" data-id={project.id}>展开项目笔记 <Maximize2 size={13}/></button></div><div className="project-tags">{project.tags.map(t=><span key={t}>{t}</span>)}</div></Paper>;})}
    {content.experiences.map((exp,i)=><Paper key={exp.id} number={15+i} label="三 / 走进现场"><Title kicker={`IN THE FIELD / ${pad(i+1)}`}>{i===0?"在测试台前，找到答案":"走进真实的电力现场"}</Title><span className="meta">{exp.period} · {exp.type}</span><h3 className="experience-company">{exp.company}</h3><div className="experience-role">{exp.role}</div><div className="field-label">{i===0?"TEST · VERIFY · DOCUMENT":"OBSERVE · MAINTAIN · RECORD"}</div><div className="experience-body">{exp.description.split("\n").map((s,j)=><p key={j}>{s}</p>)}</div><div className="experience-footnote"><span>{i===0?"32":"02"}</span><p>{i===0?<>款无线充电产品<br/>独立测试与归档</>:<>从日常巡视<br/>认识工程运维</>}</p></div></Paper>)}
    {[0,1].map(n=><Paper key={n} number={17+n} label="四 / 成长的回响"><Title kicker={`MILESTONES / ${pad(n+1)}`}>{n===0?"每一次投入，都有回响":"把积累，写进时间"}</Title><div className="award-list">{content.awards.slice(n===0?0:3,n===0?3:7).map((a,i)=><section key={a.id} className="award-item"><div className="award-top"><span className="award-index">{pad((n===0?0:3)+i+1)}</span><span>{a.date||"学业奖学金"}</span></div><h3>{a.title}</h3><p>{a.issuer}</p>{a.description&&<p className="award-detail">{a.description}</p>}</section>)}</div><span className="award-seal">KEEP<br/>GROWING</span></Paper>)}
    <Paper number={19} label="续 / 记录"><Title kicker="THE UNFINISHED PAGES">留一些页，给正在发生</Title><div className="now-block"><span className="live-dot"/> 正在探索<p>{p.now}</p></div>{content.posts.length?<div className="post-list">{content.posts.map(post=><button key={post.id} data-action="post" data-id={post.id}><small>{post.date} / {post.category}</small><h3>{post.title}</h3><p>{post.summary}</p><span>阅读记录 ↗</span></button>)}</div>:<div className="blank-notes"><span>NOTES TO SELF</span><p>实验里的发现，<br/>代码之外的生活，<br/>以及还没想明白的问题。</p><em>第一篇记录，正在路上。</em></div>}<div className="life-tags"><span>篮球</span><span>户外</span><span>AI 辅助编程</span></div></Paper>
    <Paper number={20} label="续 / 联系"><Title kicker="LET’S MAKE SOMETHING">下一页，<br/>也许与你有关</Title><StarMap/><p className="contact-intro">如果你也关注嵌入式系统、运动控制、硬件研发或科学计算，欢迎交流。</p><a className="contact-line" href={`mailto:${p.email}`}><span>EMAIL</span><strong>{p.email}</strong><ArrowRight size={15}/></a><a className="contact-line" href={p.github} target="_blank" rel="noreferrer"><span>GITHUB</span><strong>github.com/conan-wx</strong><ArrowRight size={15}/></a><button className="paper-link contact-copy" data-action="copy">复制邮箱 <Copy size={13}/></button><div className="contact-signature">伍星 <span>期待一次有趣的连接。</span></div></Paper>
    <article className="paper cover back-cover" data-density="hard" aria-label="伍星的工程手记封底"><div className="cover-content"><span className="cover-topline">THE STORY CONTINUES</span><StarMap cover/><div className="back-quote">好奇心不设终点。<br/>下一页，继续创造。</div><button data-page="0" className="cover-open"><ArrowLeft size={16}/> 回到封面</button><div className="back-colophon">WU XING / PERSONAL ARCHIVE<br/>DESIGNED TO BE EXPLORED.</div></div></article>
  </>;
}

export default function HomePage() {
  const [content,setContent]=useState<Content>(initialContent);
  const [page,setPage]=useState(0);
  const [orientation,setOrientation]=useState("landscape");
  const [mode,setMode]=useState<"book"|"read">("book");
  const [night,setNight]=useState(false);
  const [reduced,setReduced]=useState(false);
  const [toc,setToc]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [compact,setCompact]=useState(()=>window.matchMedia("(max-width: 650px)").matches);
  const [narrow,setNarrow]=useState(()=>window.matchMedia("(max-width: 360px)").matches);
  const [selected,setSelected]=useState<{title:string;subtitle:string;body:string;tags:string[]}|null>(null);
  const [copied,setCopied]=useState(false);
  const mount=useRef<HTMLDivElement>(null);
  const flip=useRef<PageFlip|null>(null);
  const current=useRef(0);
  const modeRef=useRef<"book"|"read">("book");
  const modal=useRef<HTMLDialogElement>(null);
  const tocModal=useRef<HTMLDialogElement>(null);
  const closeButton=useRef<HTMLButtonElement>(null);
  const originFocus=useRef<HTMLElement|null>(null);
  const markup=useMemo(()=>renderToStaticMarkup(<BookPages content={content}/>),[content]);
  const pageMarkup=useMemo(()=>markup.match(/<article[\s\S]*?<\/article>/g)||[],[markup]);
  useEffect(()=>{
    const abort=new AbortController();
    fetch("/site-content.json",{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error("content");return r.json();}).then(data=>{const valid=contentSchema.safeParse(data.content);if(valid.success){const published={...valid.data,posts:valid.data.posts.filter(post=>post.status==="published")};setContent(previous=>JSON.stringify(previous)===JSON.stringify(published)?previous:published);}}).catch(()=>{});
    try{setNight(localStorage.getItem("wuxing-paper-theme")==="night");}catch{}
    const preference=window.matchMedia("(prefers-reduced-motion: reduce)");setReduced(preference.matches);
    const change=()=>setReduced(preference.matches);preference.addEventListener("change",change);
    const mobile=window.matchMedia("(max-width: 650px)"),small=window.matchMedia("(max-width: 360px)");const resize=()=>{setCompact(mobile.matches);setNarrow(small.matches);};mobile.addEventListener("change",resize);small.addEventListener("change",resize);
    return()=>{abort.abort();preference.removeEventListener("change",change);mobile.removeEventListener("change",resize);small.removeEventListener("change",resize);};
  },[]);
  useEffect(()=>{
    if(mode!=="book"||!mount.current)return;
    const host=document.createElement("div");host.className="flipbook";host.innerHTML=markup;mount.current.replaceChildren(host);
    const engine=new PageFlip(host,{width:470,height:compact?(narrow?1050:820):670,size:"stretch",minWidth:compact?260:300,maxWidth:500,minHeight:370,maxHeight:900,showCover:true,usePortrait:true,autoSize:true,drawShadow:true,maxShadowOpacity:.28,flippingTime:reduced?1:850,mobileScrollSupport:true,useMouseEvents:true,showPageCorners:!reduced,disableFlipByClick:true,clickEventForward:true,startPage:current.current});
    flip.current=engine;
    const update=(index:number)=>{current.current=index;setPage(index);};
    engine.on("flip",e=>update(Number(e.data)));engine.on("changeOrientation",e=>setOrientation(String(e.data)));
    engine.on("init",()=>{setOrientation(engine.getOrientation());update(engine.getCurrentPageIndex());});
    engine.loadFromHTML(host.querySelectorAll<HTMLElement>(".paper"));
    return()=>{flip.current=null;engine.destroy();};
  },[markup,mode,reduced,compact,narrow]);
  useEffect(()=>{if(!toc||!tocModal.current)return;const previous=document.activeElement as HTMLElement;tocModal.current.showModal();return()=>previous?.focus();},[toc]);
  useEffect(()=>{
    if(mode==="book"){flip.current?.update();flip.current?.turnToPage(current.current);return;}
    const start=requestAnimationFrame(()=>document.getElementById(`read-page-${current.current}`)?.scrollIntoView({behavior:"instant",block:"start"}));
    let pending=0;
    const track=()=>{cancelAnimationFrame(pending);pending=requestAnimationFrame(()=>{if(modeRef.current!=="read")return;const pages=Array.from(document.querySelectorAll<HTMLElement>(".flow-page"));let nearest=0,distance=Infinity;pages.forEach((element,index)=>{const delta=Math.abs(element.getBoundingClientRect().top-80);if(delta<distance){distance=delta;nearest=index;}});current.current=nearest;setPage(nearest);});};
    window.addEventListener("scroll",track,{passive:true});return()=>{cancelAnimationFrame(start);cancelAnimationFrame(pending);window.removeEventListener("scroll",track);};
  },[mode]);
  useEffect(()=>{if(!selected||!modal.current)return;originFocus.current=document.activeElement as HTMLElement;modal.current.showModal();closeButton.current?.focus();return()=>originFocus.current?.focus();},[selected]);
  const changeMode=(nextMode:"book"|"read")=>{
    if(modeRef.current==="read"&&nextMode==="book"){let best=-1,index=current.current;document.querySelectorAll<HTMLElement>(".flow-page").forEach((element,i)=>{const rect=element.getBoundingClientRect();const amount=Math.max(0,Math.min(rect.bottom,window.innerHeight)-Math.max(rect.top,70));if(amount>best){best=amount;index=i;}});current.current=index;}
    modeRef.current=nextMode;setMode(nextMode);
  };
  const closeDetail=()=>{modal.current?.close();setSelected(null);};
  const jump=(index:number)=>{current.current=index;if(mode==="read"){setPage(index);document.getElementById(`read-page-${index}`)?.scrollIntoView({behavior:reduced?"instant":"smooth",block:"start"});}else if(reduced)flip.current?.turnToPage(index);else flip.current?.flip(index,"bottom");setToc(false);};
  const next=()=>{if(current.current>=TOTAL-1)return;if(reduced)flip.current?.turnToNextPage();else flip.current?.flipNext("bottom");};
  const prev=()=>{if(current.current<=0)return;if(reduced)flip.current?.turnToPrevPage();else flip.current?.flipPrev("bottom");};
  const copyEmail=async()=>{try{await navigator.clipboard.writeText(content.profile.email);setCopied(true);window.setTimeout(()=>setCopied(false),2000);}catch{setSelected({title:"联系伍星",subtitle:"复制下方邮箱",body:content.profile.email,tags:[]});}};
  const delegate=(event:React.MouseEvent)=>{const target=(event.target as HTMLElement).closest<HTMLElement>("[data-action], [data-page]");if(!target)return;if(target.dataset.page!==undefined){jump(Number(target.dataset.page));return;}const action=target.dataset.action;if(action==="open"){next();return;}if(action==="copy"){void copyEmail();return;}const item=action==="project"?content.projects.find(x=>x.id===target.dataset.id):content.posts.find(x=>x.id===target.dataset.id);if(item)setSelected({title:item.title,subtitle:`${item.category} / ${item.date}`,body:item.body,tags:item.tags});};
  const currentChapter=CHAPTERS.find(c=>page>=c.page&&page<=c.end);
  const visiblePages=orientation==="landscape"&&page>0&&page<TOTAL-1?`${pad(page)} — ${pad(Math.min(page+1,20))}`:page===0?"封面":page===21?"封底":pad(page);
  return <div className={`app ${night?"night":""} ${expanded?"expanded":""}`}>
    <header className="site-header"><a href="#" className="brand" onClick={e=>{e.preventDefault();jump(0);}} aria-label="伍星的工程手记，回到封面"><span className="brand-monogram">伍</span><span>伍星的工程手记<small>THE NOTEBOOK OF WU XING</small></span></a><div className="header-actions"><a className="github-link" aria-label="GitHub" href={content.profile.github} target="_blank" rel="noreferrer"><Github size={16}/><span>GitHub</span></a><span className="header-divider"/><button className="icon-button" onClick={()=>{setNight(!night);try{localStorage.setItem("wuxing-paper-theme",!night?"night":"paper");}catch{}}} aria-label={night?"切换日间纸色":"切换夜间纸色"}>{night?<Sun size={18}/>:<Moon size={18}/>}</button><button className="icon-button expand-button" onClick={()=>setExpanded(!expanded)} aria-label={expanded?"退出专注阅读":"专注阅读"}>{expanded?<Minimize2 size={18}/>:<Maximize2 size={18}/>}</button></div></header>
    <main><section className="desktop-heading"><div><span className="eyebrow">A PERSONAL ARCHIVE, BOUND WITH CURIOSITY</span><h1>人生不是简历，<span>是一本还在写的书。</span></h1></div><p>模型、代码与电路，<br/>还有沿途的每一次探索。</p></section>
    <div className="workspace-toolbar"><button className={`toc-toggle ${toc?"active":""}`} onClick={()=>setToc(!toc)} aria-expanded={toc} aria-controls="contents"><List size={16}/> 全书目录 <span>6 CHAPTERS</span></button><div className="view-switch" aria-label="阅读方式"><button aria-pressed={mode==="book"} onClick={()=>changeMode("book")}><BookOpen size={15}/> 翻书</button><button aria-pressed={mode==="read"} onClick={()=>changeMode("read")}><ArrowDown size={15}/> 连续阅读</button></div></div>
    <section className={`reading-desk ${mode==="read"?"reading-flow":""}`} aria-label="工程手记阅读区域">{mode==="book"?<><div className={`book-stage ${page===0?"is-front":page===21?"is-back":"is-open"} ${orientation}`}><div className="book-mount" ref={mount} onClick={delegate} onKeyDown={e=>{if(selected)return;if(e.key==="ArrowRight"){e.preventDefault();next();}if(e.key==="ArrowLeft"){e.preventDefault();prev();}if(e.key==="Home"){e.preventDefault();jump(0);}if(e.key==="End"){e.preventDefault();jump(21);}}} tabIndex={0} aria-label="翻页书。可使用左右方向键翻页，或拖动纸页外侧边角。"/></div><nav className="chapter-ribbons" aria-label="章节书签">{CHAPTERS.map((c,i)=><button key={c.page} className={currentChapter===c?"selected":""} style={{"--ribbon":c.color} as CSSProperties} onClick={()=>jump(c.page)} aria-label={`跳到${c.title}`}><span>{pad(i+1)}</span><strong>{c.title.split(" · ")[1]}</strong></button>)}</nav></>:<div className="flow-pages" onClick={delegate}>{pageMarkup.map((html,i)=><div className="flow-page" id={`read-page-${i}`} key={i} dangerouslySetInnerHTML={{__html:html}}/>)}</div>}</section>
    {mode==="book"&&<div className="reader-controls"><button onClick={prev} disabled={page===0} aria-label="上一页"><ArrowLeft size={18}/><span>上一页</span></button><div className="reader-position"><span aria-live="polite">{visiblePages} <i>/</i> 20 页</span><div className="page-progress"><span style={{width:`${page/(TOTAL-1)*100}%`}}/></div></div><button onClick={next} disabled={page===TOTAL-1} aria-label={page===0?"打开手记":"下一页"}><span>{page===0?"打开手记":"下一页"}</span><ArrowRight size={18}/></button></div>}
    <div className="desk-caption"><span><span className="caption-dot"/> {mode==="book"?"拖动页角 / 左右方向键 / 手机左右轻扫":"静下心，慢慢读"}</span><span>一份真实的经历，一本未完的手记。</span></div></main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} 伍星</span><span>保持好奇 · 持续创造</span><a href={`mailto:${content.profile.email}`}>聊聊新想法 <ChevronRight size={12}/></a></footer>
    {toc&&<dialog ref={tocModal} className="toc-dialog" aria-label="全书目录" onCancel={e=>{e.preventDefault();setToc(false);}} onClick={e=>{if(e.target===e.currentTarget)setToc(false);}}><aside className="toc-panel" id="contents" aria-label="全书目录" onClick={e=>e.stopPropagation()}><div className="toc-panel-top"><div><span className="eyebrow">TABLE OF CONTENTS</span><h2>从哪一页开始？</h2></div><button className="icon-button" onClick={()=>setToc(false)} aria-label="关闭目录"><X size={20}/></button></div><button className="toc-cover" onClick={()=>jump(0)}>回到封面 <ArrowRight size={14}/></button>{CHAPTERS.map((c,i)=><div className="toc-chapter" key={c.page}><button onClick={()=>jump(c.page)}><span style={{color:c.color}}>{pad(i+1)}</span><strong>{c.title}</strong><small>{pad(c.page)} — {pad(c.end)}</small></button>{i===2&&<div className="toc-projects">{content.projects.map((p,j)=><button key={p.id} onClick={()=>jump(5+j)}>{PROJECT_NOTES[p.id]?.shortTitle||p.title}<span>{pad(5+j)}</span></button>)}</div>}</div>)}<p className="toc-note">这本书有 {content.projects.length} 个项目、{content.experiences.length} 段实习和 {content.awards.length} 项荣誉。<br/>翻阅方式，由你决定。</p></aside></dialog>}
    {selected&&<dialog ref={modal} className="detail-dialog" aria-labelledby="detail-title" onCancel={e=>{e.preventDefault();closeDetail();}} onClick={e=>{if(e.target===e.currentTarget)closeDetail();}}><div className="detail-sheet"><div className="detail-toolbar"><span>FIELD NOTES / 完整记录</span><button ref={closeButton} className="icon-button" onClick={closeDetail} aria-label="关闭详情"><X size={22}/></button></div><span className="eyebrow">{selected.subtitle}</span><h2 id="detail-title">{selected.title}</h2><div className="detail-tags">{selected.tags.map(t=><span key={t}>{t}</span>)}</div><div className="detail-body">{selected.body.split(/\n\s*\n/).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div><button className="detail-close" onClick={closeDetail}>合上笔记，继续翻阅 <ArrowRight size={16}/></button></div></dialog>}
    {copied&&<div className="toast" role="status"><Check size={16}/> 邮箱已复制</div>}
  </div>;
}
