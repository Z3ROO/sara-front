import { useStatsController } from "../Stats";
import { mlToHours } from "../../../util/mlToHours";
import { IDayProgress } from "../StatsStateController";

export default function PlayerInfo(props: any) {
  const controller = useStatsController()!;

  const { player } = controller;
  const freeTime = mlToHours(player.freeTime);

  return  <div className="flex flex-col bg-slate-700 rounded p-1">
            <div className="flex p-2">
              <div>
                <img src='/icons/icon.png' alt='Maestria' width={'75px'}/>
              </div>
              <div className="flex flex-col w-full text-right">
                <div className="flex justify-between">
                  <div className="flex flex-col justify-between">
                    <WeekProgress weekProgress={controller.weekProgress}/>
                    <span className="text-sm ml-1">Free time: {freeTime.hours}h {freeTime.minutes}m</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">
                      {player.name} <span className="text-blue-300">Lv. {player.level}</span>
                    </span>
                    <span className="text-lg">{player.maestria}</span>
                  </div>
                </div>
                <NextLevelProgressBar controller={controller} />
              </div>
            </div>
            <div>
              
            </div>
          </div>
}

function NextLevelProgressBar(props: any) {  
  const { player } = props.controller;
  const nextLevelXpPercentage = Math.floor((player.xp - player.lastLevelXp) / (player.nextLevelXp - player.lastLevelXp) * 100);

  return  <div className="flex">
            <div className={`bg-green-800 h-0.5`} style={{width:nextLevelXpPercentage+'%'}}></div>
            <div className={`bg-red-800 h-0.5`} style={{width:100-nextLevelXpPercentage+'%'}}></div>
          </div>
}


function WeekProgress(props: {weekProgress: IDayProgress[]}) {
  const weekProgress = props.weekProgress||[];
  const weekDay = new Date().getDay();

  return  <div className="flex mt-3 ml-1">
            {
              weekProgress.map((dayProgress, index) => <DayOfWeekProgress dayProgress={dayProgress} today={weekDay === index}/>)
            }
          </div>
}


function DayOfWeekProgress(props: {dayProgress: IDayProgress, today: boolean}) {
  const { dayProgress, today } = props;
  const dayStatusColor = ['border', 'bg-gray-500', 'bg-green-500', 'bg-red-500'];

  return <div className={`rounded-full w-2 h-2 m-0.5 relative group ${dayStatusColor[dayProgress.status]} ${today && 'border-green-600'}`}>
          <div className="absolute bottom-4 -left-2.5 bg-gray-200 w-7 h-5 rounded-sm text-center leading-4 hidden group-hover:block">
            <div className="absolute w-0 h-0 border-0 border-x-4 border-t-4 border-x-transparent -bottom-1 left-2.5"></div>
            <span className="text-xs text-black">{mlToHours(dayProgress.hours).hours}</span>
          </div>
        </div>
}