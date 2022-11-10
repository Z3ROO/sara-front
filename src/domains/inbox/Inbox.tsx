import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { HiInboxArrowDown, HiInbox } from "react-icons/hi2";
import { Loading } from "../_general/Loading";
import * as InboxAPI from './InboxAPI';

export interface IInboxItem {
  _id: string
  content: string
}

export type IInbox = IInboxItem[]

export interface IInboxStateController {
  toggle: boolean
  setToggle: React.DispatchWithoutAction
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
  const [toggle, setToggle] = useReducer((state:boolean, action?:undefined) => !state, false);
  const [rawInbox, setRawInbox] = useState<IInbox|null>();
  const [reviewedInbox, setReviewedInbox] = useState<IInbox|null>();

  async function getRawInbox() {
    const items = await InboxAPI.getRawInbox();
    setRawInbox(items);
  }

  async function getReviewedInbox() {
    const items = await InboxAPI.getReviewedInbox();
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
    InboxAPI.defferInboxItem(_id, content);

    if (rawInbox!.length === 1)
      setRawInbox(null);
    else
      setRawInbox(prev => prev!.filter((v, i) => i !== index));
  }

  return {
    toggle, setToggle, rawInbox, reviewedInbox, 
    getRawInbox, getReviewedInbox, reviewInboxItem,
    defferInboxItem
  }
}

export function InboxInputWidgetButton() {
  const inboxStateController = InboxStateController();
  const {toggle, setToggle} = inboxStateController;

  return (
    <InboxStateControllerContext.Provider value={inboxStateController}>
      <HiInboxArrowDown className='w-4 cursor-pointer' onClick={setToggle} />
      { toggle && <InboxInputWidget /> }
    </InboxStateControllerContext.Provider>
  )
}

function InboxInputWidget() {
  const { setToggle } = useInboxSC()!;
  const [textareaInput, setTextareaInput] = useState('');
  return (
    <div className="taskbar-menu-growing absolute top-8 p-4 z-30 rounded-md bg-gray-300 flex flex-col">
      <h5>Inbox</h5>
      <textarea className='w-56 h-24 min-h-[6rem] max-h-36' value={textareaInput} onChange={(e) => setTextareaInput(e.target.value)}/>
      <button 
        onClick={() => {
          InboxAPI.insertInboxItem(textareaInput);
          setToggle();
        }}
        className="mt-4 p-1 border border-black rounded cursor-pointer"
      >Inserir</button>
    </div>
  )
}

export function InboxReviewAlertIcon() {
  const inboxStateController = InboxStateController();
  const {toggle, setToggle} = inboxStateController;

  return (
    <InboxStateControllerContext.Provider value={inboxStateController}>
      <HiInbox className="w-4 cursor-pointer" onClick={setToggle}/>
      {
        toggle && <InboxReviewModal />
      }
    </InboxStateControllerContext.Provider>
  )
}

function InboxReviewModal() {
  const {setToggle, getRawInbox, rawInbox, defferInboxItem, reviewInboxItem} = useInboxSC()!;
  const [textareaInput, setTextareaInput] = useState('');
  useEffect(() => {
    getRawInbox();
  },[]);
  
  useEffect(() => {
    if (rawInbox)
      setTextareaInput(rawInbox[0].content);
  },[rawInbox]);

  if (rawInbox === undefined)
    return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 z-50 flex justify-center items-center">
      <div className="rounded p-2 bg-gray-300 relative flex flex-col">
        <button 
          onClick={setToggle}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
          >x</button>
        <Loading />
      </div>
    </div>
          )

  if (rawInbox === null)
    return  <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 z-50 flex justify-center items-center">
              <div className="rounded p-2 bg-gray-300 relative flex flex-col">
                <button 
                  onClick={setToggle}
                  className="absolute top-2 right-2 opacity-50 hover:opacity-100"
                  >x</button>
                <div className="p-3">No inbox item found</div>
              </div>
            </div>

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 z-50 flex justify-center items-center">
      <div className="rounded p-2 bg-gray-300 relative flex flex-col">
        <button 
          onClick={setToggle}
          className="absolute top-2 right-2 opacity-50 hover:opacity-100"
          >x</button>
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
      </div>
    </div>
  )
}