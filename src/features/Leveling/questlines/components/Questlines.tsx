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
  activeQuest: IQuest|null|undefined
  questline: IQuestline|null|undefined
  setQuestline: React.Dispatch<string|null|undefined>
  questlines: {
    active?: IQuestline | undefined;
    previous?: IQuestline[] | undefined;
  }
  finishQuestline(): Promise<void>
  getFinishedQuestlines(): Promise<IQuestline[]>
  createNewQuestline(title: string, descrition: string, duration: number, type: string): Promise<void>
  createNewQuest(title: string, description: string, horas: number, minutes: number, type: "main" | "side" | "mission", todos: string[]): Promise<void>
  handleQuestTodo(description: string, action: 'finish' | 'invalidate'): Promise<void>
  finishQuest(focusScore: number): Promise<void>
  sendDistractionPoint(): Promise<void>
}

export function QuestlineStateController():IQuestlineStateController {
  const [activeQuest, setActiveQuest] = useState<IQuest|null>();
  const [questlines, setQuestlines] = useState<{active?: IQuestline, previous?: IQuestline[]}>({});
  const [questline, setQuestline] = useReducer((state:IQuestline|null|undefined, action:string|null|undefined) => {
    if (action === null)
      return null;
    if (action === 'active')
      return questlines.active;

    return undefined;
  }, undefined);
  
  async function getQuestline(questline_id?: string) {
    if (!questline_id && activeQuest)
      questline_id = activeQuest.questline_id!;
    else
      return;
    
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

  async function getActiveQuest() {
    const data = await QuestsAPI.getActiveQuest();
    setActiveQuest(data);
    
    if (data != null) {
      QuestStatusCaller4Taskbar.setStatus({
        color: 'yellow',
        name: 'active'
      });
      getAllQuestlines();
    }
    else {
      QuestStatusCaller4Taskbar.setStatus({});
    }
  }

  async function createNewQuest(title: string, description: string, 
    horas: number, minutes: number, type: "main" | "side" | "mission", 
    todos: string[]) {
    if (!questline)
      throw new Error('No questline selected.')

    const newQuest:INewQuest = {
      questline_id: questline._id,
      title,
      description,
      timecap: (minutes + (horas*60))*60000,
      todos,
      type
    }

    const data = await QuestsAPI.createQuest(newQuest);

    await getActiveQuest();
  }

  async function handleQuestTodo(description: string, action: 'finish'|'invalidate') {
    if (!activeQuest)
      throw  new Error('Must have an activeQuest');
    
    const quest_id = activeQuest._id;

    const response = await QuestsAPI.handleQuestTodo({
      quest_id,
      todoDescription: description,
      action
    });

    getActiveQuest();
  }

  async function finishQuest(focusScore: number) {
    if (!activeQuest)
      return

    const quest_id = activeQuest._id;
    const response = await QuestsAPI.finishQuest({quest_id, focusScore});

    getActiveQuest();
  }

  async function sendDistractionPoint() {
    await QuestsAPI.insertDistractionPoint();
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
    getActiveQuest();
    getAllQuestlines();
  }, [])

  return {
    activeQuest,
    questline,
    setQuestline,
    questlines,
    finishQuestline,
    getFinishedQuestlines,
    createNewQuestline,
    createNewQuest,
    handleQuestTodo,
    finishQuest,
    sendDistractionPoint
  }
}

const QuestlineStateControllerContext = createContext<IQuestlineStateController|null>(null)

export const useQuestlineStateController = () => useContext(QuestlineStateControllerContext);

export function QuestlineWidget() {
  const stateController = QuestlineStateController();
  const { activeQuest, questline } = stateController;
  
  let content = (
    <div>
      <h1 className="text-xl font-bold">Quest lines:</h1>
      <QuestlineList />
    </div>
  );

  if (activeQuest)
    content = <Quests />
  
  if (questline)
    content = <Questline />

  if (questline === null)
    content = <CreateNewQuestline />
  
  //if (questline === undefined)
  return (
    <QuestlineStateControllerContext.Provider value={stateController}>
      {content}
    </QuestlineStateControllerContext.Provider>
  );
}

function QuestlineList() {
  const { questlines, setQuestline } = useQuestlineStateController()!;

  if (!questlines.previous)
    return <Loading />

  return (
    <div className="flex">
      {
        !questlines.active  ? <NewQuestline /> :
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
  )
}

function NewQuestline() {
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

export function Questline(props: DefaultProps) {
  const { questline, finishQuestline, activeQuest } = useQuestlineStateController()!;
  
  if (!questline)
    return <Loading />

  return  <div className="rounded p-2 relative">
            <h2 className="font-bold text-sm">{questline.title}</h2>
            <span>{questline.description}</span>
            {
              activeQuest ?
              <Quests verbose={false} /> :
              <div>
                <CreateNewQuest />
                <div>
                  <button className="button-md" onClick={finishQuestline}>Finalizar quest line</button>
                </div>
              </div>
            }
          </div>

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

function PreviewsQuestlines() {
  const { getFinishedQuestlines } = useQuestlineStateController()!;
  const [questlineHistory, setQuestlineHistory] = useState<IQuestline[]|null>(null);

  useEffect(() => {
    (async function() { 
      setQuestlineHistory(await getFinishedQuestlines())
    })();
  },[]);

  return (
    <div className="p-1 px-2 ml-6 border-l">
      <h5>Historico de questlines:</h5>
      <div className="flex flex-col overflow-auto">
        {
          questlineHistory ?
          questlineHistory.map( questline => {
            return  <div className="p-2 rounded bg-slate-500 m-2">
                      {questline.title}
                    </div>
          }) :
          <Loading />
        }
      </div>
    </div>
  )
}

function CreateNewQuest(props: any) {
  const controller = useQuestlineStateController()!;
  const { createNewQuest, setQuestline } = controller;
  const [questTitle, setQuestTitle] = useState<string>('');
  const [questDescription, setQuestDescription] = useState<string>('');
  const [questHoras, setQuestHoras] = useState<number>(0);
  const [questMinutes, setQuestMinutes] = useState<number>(0);
  const [todos, setTodos] = useState<string[]>(['']);
  
  return  <>
            <h4>Criar Quest:</h4>
            <div className="flex flex-col">
              <Label title="Titulo: ">
                <input className="w-full text-black" type="text" value={questTitle} onChange={e => setQuestTitle(e.target.value)}/>
              </Label>
              <Label title="Descrição: ">
                <textarea className="w-full text-black resize-none" value={questDescription} onChange={e => setQuestDescription(e.target.value)}/>
              </Label>
              <div className="flex justify-between">
                <Label title="Horas: ">
                  <input className="w-full text-black" type="number" id="quest-timecap-h" value={questHoras} onChange={e => setQuestHoras(Number(e.target.value))}/>
                </Label>
                <Label title="Minutos: ">
                  <input className="w-full text-black" type="number" value={questMinutes} onChange={e => setQuestMinutes(Number(e.target.value))}/>
                </Label>
              </div>
              <CreateNewQuestTodosSection todos={todos} setTodos={setTodos} />
              <div className="flex justify-end my-4">
                <button className="m-2 py-1 px-2 border rounded cursor-pointer" onClick={() => setQuestline(undefined)}>Cancelar</button>
                <button className="m-2 py-1 px-4 border rounded cursor-pointer" onClick={() => createNewQuest(questTitle, questDescription, questHoras, questMinutes, 'main', todos)}>Criar</button>
              </div>
            </div>
          </>
}

function CreateNewQuestTodosSection(props: any) {
  const { todos, setTodos } = props;

  return  <div className="relative">
            <h5>To-do list: </h5>
            {
              todos.map((todo: string, ind:number) => {
                return  (
                  <div className="flex p-2 pt-1 pr-1">
                    <input className="w-full text-black" type="text" value={todo} placeholder={`To-do #${ind}`}
                      onChange={({target}) => setTodos((current:string[]) => {current[ind] = target.value; return [...current]})}/>
                    <button className="button-icon bg-red-600" onClick={() => {
                        if (todos.length === 1) return
                        const newTodos = [...todos];
                        newTodos.splice(ind, 1);
                        setTodos(newTodos);
                      }
                    }>
                      <img className="w-3" src="/icons/ui/close-x.svg" alt="close-x" />
                    </button>
                  </div>
                  )
                })
              }
              <button className="button-icon absolute top-1 right-1" onClick={() => {
                  const newTodos = [...todos];
                  newTodos[newTodos.length] = ''
                  setTodos(newTodos);
                }
              }><img className="w-3" src="/icons/ui/plus-sign.svg" alt="close-x" /></button>
            </div>
}


