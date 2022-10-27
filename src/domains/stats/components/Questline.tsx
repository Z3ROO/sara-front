import { useEffect, useState } from "react";
import { useStatsController } from "../Stats";
import { IQuestline, IStatsController } from "../StatsStateController";
import { Loading } from "../../_general/Loading";
import { DefaultProps } from "../../_general/types";
import Quest from "./Quest";
import { useMainStateController } from "../../../core/App";

export default function QuestlineList() {
  const controller = useStatsController()!;
  

  return  <div>
            <h1 className="text-xl font-bold">Quest lines:</h1>
            <div className="flex">
              <MainQuestline />
              <SkillQuestlines />
            </div>
          </div>
}

function MainQuestline() {
  const { modalHandler } = useMainStateController()!;
  const { listOfQuestlines } = useStatsController()!;
  const mainQuestline = listOfQuestlines.find(questline => questline.type === 'main');

  return (
    <div 
      className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
      onClick={() => modalHandler(Questline, {questlineId: mainQuestline?._id || 'new_main_questline'})}
      >
      <img className="w-8 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
      <span className="absolute bottom-1 right-1 text-[7px]">M</span>
    </div>
  )
}

function SkillQuestlines() {
  const { modalHandler } = useMainStateController()!;
  const { listOfQuestlines } = useStatsController()!;

  return (
    <>
      {
        listOfQuestlines.filter(ql => ql.type !== 'main')
        .map(questline => {
          return  <div 
                    className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
                    onClick={() => modalHandler(Questline, {questlineId: questline._id})}
                    >
                    <img className="w-8 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
                    <div className="absolute rounded-full w-5 h-5 bg-red-300 font-bold text-xs text-center leading-5 -top-2 -right-2">
                      {8}
                    </div>
                  </div>
        })
      }
      <NewSkillQuestline />
    </>
  )
}

function NewSkillQuestline() {
  const { modalHandler } = useMainStateController()!;

  return (
    <div 
      className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
      onClick={() => modalHandler(Questline, {questlineId: 'new_practice_questline'})}
      >
      <img className="w-6 opacity-50 hover:opacity-100" src="/icons/ui/plus-sign.svg" alt="questlines warnings"/>
    </div>
  )
}

export function Questline(props: DefaultProps) {
  const controller = useStatsController()!;
  const { questlineId } = props;

  
  useEffect(() => {
    if (questlineId !== 'new_main_questline' && questlineId !== 'new_practice_questline')
    controller.fetchQuestlineInfo(questlineId)
  }, []);
  
  if (!controller.questline)
    return <Loading />  

  const { questline, finishQuestline } = controller;
  
  if (questlineId === 'new_main_questline' || questlineId === 'new_practice_questline')
    return  <CreateNewQuestline controller={controller} type={questlineId}/>
  else if (questline)
    return  <div className="rounded p-2 relative">
              <h2 className="font-bold text-sm">{questline.title}</h2>
              <span>{questline.description}</span>
              {
                controller.activeQuest ?
                <Quest verbose={false} controller={controller}/> :
                <div>
                  <CreateNewQuest controller={controller} />
                  <div>
                    <button className="button-md" onClick={finishQuestline}>Finalizar quest line</button>
                  </div>
                </div>
              }
            </div>
  else
    return <Loading />
}

function CreateNewQuestline(props: {controller:IStatsController, type: string}) {
  const controller = useStatsController()!;
  const { type } = props;
  const questlineType = type === 'new_main_questline' ? 'main' : 'practice';
  const [questlineHistory, setQuestlineHistory] = useState<IQuestline[]>([]);
  const [questlineTitle, setQuestlineTitle] = useState<string>('');
  const [questlineDescription, setQuestlineDescription] = useState<string>('');
  const [questlineDuration, setQuestlineDuration] = useState<number>(0);

  useEffect(() => {
    (async function() { 
      setQuestlineHistory(await controller.fetchFinishedQuestlines())
    })();
  },[])

  return  <div>
            <h1>Create a Quest line:</h1>
            <div className="flex">
              <div className="flex flex-col p-1 px-2 w-64">
                <label htmlFor="questline-title" className="flex flex-col">
                Titulo:</label>
                <input type="text" id="questline-title" value={questlineTitle} onChange={(e) => setQuestlineTitle(e.target.value)}/>
                
                <label htmlFor="questline-description" className="flex flex-col">
                Descrição:</label>
                <textarea id="questline-description" className="resize-none h-20" value={questlineDescription} onChange={(e) => setQuestlineDescription(e.target.value)}/>

                <label htmlFor="questline-duration" className="flex flex-col">
                Duração:</label>
                <input type="number" id="questline-duration" placeholder="Quantos dias?" value={questlineDuration} onChange={(e) => setQuestlineDuration(Number(e.target.value))}/>
                
                <button 
                  className="p-1 m-4 border rounded bg-slate-500 hover:cursor-pointer hover:bg-slate-400" 
                  onClick={()=> controller.createNewQuestline(questlineTitle, questlineDescription, questlineDuration, questlineType)}>Criar</button>
              </div>
              <div className="p-1 px-2 ml-6 border-l">
                <h2>Historico de questlines:</h2>
                <div className="flex flex-col overflow-auto">
                  {
                    questlineHistory.map( questline => {
                      return  <div className="p-2 rounded bg-slate-500 m-2">
                                {questline.title}
                              </div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
}

function CreateNewQuest(props: any) {
  const controller = useStatsController()!;
  const { createNewQuest } = controller;
  const [questTitle, setQuestTitle] = useState<string>('');
  const [questDescription, setQuestDescription] = useState<string>('');
  const [questHoras, setQuestHoras] = useState<number>(0);
  const [questMinutes, setQuestMinutes] = useState<number>(0);
  const [todos, setTodos] = useState<string[]>(['']);
  const [questXp, setQuestXp] = useState<number>(50);
  
  return  <>
            <h2>Criar Quest:</h2>
            <div className="flex flex-col p-2">
              <label htmlFor="quest-title">Titulo: </label>
              <input type="text" id="quest-title" value={questTitle} onChange={e => setQuestTitle(e.target.value)}/>
              <label htmlFor="quest-description">Descrição: </label>
              <input type="text" id="quest-description" value={questDescription} onChange={e => setQuestDescription(e.target.value)}/>
              <label htmlFor="quest-timecap-h">Duração: </label>
              <div>
                <label htmlFor="quest-timecap-h">Horas: </label>
                <input type="number" id="quest-timecap-h" value={questHoras} onChange={e => setQuestHoras(Number(e.target.value))}/>
                <label htmlFor="quest-timecap-m">Minutos: </label>
                <input type="number" id="quest-timecap-m" value={questMinutes} onChange={e => setQuestMinutes(Number(e.target.value))}/>
              </div>
              <label htmlFor="quest-title">xp: </label>
              <select defaultValue={questXp} onChange={e => setQuestXp(Number(e.target.value))}>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
              <CreateNewQuestTodosSection todos={todos} setTodos={setTodos} />
              <button className="p-2 border rounded cursor-pointer" onClick={() => createNewQuest(questTitle, questDescription, questHoras, questMinutes, todos, questXp)}>Criar</button>
            </div>
          </>
}

function CreateNewQuestTodosSection(props: any) {
  const { todos, setTodos } = props;

  return  <div>
            {
              todos.map((todo: string, ind:number) => {
                return  <>
                          <label htmlFor={`quest-todo-${ind}`}>To-do {ind+1}: </label>
                          <input type="text" id={`quest-todo-${ind}`} value={todo} 
                            onChange={({target}) => setTodos((current:string[]) => {current[ind] = target.value; return [...current]})}/>
                          <button className="button-icon" onClick={() => {
                              if (todos.length === 1) return
                              const newTodos = [...todos];
                              newTodos.splice(ind, 1);
                              setTodos(newTodos);
                            }
                          }><img className="w-3 fill-red-600" src="/icons/ui/close-x.svg" alt="close-x" /></button>
                        </>
                })
              }
              <button className="button-icon" onClick={() => {
                  const newTodos = [...todos];
                  newTodos[newTodos.length] = ''
                  setTodos(newTodos);
                  }
                }><img className="w-3" src="/icons/ui/plus-sign.svg" alt="close-x" /></button>
            </div>
}