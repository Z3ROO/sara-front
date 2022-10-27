import { useStatsController } from "../Stats";

export default function History() {
  const { todaysHistory } = useStatsController()!;

  return  <div>
            <h1 className="text-xl font-bold">Histórico:</h1>
            <div>
              {
                todaysHistory.map(
                  ({type, body}: any) =>  <div className={`p-2 m-1 rounded flex ${body.state === 'invalidated' ? 'bg-red-500' : 'bg-green-500'}`}>
                                            <div className="grow">
                                              <span>{type} : </span><span>{body.title}</span>
                                            </div>
                                            <span>{body.xp}</span>{body.boostXp && <span className="text-xs">{`(+${body.boostXp})`}</span>}<span>xp</span>                                            
                                          </div>
                )
              }
              { todaysHistory.length === 0 && <span>Nenhuma atividade registrada.</span> }
            </div>
          </div>
}
