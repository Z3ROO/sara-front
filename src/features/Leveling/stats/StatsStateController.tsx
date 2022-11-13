import { useEffect, useState } from "react";
import * as LevelingAPI from "./LevelingAPI";

export interface IStatsController {
  player: IPlayer
  day: Date
  weekProgress: IDayFeedback[]
  todaysHistory: any[]
  planningHashira: IHashira
  focusHashira: IHashira
  perseverenceHashira: IPerseverenceHashira
  modal: any
  modalHandler(component?: any, props?: any): void
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

export type IDayFeedback = {
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

function StatsController(props: any): IStatsController {
  const [player, setPlayer] = useState<IPlayer>({name: '', level: 0, maestria: '', xp: 0, nextLevelXp: 0, lastLevelXp: 0, freeTime: 0});
  const [day, setDay] = useState<Date>(new Date());
  const [weekProgress, setWeekProgress] = useState<IDayFeedback[]>([]);
  const [todaysHistory, setTodaysHistory] = useState<any[]>([]);
  const [planningHashira, setPlanningHashira] = useState<IHashira>({title: '', level: 0, score: 0});
  const [focusHashira, setFocusHashira] = useState<IHashira>({title: '', level: 0, score: 0});
  const [perseverenceHashira, setPerseverenceHashira] = useState<IPerseverenceHashira>({title: '', level: 0, score: 0, goal: 0});
  
  const [modal, setModal] = useState<any>(null);

  async function fetchStats() {
    const data = await LevelingAPI.fetchLevelingStats();
    
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
  };
}

export default StatsController
