import { useEffect, useState } from "react";
import * as LevelingAPI from "./LevelingAPI";
import * as FeatsAPI from '../Leveling/feats/FeatsAPI';
import * as RecordsAPI from '../Leveling/records/RecordsAPI';

export interface IStatsController {
  player: IPlayer
  day: Date
  weekProgress: IDayProgress[]
  todaysHistory: any[]
  planningHashira: IHashira
  focusHashira: IHashira
  perseverenceHashira: IPerseverenceHashira
  modal: any
  modalHandler(component?: any, props?: any): void
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
    modal,
    modalHandler,
    createNewFeat,
    feats,
    completeFeat,
    records,
    createNewRecord,
    updateRecordLevel
  };
}



export default StatsController