import { useState, useEffect, createContext, useContext } from "react";
import { mlToHours } from "../../../../util/mlToHours";
import { QuestStatusCaller4Taskbar } from "../../../taskbar/components/StatusIconForTaskBar";
import * as QuestsAPI from '../QuestsAPI'
import * as Icons from '../../../../lib/icons/UI'
import { Label } from "../../../../ui/forms";
import * as SkillsAPI from "../../skills/SkillsAPI";
import * as QuestlineAPI from '../../questlines/QuestlinesAPI';

export interface INewQuest {
  questline_id?: string
  skill_id?: string
  mission_id?: string
  title: string
  description: string
  type: 'main'|'mission'|'practice'
  todos: string[],
  timecap: number|string
}

export interface IQuest {
  _id: string
  questline_id: string|null
  skill_id: string|null
  mission_id: string|null
  title: string
  description: string
  type: 'main'|'mission'|'practice'
  state: 'active'|'deferred'|'finished'|'invalidated'
  todos: ITodo[]
  timecap: number|string
  focus_score: number|null
  distraction_score: Date[]
  created_at: Date
  finished_at: Date|null
  xp: number|null
}

export type ITodo = {
  description: string
  state: 'invalidated'|'finished'|'active'
  finished_at: Date|null
};

function todoStyleClasses(todoState: string) {
  if (todoState === 'active')
    return ''
  else if (todoState === 'invalidated')
    return 'line-through text-red-500 text-opacity-70 font-bold'
  else if (todoState === 'finished')
    return 'line-through text-gray-500 text-opacity-70 font-bold'
}

export interface IQuestsStateController {
  activeQuest: IQuest|null|undefined
  createNewQuest(title: string, description: string, horas: number, minutes: number, type: "main" | "practice" | "mission", todos: string[]): Promise<void>
  createNewPracticeQuest(title: string, description: string, horas: number, minutes: number, type: "main" | "practice" | "mission", todos: string[], skill_id: string): Promise<void>
  handleQuestTodo(description: string, action: 'finish' | 'invalidate'): Promise<void>
  finishQuest(focusScore: number): Promise<void>
  sendDistractionPoint(): Promise<void>
}

const QuestsStateControllerContext = createContext<IQuestsStateController|null>(null);
const useQuestsSC = () => useContext(QuestsStateControllerContext);

export function QuestStateController(): IQuestsStateController {
  const [activeQuest, setActiveQuest] = useState<IQuest|null>();

  async function getActiveQuest() {
    const data = await QuestsAPI.getActiveQuest();
    setActiveQuest(data);
    
    if (data != null) {
      QuestStatusCaller4Taskbar.setStatus({
        color: 'yellow',
        name: 'active'
      });
      //getAllQuestlines();
    }
    else {
      QuestStatusCaller4Taskbar.setStatus({});
    }
  }

  async function createNewQuest(title: string, description: string, 
    horas: number, minutes: number, type: "main" | "practice" | "mission", 
    todos: string[]) {

    const newQuest:INewQuest = {
      title,
      description,
      timecap: (minutes + (horas*60))*60000,
      todos,
      type
    }

    const data = await QuestsAPI.createQuest(newQuest);

    await getActiveQuest();
  }

  async function createNewPracticeQuest(title: string, description: string, 
    horas: number, minutes: number, type: "main" | "practice" | "mission", 
    todos: string[], skill_id: string) {
    
    if (skill_id === '')
      throw new Error('skill_id empty');

    const newQuest:INewQuest = {
      skill_id,
      title,
      description,
      timecap: (minutes + (horas*60))*60000,
      todos,
      type
    }

    const data = await QuestsAPI.createPracticeQuest(newQuest);

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
  
  useEffect(() => {
    getActiveQuest();
  }, [])

  return {
    activeQuest,
    createNewQuest,
    createNewPracticeQuest,
    handleQuestTodo,
    finishQuest,
    sendDistractionPoint
  }
}

export function InQuestBlur(props: { children: JSX.Element|JSX.Element[], className?: string}) {
  const { activeQuest } = useQuestsSC()!;

  return (
    <div style={{ filter: activeQuest ? 'blur(.5rem)' : ''}} className={props.className||"w-full h-full"}>
      {props.children}
    </div>
  )
}

export default function QuestsWidget(props:any) {
  let stateController = useQuestsSC()!;
  let { activeQuest } = stateController;
  const verbose: boolean = props.verbose === undefined ? true : props.verbose;

  if (!activeQuest)
    return null

  return  (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 bg-opacity-40 flex justify-center items-center">
      <div className="relative w-96">
        <div className="bg-gradient-to-br to-gray-800 from-gray-650 rounded p-2">
          <h3 className="text-lg p-2">{activeQuest.title}</h3>
          <QuestTodosSection />
          <QuestFinishSection />
          <QuestFooter activeQuest={activeQuest} />
        </div>
        <QuestDistractionWidget />
      </div>
    </div>
  )
}

function QuestTodosSection() {
  const { activeQuest, handleQuestTodo } = useQuestsSC()!;

  return  <div className="p-2">
            {
              activeQuest && activeQuest.todos.map(
                (todo) => (
                  <div>
                    <input type="checkbox" checked={todo.state==='finished'} onClick={() => handleQuestTodo(todo.description, 'finish')}/>
                    <span className={`${todoStyleClasses(todo.state)} mx-3 text-lg`}>{todo.description}</span>
                    <button onClick={() => handleQuestTodo(todo.description, 'invalidate')}>
                      <Icons.Xclose className="w-3 fill-red-400 opacity-20 hover:opacity-100" />
                    </button>
                  </div>
                )
              )
            }
          </div>
}

function QuestFinishSection() {
  const { activeQuest, finishQuest } = useQuestsSC()!;
  const [focusScore, setFocusScore] = useState<number>(0);

  if (!activeQuest?.todos.every((todo:any) => todo.state !== 'active'))
    return <></>

  return  <div className="flex flex-col items-center p-2">
            <div>
              {Array(11).fill(true).map((x, ind) => <button className={`button-sm ${focusScore === ind && 'bg-gray-500'} border-gray-550`} onClick={() => setFocusScore(ind)}>{ind}</button>)}
            </div>
            <button className="button-md border-gray-550" onClick={() => finishQuest(focusScore)} disabled={focusScore === 0}>Finalizar quest.</button>
          </div>
}

function QuestFooter(props: any) {
  const {activeQuest} = props;
  const questTimecap = mlToHours(activeQuest.timecap);

  const [questTimer, setQuestTimer] = useState<{hours:number, minutes:number}>({hours: 0, minutes: 0});
  const [overtime, setOvertime] = useState<boolean>(false);

  useEffect(() => {
    function tick() {
      const predictedEnd = (new Date(activeQuest.created_at).getTime() + Number(activeQuest.timecap))||0;
      let timePassed = predictedEnd - Date.now();
      if (timePassed < 0){
        timePassed = Math.abs(timePassed);
        setOvertime(true);
        QuestStatusCaller4Taskbar.setStatus({
          color: 'red',
          name: 'Overtime'
        })
      }
      setQuestTimer(mlToHours(timePassed));
    }

    tick();
    const interval = setInterval(tick, 20000)

    return () => clearInterval(interval)
  },[activeQuest])

  return <div className="p-2 flex justify-between">
            <span className="">
              {(questTimecap.hours+'h')}
              {(questTimecap.minutes+'m')}
              / <span style={{color: overtime ? 'red' : 'lime'}}>
                {(questTimer.hours+'h')}
                {(questTimer.minutes+'m')}
              </span>
            </span>
            <span className="text-green-600">150xp</span>
          </div>
}

function QuestDistractionWidget() {
  const { sendDistractionPoint } = useQuestsSC()!;
  const [distractionWidget, setDistractionWidget] = useState<boolean>(false);

  return  <div className={`absolute border border-gray-550 rounded bg-gray-600 p-1 px-3 right-1 top-1 ${!distractionWidget && 'hover:bg-slate-800 hover:cursor-pointer text-xs'}`} 
            onClick={() => !distractionWidget && setDistractionWidget(true)}
            >
            {
            distractionWidget ?
              <div className="flex flex-col text-center hover:cursor-default" id="distraction">
                <span className="font-bold">Tem certeza?</span>
                <div>
                  <button className="button-md px-4 text-sm border-gray-500" onClick={() => {setDistractionWidget(false); sendDistractionPoint()}}>Sim</button>
                  <button className="button-md px-4 text-sm border-gray-500" onClick={() => setDistractionWidget(false)}>Não</button>
                </div>
              </div>
              : 'Distração'
            }
          </div>
}

export function QuestsContext(props: { children: JSX.Element|JSX.Element[] }) {
  const stateController = QuestStateController();
  return (
    <QuestsStateControllerContext.Provider value={stateController}>
      {props.children}
    </QuestsStateControllerContext.Provider>
  )
}



export function CreateNewQuest(props: any) {
  const [type, setType] = useState<'main'|'practice'>();
  const [activeQuestline, setActiveQuestline] = useState(false);

  useEffect(() => {
    (async () => {
      const questline = await QuestlineAPI.getActiveQuestline();
      if (questline)
        setActiveQuestline(true)
    })();
  },[]);

  if (type)
    return <NewQuestForms type={type} setType={() => setType(undefined)} />

  return (
    <div className="">
      <h5>Create new Questline</h5>
      <div className="py-4 flex items-center">
        <button 
          disabled={!activeQuestline}
          style={{opacity:!activeQuestline ? '.3' : '1'}}
          onClick={()=> setType('main')}
          className='px-3 py-1 mx-3 pl-8 border-gray-800 hover:border-purple-800 hover:border-opacity-60 border rounded-sm'>
          Main
        </button>
        <button 
          onClick={()=> setType('practice')}
          className='px-3 py-1 mx-3 pl-8 border-gray-800 hover:border-purple-800 hover:border-opacity-60 border rounded-sm'>
          Practice
        </button>
      </div>
    </div>
  )
}


function NewQuestForms(props: { type: 'main'|'practice'|'mission', setType:() => void}) {
  const {type, setType} = props;
  const { createNewQuest, createNewPracticeQuest } = useQuestsSC()!;

  const [questTitle, setQuestTitle] = useState<string>('');
  const [questDescription, setQuestDescription] = useState<string>('');
  const [questHoras, setQuestHoras] = useState<number>(0);
  const [questMinutes, setQuestMinutes] = useState<number>(0);
  const [todos, setTodos] = useState<string[]>(['']);

  const [skill_id, setSkill_id] = useState('');
  
  return  <div>
            <h4>Criar Quest:</h4>
            <div className="flex flex-col">
              {
                type === 'practice' && <SkillsListing className='m-2 w-3/6 self-end text-black' {...{skill_id, setSkill_id}}/>
              }
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
                <button className="m-2 py-1 px-2 border rounded cursor-pointer" onClick={setType} >Cancelar</button>
                <button className="m-2 py-1 px-4 border rounded cursor-pointer" onClick={() => {
                  if (type === 'main')
                    createNewQuest(questTitle, questDescription, questHoras, questMinutes, type, todos);
                  else if (type === 'practice')
                    createNewPracticeQuest(questTitle, questDescription, questHoras, questMinutes, type, todos, skill_id);
                  setType();
                }}>Criar</button>
              </div>
            </div>
          </div>
}

function SkillsListing(props: any) {
  const { skill_id, setSkill_id } = props;
  const [skills, setSkills] = useState<SkillsAPI.ISkill[]>([]);

  useEffect(() => {
    (async () => {
      const data = await SkillsAPI.getAllSkills();
      setSkills(data);
      
      if (data[0])
        setSkill_id(data[0]._id)
    })();
  },[])

  return (
    <div {...props}>
      <select className="w-full" value={skill_id} onChange={e => setSkill_id(e.target.value)}>
        {
          skills.map((skill:any) => (
            <option value={skill._id}>{skill.name}</option>
          ))
        }
      </select>
    </div>
  )
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