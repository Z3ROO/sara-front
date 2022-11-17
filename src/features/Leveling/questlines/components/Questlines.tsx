import { createContext, useContext, useEffect, useReducer, useState } from "react";
import * as QuestlinesAPI from '../QuestlinesAPI';

export interface IQuestline {
  _id: string
  title: string
  description: string
  state: 'active'|'finished'|'invalidated'
  timecap: number
  created_at: Date
  finished_at: Date|null
  xp: number|null
}

interface IQuestlineStateController {
  questline: IQuestline|null|undefined
  setQuestline: React.Dispatch<string|null|undefined>
  questlines: {
    active?: IQuestline | undefined;
    previous?: IQuestline[] | undefined;
  }
  finishQuestline(): Promise<void>
  getFinishedQuestlines(): Promise<IQuestline[]>
  createNewQuestline(title: string, descrition: string, duration: number, type: string): Promise<void>
}

export function QuestlineStateController():IQuestlineStateController {
  const [questlines, setQuestlines] = useState<{active?: IQuestline, previous?: IQuestline[]}>({});
  const [questline, setQuestline] = useReducer((state:IQuestline|null|undefined, action:string|null|undefined) => {
    if (action === null)
      return null;
    if (action === 'active')
      return questlines.active;

    return undefined;
  }, undefined);
  
  async function getQuestline(questline_id: string) {    
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
    getAllQuestlines();
  }, [])

  return {
    questline,
    setQuestline,
    questlines,
    finishQuestline,
    getFinishedQuestlines,
    createNewQuestline,
  }
}

export const QuestlineStateControllerContext = createContext<IQuestlineStateController|null>(null)

export const useQuestlineStateController = () => useContext(QuestlineStateControllerContext);
