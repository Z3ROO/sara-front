import Requester from "../../lib/Requester";
import { IQuestline, INewQuest, IQuest } from "./components/Questline";

export async function getActiveQuest(): Promise<IQuest|null> {
  const { body } = await Requester.get('/leveling/active-quest');
  return body;
}

export async function getQuestline(questline_id: string): Promise<IQuestline> {
  const { body } = await Requester.get(`/leveling/questlines/${questline_id}`)
  return body
}

export async function getActiveQuestline(): Promise<IQuestline> {
  const { body } = await Requester.get(`/leveling/questlines`);
  return body;
}

export async function getAllQuestlines(): Promise<IQuestline[]> {
  const { body } = await Requester.get(`/leveling/questlines/all`);
  return body;
}

export async function createQuest(quest:INewQuest) {
  await Requester.post('/leveling/quest/new', JSON.stringify(quest));
}

export async function handleQuestTodo(todoInfo: {quest_id: string, todoDescription: string, action: 'invalidate'|'finish'}) {
  await Requester.post(`/leveling/quest/handle-todo`, JSON.stringify(todoInfo));
}

export async function finishQuest(info: {quest_id:string, focusScore: number}) {
  await Requester.post(`/leveling/quest/finish`, JSON.stringify(info));
}

export async function insertDistractionPoint() {
  await Requester.get('/leveling/quest/distraction');
}

export async function finishMainQuestline() {
  await Requester.get('/leveling/questlines/finish');
}

export async function allFinishedQuestlines(): Promise<IQuestline[]> {
  const { body } = await Requester.get('/leveling/questlines/all-finished');
  return body;
}

export async function newQuestline(data: Partial<IQuestline>): Promise<IQuestline|null> {
  const { body } = await Requester.post('/leveling/questlines/new', JSON.stringify(data));
  return body;
}
