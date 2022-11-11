import { createContext, useContext, useEffect, useState } from "react"
import { Label } from "../_general/forms"
import { OneDigitNotificationCounter } from "../_general/notifications";
import { DefaultProps } from "../_general/types";
import * as PillsAPI from './PillsAPI';

export interface IPills {
  _id: string
  immune: boolean
  name: string
  description: string
  times_taken: number
  next_shot: Date
  history: Date[]
}

interface IPillsStateController {
  pills: IPills[]|null|undefined,
  _init(): Promise<void>
  takePill(pill_id: string): Promise<void>
  addNewPill: (data: { name: string, description: string }) => Promise<void>
}

export const PillsStateControllerContext = createContext<IPillsStateController|null>(null);
export const usePillsStateController = () => useContext(PillsStateControllerContext);


export function PillsStateController(): IPillsStateController {
  const [pills, setPills] = useState<IPills[]|null|undefined>();

  async function _init(): Promise<void> {
    await getTakeablePills();
  }
  
  async function getTakeablePills() {
    const pills = await PillsAPI.getTakeablePills();
    setPills(pills);
  }

  async function takePill(pill_id: string) {
    await PillsAPI.takePill(pill_id);
    await getTakeablePills();
  }

  async function addNewPill(data: { name: string, description: string }) {
    await PillsAPI.addPills(data);
  }

  return {
    pills,
    _init,
    takePill,
    addNewPill
  }
}

export function PillsWidget() {
  const pillsStateController = PillsStateController();
  const { pills } = pillsStateController;
  
  const [toggle, setToggle] = useState(false);

  async function takePill(pill_id: string) {
    await pillsStateController.takePill(pill_id);
    setToggle(false);
  }

  function cancelPillTaking() {
    setToggle(false);
  }

  useEffect(() => {
    pillsStateController._init()
  },[]);

  if(!pills)
    return null;

  return (
    <PillsStateControllerContext.Provider value={pillsStateController}>
      <div className="fixed bottom-4 right-4 rounded bg-gray-300 p-2.5 opacity-50 hover:opacity-100 hover:scale-110 transition-all">
        {
          toggle ?
          <PillToTake {...{takePill, cancelPillTaking}} /> :
          <div 
            className="cursor-pointer"
            onClick={() => setToggle(true)}>
            <PillIcon className="w-8 fill-black" />
            <OneDigitNotificationCounter notifications={pills.length} />
          </div>
        }
      </div>
    </PillsStateControllerContext.Provider>
  )
}

function PillToTake(props: {takePill: (pill_id:string) => Promise<void>, cancelPillTaking:() => void }) {
  const {pills} = usePillsStateController()!;
  const {_id, name, description} = pills![0];
  return (
    <div className="max-w-sm">
      <h5>{name}</h5>
      <div className="max-h-32 overflow-auto">
        <p>{description}</p>
      </div>
      <div className="flex">
        <button 
          onClick={() => { props.takePill(_id) }}
          className="m-1 p-1 border border-black cursor-pointer"
        >Tomar</button>
        <button 
          onClick={() => { props.cancelPillTaking() }}
          className="m-1 p-1 border border-black cursor-pointer"
        >Cancelar</button>
      </div>
    </div>
  )
}

export function AddNewPills() {
  const { addNewPill } = PillsStateController();
  const [toggle, setToggle] = useState(false);
  const [pillNameInput, setPillNameInput] = useState('');
  const [pillDescriptionInput, setPillDescriptionInput] = useState('');

  return (
    <div className="rounded bg-gray-300 text-black p-2 my-4">
      <h5 onClick={()=> setToggle(prev => !prev)} className="cursor-pointer p-0 m-0">Add Pills</h5>
      {
        toggle && (
          <>
            <Label title="Titulo: ">
              <input type="text" value={pillNameInput} onChange={(e) => setPillNameInput(e.target.value)} />
            </Label>
            <Label title="Descrição: ">
              <textarea value={pillDescriptionInput} onChange={(e) => setPillDescriptionInput(e.target.value)} />
            </Label>
            <button
              className="p-2 rounded border border-gray-700"
              onClick={() => {
                addNewPill({
                  name: pillNameInput, 
                  description: pillDescriptionInput
                });
                setToggle(false);
                setPillNameInput('');
                setPillDescriptionInput('');
              }}
            >
              Adicionar
            </button>
          </>
        )
      }
    </div>
  )
}

function PillIcon(props:any) {
  return (
    <svg {...props} viewBox="0 0 16 16">
      <path d="M3.5 8l6.3-6.3c0.4-0.4 1-0.7 1.7-0.7s1.3 0.3 1.8 0.7c1 1 1 2.6 0 3.5l-2.8 2.8h1.4l2-2c1.4-1.4 1.4-3.6 0-4.9-0.7-0.7-1.6-1-2.5-1s-1.7 0.2-2.4 0.9l-6.3 6.4c-0.3 0.2-0.5 0.5-0.7 0.9 0.5-0.2 1-0.3 1.5-0.3z"></path>
      <path d="M7.3 5.6l-2.4 2.4h4.7z"></path>
      <path d="M12.5 9h-9c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5h9c1.9 0 3.5-1.6 3.5-3.5s-1.6-3.5-3.5-3.5zM12.5 15h-4.5v-4h-4.5c-1.1 0-2 0.6-2.5 1.2 0.2-1.2 1.2-2.2 2.5-2.2h9c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5z"></path>
    </svg>
  )
}