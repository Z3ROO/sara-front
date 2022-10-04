import { useEffect, useState } from "react";

export interface IStatsController {
  player: IPlayer
  day: Date
  weekProgress: IDayProgress[]
  todaysHistory: any[]
  planningHashira: IHashira
  focusHashira: IHashira
  perseverenceHashira: IPerseverenceHashira
  listOfQuestLines: IQuestLine[]
  activeQuest: IQuest|null
  questLine: IQuestLine|null
  fetchQuestLineInfo(questline_id?: string): void
  modal: any
  modalHandler(component?: any, props?: any): void
  createNewQuest(title: string, description: string, horas: number, minutes: number, todos: string[], xp: number): Promise<void>
  handleQuestTodo(todoId: string, action: 'finish' | 'invalidate'): Promise<void>
  finishQuest(focusScore: number, questId?: string): Promise<void>
  sendDistractionPoint(): Promise<void>
  finishQuestLine(): Promise<void>
  fetchFinishedQuestLines(): Promise<IQuestLine[]>
  createNewQuestLine(title: string, descrition: string, duration: number, type: string): Promise<void>
  createNewFeat(title: string, description: string, category: string, tier: number, questLine: string): Promise<void>
  feats: IFeats[]
  completeFeat(featId: string): Promise<void>
  records: IRecords[]
  createNewRecord(title: string, description: string, qtd: number, categories: string, tier: number, questLine: string): void
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
  id: string
  questline_id: string
  title: string
  description: string
  type: 'main'|'side'|'practice'
  state: 'active'|'deferred'|'finished'|'invalidated'
  timecap: number|string
  focus_score?: number
  distraction_score?: number
  created_at: string
  finished_at?: string
  xp: number
  todos: IQuestTodo[]
}

interface IQuestTodo {
  id: number
  quest_id: number
  description: string
  state: 'invalidated'|'finished'|'active'
  finished_at?: string
}

export interface IQuestLine {
  id: string
  title: string
  description: string
  type: 'main'|'practice'
  state: 'active'|'finished'|'invalidated'
  timecap: number|string
  created_at: string
  finished_at?: string
  xp: number
}

interface IFeats {
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

export interface IRecords {
  id: string
  questline_id: string
  title: string
  description: string
  qtd: number
  categories: string
  tier: number
  level: number
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
  const [listOfQuestLines, setListOfQuestLines] = useState<IQuestLine[]>([]);
  const [activeQuest, setActiveQuest] = useState<IQuest|null>(null);
  const [questLine, setQuestLine] = useState<IQuestLine|null>(null);
  const [feats, setFeats] = useState<IFeats[]>([]);
  const [records, setRecords] = useState<IRecords[]>([]);
  const [modal, setModal] = useState<any>(null);

  async function fetchStats() {
    const get = await fetch('/leveling/stats');
    const data = await get.json();

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
    const get = await fetch('/leveling/active-quest');
    const data = await get.json();

    if (data === 'no_quest_activated'){
      fetchListOfQuestLines();
      if (activeQuest) 
        setActiveQuest(null);
    }
    else{
      setActiveQuest(data);
      fetchQuestLineInfo(data.questline_id);
    } 
  }

  async function fetchQuestLineInfo(questline_id?: string) {
    if (!questline_id && activeQuest)
      questline_id = activeQuest.questline_id;

    const get = await fetch(`/leveling/questline/info/${questline_id}`);
    const data = await get.json();

    setQuestLine(data);
  }

  async function fetchListOfQuestLines() {
    const get = await fetch(`/leveling/questline/list`);
    const data = await get.json();

    setListOfQuestLines(data);
    fetchFeats();
    fetchRecords();
  }

  async function createNewQuest(title: string, description: string, horas: number, minutes: number, todos: string[], xp: number) {
    if (!questLine)
      throw new Error('No questline found.')

    const type = questLine.type === 'main' ? 'main' : 'practice';

    const newQuest = {
      questLine: questLine.id,
      title,
      description,
      timecap: (minutes + (horas*60))*60000,
      todos,
      xp,
      type
    }
    const requestBody = {
      method: 'post',
      body: JSON.stringify(newQuest),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const post = await fetch('/leveling/quest/new', requestBody);
    const data = await post.json();

    fetchActiveQuest();
  }

  async function handleQuestTodo(todoId: string, action: 'finish'|'invalidate') {
    const requestBody = {
      method: 'post',
      body: JSON.stringify({todoId, action}),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const post = await fetch(`/leveling/quest/todo`, requestBody);
    const response = await post.json();

    fetchActiveQuest();
  }

  async function finishQuest(focusScore: number, questId?: string) {
    if (!questId && activeQuest)
      questId = activeQuest.id;

    const requestBody = {
      method: 'post',
      body: JSON.stringify({questId, focusScore}),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const post = await fetch(`/leveling/quest/finish`, requestBody);
    const response = await post.json();

    fetchActiveQuest();
  }

  async function sendDistractionPoint() {
    const post = await fetch(`/leveling/quest/distraction`, { method: 'post'});
    const response = post.json();
  }

  async function finishQuestLine() {
    const post = await fetch('/leveling/questline/finish', { method: 'post'});
    const response = post.json();

    fetchStats();
    setModal(null);
  }

  async function fetchFinishedQuestLines(): Promise<IQuestLine[]> {
    const get = await fetch('/leveling/questline/all-finished');
    const response = get.json();

    return response;
  }

  async function createNewQuestLine(title: string, descrition: string, duration: number, type: string): Promise<void> {
    const requestBody = {
      method: 'post',
      body: JSON.stringify({
        title,
        descrition,
        duration, 
        type
      }),
      headers: {
        'Content-Type':'application/json'
      }
    };

    const post = await fetch('/leveling/questline/new', requestBody);
    const response = await post.json();
    setQuestLine(response);
    fetchListOfQuestLines();
  }

  async function createNewFeat(title: string, description: string, category: string, tier: number, questLine: string) {
    const requestBody = {
      method: 'post',
      body: JSON.stringify({
        title,
        description,
        category,
        tier,
        questLine
      }),
      headers: {
        'Content-Type':'application/json'
      }
    }
    const post = await fetch('/leveling/feats/new', requestBody);
    const response = await post.json();
    
    setModal(null);
    fetchFeats();
  }

  async function fetchFeats() {
    const get = await fetch('/leveling/feats');
    const response = await get.json();

    setFeats(response);
  }

  async function completeFeat(featId: string) {
    const requestBody = {
      method: 'post',
      body: JSON.stringify({
        featId
      }),
      headers: {
        'Content-Type':'application/json'
      }
    };

    const post = await fetch('/leveling/feats/complete', requestBody);
    const response = await post.json();

    fetchFeats();
  }

  async function fetchRecords() {
    const get = await fetch('/leveling/records');
    const response = await get.json();

    setRecords(response);
  }

  async function createNewRecord(title: string, description: string, qtd: number, categories: string, tier: number, questLine: string) {
    const requestBody = {
      method: 'post',
      body: JSON.stringify({
        title, 
        description, 
        qtd, 
        categories, 
        tier, 
        questLine 
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const post = await fetch('/leveling/records/new', requestBody);
    const response = await post.json();

    fetchRecords();
  }

  async function updateRecordLevel(recordId: string) {
    const requestBody = {
      method: 'post',
      body: JSON.stringify({
        recordId
      }),
      headers: {
        'Content-Type':'application/json'
      }
    }
    const post = await fetch('/leveling/records/up', requestBody);
    const response = await post.json();

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
    listOfQuestLines,
    activeQuest,
    questLine,
    fetchQuestLineInfo,
    modal,
    modalHandler,
    createNewQuest,
    handleQuestTodo,
    finishQuest,
    sendDistractionPoint,
    finishQuestLine,
    fetchFinishedQuestLines,
    createNewQuestLine,
    createNewFeat,
    feats,
    completeFeat,
    records,
    createNewRecord,
    updateRecordLevel
  };
}



export default StatsController