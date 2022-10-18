import {useState, createContext, useRef, useEffect} from 'react'
import { IAppController, useMainStateController } from '../../core/App';
import { DefaultProps, INotesTree } from './interfaces';
import { NotesController, NotesControllerContext, useNotesController } from './controller';
import mdParser, { Editor } from '@z3ro/mdparser';
import { Link, Route, Routes } from '../../lib/Router/Router';
import { useLocation, useParams } from '../../lib/Router/hooks';
import { marked } from 'marked';

export function Notes(props: {AppController: IAppController, path?:string}) {
  //const AppController = props.AppController;
  const controller = NotesController({AppController: props.AppController});
  const {path, traversePath} = useLocation()!;

  return  <NotesControllerContext.Provider value={controller}>
            <Routes>
              <Home path="/notes" controller={controller}/>
              <NotesManager path="/notes/:category/**" controller={controller} />
            </Routes>
          </NotesControllerContext.Provider>
}

function Home(props: DefaultProps) {
  const { controller } = props
  //const navigate = useNavigate();

  const boxButtonClass = `
    bg-gray-700 text-slate-300 transition-all
    hover:scale-105 hover:cursor-pointer hover:bg-slate-500 hover:shadow-md
    `
  const boxTextClass = "text-5xl font-bold"


  return  <div className="h-full w-full flex justify-center items-center ">
            <div className="h-[90vh] w-[90vh] grid grid-cols-2 grid-rows-2">
              <div className={boxButtonClass}>
                <Link href="/notes/general" className="w-full h-full flex justify-center items-center">
                  <span className={boxTextClass}>General</span>
                </Link>
              </div>
              <div className={boxButtonClass}>
                <Link href="/notes/projects" className="w-full h-full flex justify-center items-center">
                  <span className={boxTextClass}>Projects</span>
                </Link>
              </div>
              <div className={boxButtonClass}>
                <Link href="/notes/study" className="w-full h-full flex justify-center items-center">
                  <span className={boxTextClass}>Study</span>
                </Link>
              </div>
              <div className={boxButtonClass}>
                <Link href="/notes/journal" className="w-full h-full flex justify-center items-center">
                  <span className={boxTextClass}>Journal</span>
                </Link>
              </div>
            </div>
          </div>
}

function NotesManager(props: DefaultProps) {
  const { updateNotesTree } = useNotesController()!;
  const category = useParams('/notes/:category/**')![1];
  const params = useParams('/notes/:category/**/*.md')!;
  
  useEffect(() => {
    if (category != null)
      updateNotesTree(category);
  },[]);

  return  <div className="h-full w-full flex">
            <FileExplorer />
            {params && <Page />}
          </div>
}

function FileExplorer(props: any) {
  return (
    <div className='flex flex-col'>
      <FileExplorerOptions />
      <ContentList />
    </div>
  )
}

function FileExplorerOptions() {
  const { traversePath } = useLocation()!;
  const {setNewItemField} = useNotesController()!;
  return (
    <div>
      <button 
      onClick={() => {traversePath('/notes')}}
      className='text-white text-sm rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'>back</button>
      <span className='text-white'> | </span>
      <button onClick={() => setNewItemField('folder')}
      className='text-white text-sm rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'>pasta</button>
      <button onClick={() => setNewItemField('file')}
      className='text-white text-sm rounded-md px-1.5 py-0.5 m-1 border border-gray-500 hover:bg-gray-600'>arquivo</button>
    </div>
  )
}

function ContentList(props: any) {
  const category = useParams('/notes/:category/**')![1];
  const [focusedItem, setFocusedItem] = useState<string>('');
  const [newItemInputField, setNewItemInputField] = useState<string>('');

  useEffect(() => {
    setFocusedItem(category);
  },[])

  return (
    <div className="bg-gray-700 text-slate-300 h-full p-2 w-72 overflow-auto">
      <FolderContent {...{focusedItem, setFocusedItem, newItemInputField, setNewItemInputField}} />
    </div>
  )
}

function FolderContent(props: any) {
  const {notesTree, updateNotesTree, openMarkdownFile, newItemField, setNewItemField, createNewItem, deleteNote, deleteFolder} = useNotesController()!;
  const {path, traversePath} = useLocation()!;
  const category = useParams('/notes/:category/**')![1];
  const {contextMenuHandler} = useMainStateController()!;
  const { focusedItem, setFocusedItem, newItemInputField, setNewItemInputField } = props;
  
  let notes = (notesTree as INotesTree)[category].children!;
  const depth:string[] = props.depth || [];

  if (props.depth) {
    depth.forEach(dir => {
      notes = notes[dir].children!
    })
  }

  function contextMenuWrapper(event: React.MouseEvent<Element, MouseEvent>, info: any) {
    const { type, directory } = info;

    const options = [
        {title: 'Abrir', action:()=>{
          //setNotebook(item);
        }},
        {title: 'Editar', action:()=>{}},
        {title: 'Excluir', action:()=>{
          if (type === 'note')
            deleteNote(directory);
          else
            deleteFolder(directory);
        }}
      ];
    return contextMenuHandler(event, options)
  }

  return (
    <ul className={`${depth.length > 0 && 'border-l-[1px] border-l-gray-500  border-b-[1px] border-b-gray-550 bg-gray-500 bg-opacity-5'} m-0 p-0`}> 
      {
        (newItemField && [category,...depth].join('/') === focusedItem.replace(/\/[^\/]+\.md$/,'')) 
        &&  <li className='pl-3'>
              <input 
                autoFocus 
                type="text"
                value={newItemInputField}
                placeholder={newItemField}
                onChange={(e) => setNewItemInputField(e.target.value) }
                onBlur={() => createNewItem([category,...depth], newItemInputField) } 
                className='bg-gray-600 w-full text-slate-300 text-sm outline-none focus:shadow-inner p-0.5 px-1' 
                 />
            </li>
      }
      {
      Object.keys(notes).map(itemName => {
        const {name, path, title, type, state, children} = notes[itemName];
        const icon = type === 'folder' ? (state === 'closed' ? '\u{1F5C0}' : '\u{1F5C1}') : '\u{1F5CE}';
        const hasChildren = children && Object.keys(children).length > 0;
        
        if (type === 'folder') {

          if (state === 'open')
            return (
              <>
                <ListItem
                  onClick={() => {
                    updateNotesTree();
                    notes[itemName].state = 'closed';
                  }}
                  onContextMenu={(e:React.MouseEvent<Element, MouseEvent>) => contextMenuWrapper(e, {type: 'folder', directory: path})}
                >{icon} {title}</ListItem>                
                {
                  (hasChildren || newItemField) &&
                  <li className='pl-4'>
                    <FolderContent depth={[...depth, itemName]} {...{focusedItem, setFocusedItem, newItemInputField, setNewItemInputField}}/>
                  </li>
                }
              </>
            )

          return (
            <ListItem 
              onClick={() => {
                updateNotesTree();
                notes[itemName].state = 'open';
                setFocusedItem(path.join('/'))
              }}
              onContextMenu={(e:React.MouseEvent<Element, MouseEvent>) => contextMenuWrapper(e, {type: 'folder', directory: path})}
            >{icon} {title}</ListItem>
          );
        }

        return (
          <ListItem
            onClick={
              () => {
                traversePath(['notes', ...path]);
                setFocusedItem(path.join('/'));
              }
            }
            onContextMenu={(e:React.MouseEvent<Element, MouseEvent>) => contextMenuWrapper(e, {type: 'note', directory: path})}
          >{icon} {title}</ListItem>
        );
      })
      }
    </ul>
  )
}

function ListItem(props: any) {
  return (
    <li 
      {...props}
      className='ml-1.5 m-0.5 p-0.5 pl-1.5 hover:bg-gray-550 rounded-sm select-none cursor-pointer' 
    >{props.children}</li>
  )
}

function Page(props: any) {
  const controller = useNotesController()!;
  const { openedPage, saveNote, openMarkdownFile } = controller;
  const {path} = useLocation()!
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const editorNodeRef = useRef<HTMLPreElement|null>(null);
  const previewNodeRef = useRef<HTMLPreElement|null>(null);

  const params = useParams('/notes/:category/**/*.md')!;

  useEffect(()=> {
    openMarkdownFile(params)
  },[path]);
  
  
  useEffect(()=>{
    if (editorNodeRef.current) {
      editorNodeRef.current.innerHTML = mdParser.parse(openedPage.content);
      
      return Editor(editorNodeRef.current as Element, (e: Event) => {
        const target = e.target as Element;
        const rawMarkdown = mdParser.extractRawMarkdown(target.innerHTML);
        previewNodeRef.current!.innerHTML = marked.parse(rawMarkdown);
      });
    }
  },[editorNodeRef.current, openedPage]);

  useEffect(() => {
    if (previewNodeRef.current)
      previewNodeRef.current.innerHTML = marked.parse(openedPage.content);
  },[previewNodeRef.current, openedPage])
  
  if (!openedPage.title)
    return null;

  return  <div className="flex flex-col justify-start w-full h-full">
            <div className='bg-gray-500 text-slate-300 shrink-0 flex flex-col'>
              <div className='p-2'>
                <button className='p-1' onClick={() => setIsEditorOpen((prev) => !prev)}>{isEditorOpen ? 'close' : 'open'}</button>
                <button className='p-1' onClick={() => saveNote(openedPage.path, mdParser.extractRawMarkdown(openedPage.content)) }>save</button>
              </div>
              <div className='text-lg font-bold p-1'>
                <span className="text-xs">{`${openedPage.path.join('/')}`}</span>
              </div>
            </div>
            <div className="h-full w-full flex min-h-0">
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
              <div  
                className='h-full bg-gray-550 text-gray-300 shadow-inner overflow-auto p-4'
                style={{
                  width: isEditorOpen ? '50%' : '100%'
                }}
                >
                <pre 
                  ref={previewNodeRef}
                className="max-w-[1080px] mx-auto">

                </pre>
              </div>
            </div>
          </div>
}
