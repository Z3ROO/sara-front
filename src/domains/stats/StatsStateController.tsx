import { useEffect, useState } from "react";
import * as LevelingAPI from "./LevelingAPI";
import * as QuestsAPI from './QuestsAPI';
import * as FeatsAPI from './FeatsAPI';
import * as RecordsAPI from './RecordsAPI';

export interface IStatsController {
  player: IPlayer
  day: Date
  weekProgress: IDayProgress[]
  todaysHistory: any[]
  planningHashira: IHashira
  focusHashira: IHashira
  perseverenceHashira: IPerseverenceHashira
  listOfQuestlines: IQuestline[]
  activeQuest: IQuest|null
  questline: IQuestline|null
  fetchQuestlineInfo(questline_id?: string): void
  modal: any
  modalHandler(component?: any, props?: any): void
  createNewQuest(title: string, description: string, horas: number, minutes: number, todos: string[], xp: number): Promise<void>
  handleQuestTodo(todoId: string, action: 'finish' | 'invalidate'): Promise<void>
  finishQuest(focusScore: number, questId?: string): Promise<void>
  sendDistractionPoint(): Promise<void>
  finishQuestline(): Promise<void>
  fetchFinishedQuestlines(): Promise<IQuestline[]>
  createNewQuestline(title: string, descrition: string, duration: number, type: string): Promise<void>
  createNewFeat(title: string, description: string, category: string, tier: number, questline: string): Promise<void>
  feats: IFeats[]
  completeFeat(featId: string): Promise<void>
  records: IRecords[]
  createNewRecord(title: string, description: string, qtd: number, categories: string, tier: number, questline: string): void
  updateRecordLevel(recordId: string): void
}

export interface IPlayer {
  name: string
  level: number
  maestria: string
  xp: number
  nextLevelXp: number
  lastLevelXp: number  
  freeTime: number
}

export type IDayProgress = {
  hours: number
  status: 0|1|2|3
}

export interface IHashira {
  title: string
  level: number
  score: number
}

export interface IPerseverenceHashira extends IHashira {
  goal: number
}

interface IQuest {
  _id: string
  questline_id: string
  mission_id: string|null
  title: string
  description: string
  type: 'main'|'side'|'mission'
  state: 'active'|'deferred'|'finished'|'invalidated'
  todos: {
    description: string
    state: 'invalidated'|'finished'|'active'
    finished_at: Date|null
  }[]
  timecap: number|string
  focus_score: number|null
  distraction_score: number|null
  created_at: Date
  finished_at: Date|null
  xp: number
}


export interface IQuestline {
  _id: string
  title: string
  description: string
  type: 'main'|'practice'
  state: 'active'|'finished'|'invalidated'
  timecap: number|string
  created_at: Date
  finished_at: Date|null
  level: number|null
  history: levelHistory|null
  xp: number|null
}

interface IFeats {
  _id?:string
  id: string
  questline_id: string
  title: string
  description: string
  categories: string
  type: 'feat'|'record'
  tier: number
  level: number
  completed: boolean
  xp: number
  finished_at?: string
}

type levelHistory = {direction:-1|0|1, date: Date}[]

export interface IRecords {
  _id: string
  questline_id: string|null
  title: string
  description: string
  acceptance: {
    stage: 'created'|'reviewed'|'ready',
    date: Date[]
  }
  metric: 'unit'|'time'|'distance'
  status: {
    waitTime: number
    stageAmount: number
    stage?: number|null
    last_commitment?: Date|null
  }
  categories: string[]
  level: number
  history: levelHistory
  xp: number
}

function StatsController(props: any): IStatsController {
  const [player, setPlayer] = useState<IPlayer>({name: '', level: 0, maestria: '', xp: 0, nextLevelXp: 0, lastLevelXp: 0, freeTime: 0});
  const [day, setDay] = useState<Date>(new Date());
  const [weekProgress, setWeekProgress] = useState<IDayProgress[]>([]);
  const [todaysHistory, setTodaysHistory] = useState<any[]>([]);
  const [planningHashira, setPlanningHashira] = useState<IHashira>({title: '', level: 0, score: 0});
  const [focusHashira, setFocusHashira] = useState<IHashira>({title: '', level: 0, score: 0});
  const [perseverenceHashira, setPerseverenceHashira] = useState<IPerseverenceHashira>({title: '', level: 0, score: 0, goal: 0});
  const [listOfQuestlines, setListOfQuestlines] = useState<IQuestline[]>([]);
  const [activeQuest, setActiveQuest] = useState<IQuest|null>(null);
  const [questline, setQuestline] = useState<IQuestline|null>(null);
  const [feats, setFeats] = useState<IFeats[]>([]);
  const [records, setRecords] = useState<IRecords[]>([]);
  const [modal, setModal] = useState<any>(null);

  async function fetchStats() {
    const data = await LevelingAPI.fetchLevelingStats();
    
    console.log('asdasdasd')
    setPlayer({
      name: data.player,
      level: data.level,
      maestria: data.maestria,
      xp: data.xp,
      nextLevelXp: data.nextLevelXp,
      lastLevelXp: data.lastLevelXp,
      freeTime: data.freeTime
    });
    setDay(new Date(data.day));
    setWeekProgress(data.weekProgress);
    setTodaysHistory(data.todaysHistory);
    setPlanningHashira(data.hashiras.planning);
    setFocusHashira(data.hashiras.focus);
    setPerseverenceHashira(data.hashiras.perseverence);
    fetchActiveQuest();
  }

  async function fetchActiveQuest() {
    const data = await QuestsAPI.getActiveQuest();
    
    if (data != null){
      fetchListOfQuestlines();
      if (activeQuest) 
        setActiveQuest(null);
    }
    else{
      setActiveQuest(data);
      fetchQuestlineInfo(data.questline_id);
    } 
  }

  async function fetchQuestlineInfo(questline_id?: string) {
    if (!questline_id && activeQuest)
      questline_id = activeQuest.questline_id;
    else
      return
    
    const data = await QuestsAPI.getQuestlineInfo(questline_id);

    setQuestline(data);
  }

  async function fetchListOfQuestlines() {
    const data = await QuestsAPI.getQuestlines();
    console.log(data)
    setListOfQuestlines(data);
    fetchFeats();
    fetchRecords();
  }

  async function createNewQuest(title: string, description: string, horas: number, minutes: number, todos: string[], xp: number) {
    if (!questline)
      throw new Error('No questline found.')

    const type = questline.type === 'main' ? 'main' : 'practice';

    const newQuest = {
      questline: questline._id,
      title,
      description,
      timecap: (minutes + (horas*60))*60000,
      todos,
      xp,
      type
    }

    const data = await QuestsAPI.createQuest(newQuest);

    fetchActiveQuest();
  }

  async function handleQuestTodo(description: string, action: 'finish'|'invalidate') {
    if (!activeQuest)
      throw  new Error('Must have an activeQuest');
    
    const quest_id = activeQuest._id;

    const response = await QuestsAPI.handleQuestTodo({
      quest_id,
      description,
      action
    });

    fetchActiveQuest();
  }

  async function finishQuest(focusScore: number, quest_id: string) {

    const response = await QuestsAPI.finishQuest({quest_id, focusScore});

    fetchActiveQuest();
  }

  async function sendDistractionPoint() {
    await QuestsAPI.insertDistractionPoint();
  }

  async function finishQuestline() {
    await QuestsAPI.finishMainQuestline();

    fetchStats();
    setModal(null);
  }

  async function fetchFinishedQuestlines(): Promise<IQuestline[]> {
    const response = await QuestsAPI.allFinishedQuestlines();
    return response;
  }

  async function createNewQuestline(title: string, descrition: string, duration: number, type: string): Promise<void> {
    const response = await QuestsAPI.newQuestline({
      title,
      descrition,
      duration, 
      type
    });

    setQuestline(response);
    fetchListOfQuestlines();
  }

  async function createNewFeat(title: string, description: string, category: string, tier: number, questline: string) {

    const response = await FeatsAPI.newFeat({
      title,
      description,
      category,
      tier,
      questline_id: questline
    });
    
    setModal(null);
    fetchFeats();
  }

  async function fetchFeats() {
    const response = await FeatsAPI.getFeats();

    setFeats(response);
  }

  async function completeFeat(featId: string) {
    await FeatsAPI.completeFeat(featId);

    fetchFeats();
  }

  async function fetchRecords() {
    const response = await RecordsAPI.getRecords();
    setRecords(response);
  }



  async function createNewRecord({
    questline_id,
    title,
    description,
    categories,
    metric,
    waitTime,
    stageAmount
  }:any) {
    await RecordsAPI.newRecord({
      questline_id,
      title, 
      description,
      categories,
      metric,
      status: {
        waitTime,
        stageAmount,
      }
    });

    fetchRecords();
  }

  async function updateRecordLevel(record_id: string) {

    const response = await RecordsAPI.levelUpRecord(record_id);

    fetchRecords();
  }

  function modalHandler(component?: any, props?: any) {
    if (!component)
      return setModal(null)
    
    setModal({component, props});
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    player,
    day,
    weekProgress,
    todaysHistory,
    planningHashira,
    focusHashira,
    perseverenceHashira,
    listOfQuestlines,
    activeQuest,
    questline,
    fetchQuestlineInfo,
    modal,
    modalHandler,
    createNewQuest,
    handleQuestTodo,
    finishQuest,
    sendDistractionPoint,
    finishQuestline,
    fetchFinishedQuestlines,
    createNewQuestline,
    createNewFeat,
    feats,
    completeFeat,
    records,
    createNewRecord,
    updateRecordLevel
  };
}



export default StatsController