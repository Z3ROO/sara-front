import Requester from "../../lib/Requester";
import { IInbox } from "./Inbox";

export async function getRawInbox(): Promise<IInbox> {
  return [
    {
      _id: '123456',
      content: 'inbox 1'
    },
    {
      _id: '123456',
      content: 'inbox 2'
    },
    {
      _id: '123456',
      content: 'inbox 3'
    }
  ];

  const { body } = await Requester.get('/leveling/inbox/raw');
  return body;
}

export async function getReviewedInbox(): Promise<IInbox> {
  return [
    {
      _id: '123456',
      content: 'inbox 1'
    },
    {
      _id: '123456',
      content: 'inbox 2'
    },
    {
      _id: '123456',
      content: 'inbox 3'
    }
  ];

  const { body } = await Requester.get('/leveling/inbox/reviewed');
  return body;
}

export async function insertInboxItem(content: string) {
  return console.log('inserted: ', content);
  const response = await Requester.post('/leveling/inbox/new', JSON.stringify({content}));
}

export async function reviewInboxItem(inbox_id: string, content: string|null) {
  return console.log('reviewed: ', inbox_id, content);
  const response = await Requester.post(`/leveling/inbox/review/${inbox_id}`, JSON.stringify({content}));
}

export async function defferInboxItem(inbox_id: string, content: string|null) {
  return console.log('deffered: ', inbox_id, content);
  const response = await Requester.post(`/leveling/inbox/deffer/${inbox_id}`, JSON.stringify({content}));
}

export async function removeInboxItem(inbox_id: string) {
  return console.log('removed: ', inbox_id);
  const response = await Requester.delete(`/leveling/inbox/${inbox_id}`);
}