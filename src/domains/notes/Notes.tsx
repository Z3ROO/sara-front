import {useState, useRef, useEffect, Children} from 'react';
import { useMainStateController } from '../../core/App';
import { NotesController, NotesControllerContext, useNotesController } from './NotesStateController';
import { Link, Route, Routes } from '../../lib/Router';
import { useLocation, useParams } from '../../lib/Router/RouterHooks';
import { DefaultProps } from '../_general/types';
import { FileExplorer } from './components/FileExplorer';
import { DocumentEditor } from './components/DocumentEditor';

export function Notes(props: DefaultProps) {
  const mainStateController = useMainStateController()!;
  const controller = NotesController({AppController: mainStateController});

  return  <NotesControllerContext.Provider value={controller}>
            <Routes>
              <HomeScreen path="/notes" controller={controller} />
              <NotesManager path="/notes/:category/**" controller={controller} />
            </Routes>
          </NotesControllerContext.Provider>
}

function HomeScreen(props: DefaultProps) {

  return  <div className="h-full w-full flex justify-center items-center ">
            <div className="h-[90vh] w-[90vh] grid grid-cols-2 grid-rows-2">
              <CategoryBoxButton href='/notes/general'>
                General
              </CategoryBoxButton>
              <CategoryBoxButton href='/notes/projects'>
                Projects
              </CategoryBoxButton>
              <CategoryBoxButton href='/notes/study'>
                Study
              </CategoryBoxButton>
              <CategoryBoxButton href='/notes/journal'>
                Journal
              </CategoryBoxButton>
            </div>
          </div>
}

function CategoryBoxButton({href, children}: {children:string, href:string}) {
  return (
    <div className={`
      bg-gray-700 text-slate-300 transition-all
      hover:scale-105 hover:cursor-pointer hover:bg-slate-500 hover:shadow-md
    `}>
      <Link href={href} className="w-full h-full flex justify-center items-center">
        <span className={`text-5xl font-bold`}>{children}</span>
      </Link>
    </div>
  )
}

function NotesManager(props: DefaultProps) {
  const { updateNotesTree } = useNotesController()!;
  const category = useParams('/notes/:category/**')![1];
  const isDocument = useParams('/notes/:category/**/*.md')!;
  
  useEffect(() => {
    if (category != null)
      updateNotesTree(category);
  },[]);

  return  <div className="h-full w-full flex">
            <FileExplorer />
            {isDocument && <DocumentEditor />}
          </div>
}
