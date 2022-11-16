import { useState } from "react";
import { Label } from "../../../../ui/forms";
import { Loading } from "../../../../ui/Loading";
import { QuestlineStateController, QuestlineStateControllerContext, useQuestlineStateController } from "./Questlines";

export function QuestlinesWidget() {
  const stateController = QuestlineStateController();
  const { questlines, setQuestline } = stateController;

  if (!questlines.previous)
    return <Loading />

  // if (toggle)
  //   return <CreateNewQuestline />

  return (
    <QuestlineStateControllerContext.Provider value={stateController}>
      <div>
      <h1 className="text-xl font-bold">Quest lines:</h1>
        <div className="flex relative">
          { <QuestlineItem data={questlines.active!} index='active' active/> }
          {
          questlines.previous!.map((questline, index) => (
            <QuestlineItem data={questline} index={index} />
            )
          )
          }
        </div>
      </div>
    </QuestlineStateControllerContext.Provider>
  );
}

function QuestlineItem(props: {data: {}|null, active?: boolean, index: number|'active'}) {
  const { setQuestline } = QuestlineStateController();
  let { active, index, data } = props;
  const [toggle, setToggle] = useState<number|'active'|null>(null);
  const questline = data;
  let icon:string;

  if (data)
    icon = "/icons/icon1.png";
  else
    icon = "/icons/ui/plus-sign.svg";

  return (
    <div
      style={{
        zIndex: toggle ? '30' : '0',
        height: toggle ? '19rem' : '4rem',
        width: '4rem'
      }}
    >
      <div 
        className={`
          relative p-1 m-2 w-12 h-12 flex justify-center items-center 
          bg-slate-600 rounded hover:cursor-pointer
          transition-all
        `}

        style={{
          position: toggle ? 'absolute' : undefined,
          width: toggle ? '100%' : '3rem',
          height: toggle ? '18rem' : '3rem',
          margin: toggle ? '0 0': '0 .5rem',
          left: toggle ? '0' : 'auto'
        }}
        >
        <img
          style={{
            position: toggle ? 'absolute' : undefined,
            top: toggle ? '1rem' : undefined,
            right: toggle ? '1rem' : undefined,
          }}

          onClick={() => {
            setToggle(prev => prev != null ? null : index)
            // if (active)
            //   setQuestline('active')
          }}

          className="w-6 opacity-50 hover:opacity-100" 
          src={icon} alt="questlines warnings"
        />
        {
          (active && data && !toggle) && 
          <span className="absolute bottom-1 right-1 text-[7px]">A</span>
        }
        {
          (toggle === 'active' && data == null) ? <CreateNewQuestline close={() => setToggle(null)}/> :
          <QuestlineDetails />
        }
      </div>
    </div>
  )
}

function QuestlineDetails() {
  return (
    <>
    </>
  )
}

function CreateNewQuestline(props: { close: () => void}) {
  const { close } = props;
  const { createNewQuestline, setQuestline } = useQuestlineStateController()!;

  const [questlineTitle, setQuestlineTitle] = useState<string>('');
  const [questlineDescription, setQuestlineDescription] = useState<string>('');
  const [questlineDuration, setQuestlineDuration] = useState<number>(0);

  return  (
    <div className="w-full h-72 p-2">
      <h4 className="px-2 pt-2">Create a Quest line:</h4>
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <Label title="Title: " className="p-2 w-full">
            <input className="w-full" type="text" id="questline-title" value={questlineTitle} onChange={(e) => setQuestlineTitle(e.target.value)}/>
          </Label>
          <Label title="Duration: " className="p-2 w-32">
            <input className="w-full" type="number" id="questline-duration" placeholder="Days" value={questlineDuration} onChange={(e) => setQuestlineDuration(Number(e.target.value))}/>
          </Label>
        </div>
        <Label title="Description: ">
          <textarea id="questline-description" className="resize-none h-16 w-full" value={questlineDescription} onChange={(e) => setQuestlineDescription(e.target.value)}/>
        </Label>
      </div>
      <div className="flex justify-end">
        <button 
          className="p-1 px-3 m-1 border rounded bg-slate-500 hover:cursor-pointer hover:bg-slate-400" 
          onClick={close}>
          Cancelar
        </button>
        <button 
          className="p-1 px-3 m-1 border rounded bg-slate-500 hover:cursor-pointer hover:bg-slate-400" 
          onClick={()=> createNewQuestline(questlineTitle, questlineDescription, questlineDuration, 'skill')}
        >
          Criar
        </button>
      </div>
    </div>
  )
}
