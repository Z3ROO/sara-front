import Requester from "../../../lib/Requester";

export interface IGainsHistory {
  name: string
  type: string
  xp: number
  boostXp: number
  status: number
  start: Date
  end: Date
}

export async function fetchLevelingStats() {
  const { body } = await Requester.get('/leveling/stats');
  return body;
}

export async function getGainsHistory(date?: string): Promise<IGainsHistory[]> {
  const { body } = await Requester.get(`/leveling/stats/gains-history${date ? '?date='+date : ''}`);
  console.log(body);
  return body;
}