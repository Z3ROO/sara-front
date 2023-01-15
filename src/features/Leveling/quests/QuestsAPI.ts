import Requester from "../../../lib/Requester";
import { INewQuest, IQuest } from "./components/Quests";

export async function getActiveQuest(): Promise<IQuest|null> {
  const { body } = await Requester.get('/leveling/active-quest');
  return body;
}

export async function createQuest(quest:INewQuest) {
  await Requester.post('/leveling/quest/new', JSON.stringify(quest));
}

export async function handleQuestTodo(todoInfo: {quest_id: string, todoDescription: string, action: 'invalidate'|'finish'}) {
  await Requester.post(`/leveling/quest/handle-todo`, JSON.stringify(todoInfo));
}

export async function finishQuest(info: {quest_id:string, focus_quality: number}) {
  await Requester.post(`/leveling/quest/finish`, JSON.stringify(info));
}

export async function insertDistractionPoint() {
  await Requester.get('/leveling/quest/distraction');
}
