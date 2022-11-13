import React, { useEffect, useState, createContext, useContext } from 'react';
import { Flashcards } from '../features/flashcards/Flashcards';
import { Notes } from '../features/notes/Notes'
import TestPage from '../TestPage'
import { ContextMenu } from '../ui/ContextMenu';
import { Router, Route, Link } from '../lib/Router';
import { PillsWidget } from '../features/pills/components/Pills';
import TaskBar from '../features/taskbar/TaskBar';
import DesignSystems from '../features/DesignSystems/DesignSystems';
import Home from '../features/home/Home';

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
            <div className="h-screen bg-gray-800 flex flex-col">
              <Router>                
                <TaskBar />
                <Home path="/" />
                <Notes path="/notes" />
                <Route path="/flashcards" element={<Flashcards AppController={controller} />} />
                <Route path="/design-systems"><DesignSystems /></Route>
                <Route path="/teste" element={<TestPage />} />
              </Router>
              {controller.contextMenu}
              
              {controller.modal && <Modal />}
              <PillsWidget />
            </div>
          </AppControllerContext.Provider>
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
