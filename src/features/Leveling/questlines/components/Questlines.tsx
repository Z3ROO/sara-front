import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Loading } from "../../../../ui/Loading";
import { DefaultProps } from "../../../../ui/types";
import Quests, { INewQuest, IQuest } from "../../quests/components/Quests";
import * as QuestsAPI from '../../quests/QuestsAPI';
import * as QuestlinesAPI from '../QuestlinesAPI';
import { Label } from "../../../../ui/forms";
import { QuestStatusCaller4Taskbar } from "../../../taskbar/components/StatusIconForTaskBar";

export interface IQuestline {
  _id: string
  title: string
  description: string
  state: 'active'|'finished'|'invalidated'
  timecap: number|string
  created_at: Date
  finished_at: Date|null
  xp: number|null
}

interface IQuestlineStateController {

  questline: IQuestline|null|undefined
  setQuestline: React.Dispatch<string|null|undefined>
  questlines: {
    active?: IQuestline | undefined;
    previous?: IQuestline[] | undefined;
  }
  finishQuestline(): Promise<void>
  getFinishedQuestlines(): Promise<IQuestline[]>
  createNewQuestline(title: string, descrition: string, duration: number, type: string): Promise<void>

}

export function QuestlineStateController():IQuestlineStateController {
  const [questlines, setQuestlines] = useState<{active?: IQuestline, previous?: IQuestline[]}>({});
  const [questline, setQuestline] = useReducer((state:IQuestline|null|undefined, action:string|null|undefined) => {
    if (action === null)
      return null;
    if (action === 'active')
      return questlines.active;

    return undefined;
  }, undefined);
  
  async function getQuestline(questline_id: string) {    
    const data = await QuestlinesAPI.getQuestline(questline_id);
    //setQuestline(data);
  }

  async function getAllQuestlines() {
    const data = await QuestlinesAPI.getAllQuestlines();
    let questlinesObject:any;

    if (data[0]?.state !== 'active' || data.length === 0)
      questlinesObject = {
        active: null,
        previous: data
      }
    else
      questlinesObject = {
        active: data[0],
        previous: data.slice(1)
      }
    
    setQuestlines(questlinesObject);
  }

  async function finishQuestline() {
    await QuestlinesAPI.finishMainQuestline();
    setQuestline(undefined);
    await getAllQuestlines();
  }

  async function getFinishedQuestlines(): Promise<IQuestline[]> {
    const response = await QuestlinesAPI.allFinishedQuestlines();
    return response;
  }

  async function createNewQuestline(title: string, description: string, 
    timecap: number, type: 'main'|'practice' ): Promise<void> {
    
    const response = await QuestlinesAPI.newQuestline({
      title,
      description,
      timecap: timecap * (24 * 60 * 60 * 1000)
    });

    setQuestline(undefined);
    getAllQuestlines();
  }

  useEffect(() => {
    getAllQuestlines();
  }, [])

  return {
    questline,
    setQuestline,
    questlines,
    finishQuestline,
    getFinishedQuestlines,
    createNewQuestline,
  }
}

const QuestlineStateControllerContext = createContext<IQuestlineStateController|null>(null)

export const useQuestlineStateController = () => useContext(QuestlineStateControllerContext);

export function QuestlineWidget() {
  const stateController = QuestlineStateController();
  const { questlines, setQuestline } = stateController;
  const [ toggle, setToggle ] = useState(false);

  if (!questlines.previous)
    return <Loading />

  if (toggle)
    return <CreateNewQuestline />

  return (
    <QuestlineStateControllerContext.Provider value={stateController}>
      <div>
      <h1 className="text-xl font-bold">Quest lines:</h1>
        <div className="flex">
          {
            !questlines.active  ? <NewQuestlineButton /> :
            <div 
              className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
              onClick={() => { setQuestline('active'); }}
              >
              <img className="w-8 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
              <span className="absolute bottom-1 right-1 text-[7px]">M</span>
            </div>
          }      
          {
          questlines.previous!.map( questline => (
            <div 
              className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
              onClick={() => {
              }}
              >
              <img className="w-8 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
              <span className="absolute bottom-1 right-1 text-[7px]">M</span>
            </div>
            )
          )
          }
        </div>
      </div>
    </QuestlineStateControllerContext.Provider>
  );
}

function NewQuestlineButton() {
  const {setQuestline} = useQuestlineStateController()!;

  return (
    <div 
      className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
      onClick={() => {setQuestline(null)}}
      >
      <img className="w-6 opacity-50 hover:opacity-100" src="/icons/ui/plus-sign.svg" alt="questlines warnings"/>
    </div>
  )
}

function CreateNewQuestline() {
  const { createNewQuestline, setQuestline } = useQuestlineStateController()!;

  const [questlineTitle, setQuestlineTitle] = useState<string>('');
  const [questlineDescription, setQuestlineDescription] = useState<string>('');
  const [questlineDuration, setQuestlineDuration] = useState<number>(0);

  return  <div>
            <h4>Create a Quest line:</h4>
            <div className="flex">
              <div className="flex flex-col p-1 px-2 w-64">
                <label htmlFor="questline-title" className="flex flex-col">
                Titulo: </label>
                <input type="text" id="questline-title" value={questlineTitle} onChange={(e) => setQuestlineTitle(e.target.value)}/>
                
                <label htmlFor="questline-description" className="flex flex-col">
                Descrição: </label>
                <textarea id="questline-description" className="resize-none h-20" value={questlineDescription} onChange={(e) => setQuestlineDescription(e.target.value)}/>

                <label htmlFor="questline-duration" className="flex flex-col">
                Duração: </label>
                <input type="number" id="questline-duration" placeholder="Quantos dias?" value={questlineDuration} onChange={(e) => setQuestlineDuration(Number(e.target.value))}/>

                <button 
                  className="p-1 m-4 border rounded bg-slate-500 hover:cursor-pointer hover:bg-slate-400" 
                  onClick={()=> createNewQuestline(questlineTitle, questlineDescription, questlineDuration, 'skill')}
                >
                  Criar
                </button>
                <button 
                  className="p-1 m-4 border rounded bg-slate-500 hover:cursor-pointer hover:bg-slate-400" 
                  onClick={() => { setQuestline(undefined) }}>
                  Cancelar
                </button>
              </div>
            </div>
            {/* <PreviewsQuestlines /> */}
          </div>
}
