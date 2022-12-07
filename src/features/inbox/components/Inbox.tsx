import { BsListTask } from 'react-icons/bs';
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { HiInboxArrowDown, HiInbox } from "react-icons/hi2";
import { Loading } from "../../../ui/Loading";
import * as InboxAPI from '../InboxAPI';

export interface IInboxItem {
  _id: string
  content: string
}

export type IInbox = IInboxItem[]

export interface IInboxStateController {
  rawInbox: IInbox|null|undefined
  reviewedInbox: IInbox|null|undefined
  getRawInbox(): Promise<void>
  getReviewedInbox(): Promise<void>
  defferInboxItem(index: number, content: string): void
  reviewInboxItem(index: number, content: string): void
}

const InboxStateControllerContext = createContext<IInboxStateController|null>(null);
const useInboxSC = () => useContext(InboxStateControllerContext);

function InboxStateController() {
  const [rawInbox, setRawInbox] = useState<IInbox|null>();
  const [reviewedInbox, setReviewedInbox] = useState<IInbox|null>();

  async function getRawInbox() {
    const items = await InboxAPI.getRawInbox();
    if (items.length === 0)
      setRawInbox(null);
    else
      setRawInbox(items);
  }

  async function getReviewedInbox() {
    const items = await InboxAPI.getReviewedInbox();
    if (items.length === 0)
      setReviewedInbox(null);
    else
      setReviewedInbox(items);
  }

  function reviewInboxItem(index:number, content: string) {
    const {_id} = rawInbox![index];
    InboxAPI.reviewInboxItem(_id, content);

    if (rawInbox!.length === 1)
      setRawInbox(null);
    else
      setRawInbox(prev => prev!.filter((v, i) => i !== index));
  }
  function defferInboxItem(index:number, content: string) {
    const {_id} = rawInbox!![index];
    InboxAPI.deferInboxItem(_id, content);

    if (rawInbox!.length === 1)
      setRawInbox(null);
    else
      setRawInbox(prev => prev!.filter((v, i) => i !== index));
  }

  return {
    rawInbox, reviewedInbox, 
    getRawInbox, getReviewedInbox, reviewInboxItem,
    defferInboxItem
  }
}

export function InboxInputWidget() {
  
  const [textareaInput, setTextareaInput] = useState('');
  return (
    <div className="taskbar-menu-growing p-4 rounded-md bg-gray-300 flex flex-col">
      <h5>Inbox</h5>
      <textarea className='w-56 h-24 min-h-[6rem] max-h-36' value={textareaInput} onChange={(e) => setTextareaInput(e.target.value)}/>
      <button 
        onClick={() => {
          InboxAPI.insertInboxItem(textareaInput);
          setTextareaInput('');
        }}
        className="mt-4 p-1 border border-black rounded cursor-pointer"
      >Inserir</button>
    </div>
  )
}

export function InboxReviewModal() {
  const {getRawInbox, rawInbox, defferInboxItem, reviewInboxItem} = InboxStateController();
  const [textareaInput, setTextareaInput] = useState('');

  useEffect(() => {
    getRawInbox();
  },[]);
  
  useEffect(() => {
    if (rawInbox)
      setTextareaInput(rawInbox[0].content);
  },[rawInbox]);

  if (rawInbox === undefined)
    return <Loading />

  if (rawInbox === null)
    return <div className="p-3">No inbox item found</div>

  return (
    <>
      <h5>Review Inbox</h5>
      <textarea className='w-72 h-32 min-h-[8rem] max-h-48' value={textareaInput} onChange={(e) => setTextareaInput(e.target.value)}/>
      <div className="flex justify-around my-2">
        <button 
          onClick={() => {
            defferInboxItem(0, textareaInput);
          }}
          className="p-1 border border-black rounded cursor-pointer"
        >Deffer</button>
        <button 
          onClick={() => {
            reviewInboxItem(0, textareaInput);
          }}
          className="p-1 border border-black rounded cursor-pointer"
        >Review</button>
      </div>
    </>
  )
}

export function ReviewedInboxWidget() {
  const { reviewedInbox, getReviewedInbox } = InboxStateController();
  
  useEffect(() => {
    getReviewedInbox();
  },[]);

  if (reviewedInbox === undefined)
    return (
      <div className="taskbar-menu-growing p-4 z-30 rounded-md bg-gray-300 flex flex-col">
        <Loading />
      </div>
    )

  if (reviewedInbox === null)
    return (
      <div className="taskbar-menu-growing p-4 z-30 rounded-md bg-gray-300 flex flex-col">
        <div className='mx-2 my-4'>Lista vazia.</div>
      </div>
    )

  return (
    <div className="taskbar-menu-growing p-4 z-30 rounded-md bg-gray-300 flex flex-col">
      <h5>Reviewed Inbox items</h5>
      <div className='max-h-96 overflow-y-auto overflow-x-hidden'>
        {
          reviewedInbox.map(item => (
            <div className='flex m-2 w-64 border border-gray-550 rounded hover:bg-gray-400'>
              <div className='p-1 w-full'>{item.content}</div>
              <button
                className='p-3 shrink-0'
                onClick={async () => {
                  await InboxAPI.deleteInboxItem(item._id);
                  await getReviewedInbox();
                }}
              >x</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}