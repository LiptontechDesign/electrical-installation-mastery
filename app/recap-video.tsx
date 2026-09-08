'use client';
import {useRef} from 'react';
import {X,ExternalLink} from 'lucide-react';
import {useDialogFocus} from './use-dialog-focus';
import type {RecapChapter} from './module-recaps';

export default function RecapVideo({lesson,onClose}:{lesson:RecapChapter['lessons'][number];onClose:()=>void}){
 const dialog=useRef<HTMLElement>(null);
 useDialogFocus(dialog,true);
 const videoId=new URL(lesson.url).searchParams.get('v');
 return <section ref={dialog} className="recap-video-overlay" role="dialog" aria-modal="true" aria-labelledby="recap-video-title" onKeyDown={event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();onClose();}}}>
  <div className="recap-video-window">
   <header><div><span className="recap-kicker">Source lesson · Watch here</span><h2 id="recap-video-title">{lesson.title}</h2></div><button type="button" onClick={onClose} aria-label="Close source video"><X/></button></header>
   {videoId&&/^[\w-]{11}$/.test(videoId)?<iframe key={lesson.id} src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<p>This source cannot be embedded. Use the source link below.</p>}
   <footer><p>Close the player to return to the same recap page. Previewing here does not change lesson completion.</p><a href={lesson.url} target="_blank" rel="noopener noreferrer">Open on YouTube if playback is unavailable <ExternalLink size={16}/></a></footer>
  </div>
 </section>;
}
