import mdParser, { Editor } from "@z3ro/mdparser";
import { marked } from "marked";
import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "../../../lib/Router/RouterHooks";
import { DefaultProps } from "../../_general/types";
import { useNotesController } from "../NotesStateController";

export function DocumentEditor() {
  const controller = useNotesController()!;
  const { getMarkdownFileContent } = controller;
  const {path} = useLocation()!
  const [openedPage, setOpenedPage] = useState<any>({});
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isDocumentSaved, setIsDocumentSaved] = useState<boolean>(true);
  const editorNodeRef = useRef<HTMLPreElement|null>(null);
  const viewerNodeRef = useRef<HTMLPreElement|null>(null);

  useEffect(()=> {
    (async function() {
      const content = await getMarkdownFileContent(path);
      setOpenedPage(content);
    })().catch(err => {
      throw err;
    });
  },[path]);
  
  useEffect(()=>{
    if (editorNodeRef.current) {
      editorNodeRef.current.innerHTML = mdParser.parse(openedPage.content);
      
      return Editor(editorNodeRef.current as Element, (e: Event) => {
        const target = e.target as Element;
        const rawMarkdown = mdParser.extractRawMarkdown(target.innerHTML);
        viewerNodeRef.current!.innerHTML = marked.parse(rawMarkdown);
        setIsDocumentSaved(false)
      });
    }
  },[editorNodeRef.current, openedPage]);

  useEffect(() => {
    if (viewerNodeRef.current)
      viewerNodeRef.current.innerHTML = marked.parse(openedPage.content);
  },[viewerNodeRef.current, openedPage])
  
  if (!openedPage.title)
    return null;

  return (
    <div className="flex flex-col justify-start w-full h-full">
      <div className='bg-gray-500 text-slate-300 shrink-0 flex flex-col'>
        <ToolBar {...{ setIsEditorOpen, isEditorOpen, openedPage, editorNodeRef, isDocumentSaved, setIsDocumentSaved }}/>
        <div className='text-lg font-bold p-1'>
          <span className="text-xs">{`${openedPage.path.join('/')}`}</span>
        </div>
      </div>
      <div className="h-full w-full flex min-h-0">
        <NoteEditor {...{isEditorOpen, editorNodeRef}}/>
        <NoteViewer {...{isEditorOpen, viewerNodeRef}} />
      </div>
    </div>
  )
}

function ToolBar(props: DefaultProps) {
  const { setIsEditorOpen, isEditorOpen, openedPage, editorNodeRef, isDocumentSaved, setIsDocumentSaved } = props;
  const { saveNote } = useNotesController()!;

  return (
    <div className='p-2'>
      <button className='p-1' onClick={() => setIsEditorOpen((prev: string) => !prev)}>{isEditorOpen ? 'close' : 'open'}</button>
      <button className='p-1' onClick={() => {
        saveNote(openedPage.path, mdParser.extractRawMarkdown(editorNodeRef.current!.innerHTML));
        setIsDocumentSaved(true);
        }}>
        save{isDocumentSaved ? '' : <strong>*</strong>}
      </button>
    </div>
  )
}

function NoteEditor(props: DefaultProps) {
  const {isEditorOpen, editorNodeRef} = props;

  return (
    <div 
      className='h-full resize-none bg-gray-550 text-gray-300 w-1/2'
      style={{
        display:isEditorOpen ? 'block' : 'none'
      }}
      >
        <pre
          className='m-0 h-full p-4 text-base pb-52 overflow-auto focus:outline-none focus:border-[1px] focus:border-slate-200 focus:shadow-inner' 
          ref={editorNodeRef}
          contentEditable
        ></pre>
    </div>
  )
}

function NoteViewer(props: DefaultProps) {
  const {isEditorOpen, viewerNodeRef} = props;

  return (
    <div  
      className='h-full bg-gray-550 text-gray-300 shadow-inner overflow-auto p-4'
      style={{
        width: isEditorOpen ? '50%' : '100%'
      }}
      >
      <pre 
        ref={viewerNodeRef}
        className="max-w-[1080px] mx-auto"
      ></pre>
    </div>
  )
}
