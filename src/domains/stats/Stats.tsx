import { createContext, useContext, useEffect, useState } from "react";
import { AppControllerContext, IAppController, useMainStateController } from "../../core/App"
import Quest from "./components/Quest";
import QuestLineList from "./components/Questline";
import Hashiras from "./components/HashiraBadges";
import PlayerInfo from "./components/PlayerInfoHeader";
import StatsController, { IDayProgress, IQuestLine, IStatsController } from "./StatsStateController";
import History from './components/EarningsHistory'
import Feats from "./components/Feats";
import Records from "./components/Records";

interface IStatsProps {
  AppController?: IAppController;
  path?: string;
}

export function mlToHours(milliseconds:number): {hours:number, minutes:number} {
  const oneHour = 3600000;
  const oneMinute = 60000;
  const hours = Math.floor(milliseconds/oneHour);
  const minutes = Math.floor(milliseconds%oneHour / oneMinute);
  return {hours, minutes}
}

const StatsControllerContext = createContext<null|IStatsController>(null);
export const useStatsController = () => useContext(StatsControllerContext);

export default function StatsPage(props:IStatsProps) {
  const AppController = useMainStateController()!;
  const controller = StatsController({AppController});

  return  (
    <StatsControllerContext.Provider value={controller}>
      <div className="h-full w-full flex">
        <div className="flex flex-col p-3 text-white bg-slate-800">
            <PlayerInfo />
            <Hashiras />
            {
              controller.activeQuest ? 
              <Quest /> : 
              <QuestLineList />
            }
            <History />
        </div>
        <div className="bg-slate-500 w-full">                  
            <Feats />
            <Records />
            <div>
              
            </div>
        </div>
        
        {controller.modal && <Modal />}
      </div>
    </StatsControllerContext.Provider>
  )
}




function Modal(props: any) {
  const controller = useStatsController()!;
  const { modal, modalHandler } = controller;

  return  <div className="absolute w-full h-full bg-slate-300 bg-opacity-30 top-0 left-0 flex justify-center items-center">
            <div className="bg-slate-600 rounded p-4 relative shadow-lg">
              <div>
                {modal.component({controller, ...modal.props})}
              </div>
                <img 
                  className="absolute p-1 hover:cursor-pointer hover:bg-slate-700 top-1 right-1 rounded w-6" 
                  src="/icons/ui/close-x.svg" 
                  onClick={() => modalHandler()} 
                  alt={'close-x'}
                />
            </div>
          </div>
}

//https://coolors.co/palette/000001-282244-eaecf3-cdbfe3-8681bc