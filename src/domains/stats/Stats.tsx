import { useContext, useEffect, useState } from "react";
import { AppControllerContext, IAppController } from "../../core/App"
import { Link } from "../../lib/Router";
import StatsController, { IDayProgress, IQuestLine, IStatsController } from "./StatsStateController";

interface IStatsProps {
  AppController?: IAppController;
  path?: string;
}

function mlToHours(milliseconds:number): {hours:number, minutes:number} {
  const oneHour = 3600000;
  const oneMinute = 60000;
  const hours = Math.floor(milliseconds/oneHour);
  const minutes = Math.floor(milliseconds%oneHour / oneMinute);
  return {hours, minutes}
}

function Stats(props:IStatsProps) {
  const AppController = useContext(AppControllerContext);
  const controller = StatsController({AppController});

  return  <div className="h-full w-full flex">
            <div className="flex flex-col p-3 text-white bg-slate-800">
              <Link href="/notes">Testando testes</Link>
              <Link href="/">Testando testes só que para home</Link>
                <PlayerInfo controller={controller} />
                <PassiveSkills controller={controller} />
                <Hashiras controller={controller} />
                {
                  controller.activeQuest ? 
                  <Quest controller={controller}/> : 
                  <QuestLineList  controller={controller}/>
                }
                <History controller={controller} />
            </div>
            <div className="bg-slate-500 w-full">                  
                <Feats controller={controller} />
                <Records controller={controller} />
                <div>
                  
                </div>
            </div>
            
            {controller.modal && <Modal controller={controller} />}
          </div>
}

function PlayerInfo(props: any) {
  const controller = props.controller;

  const { player } = controller;
  const freeTime = mlToHours(player.freeTime);

  return  <div className="flex flex-col bg-slate-700 rounded p-1">
            <div className="flex p-2">
              <div>
                <img src='/icons/icon.png' alt='Maestria' width={'75px'}/>
              </div>
              <div className="flex flex-col w-full text-right">
                <div className="flex justify-between">
                  <div className="flex flex-col justify-between">
                    <WeekProgress weekProgress={controller.weekProgress}/>
                    <span className="text-sm ml-1">Free time: {freeTime.hours}h {freeTime.minutes}m</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">
                      {player.name} <span className="text-blue-300">Lv. {player.level}</span>
                    </span>
                    <span className="text-lg">{player.maestria}</span>
                  </div>
                </div>
                <NextLevelProgressBar controller={controller} />
              </div>
            </div>
            <div>
              
            </div>
          </div>
}

function NextLevelProgressBar(props: any) {  
  const { player } = props.controller;
  const nextLevelXpPercentage = Math.floor((player.xp - player.lastLevelXp) / (player.nextLevelXp - player.lastLevelXp) * 100);

  return  <div className="flex">
            <div className={`bg-green-800 h-0.5`} style={{width:nextLevelXpPercentage+'%'}}></div>
            <div className={`bg-red-800 h-0.5`} style={{width:100-nextLevelXpPercentage+'%'}}></div>
          </div>
}

function WeekProgress(props: {weekProgress: IDayProgress[]}) {
  const weekProgress = props.weekProgress;
  const weekDay = new Date().getDay();

  return  <div className="flex mt-3 ml-1">
            {
              weekProgress.map((dayProgress, index) => <DayOfWeekProgress dayProgress={dayProgress} today={weekDay === index}/>)
            }
          </div>
}

function DayOfWeekProgress(props: {dayProgress: IDayProgress, today: boolean}) {
  const { dayProgress, today } = props;
  const dayStatusColor = ['border', 'bg-gray-500', 'bg-green-500', 'bg-red-500'];

  return <div className={`rounded-full w-2 h-2 m-0.5 relative group ${dayStatusColor[dayProgress.status]} ${today && 'border-green-600'}`}>
          <div className="absolute bottom-4 -left-2.5 bg-gray-200 w-7 h-5 rounded-sm text-center leading-4 hidden group-hover:block">
            <div className="absolute w-0 h-0 border-0 border-x-4 border-t-4 border-x-transparent -bottom-1 left-2.5"></div>
            <span className="text-xs text-black">{mlToHours(dayProgress.hours).hours}</span>
          </div>
        </div>
}

function PassiveSkills(props: any) {
  return <div className="flex">
          <div className="bg-slate-600 rounded p-1 m-1 w-4 h-4 flex justify-center items-center relative">
            <img className="w-2 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
          </div>
          <div className="bg-red-500 rounded p-1 m-1 w-4 h-4 flex justify-center items-center relative">
            <img className="w-2 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
          </div>
          <div className="bg-slate-600 rounded p-1 m-1 w-4 h-4 flex justify-center items-center relative">
            <img className="w-2 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
          </div>
        </div>
}

function Hashiras(props: any) {
  const controller = props.controller;
  const {planningHashira, focusHashira, perseverenceHashira, weekProgress, day} = controller;

  const weekDay = day.getDay();
  const perseverenceProgress = Math.floor(weekProgress[weekDay]?.hours/perseverenceHashira.goal * 100) || 0;

  return  <div className="flex h-32">
            <Hashira hashira={planningHashira}/>
            <Hashira hashira={focusHashira} />
            <Hashira hashira={perseverenceHashira}>
              {
                perseverenceProgress < 100 &&
                <div className="absolute top-0">
                  <img className="w-12" src="/icons/progress-circle.png" alt="perseverence-progress"/>
                  <span className="absolute top-2.5 right-2">{perseverenceProgress}%</span>
                </div>
              }
            </Hashira>
          </div>
}

function Hashira(props:any) {
  const {hashira} = props;

  return  <div className="flex flex-col items-center w-28 h-28 m-2 p-2 relative rounded cursor-pointer hover:z-10 hover:scale-125 hover:h-32 bg-slate-800 hover:border transition-transform group">
            <span className="mb-2 font-bold text-sky-200">{hashira.title}</span>
            <div className="relative">
              <img className={`w-12 ${props.children && 'blur-sm'}`} src='/icons/icon1.png' alt={'Pilar de '+hashira.name}/>
              {props.children && props.children}
            </div>
            <span className={`hidden group-hover:block text-[11px]`}>{hashira.name} <strong>Lv.{hashira.level}</strong></span>
            <span className={`absolute bottom-1 right-1 ${hashira.todaysEarnings > 0 ? 'text-green-500' : 'text-red-500'} group-hover:hidden`}>{hashira.todaysEarnings > 0 ? '+'+hashira.todaysEarnings : hashira.todaysEarnings}</span>
          </div>
}

function QuestLineList(props:{controller: IStatsController}) {
  const { controller } = props;
  const mainQuestLine = controller.listOfQuestLines.find(questLine => questLine.type === 'main');

  return  <div>
            <h1 className="text-xl font-bold">Quest lines:</h1>
            <div className="flex">
              <div 
                className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
                onClick={() => controller.modalHandler(QuestLine, {questLineId: mainQuestLine?._id || 'new_main_questline'})}
                >
                <img className="w-8 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
                <span className="absolute bottom-1 right-1 text-[7px]">M</span>
              </div>
              {
                controller.listOfQuestLines.filter(ql => ql.type !== 'main')
                .map(questLine => {
                  return  <div 
                            className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
                            onClick={() => controller.modalHandler(QuestLine, {questLineId: questLine._id})}
                            >
                            <img className="w-8 opacity-50 hover:opacity-100" src="/icons/icon1.png" alt="questlines warnings"/>
                            <div className="absolute rounded-full w-5 h-5 bg-red-300 font-bold text-xs text-center leading-5 -top-2 -right-2">
                              {8}
                            </div>
                          </div>
                })
              }
              <div 
                className="relative bg-slate-600 rounded p-1 m-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer" 
                onClick={() => controller.modalHandler(QuestLine, {questLineId: 'new_practice_questline'})}
                >
                <img className="w-6 opacity-50 hover:opacity-100" src="/icons/ui/plus-sign.svg" alt="questlines warnings"/>
              </div>
            </div>
          </div>
}

function QuestLine(props: any) {
  const { controller, questLineId } = props;

  const { questLine, finishQuestLine } = controller;

  useEffect(() => {
    if (questLineId !== 'new_main_questline' && questLineId !== 'new_practice_questline')
      controller.fetchQuestLineInfo(questLineId)
  }, []);
  
  
  if (questLineId === 'new_main_questline' || questLineId === 'new_practice_questline')
    return  <CreateNewQuestLine controller={controller} type={questLineId}/>
  else if (questLine)
    return  <div className="rounded p-2 relative">
              <h2 className="font-bold text-sm">{questLine.title}</h2>
              <span>{questLine.description}</span>
              {
                controller.activeQuest ?
                <Quest verbose={false} controller={controller}/> :
                <div>
                  <CreateNewQuest controller={controller} />
                  <div>
                    <button className="button-md" onClick={finishQuestLine}>Finalizar quest line</button>
                  </div>
                </div>
              }
            </div>
  else
    return <Loading />
}

function CreateNewQuestLine(props: {controller:IStatsController, type: string}) {
  const { controller, type } = props;
  const questLineType = type === 'new_main_questLine' ? 'main' : 'practice';
  const [questLineHistory, setQuestLineHistory] = useState<IQuestLine[]>([]);
  const [questLineTitle, setQuestLineTitle] = useState<string>('');
  const [questLineDescription, setQuestLineDescription] = useState<string>('');
  const [questLineDuration, setQuestLineDuration] = useState<number>(0);

  useEffect(() => {
    (async function() { 
      setQuestLineHistory(await controller.fetchFinishedQuestLines())
    })();
  },[])

  return  <div>
            <h1>Create a Quest line:</h1>
            <div className="flex">
              <div className="flex flex-col p-1 px-2 w-64">
                <label htmlFor="questline-title" className="flex flex-col">
                Titulo:</label>
                <input type="text" id="questline-title" value={questLineTitle} onChange={(e) => setQuestLineTitle(e.target.value)}/>
                
                <label htmlFor="questline-description" className="flex flex-col">
                Descrição:</label>
                <textarea id="questline-description" className="resize-none h-20" value={questLineDescription} onChange={(e) => setQuestLineDescription(e.target.value)}/>

                <label htmlFor="questline-duration" className="flex flex-col">
                Duração:</label>
                <input type="number" id="questline-duration" placeholder="Quantos dias?" value={questLineDuration} onChange={(e) => setQuestLineDuration(Number(e.target.value))}/>
                
                <button 
                  className="p-1 m-4 border rounded bg-slate-500 hover:cursor-pointer hover:bg-slate-400" 
                  onClick={()=> controller.createNewQuestLine(questLineTitle, questLineDescription, questLineDuration, questLineType)}>Criar</button>
              </div>
              <div className="p-1 px-2 ml-6 border-l">
                <h2>Historico de questlines:</h2>
                <div className="flex flex-col overflow-auto">
                  {
                    questLineHistory.map( questLine => {
                      return  <div className="p-2 rounded bg-slate-500 m-2">
                                {questLine.title}
                              </div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
}

function CreateNewQuest(props: any) {
  const { createNewQuest, modalHandler } = props.controller;
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

function todoStyleClasses(todoState: string) {
  if (todoState === 'active')
    return ''
  else if (todoState === 'invalidated')
    return 'text-red-600 text-opacity-60'
  else if (todoState === 'finished')
    return 'line-through text-gray-600 text-opacity-60'
}

function Quest(props:any) {
  let controller = props.controller;  
  const verbose: boolean = props.verbose === undefined ? true : props.verbose;
  const {activeQuest, questLine} = controller;

  if (!activeQuest || !questLine)
    return <Loading />

  return  <div className="relative w-96">
            <div className="bg-cyan-700 rounded p-2">
              {verbose === true && <h2 className="font-bold text-sm cursor-pointer" onClick={() => controller.modalHandler(QuestLine)}>{questLine.title}</h2>}
              <h3 className="text-lg">{activeQuest.title}</h3>
              <QuestTodosSection controller={controller} />
              <QuestFinishSection controller={controller} />
              <QuestFooter activeQuest={activeQuest} />
            </div>
            <QuestDistractionWidget controller={controller} />
          </div>
}

function QuestTodosSection(props: any) {
  const { activeQuest, handleQuestTodo } = props.controller;

  return  <div>
            {
              activeQuest.todos.map(
                (todo:any) => <div>
                                <span className={`${todoStyleClasses(todo.state)}`}>{todo.description}</span>
                                <button className="button-sm" onClick={() => handleQuestTodo(todo.id, 'finish')}>C</button>
                                <button className="button-icon" onClick={() => handleQuestTodo(todo.id, 'invalidate')}><img className="w-3" src="/icons/ui/close-x.svg" alt="close-x" /></button>
                              </div>
                        )
            }
          </div>
}

function QuestFinishSection(props: any) {
  const { activeQuest, finishQuest } = props.controller;
  const [focusScore, setFocusScore] = useState<number>(0);

  if (!activeQuest.todos.every((todo:any) => todo.state !== 'active'))
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

function QuestDistractionWidget(props: any) {
  const { sendDistractionPoint } = props.controller;
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

function History(props: any) {
  const { todaysHistory } = props.controller;

  return  <div>
            <h1 className="text-xl font-bold">Histórico:</h1>
            <div>
              {
                todaysHistory.map(
                  ({type, body}: any) =>  <div className={`p-2 m-1 rounded flex ${body.state === 'invalidated' ? 'bg-red-500' : 'bg-green-500'}`}>
                                            <div className="grow">
                                              <span>{type} : </span><span>{body.title}</span>
                                            </div>
                                            <span>{body.xp}</span>{body.boostXp && <span className="text-xs">{`(+${body.boostXp})`}</span>}<span>xp</span>                                            
                                          </div>
                )
              }
              { todaysHistory.length === 0 && <span>Nenhuma atividade registrada.</span> }
            </div>
          </div>
}

function Feats(props: {controller: IStatsController}) {
  const { controller } = props;

  if (controller.feats.length === 0)
    return  <Loading/>

  return  <div>
            <div>
              <span>Feats: </span>
              <button className="button-icon" onClick={() => controller.modalHandler(CreateNewFeat)}>
                <img className="w-4" src="/icons/ui/plus-sign.svg" alt="add-feat" />
              </button>
            </div>            
            <div>
              {
                controller.feats.map(feat => {
                  return  <div className="button-sm">
                            <span>{feat.title} {feat.completed && 'complete'}</span>
                            {!feat.completed && <button className="button-sm" onClick={() => controller.completeFeat(feat._id!)}>finish</button>}
                          </div>
                })
              }
            </div>
          </div>
}

function CreateNewFeat(props: {controller: IStatsController}) {
  const { controller } = props;

  const [featTitle, setFeatTitle] = useState<string>('');
  const [featDescription, setFeatDescription] = useState<string>('');
  const [featCategory, setFeatCategory] = useState<string>('');
  const [featTier, setFeatTier] = useState<number>(1);
  const [featQuestLine, setFeatQuestLine] = useState<string>('');

  return  <div>
            <h1>Criar um novo feito:</h1>
            <div className="flex flex-col">
              <label>Titulo: </label>
              <input id="feat-title" type="text" value={featTitle} onChange={e => setFeatTitle(e.target.value)}/>
              <label>Descrição: </label>
              <input id="feat-description" type="text" value={featDescription} onChange={e => setFeatDescription(e.target.value)}/>
              <label>Categoria: </label>
              <input id="feat-category" type="text" value={featCategory} onChange={e => setFeatCategory(e.target.value)}/>
              <div>
                <h2>Tier: </h2>
                <label>1 </label>
                <input name="feat-tier" type="radio" value="1" onChange={e => setFeatTier(Number(e.target.value))} checked={featTier===1}/>
                <label>2 </label>
                <input name="feat-tier" type="radio" value="2" onChange={e => setFeatTier(Number(e.target.value))} />
                <label>3 </label>
                <input name="feat-tier" type="radio" value="3" onChange={e => setFeatTier(Number(e.target.value))} />
              </div>
              <label>Quest Line: </label>
              <select onChange={e => setFeatQuestLine(e.target.value)}>
                {
                  controller.listOfQuestLines.map(questLine => {
                    if (questLine.type === 'main' && featQuestLine === '')
                      setFeatQuestLine(questLine._id);
                    return <option value={questLine._id}>{questLine.title}</option>
                  })
                }
              </select>
              <button className="button-md"
                onClick={() => controller.createNewFeat(featTitle, featDescription, featCategory, featTier, featQuestLine)}
              >Criar</button>
            </div>
          </div>
}

function Records(props: {controller: IStatsController}) {
  const { controller } = props;

  if (controller.records.length === 0)
    return  <Loading/>

  return  <div>
            <div>
              <span>Records: </span>
              <button className="button-icon" onClick={() => controller.modalHandler(CreateNewRecord)}>
                <img className="w-4" src="/icons/ui/plus-sign.svg" alt="add-record" />
              </button>
            </div>
            <div>
              {
                controller.records.map(record => {
                  return  <div className="button-sm">
                            <span>{record.title} - {record.level}</span>
                            <button className="button-sm" onClick={() => controller.updateRecordLevel(record._id!)}>Uppar</button>
                          </div>
                })
              }
            </div>
          </div>
}

function CreateNewRecord(props: {controller: IStatsController}) {
  const { controller } = props;

  const [recordTitle, setRecordTitle] = useState<string>('');
  const [recordDescription, setRecordDescription] = useState<string>('');
  const [recordQtd, setRecordQtd] = useState<number>(0);
  const [recordCategories, setRecordCategories] = useState<string>('');
  const [recordTier, setRecordTier] = useState<number>(1);
  const [recordQuestLine, setRecordQuestLine] = useState<string>('');
  

  return  <div>
            <h1>Criar um novo Recorde:</h1>
            <div className="flex flex-col">
              <label>Titulo: </label>
              <input id="record-title" type="text" value={recordTitle} onChange={e => setRecordTitle(e.target.value)}/>
              <label>Descrição: </label>
              <input id="record-description" type="text" value={recordDescription} onChange={e => setRecordDescription(e.target.value)}/>
              <label>Quantidade: </label>
              <input id="record-qtd" type="text" value={recordQtd} onChange={e => setRecordQtd(Number(e.target.value))}/>
              <label>Categoria: </label>
              <input id="record-categories" type="text" value={recordCategories} onChange={e => setRecordCategories(e.target.value)}/>
              <div>
                <h2>Tier: </h2>
                <label>1 </label>
                <input name="record-tier" type="radio" value="1" onChange={e => setRecordTier(Number(e.target.value))} checked={recordTier===1}/>
                <label>2 </label>
                <input name="record-tier" type="radio" value="2" onChange={e => setRecordTier(Number(e.target.value))} />
                <label>3 </label>
                <input name="record-tier" type="radio" value="3" onChange={e => setRecordTier(Number(e.target.value))} />
              </div>
              <label>Quest Line: </label>
              <select onChange={e => setRecordQuestLine(e.target.value)}>
                {
                  controller.listOfQuestLines.map(questLine => {
                    if (questLine.type === 'main' && recordQuestLine === '')
                      setRecordQuestLine(questLine._id);
                    return <option value={questLine._id}>{questLine.title}</option>
                  })
                }
              </select>
              <button className="button-md"
                onClick={() => controller.createNewRecord(recordTitle, recordDescription, recordQtd, recordCategories, recordTier, recordQuestLine)}
              >Criar</button>
            </div>
          </div>
}


function Loading() {
  return  <div className="p-2 m-2">Loading...</div>
}

function Modal(props: any) {
  const controller = props.controller;
  const { modal, modalHandler } = controller;

  return  <div className="absolute w-full h-full bg-slate-300 bg-opacity-30 top-0 left-0 flex justify-center items-center">
            <div className="bg-slate-600 rounded p-4 relative shadow-lg">
              <div>
                {modal.component({controller, ...modal.props})}
              </div>
                <img 
                  className="absolute p-1 hover:cursor-pointer hover:bg-slate-700 top-1 right-1 rounded w-6" 
                  src="/icons/ui/close-x.svg" 
                  onClick={() => modalHandler()} 
                  alt={'close-x'}
                />
            </div>
          </div>
}

export default Stats

//https://coolors.co/palette/000001-282244-eaecf3-cdbfe3-8681bc