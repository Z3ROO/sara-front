import { useState } from "react";
import { Label } from "../../../../ui/forms";
import { Loading } from "../../../../ui/Loading";
import { IQuestline, QuestlineStateController, QuestlineStateControllerContext, useQuestlineStateController } from "./Questlines";

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

function QuestlineItem(props: {data: IQuestline|null, active?: boolean, index: number|'active'}) {
  const { setQuestline } = QuestlineStateController();
  let { active, index, data } = props;
  const [toggle, setToggle] = useState<boolean>(false);
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
        width: '4rem',
      }}
    >
      <div 
        className={`
          relative p-1 m-2 w-12 h-12 flex justify-center items-center 
          bg-gradient-to-br from-gray-550 to-gray-600 rounded hover:cursor-pointer
          transition-all overflow-hidden
        `}

        style={{
          position: toggle ? 'absolute' : undefined,
          zIndex: toggle ? '30' : '0',
          width: toggle ? '100%' : '3rem',
          height: toggle ? '18rem' : '3rem',
          margin: toggle ? '0 0': '0 .5rem',
          left: toggle ? '0' : 'auto'
        }}
        >
        {
          toggle && (active && data == null ? <CreateNewQuestline close={() => setToggle(false)}/> :
          <QuestlineDetails {...{data}} />)
        }
        <img
          style={{
            position: toggle ? 'absolute' : undefined,
            top: toggle ? '1rem' : undefined,
            right: toggle ? '1rem' : undefined,
            width: toggle ? '3rem' : '1.5rem',
            opacity: toggle ? '1' : undefined,
            transitionDelay: toggle ? '150ms' : '0ms'
          }}

          onClick={() => {
            setToggle(prev => !prev)
            // if (active)
            //   setQuestline('active')
          }}

          className="opacity-50 hover:opacity-100 transition-all" 
          src={icon} alt="questlines warnings"
        />
        {
          (active && data && !toggle) && 
          <span className="absolute bottom-1 right-1 text-[7px]">A</span>
        }

      </div>
    </div>
  )
}

function QuestlineDetails(props: {data: IQuestline|null}) {
  const { finishQuestline } = useQuestlineStateController()!;
  const questline = props.data!;

  return (
    <div className="w-full flex flex-col h-72 p-2">
      <div className={`absolute h-44 w-full top-0 left-0 bg-gradient-to-b from-slate-900 to-transparent -z-10`}>
      </div>
      <div className="grow">
        <h4 className="px-2 pt-1 mb-16">{questline.title}</h4>
        <p className="p-2">{questline.description}</p>
      </div>
      <div className="">
        <div className="p-2">
          <span>Created: {'00/00/2022'}</span>
          {
            questline.finished_at ? 
            <span>Finished: {'00/00/2022'}</span> : 
            <span>Will finish in: {Math.round(((new Date(questline.created_at).getTime() + questline.timecap) - Date.now())/1000/60/60/24)} days</span>
          }
        </div>
        {
          !questline.finished_at && (
            <button 
              className="m-2 p-1 px-3 border rounded"
              onClick={finishQuestline}
            >Finalizar questline</button>
          )
        }
      </div>
    </div>
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
            <input className="w-full text-black" type="text" id="questline-title" value={questlineTitle} onChange={(e) => setQuestlineTitle(e.target.value)}/>
          </Label>
          <Label title="Duration: " className="p-2 w-32">
            <input className="w-full text-black" type="number" id="questline-duration" placeholder="Days" value={questlineDuration} onChange={(e) => setQuestlineDuration(Number(e.target.value))}/>
          </Label>
        </div>
        <Label title="Description: ">
          <textarea id="questline-description" className="resize-none h-16 w-full text-black" value={questlineDescription} onChange={(e) => setQuestlineDescription(e.target.value)}/>
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
