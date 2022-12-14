import { createContext, useContext, useEffect, useState } from "react";
import { IAppController, useMainStateController } from "../../../core/App"
import Hashiras from "./components/HashiraBadges";
import PlayerInfo from "./components/PlayerInfoHeader";
import StatsController, { IStatsController } from "./StatsStateController";
import History from './components/EarningsHistory'
import {QuestlinesWidget} from "../questlines/components/QuestlinesWidget";
import QuestsWidget, { CreateNewQuest, InQuestBlur, QuestsContext, useQuestsSC } from "../quests/components/Quests";
import { SkillsWidget } from "../skills/components/SkillsWidget";
import WeekFeedback from "./components/WeekFeedback";

interface IStatsProps {
  path?: string;
}

const StatsControllerContext = createContext<null|IStatsController>(null);
export const useStatsController = () => useContext(StatsControllerContext);

export default function StatsPanelAndDashboard(props:IStatsProps) {
  const AppController = useMainStateController()!;
  const controller = StatsController({AppController});

  useEffect(() => {
    console.log('effeeect');
  },[]);
  
  return  (
    <StatsControllerContext.Provider value={controller}>
      <div className="h-screen w-full flex bg-gray-800 bg-opacity-30" style={{backdropFilter:'blur(8px)'}}>
        <QuestsContext>
        <div className="h-screen relative flex flex-col p-3 max-w-md text-white bg-gray-800 bg-opacity-80 slidein-ltr-animation">
          <InQuestBlur className="flex flex-col h-full">
            <PlayerInfo />
            <div className="overflow-auto scrollbar-hide h-full">
              <Hashiras />
              <SkillsWidget />
              <QuestlinesWidget />
              <CreateNewQuest />
              <History />
            </div>
          </InQuestBlur>
          <QuestsWidget />
        </div>
        <div className="w-full ">
          <div className="p-8">
            <WeekFeedback />
          </div>
        </div>
        </QuestsContext>
      </div>
    </StatsControllerContext.Provider>
  )
}


//https://coolors.co/palette/000001-282244-eaecf3-cdbfe3-8681bc