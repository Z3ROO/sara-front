import Requester from "../../lib/Requester";

export async function getActiveQuest() {
  const { body } = await Requester.get('/quests/active-quest');
  return body;
}

export async function getQuestlineInfo(questline_id: string) {
  const { body } = await Requester.get(`/quests/questline/${questline_id}`)
  return body
}

export async function getQuestlines() {
  const { body } = await Requester.get(`/quests/questline/list`);
  return body;
}

export async function createQuest(quest:any) {
  const { body } = await Requester.post('/quests/quest/new', JSON.stringify(quest));

  return body;
}

export async function handleQuestTodo(todoInfo: {quest_id: string, description: string, action: string}) {
  const { body } = await Requester.post(`/quests/quest/todo`, JSON.stringify(todoInfo));
  return body;
}

export async function finishQuest(info: {quest_id:string, focusScore: number}) {
  const {body} = await Requester.post(`/quests/quest/finish`, JSON.stringify(info));
}

export async function insertDistractionPoint() {
  const {body} = await Requester.get('/quests/quest/distraction');
}

export async function finishMainQuestline() {
  await Requester.get('/quests/questline/finish');
}

export async function allFinishedQuestlines() {
  const { body } = await Requester.get('/quests/questline/all-finished');
  return body;
}

export async function newQuestline(data: {}) {
  const { body } = await Requester.post('/quests/questline/new', JSON.stringify(data));
  return body
}
