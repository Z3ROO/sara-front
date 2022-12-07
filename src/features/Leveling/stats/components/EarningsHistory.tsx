import { useEffect, useState } from "react";
import { IGainsHistory } from "../LevelingAPI";
import * as StatsAPI from '../LevelingAPI';
import { Loading } from "../../../../ui/Loading";
import { useQuestsSC } from "../../quests/components/Quests";

export default function History() {
  const [history, setHistory] = useState<IGainsHistory[]>();
  const QuestsSC = useQuestsSC();

  useEffect(() => {
    (async () => {
      const res = await StatsAPI.getGainsHistory();
      setHistory(res);
    })();
  },[QuestsSC?.activeQuest]);

  if (history === undefined)
    return <Loading />

  return  <div>
            <h1 className="text-xl font-bold">Histórico:</h1>
            <div>
              {
                history.map( gain => {
                  const { name, xp, status, type, boostXp} = gain;
                    return (
                      <div className={`p-2 m-1 rounded flex ${status === -1 ? 'bg-red-500' : 'bg-green-500'}`}>
                        <div className="grow">
                          <span>{type} : </span><span>{name}</span>
                        </div>
                        <span>{xp}</span>{boostXp && <span className="text-xs">{`(+${boostXp})`}</span>}<span>xp</span>                                            
                      </div>
                    )
                  }
                )
              }
              { history.length === 0 && <span>Nenhuma atividade registrada.</span> }
            </div>
          </div>
}
