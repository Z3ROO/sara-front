import Requester from "../../../lib/Requester";
import { IQuestline } from "./components/Questlines";

export async function getQuestline(questline_id: string): Promise<IQuestline> {
  const { body } = await Requester.get(`/leveling/questlines/${questline_id}`)
  return body;
}

export async function getActiveQuestline(): Promise<IQuestline> {
  const { body } = await Requester.get(`/leveling/questlines`);
  return body;
}

export async function getAllQuestlines(): Promise<IQuestline[]> {
  const { body } = await Requester.get(`/leveling/questlines/all`);
  return body;
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
