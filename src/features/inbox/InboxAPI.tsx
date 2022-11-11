import Requester from "../../lib/Requester";
import { IInbox } from "./components/Inbox";

export async function getRawInbox(): Promise<IInbox> {
  const { body } = await Requester.get('/leveling/inbox/raw');
  return body;
}

export async function getReviewedInbox(): Promise<IInbox> {
  const { body } = await Requester.get('/leveling/inbox/reviewed');
  return body;
}

export async function insertInboxItem(content: string) {
  const response = await Requester.post('/leveling/inbox/new', JSON.stringify({content}));
}

export async function reviewInboxItem(inbox_item_id: string, content: string) {
  const response = await Requester.post(`/leveling/inbox/review/${inbox_item_id}`, JSON.stringify({content}));
}

export async function deferInboxItem(inbox_item_id: string, content: string) {
  const response = await Requester.post(`/leveling/inbox/defer/${inbox_item_id}`, JSON.stringify({content}));
}

export async function deleteInboxItem(inbox_item_id: string) {
  const response = await Requester.delete(`/leveling/inbox/${inbox_item_id}`);
}