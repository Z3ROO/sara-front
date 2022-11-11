import Requester from "../../../lib/Requester";

export async function newFeat(data:{
  title: string,
  description: string,
  category: string|string[],
  tier: number,
  questline_id: string 
}) {
  await Requester.post('/feats/new', JSON.stringify(data));
}

export async function getFeats() {
  const { body } = await Requester.get('/quests/feats');
  return body;
}

export async function completeFeat(feat_id: string) {
  await Requester.get(`/quests/feats/complete/${feat_id}`);
}