import { useState, useEffect } from "react";
import { mlToHours } from "../../../../util/mlToHours";
import { Loading } from "../../../../ui/Loading";
import { Questline, useQuestlineStateController } from '../../questlines/components/Questlines';

export interface INewQuest {
  questline_id?: string
  skill_id?: string
  mission_id?: string
  title: string
  description: string
  type: 'main'|'side'|'mission'|'practice'
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
  type: 'main'|'side'|'mission'|'practice'
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
    return 'text-red-600 text-opacity-60'
  else if (todoState === 'finished')
    return 'line-through text-gray-600 text-opacity-60'
}


export default function Quest(props:any) {
  let { activeQuest, questlines } = useQuestlineStateController()!;
  const verbose: boolean = props.verbose === undefined ? true : props.verbose;

  if (!activeQuest || !questlines.active)
    return <Loading />

  const questline = questlines.active

  return  <div className="relative w-96">
            <div className="bg-cyan-700 rounded p-2">
              {verbose === true && <h2 className="font-bold text-sm cursor-pointer" onClick={() => {}}>{questline.title}</h2>}
              <h3 className="text-lg">{activeQuest.title}</h3>
              <QuestTodosSection />
              <QuestFinishSection />
              <QuestFooter activeQuest={activeQuest} />
            </div>
            <QuestDistractionWidget />
          </div>
}

function QuestTodosSection() {
  const { activeQuest, handleQuestTodo } = useQuestlineStateController()!;

  return  <div>
            {
              activeQuest && activeQuest.todos.map(
                (todo) => <div>
                            <input type="checkbox" checked={todo.state==='finished'} onClick={() => handleQuestTodo(todo.description, 'finish')}/>
                            <span className={`${todoStyleClasses(todo.state)} mx-3 text-lg`}>{todo.description}</span>
                            <button className="opacity-10 hover:opacity-100" onClick={() => handleQuestTodo(todo.description, 'invalidate')}><img className="w-3" src="/icons/ui/close-x.svg" alt="close-x" /></button>
                          </div>
              )
            }
          </div>
}

function QuestFinishSection() {
  const { activeQuest, finishQuest } = useQuestlineStateController()!;
  const [focusScore, setFocusScore] = useState<number>(0);

  if (!activeQuest?.todos.every((todo:any) => todo.state !== 'active'))
    return <></>

  return  <div className="flex flex-col items-center">
            <div>
              {Array(11).fill(true).map((x, ind) => <button className={`button-sm ${focusScore === ind && 'bg-slate-700'}`} onClick={() => setFocusScore(ind)}>{ind}</button>)}
            </div>
            <button className="button-md" onClick={() => finishQuest(focusScore)} disabled={focusScore === 0}>Finalizar quest.</button>
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
      }
      setQuestTimer(mlToHours(timePassed));
    }

    tick();
    const interval = setInterval(tick, 20000)

    return () => clearInterval(interval)
  },[activeQuest])

  return <div className="flex justify-between">
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
  const { sendDistractionPoint } = useQuestlineStateController()!;
  const [distractionWidget, setDistractionWidget] = useState<boolean>(false);

  return  <div className={`absolute border rounded bg-slate-400 p-1 px-3 right-1 top-1 ${!distractionWidget && 'hover:bg-slate-800 hover:cursor-pointer text-xs'}`} 
            onClick={() => !distractionWidget && setDistractionWidget(true)}
            >
            {
            distractionWidget ?
              <div className="flex flex-col text-center hover:cursor-default" id="distraction">
                <span className="font-bold">Tem certeza?</span>
                <div>
                  <button className="button-md" onClick={() => {setDistractionWidget(false); sendDistractionPoint()}}>Sim</button>
                  <button className="button-md" onClick={() => setDistractionWidget(false)}>Não</button>
                </div>
              </div>
              : 'Distração'
            }
          </div>
}