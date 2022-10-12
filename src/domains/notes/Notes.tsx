import {useState, createContext, useRef, useEffect} from 'react'
import { IAppController } from '../../core/App';
import { DefaultProps } from './interfaces';
import { NotesController, NotesControllerContext, useNotesController } from './controller';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Editor } from '@z3ro/mdparser';

export function Notes(props: {AppController: IAppController}) {
  //const AppController = props.AppController;
  const controller = NotesController({AppController: props.AppController});

  return  <NotesControllerContext.Provider value={controller}>
            <div className="h-full">
              {controller.navState.length === 0 && <Home controller={controller}/>}
              {controller.navState.length >= 1 && <NotesManager controller={controller}/>}
            </div>
          </NotesControllerContext.Provider>
}

function Home(props: DefaultProps) {
  const { controller } = props
  const navigate = useNavigate();

  const boxButtonClass = `
    bg-gray-700 text-slate-300 flex justify-center items-center transition-all
    hover:scale-105 hover:cursor-pointer hover:bg-slate-500 hover:shadow-md
    `
  const boxTextClass = "text-5xl font-bold"


  return  <div className="h-full w-full flex justify-center items-center ">
            <div className="h-[90vh] w-[90vh] grid grid-cols-2 grid-rows-2">
              <div 
                className={boxButtonClass} 
                onClick={() => {controller.setCategory('projects')}}>
                <span className={boxTextClass}>Projects</span>
              </div>
              <div 
                className={boxButtonClass}
                onClick={() => {controller.setCategory('study')}}
              >
                <span className={boxTextClass}>Study</span>
              </div>
              <div 
                className={boxButtonClass}
                onClick={() => {controller.setCategory('journal')}}
              >
                <span className={boxTextClass}>Journal</span>
              </div>
              <div  
                className={boxButtonClass}
                onClick={() => {controller.setCategory('misc')}}
              >
                <span className={boxTextClass}>Misc</span>
              </div>
            </div>
          </div>
}

function NotesManager(props: DefaultProps) {
  const { controller } = props;
  return  <div className="h-full w-full flex">
            <Navigation controller={controller}/>
            {controller.pageState.length > 0 && <Page controller={controller} />}
          </div>
}

function Navigation(props: DefaultProps) {
  const { controller } = props;

  let content: JSX.Element|null = null;

  if (controller.navState.length === 1)
    content = <CategoryContentList controller={controller} />
  else if (controller.navState.length === 2)
    content = <ContentList controller={controller} type="notebook" />
  else if (controller.navState.length >= 3)
    content = <ContentList controller={controller} type="section" />

  return  <div className="flex">
            <div className="w-12 h-full bg-gray-750">
              <button 
                className="m-1"
                onClick={()=> controller.setPath('__back')}>
                {'\u{1f519}'}
              </button>
            </div>
            <div className="w-72 h-full bg-gray-550">
              <div className="w-72 bg-gray-750">
                <button 
                  className="m-1"
                  onClick={() => controller.setInputAux('section')}
                >
                  {'\u2795 s'}
                </button>
                { controller.navState.length > 1 && <button className="m-1" onClick={() => controller.setInputAux('page') }>{'\u2795 p'}</button> }
              </div>
              { content }
            </div>            
          </div>
}

const contentListUlClass = `list-none p-0 m-0 text-slate-300 overflow-auto`;
const contentListLIFirstChild = `bg-gray-650 text-base text-slate-300`;
const contentListLIFirstChildFirstChild = `text-xs`;
const contentListLISecondChild = `list-title bg-gray-600 text-sm p-1 text-slate-400`;
const contentListLIItems = `list-item bg-gray-550 hover:bg-gray-500 hover:cursor-pointer`;
const contentListInput = `outline-none border-none p-1 text-slate-300 bg-gray-600 shadow-md w-full`;

function CategoryContentList(props: DefaultProps) {
  const { categoryContent, setNotebook, inputAux, createNew, newItemInputField, setNewItemInputField, navState, categoryListItemContextMenu } = props.controller;

  return  <ul className={contentListUlClass}>
            <li className={contentListLIFirstChild}>
              <li className={contentListLIFirstChildFirstChild}>
                {navState.slice(0,navState.length-1).toString().replace(/,/g, '/')}
              </li>
              <li>
                {navState[navState.length-1]}
              </li>
            </li>
            <li className={contentListLISecondChild}>Notebooks</li>
            {
              categoryContent.map( item => (
                <li className={contentListLIItems} onClick={() => setNotebook(item)} onContextMenu={(event)=> categoryListItemContextMenu(event, item)}>{item}</li>
              ))
            }
            {
              inputAux && <NewItem />
            }
          </ul>
}
function ContentList(props: DefaultProps) {//fix name of states
  const { setSection, setPage, inputAux, createNew, newItemInputField, setNewItemInputField, navState, listItemContextMenu } = props.controller;
  let type:string = props.type;
  let sectionContent: string[]; 

  if (type === 'notebook')
    sectionContent = props.controller.notebookContent;
  else
    sectionContent = props.controller.sectionContent;
  
  

  return  <ul className={contentListUlClass}>
            <li className={contentListLIFirstChild}>
              <li className={contentListLIFirstChildFirstChild}>
                {navState.slice(0,navState.length-1).toString().replace(/,/g, '/')}
              </li>
              <li>
                {navState[navState.length-1]}
              </li>
            </li>
            <li className={contentListLISecondChild}>Sections</li>
            {
              sectionContent.map( item => !item.match(/\.md$/) && <li className={contentListLIItems} onClick={() => setSection(item)} onContextMenu={(e) => listItemContextMenu(e, item)}>{item}</li>)
            }
            <li className={contentListLISecondChild}>Pages</li>
            {
              sectionContent.map( item => item.match(/\.md$/) && <li className={contentListLIItems} onClick={() => setPage(item)} onContextMenu={(e) => listItemContextMenu(e, item)}>{item}</li>)
            }
            {
              inputAux && <NewItem />
            }
          </ul>
}

function NewItem() {
  const {createNew, inputAux} = useNotesController()!;
  const [inputField, setInputField] = useState<string>('');

  return  <li className="list-input">
            <input  
              className={contentListInput}
              value={inputField} onChange={(e)=> setInputField(e.target.value)} onBlur={() => createNew(inputAux, inputField)} placeholder={'new '+inputAux} autoFocus />
          </li>

}

function Page(props: DefaultProps) {
  const { controller } = props;
  const { category, notebook, section, page } = controller.pageState[0];

  useEffect(()=>{
    controller.getPageContent(category, notebook, section, page);
    Editor(controller.textareaRef.current as Element, controller.onEditorTextareaFieldChange)
  },[])

  return  <div className="flex flex-col justify-start w-full h-full">
            <div className='bg-gray-500 text-slate-300 shrink-0 flex flex-col'>
              <div>
                <button onClick={()=> controller.saveNote()} disabled={controller.pageState === null}>{'🖭'}</button>
                <button onClick={()=> controller.setIsEditorOpen(!controller.isEditorOpen)}>{'\u{1F589}'}</button>
              </div>
              <div className='text-lg font-bold p-1'>
                <span className="text-xs">{`${category}/${notebook}/${section}`}</span>
                <span>{!controller.isSaved && '*'}{page.replace(/\.md$/, '')}</span>
              </div>
            </div>
            <div className="h-full w-full flex min-h-0">
              <div 
                className='h-full resize-none bg-gray-550 text-gray-300 w-1/2'
                style={{
                  display:controller.isEditorOpen ? 'block' : 'none'
                }}
                >
                  <pre
                    className='m-0 h-full p-4 text-base pb-52 overflow-auto focus:outline-none focus:border-[1px] focus:border-slate-200 focus:shadow-inner' 
                    ref={controller.textareaRef}
                    contentEditable
                  ></pre>
              </div> 
              <div  
                className='h-full bg-gray-550 text-gray-300 shadow-inner overflow-auto p-4'
                style={{
                  width: controller.isEditorOpen ? '50%' : '100%'
                }}
                >
                <pre ref={controller.viewerRef} className="max-w-[1080px] mx-auto">

                </pre>
              </div>
            </div>
          </div>
}

