import { useState, useEffect, createContext, useContext } from "react";
import { mlToHours } from "../../../../util/mlToHours";
import { QuestStatusCaller4Taskbar } from "../../../taskbar/components/StatusIconForTaskBar";
import * as QuestsAPI from '../QuestsAPI'
import * as Icons from '../../../../ui/icons/UI'
import { Label } from "../../../../ui/forms";
import * as SkillsAPI from "../../skills/SkillsAPI";
import * as QuestlineAPI from '../../questlines/QuestlinesAPI';
import { Tree, TreeNode } from "../../../../lib/data-structures/GenericTree";
import { IDeed } from "../../deeds/deeds";

// Quests exist to record the details of the action, basicly what I did in this brief period of time.
export interface IQuest {
  _id: string
  questline_id: string|null
  mission_id: string|null
  title: string
  steps: IQuestStep[]
  state: 'active'|'finished'|'invalidated'
  timecap: number|string
  pause: {
    start: Date
    finish: Date
  }[]
  created_at: Date
  distraction_score: number
  focus_quality: number
  finished_at: Date|null
  xp: number|null
}

export type IQuestStep = {
  doable_id: string
  type: 'deed'|'record'
  title: string
  description: string
  todo_list: string[]
  metric?: SkillsAPI.RecordsMetric
  history: SkillsAPI.IDoableHistory
};

export type INewQuestStep = {
  doable_id: string
  description: string
}

export interface INewQuest {
  questline?: boolean
  mission_id?: string
  title: string
  steps: INewQuestStep[]
  timecap: number|string
}

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
  createNewQuest(props: INewQuest): Promise<void>
  handleQuestTodo(description: string, action: 'finish' | 'invalidate'): Promise<void>
  finishQuest(focus_quality: number): Promise<void>
  sendDistractionPoint(): Promise<void>
  doablesMEM: INewQuestStep[]
  setDoablesMEM: React.Dispatch<React.SetStateAction<INewQuestStep[]>>
  includeDoableItem: (doable: INewQuestStep) => void
  questCreation: boolean, 
  setQuestCreation: React.Dispatch<React.SetStateAction<boolean>>
}

const QuestsStateControllerContext = createContext<IQuestsStateController|null>(null);
export const useQuestsSC = () => useContext(QuestsStateControllerContext);

export function QuestStateController(): IQuestsStateController {
  const [activeQuest, setActiveQuest] = useState<IQuest|null>();
  const [questCreation, setQuestCreation] = useState(false);

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

  async function createNewQuest(props: INewQuest) {
    const {
      questline,
      mission_id,
      title,
      timecap,
      steps
    } = props;

    const data = await QuestsAPI.createQuest({
      questline,
      mission_id,
      title,
      timecap,
      steps
    });

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

  async function finishQuest(focus_quality: number) {
    if (!activeQuest)
      return

    const quest_id = activeQuest._id;
    const response = await QuestsAPI.finishQuest({quest_id, focus_quality});

    getActiveQuest();
  }

  async function sendDistractionPoint() {
    await QuestsAPI.insertDistractionPoint();
  }
  const [doablesMEM, setDoablesMEM] = useState<INewQuestStep[]>([]);

  function includeDoableItem(doable: INewQuestStep) {
    setDoablesMEM(prev => [...prev, doable]);
  }
  
  useEffect(() => {
    getActiveQuest();
  }, [])

  return {
    activeQuest,
    createNewQuest,
    handleQuestTodo,
    finishQuest,
    sendDistractionPoint,
    doablesMEM,
    setDoablesMEM,
    includeDoableItem,
    questCreation, setQuestCreation
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
          <QuestStepsSection />
          <QuestFinishSection />
          <QuestFooter activeQuest={activeQuest} />
        </div>
        <QuestDistractionWidget />
      </div>
    </div>
  )
}

function QuestStepsSection() {
  const { activeQuest, handleQuestTodo } = useQuestsSC()!;

  return  <div className="p-2">
            {
              activeQuest && activeQuest.steps.map(
                (step) => {
                  const { doable_id, type, title, description, todo_list, metric, history } = step;

                  if (type === 'deed')
                    return (
                      <div>
                        <h5>{title}</h5>
                        <div>
                          {
                            todo_list.map(todo => {
                              return (
                                <div>
                                  <input type="checkbox" checked={} onChange={e => {}}/>
                                  <span>{todo}</span>
                                  <span> X </span>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    )

                  if (type === 'record')
                    return (
                      <div>
                        
                      </div>
                    )
                }
              )
            }
          </div>
}

function QuestFinishSection() {
  const { activeQuest, finishQuest } = useQuestsSC()!;
  const [focus_quality, setFocus_quality] = useState<number>(0);

  if (!activeQuest?.steps.every((step:any) => step.state !== 'active'))
    return <></>

  return  <div className="flex flex-col items-center p-2">
            <div>
              {Array(11).fill(true).map((x, ind) => <button className={`button-sm ${focus_quality === ind && 'bg-gray-500'} border-gray-550`} onClick={() => setFocus_quality(ind)}>{ind}</button>)}
            </div>
            <button className="button-md border-gray-550" onClick={() => finishQuest(focus_quality)} disabled={focus_quality === 0}>Finalizar quest.</button>
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
  const { createNewQuest, doablesMEM, includeDoableItem, setDoablesMEM, setQuestCreation } = useQuestsSC()!;

  const [questTitle, setQuestTitle] = useState<string>('');
  const [questDescription, setQuestDescription] = useState<string>('');
  const [questHoras, setQuestHoras] = useState<number>(0);
  const [questMinutes, setQuestMinutes] = useState<number>(0);

  useEffect(() => {
    setQuestCreation(true);
    return () => setQuestCreation(false);
  },[])
  
  return  <div>
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
              <CreateNewQuestStepsSection steps={doablesMEM} setSteps={setDoablesMEM} />
              <div className="flex justify-end my-4">
                <button className="m-2 py-1 px-2 border rounded cursor-pointer" onClick={setType} >Cancelar</button>
                <button className="m-2 py-1 px-4 border rounded cursor-pointer" onClick={() => {
                    createNewQuest({
                      questline: type === 'main',
                      title: questTitle,
                      timecap: ((questHoras * 60) + questMinutes) * 60 * 1000, 
                      steps: doablesMEM
                    });
                  setType();
                }}>Criar</button>
              </div>
            </div>
          </div>
}

function SkillsListing(props: any) {
  const { skill_id, setSkill_id } = props;
  const [skills, setSkills] = useState<Tree<SkillsAPI.ISkillNode>[]>([]);

  useEffect(() => {
    (async () => {
      // const data = await SkillsAPI.getSkills();
      // setSkills(data.root.children);
      
      // if (data[0])
      //   setSkill_id(data[0].root.node_id)
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

function CreateNewQuestStepsSection(props: { steps: INewQuestStep[], setSteps: React.Dispatch<React.SetStateAction<INewQuestStep[]>> }) {
  const { steps, setSteps } = props;

  return  <div className="relative">
            <h5>To-do list: </h5>
            {
              steps.map((step, ind) => {
                const { description } = step;
                return  (
                  <div className="flex p-2 pt-1 pr-1">
                    <div>{description}</div>
                    <button className="button-icon bg-red-600" onClick={() => {
                        setSteps(prev => {
                          const newSteps = [...prev];
                          newSteps.splice(ind, 1);
                          return newSteps;
                        });
                      }
                    }>
                      <img className="w-3" src="/icons/ui/close-x.svg" alt="close-x" />
                    </button>
                  </div>
                  )
                })
              }
            </div>
}