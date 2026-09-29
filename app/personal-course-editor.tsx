'use client';
import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { ArrowDown, Check, ChevronDown, LoaderCircle, MapPin, Plus, Search, Undo2, X } from 'lucide-react';
import { useCourseOrder, type EditorIntent } from './course-order';
import { useCourseAccount } from './course-account';
import { useSupplementary } from './supplementary-videos';
import { learningSections } from './learning-sections';
import { existingVideoId, relatedVideoIds, savedPlacement, type CourseEdit, type Placement } from './personal-course-model';
import { youtubeId } from './supplementary-model';

export function PersonalCourseEditor() {
  const editor = useCourseOrder();
  const { user } = useCourseAccount();
  if (!user) return null;
  return <>
    {editor.intent && <EditorDialog key={JSON.stringify(editor.intent)} intent={editor.intent}/>}
    {!editor.intent && (editor.notice || editor.error) && <div className={`personal-course-notice ${editor.error ? 'has-error' : ''}`}>
      <span role={editor.error ? 'alert' : 'status'}>{editor.error || editor.notice}</span>
      {editor.error ? <button type="button" disabled={editor.busy} onClick={() => void editor.refresh()}>Refresh</button> : editor.canUndo && <button type="button" disabled={editor.busy} onClick={() => void editor.undo()}><Undo2 size={14}/>Undo</button>}
      {!editor.error && <button type="button" aria-label="Dismiss course message" onClick={editor.dismissNotice}><X size={15}/></button>}
    </div>}
  </>;
}

function EditorDialog({ intent }: { intent: EditorIntent }) {
  const editor = useCourseOrder();
  const supplementary = useSupplementary();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const original = 'id' in intent ? editor.videos.find(v => v.id === intent.id) : undefined;
  const sourceRow = 'id' in intent ? editor.byId.get(intent.id) : undefined;
  const sourcePlacement = 'id' in intent ? savedPlacement(editor.state, intent.id) : null;
  const [placement, setPlacement] = useState<Placement>(intent.type === 'add' ? intent : ('destination' in intent ? intent.destination : null) ?? sourcePlacement ?? { sectionId: learningSections[0].id, beforeId: null });
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState(original?.title ?? '');
  const [instructor, setInstructor] = useState(original?.instructor ?? '');
  const [showDetails, setShowDetails] = useState(intent.type === 'edit');
  const [showLocation, setShowLocation] = useState(intent.type === 'move' || intent.type === 'restore');
  const [withSupporting, setWithSupporting] = useState(false);
  const [metadata, setMetadata] = useState('');
  const [lookup, setLookup] = useState(0);
  const [metadataBusy, setMetadataBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [archiveSearch, setArchiveSearch] = useState('');
  const [reviewedRevision, setReviewedRevision] = useState(editor.state.revision);
  const touched = useRef({ title: false, instructor: false });
  const videoId = youtubeId(url);
  const duplicateId = intent.type === 'add' ? existingVideoId(editor.state, url) : undefined;
  const duplicate = editor.videos.find(v => v.id === duplicateId);
  const related = 'id' in intent ? relatedVideoIds(editor.state, intent.id) : [];
  const excluded = 'id' in intent ? [intent.id, ...(withSupporting ? related : [])] : [];
  const candidates = (editor.rows[placement.sectionId] ?? []).filter(row => !excluded.includes(row.id));
  const validPosition = placement.beforeId === null || candidates.some(row => row.id === placement.beforeId);
  const before = candidates.find(row => row.id === placement.beforeId);
  const label = intent.type === 'add' ? 'Add a video' : intent.type === 'move' ? 'Move video' : intent.type === 'restore' ? 'Restore video' : intent.type === 'edit' ? 'Edit video details' : 'Archived videos';
  const close = () => { if (!editor.busy) editor.openEditor(null); };
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; element.showModal();
    return () => { element.close(); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => {
    if (intent.type !== 'add' || !videoId) return;
    const abort = new AbortController();
    const timer = window.setTimeout(async () => {
      setMetadataBusy(true); setMetadata('Looking up video details…');
      try {
        const response = await fetch(`/api/supplementary/metadata?url=${encodeURIComponent(url)}`, { signal: abort.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (abort.signal.aborted) return;
        if (!touched.current.title) setTitle(data.title);
        if (!touched.current.instructor) setInstructor(data.instructor);
        setMetadata('Details found. You can edit them below.');
      } catch (error) {
        if (!abort.signal.aborted) { setMetadata(error instanceof Error ? error.message : 'Enter the video details below.'); setShowDetails(true); }
      } finally { if (!abort.signal.aborted) setMetadataBusy(false); }
    }, 400);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [url, videoId, intent.type, lookup]);

  function watch(id: string) {
    const video = editor.videos.find(v => v.id === id);
    close();
    if (video && !video.archived) supplementary?.open(video);
    else window.dispatchEvent(new CustomEvent('personal-course-watch', { detail: { id } }));
  }
  async function submit() {
    if (editor.busy || !editor.ready) return;
    if (reviewedRevision !== editor.state.revision) { setReviewedRevision(editor.state.revision); setFormError('Your course has updated. Check the destination shown below, then save again.'); return; }
    if (intent.type !== 'edit' && !validPosition) { setFormError('Choose a new position; the previous destination has moved.'); setShowLocation(true); return; }
    let edit: CourseEdit;
    if (intent.type === 'add') edit = { type: 'add', url, title, instructor, ...placement };
    else if (intent.type === 'move') edit = { type: 'move', id: intent.id, ...placement, withSupporting };
    else if (intent.type === 'restore') edit = { type: 'restore', id: intent.id, ...placement };
    else if (intent.type === 'edit') edit = { type: 'edit', id: intent.id, title, instructor };
    else return;
    setFormError('');
    const result = await editor.commit(edit);
    if (!result.ok) { setFormError(result.error ?? 'The change could not be saved. Please retry.'); setReviewedRevision(result.state?.revision ?? editor.state.revision); return; }
    if (intent.type === 'add') setSavedId(`personal-${result.operationId}`);
    else close();
  }
  return <dialog ref={dialog} className="personal-course-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); close(); }}>
    <header className="course-editor-heading"><div><span>Only your course changes</span><h2 id={titleId}>{savedId ? 'Video added' : label}</h2></div><button type="button" className="editor-close" aria-label="Close course editor" disabled={editor.busy} onClick={close}><X size={19}/></button></header>
    {savedId ? <div className="editor-success"><Check size={24}/><h3>{title}</h3><p>Added to {editor.label(placement.sectionId)}.</p><p>Your current video is still in place.</p><div className="editor-footer"><button type="button" className="editor-secondary" onClick={() => { setSavedId(null); setUrl(''); setTitle(''); setInstructor(''); setMetadata(''); setFormError(''); setReviewedRevision(editor.state.revision); touched.current = { title: false, instructor: false }; }}>Add another</button><button type="button" className="editor-primary" onClick={() => watch(savedId)}>Watch now</button></div></div>
      : intent.type === 'archive' ? <div className="editor-archive"><p>Archived videos keep their notes and progress. Restore one to any section.</p><label className="editor-search"><Search size={16}/><input aria-label="Search archived videos" placeholder="Find an archived video" value={archiveSearch} onChange={event => setArchiveSearch(event.target.value)}/></label><ul>{editor.videos.filter(v => v.archived && v.title.toLowerCase().includes(archiveSearch.toLowerCase())).map(video => <li key={video.id}><span>{video.title}</span><button type="button" onClick={() => editor.openEditor({ type: 'restore', id: video.id })}>Restore…</button></li>)}</ul>{!editor.videos.some(v => v.archived && v.title.toLowerCase().includes(archiveSearch.toLowerCase())) && <p className="editor-empty">{archiveSearch ? 'No archived videos match your search.' : 'No archived videos yet.'}</p>}</div>
      : <form onSubmit={event => { event.preventDefault(); void submit(); }}><fieldset className="editor-form-fields" disabled={editor.busy}>
        {intent.type === 'add' && <>
          <label className="editor-field">YouTube link<input autoFocus type="url" required value={url} placeholder="Paste a YouTube video link" onChange={event => { setUrl(event.target.value.trim()); setTitle(''); setInstructor(''); setMetadata(''); setMetadataBusy(false); setFormError(''); touched.current = { title: false, instructor: false }; }}/></label>
          {url && !videoId && <p className="editor-help">Use a YouTube watch, share, Shorts, or live-video link.</p>}
          {videoId && <div className="editor-video-preview">
            {/* The thumbnail host and validated video ID are fixed, never supplied HTML. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} alt="" width="112" height="63"/>
            <div><strong>{title || 'Your video'}</strong><small>{instructor || 'YouTube'}</small></div>
          </div>}
          <div className="editor-metadata"><span role="status">{metadataBusy && <LoaderCircle size={13}/>} {metadata}</span>{videoId && <button type="button" onClick={() => setLookup(value => value + 1)}>Retry lookup</button>}</div>
          {duplicateId && <div className="editor-duplicate" role="status"><strong>{duplicate?.archived ? 'This video is in your archive.' : 'This video is already in your course.'}</strong><div>{!duplicate?.archived && <button type="button" onClick={() => watch(duplicateId)}>Go to video</button>}<button type="button" onClick={() => editor.openEditor({ type: duplicate?.archived ? 'restore' : 'move', id: duplicateId })}>{duplicate?.archived ? 'Restore video…' : 'Move existing video…'}</button></div></div>}
          <button type="button" className="editor-text-action" aria-expanded={showDetails} onClick={() => setShowDetails(value => !value)}>Edit details <ChevronDown size={14}/></button>
        </>}
        {(intent.type === 'edit' || intent.type === 'add' && showDetails) && <div className="editor-details"><label className="editor-field">Video title<input required maxLength={240} value={title} onChange={event => { touched.current.title = true; setTitle(event.target.value); }}/></label><label className="editor-field">Instructor / channel<input maxLength={160} value={instructor} onChange={event => { touched.current.instructor = true; setInstructor(event.target.value); }}/></label></div>}
        {(intent.type === 'move' || intent.type === 'restore') && <div className="editor-moving-title"><strong>{sourceRow?.title ?? original?.title}</strong><div className="editor-source-location"><span className="editor-location-caption">Current location</span><LocationDetails sectionId={sourcePlacement!.sectionId}/></div></div>}
        {intent.type !== 'edit' && <>
          <div className="editor-location-summary"><MapPin size={16}/><div><span className="editor-location-caption">{intent.type === 'add' ? 'Add to' : intent.type === 'restore' ? 'Restore to' : 'Move to'}</span><LocationDetails sectionId={placement.sectionId}/><small>Position: {!validPosition ? 'Choose a new position' : before ? `Before Lesson ${String(before.displayNumber).padStart(2, '0')} — ${before.title}` : candidates.length ? 'At the end of this section' : 'First video in this section'}</small></div><button type="button" aria-expanded={showLocation} onClick={() => setShowLocation(value => !value)}>{showLocation ? 'Hide' : 'Change location'}</button></div>
          {intent.type === 'move' && related.length > 0 && <div className="editor-related"><label><input type="checkbox" checked={withSupporting} onChange={event => { setWithSupporting(event.target.checked); setPlacement(value => ({ ...value, beforeId: null })); }}/>Move with {related.length} supporting {related.length === 1 ? 'video' : 'videos'}</label>{withSupporting && <ul>{related.map(id => <li key={id}>{editor.videos.find(video => video.id === id)?.title}{editor.videos.find(video => video.id === id)?.archived ? ' (archived)' : ''}</li>)}</ul>}</div>}
          {showLocation && <PlacementPicker value={placement} onChange={setPlacement} excluded={excluded} movingTitle={title || sourceRow?.title || 'Your video'}/>}
        </>}
        {(formError || editor.error) && <p className="editor-error" role="alert">{formError || editor.error}</p>}
        {!editor.ready && <p className="editor-help" role="status">{editor.error ? 'Load your saved course before editing.' : 'Loading your course…'} <button type="button" onClick={() => void editor.refresh()}>Retry</button></p>}
        </fieldset><footer className="editor-footer"><button type="button" className="editor-secondary" disabled={editor.busy} onClick={close}>Cancel</button><button className="editor-primary" type="submit" disabled={editor.busy || !editor.ready || Boolean(duplicateId) || (intent.type === 'add' && (!videoId || !title.trim())) || !validPosition}>{editor.busy ? 'Saving…' : intent.type === 'add' ? 'Add to my course' : intent.type === 'move' ? 'Move video' : intent.type === 'restore' ? 'Restore video' : 'Save details'}</button></footer>
      </form>}
  </dialog>;
}

function LocationDetails({ sectionId }: { sectionId: string }) {
  const editor = useCourseOrder();
  const section = learningSections.find(item => item.id === sectionId)!;
  const courseModule = editor.course.modules.find(item => item.id === section.moduleId)!;
  return <span className="editor-location-details"><span>Pathway: {courseModule.path === 'Professional' ? 'Advanced' : courseModule.path}</span><strong>Module {String(courseModule.number).padStart(2, '0')} — {courseModule.title}</strong><span>Section {String(section.number).padStart(2, '0')} — {section.title}</span></span>;
}

function PlacementPicker({ value, onChange, excluded, movingTitle }: { value: Placement; onChange: (value: Placement) => void; excluded: string[]; movingTitle: string }) {
  const editor = useCourseOrder();
  const [query, setQuery] = useState('');
  const [path, setPath] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [browse, setBrowse] = useState(false);
  const radioName = useId();
  const results = learningSections.filter(section => {
    const courseModule = editor.course.modules.find(m => m.id === section.moduleId)!;
    return (!path || courseModule.path === path) && (!moduleId || section.moduleId === moduleId) && editor.label(section.id).toLowerCase().includes(query.toLowerCase());
  });
  const rows = (editor.rows[value.sectionId] ?? []).filter(row => !excluded.includes(row.id));
  const selectedSection = learningSections.find(s => s.id === value.sectionId)!;
  const preceding = learningSections.filter(s => s.moduleId === selectedSection.moduleId).slice(0, learningSections.filter(s => s.moduleId === selectedSection.moduleId).findIndex(s => s.id === value.sectionId)).reduce((sum, s) => sum + (editor.rows[s.id] ?? []).filter(row => !excluded.includes(row.id)).length, 0);
  const chosenIndex = value.beforeId === null ? rows.length : rows.findIndex(row => row.id === value.beforeId);
  const visibleMovingCount = Math.max(1, excluded.filter(id => editor.byId.has(id)).length);
  return <section className="editor-placement" aria-label="Choose video placement">
    <label className="editor-search"><Search size={16}/><input aria-label="Find a destination section" placeholder="Find a module or section…" value={query} onChange={event => { setQuery(event.target.value); setModuleId(''); setPath(''); setBrowse(true); }}/></label>
    <button className="editor-text-action" type="button" aria-expanded={browse} onClick={() => setBrowse(value => !value)}>Browse pathways and modules <ChevronDown size={14}/></button>
    {browse && <><div className="editor-browse-filters"><label>Pathway<select value={path} onChange={event => { setPath(event.target.value); setModuleId(''); }}><option value="">All pathways</option><option>C2</option><option>C1</option><option value="Professional">Advanced</option></select></label><label>Module<select value={moduleId} onChange={event => setModuleId(event.target.value)}><option value="">All modules</option>{editor.course.modules.filter(m => !path || m.path === path).map(m => <option key={m.id} value={m.id}>Module {String(m.number).padStart(2, '0')} — {m.title}</option>)}</select></label></div>
      <div className="editor-section-results" aria-label="Destination sections">{results.map(section => <button type="button" key={section.id} aria-pressed={value.sectionId === section.id} onClick={() => { onChange({ sectionId: section.id, beforeId: null }); setBrowse(false); setQuery(''); }}><span><LocationDetails sectionId={section.id}/></span>{value.sectionId === section.id && <Check size={15}/>}</button>)}{results.length === 0 && <p>No sections match. Try a shorter search or another pathway.</p>}</div></>}
    <div className="editor-position-heading"><strong>Choose the exact position</strong><span>{rows.length} {rows.length === 1 ? 'video' : 'videos'}</span></div>
    <div className="editor-position-list" role="radiogroup" aria-label="Video position">
      {Array.from({ length: rows.length + 1 }, (_, index) => {
        const beforeId = rows[index]?.id ?? null;
        const selected = value.beforeId === beforeId;
        const positionLabel = index === 0 ? 'At the beginning' : index === rows.length ? 'At the end' : `Before ${rows[index].title}`;
        return <Fragment key={beforeId ?? 'end'}><label className={`editor-insertion ${selected ? 'selected' : ''}`}><input name={radioName} type="radio" checked={selected} value={beforeId ?? ''} aria-label={positionLabel} onChange={() => onChange({ sectionId: value.sectionId, beforeId })}/>{selected ? <><ArrowDown size={13}/><span>L{String(preceding + index + 1).padStart(2, '0')} · {movingTitle}</span></> : <><Plus size={12}/><span>{index === 0 ? 'Place at beginning' : index === rows.length ? 'Place at end' : 'Place here'}</span></>}</label>{rows[index] && <div className="editor-position-row"><small>L{String(preceding + index + 1 + (chosenIndex >= 0 && index >= chosenIndex ? visibleMovingCount : 0)).padStart(2, '0')}</small><span>{rows[index].title}</span></div>}</Fragment>;
      })}
    </div>
  </section>;
}
