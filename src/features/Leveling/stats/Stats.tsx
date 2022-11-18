import { createContext, useContext, useEffect, useState } from "react";
import { IAppController, useMainStateController } from "../../../core/App"
import Hashiras from "./components/HashiraBadges";
import PlayerInfo from "./components/PlayerInfoHeader";
import StatsController, { IStatsController } from "./StatsStateController";
import History from './components/EarningsHistory'
import {QuestlinesWidget} from "../questlines/components/QuestlinesWidget";
import { AddNewPills } from "../../pills/components/Pills";
import QuestsWidget, { CreateNewQuest, InQuestBlur, QuestsContext } from "../quests/components/Quests";

interface IStatsProps {
  path?: string;
}

const StatsControllerContext = createContext<null|IStatsController>(null);
export const useStatsController = () => useContext(StatsControllerContext);

export default function StatsPanelAndDashboard(props:IStatsProps) {
  const AppController = useMainStateController()!;
  const controller = StatsController({AppController});

  useEffect(() => {
    console.log('effeeect')
  },[])
  
  return  (
    <StatsControllerContext.Provider value={controller}>
      <div className="h-full w-full flex bg-slate-500 bg-opacity-80">
        <div className="relative flex flex-col p-3 max-w-md text-white bg-gray-800 bg-opacity-80 slidein-ltr-animation">
          <QuestsContext>
          <InQuestBlur>
            <PlayerInfo />
            <div className="flex flex-col overflow-auto scrollbar-hide">
              <Hashiras />
              <QuestlinesWidget />
              <CreateNewQuest />
              <History />
              <AddNewPills />
            </div>
          </InQuestBlur>
          <QuestsWidget />
          </QuestsContext>
        </div>
        <div className="w-full ">
            <div>
            </div>
        </div>
      </div>
    </StatsControllerContext.Provider>
  )
}



//https://coolors.co/palette/000001-282244-eaecf3-cdbfe3-8681bc