import Requester from "../../lib/Requester";

export async function fetchLevelingStats() {
  const { body } = await Requester.get('/leveling/stats')
  return body;
}