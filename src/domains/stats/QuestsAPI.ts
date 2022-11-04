import Requester from "../../lib/Requester";
import { IQuestline, INewQuest, IQuest } from "./components/Questline";

export async function getActiveQuest(): Promise<IQuest|null> {
  const { body } = await Requester.get('/quests/active-quest');
  return body;
}

export async function getQuestline(questline_id: string): Promise<IQuestline> {
  const { body } = await Requester.get(`/quests/questline/${questline_id}`)
  return body
}

export async function getActiveQuestline(): Promise<IQuestline> {
  const { body } = await Requester.get(`/quests/questline`);
  return body;
}

export async function getAllQuestlines(): Promise<IQuestline[]> {
  const { body } = await Requester.get(`/quests/questline/all`);
  return body;
}

export async function createQuest(quest:INewQuest) {
  await Requester.post('/quests/quest/new', JSON.stringify(quest));
}

export async function handleQuestTodo(todoInfo: {quest_id: string, todoDescription: string, action: 'invalidate'|'finish'}) {
  await Requester.post(`/quests/quest/handle-todo`, JSON.stringify(todoInfo));
}

export async function finishQuest(info: {quest_id:string, focusScore: number}) {
  await Requester.post(`/quests/quest/finish`, JSON.stringify(info));
}

export async function insertDistractionPoint() {
  await Requester.get('/quests/quest/distraction');
}

export async function finishMainQuestline() {
  await Requester.get('/quests/questline/finish');
}

export async function allFinishedQuestlines(): Promise<IQuestline[]> {
  const { body } = await Requester.get('/quests/questline/all-finished');
  return body;
}

export async function newQuestline(data: Partial<IQuestline>): Promise<IQuestline|null> {
  const { body } = await Requester.post('/quests/questline/new', JSON.stringify(data));
  return body;
}
