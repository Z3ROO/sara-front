import { useEffect, useRef, useState } from 'react';
import * as NotesAPI from '../NotesAPI';

export function HandyNoteWidget() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (textareaRef.current) {
      (async () => {
        const note = await NotesAPI.getHandyNote();
        setNoteContent(note||'');
      })();
    }
  },[textareaRef.current]);

  return (
    <>
      <h6>Handy Notes</h6>
      <textarea
        ref={textareaRef} 
        value={noteContent} 
        onChange={e => setNoteContent(e.target.value)} 
        className="resize w- min-h-[16rem] min-w-[14rem] p-1"
        onBlur={(e) => {NotesAPI.updateHandyNote(e.target.value)}}
      />
    </>
  )
}