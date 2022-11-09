import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Flashcards } from '../domains/flashcards/Flashcards';
import { Notes } from '../domains/notes/Notes'
import TestPage from '../TestPage'
import { ContextMenu } from '../domains/_general/ContextMenu';
import Stats from '../domains/stats/Stats';
import { Router, Route, Link } from '../lib/Router';
import { PillsWidget } from '../domains/stats/Pills';
import { DefaultProps } from '../domains/_general/types';

export type IAppController = {
  modal: any;
  modalHandler(ModalContent?: any, controller?: any): void
  contextMenu: null|JSX.Element;
  contextMenuHandler(event: React.MouseEvent<Element, MouseEvent>, options: {
    title: string;
    action(): void;
  }[]): void
}

export const AppControllerContext = createContext<IAppController|null>(null);

export function useMainStateController() {
  return useContext(AppControllerContext);
}

export function AppController(): IAppController {
  const [modal, setModal] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<null|JSX.Element>(null);

  function contextMenuHandler(event: React.MouseEvent<Element, MouseEvent>, options: {title: string, action(): void}[]) {
    event.preventDefault();
    setContextMenu(<ContextMenu xPos={event.clientX} yPos={event.clientY} options={options}/>);
  }

  function modalHandler(component?: any, props?: any) {
    if (!component)
      return setModal(null)
    
    setModal({component, props});
  }
  
  useEffect(()=> {
    function handler() {
      setContextMenu(null)
      window.removeEventListener('click', handler)
    }

    if (contextMenu)
      window.addEventListener('click', handler)
      
  }, [contextMenu]);

  return {
    modal,
    modalHandler,
    contextMenu,
    contextMenuHandler
  }
}

function App() {
  const controller = AppController()

  return  <AppControllerContext.Provider value={controller}>
            <div className="h-screen bg-gray-800">
              <Router>                
                <Stats path="/" />
                <Route path="/teste" element={<TestPage />} />
                <Notes path="/notes" />
                <Route path="/teste/fc" element={<Flashcards AppController={controller} />} />
                <MainMenu />
              </Router>
              {controller.contextMenu}
              
              {controller.modal && <Modal />}
              <PillsWidget />
            </div>
          </AppControllerContext.Provider>
}

function MainMenu() {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="bg-gray-300 rounded-md shadow-md p-2 fixed top-5 right-5 transition-all">
      {
        toggle ?
        <MenuIconsList {...{toggle, setToggle}} /> :
        <>
          <MenuIcon className="w-5 cursor-pointer" onClick={() => { setToggle(true) }} />
        </>
      }
    </div>
  )
}

function MenuIconsList(props: {toggle: boolean, setToggle: React.Dispatch<React.SetStateAction<boolean>>}) {
  const iconList = [
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Notes', link: '/notes', Icon: MenuIcon },
    { title: 'Flashcard', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon }
  ];

  return (
    <div className="flex flex-wrap max-w-[288px]">
      {
        iconList.map(icon => (
            <SectionIcon {...icon} onClick={() =>props.setToggle(false)} />
          )
        )
      }
    </div>
  )
}

function SectionIcon(props: {Icon:(props:DefaultProps) => JSX.Element, title:string, link: string, [key: string]:any}) {
  const {Icon, title, link} = props;

  return (
    <div className="flex flex-col w-24 h-24 justify-center items-center">
      <Link href={link}>
        <div className="rounded p-2 shadow-md cursor-pointer" onClick={props.onClick}>
          <Icon className="w-6" />
        </div>
      </Link>
      <span>{title}</span>
    </div>
  )
}

export function MenuIcon(props: DefaultProps) {
  return (
    <svg x="0px" y="0px" viewBox="0 0 210 210" {...props}>
      <g id="XMLID_16_">
        <path id="XMLID_17_" d="M195,0h-20c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V15
          C210,6.716,203.284,0,195,0z"/>
        <path id="XMLID_18_" d="M115,0H95c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V15
          C130,6.716,123.284,0,115,0z"/>
        <path id="XMLID_19_" d="M35,0H15C6.716,0,0,6.716,0,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V15
          C50,6.716,43.284,0,35,0z"/>
        <path id="XMLID_20_" d="M195,160h-20c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15v-20
          C210,166.716,203.284,160,195,160z"/>
        <path id="XMLID_21_" d="M115,160H95c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15v-20
          C130,166.716,123.284,160,115,160z"/>
        <path id="XMLID_22_" d="M35,160H15c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15v-20
          C50,166.716,43.284,160,35,160z"/>
        <path id="XMLID_23_" d="M195,80h-20c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V95
          C210,86.716,203.284,80,195,80z"/>
        <path id="XMLID_24_" d="M115,80H95c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V95
          C130,86.716,123.284,80,115,80z"/>
        <path id="XMLID_25_" d="M35,80H15C6.716,80,0,86.716,0,95v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V95
          C50,86.716,43.284,80,35,80z"/>
      </g>
    </svg>
  )
}

export function Modal() {
  const { modal, modalHandler } = useMainStateController()!;
  const { controller } = modal.props;

  return  (
    <ModalTemplate>
      <>
        {modal.component({controller, ...modal.props})}
        <img 
          className="absolute p-1 hover:cursor-pointer hover:bg-slate-700 top-1 right-1 rounded w-6" 
          src="/icons/ui/close-x.svg" 
          onClick={() => modalHandler()} 
          alt={'close-x'}
        />
      </>
    </ModalTemplate>
  )
}

export function ModalTemplate({children}:{children:JSX.Element}) {
  return  (
    <div className="absolute w-full h-full bg-slate-300 bg-opacity-30 top-0 left-0 flex justify-center items-center">
      <div className="bg-slate-600 rounded p-4 relative shadow-lg">
        {children}
      </div>
    </div>
  )
}

export default App;
