import { createContext, useContext, useState } from "react";
import { IAppController, useMainStateController } from "../../../core/App"
import Hashiras from "./components/HashiraBadges";
import PlayerInfo from "./components/PlayerInfoHeader";
import StatsController, { IStatsController } from "./StatsStateController";
import History from './components/EarningsHistory'
import {QuestlineWidget} from "../questlines/components/Questlines";
import { AddNewPills } from "../../pills/components/Pills";

interface IStatsProps {
  path?: string;
}

const StatsControllerContext = createContext<null|IStatsController>(null);
export const useStatsController = () => useContext(StatsControllerContext);

export default function StatsPanelAndDashboard(props:IStatsProps) {
  const AppController = useMainStateController()!;
  const controller = StatsController({AppController});

  return  (
    <StatsControllerContext.Provider value={controller}>
      <div className="h-full w-full flex bg-slate-500 bg-opacity-80">
        <div className="flex flex-col p-3 text-white bg-slate-800 bg-opacity-80 slidein-ltr-animation">
          <PlayerInfo />
          <div className="flex flex-col overflow-auto scrollbar-hide">
            <Hashiras />
            <QuestlineWidget />
            <History />
            <AddNewPills />
          </div>
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