import { useState, useEffect } from "react";
import { Loading } from "../../../../ui/Loading";
import { useQuestsSC } from "../../quests/components/Quests";
import { IGainsHistory } from "../LevelingAPI";
import * as StatsAPI from '../LevelingAPI'

export default function WeekFeedback() {
  const [history, setHistory] = useState<IGainsHistory[]>();
  const QuestsSC = useQuestsSC();
  const today = new Date().getDay();
  const [dayOfTheWeek, setDayOfTheWeek] = useState(today);

  let [dayPercentage, setDayPercentage] = useState(0);

  async function getHistory(date?:string) {
    const res = await StatsAPI.getGainsHistory(date);
    setHistory(res);
  }

  useEffect(() => {
    let date: string|undefined;
    if (today !== dayOfTheWeek) {
      const nowDate = new Date();
      nowDate.setDate(nowDate.getDate()+(dayOfTheWeek-today));
      date = nowDate.toLocaleDateString('en').replace(/\//g,'-');
    }
    
    (async () => await getHistory(date))();

    //======================================================

    const handler = () => {
      if (dayOfTheWeek-today > 0)
        setDayPercentage(0);
      else if (dayOfTheWeek-today < 0)
        setDayPercentage(100);
      else
        setDayPercentage(Math.round(((new Date().getHours())*60+(new Date().getMinutes()))/(24*60) * 100));
    }

    const interval = setInterval(handler, 5000);handler();

    return () => clearInterval(interval);

  },[QuestsSC?.activeQuest, dayOfTheWeek]);

  if (history === undefined)
    return <Loading />
    
  return (
    <div className="p-4 w-full bg-gray-450 bg-opacity-40 rounded-sm backdrop-blur-3xl">
      <h3>Week Feedback</h3>
      <WeekDaysHeader {...{dayOfTheWeek, setDayOfTheWeek, today}}/>
      <TimeLine {...{dayPercentage, dayOfTheWeek, today, history}} />
    </div>
  )
}

function WeekDaysHeader(props: { dayOfTheWeek: number, setDayOfTheWeek: any, today: number}) {
  const  { dayOfTheWeek, setDayOfTheWeek, today } = props;

  return (
    <div className="flex justify-center">
      {
        [
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
          'Thursday', 'Friday', 'Saturday'
        ].map((day, index) => {
          return (
            <span 
              className={`m-2 font-bold text-lg cursor-pointer ${index === dayOfTheWeek && 'text-purple-300'}`}
              style={{
                fontSize: index === today ? '1.25rem' : undefined,
                lineHeight: index === today ? '1.75rem' : undefined
              }}
              onClick={() => setDayOfTheWeek(index)}
            >{day}</span>
          )
        })
      }
    </div>
  )
}

function TimeLine(props: {dayPercentage:number, dayOfTheWeek:number, today: number, history: IGainsHistory[]}) {
  const { dayPercentage, dayOfTheWeek, today, history } = props;

  return (
    <div className="my-6 mx-auto h-1 relative w-10/12">
      {/* timeline bg */}
      <div className="absolute w-full h-1 rounded-sm bg-gray-450 top-0 left-0"></div>

      {/* timeline conclusion */}
      <div 
        className="absolute h-1 rounded-sm bg-purple-600 bg-opacity-40 top-0 left-0"
        style={{width: dayPercentage+'%'}}
      >
        {dayOfTheWeek === today && <div className="h-2 w-2 rounded-full bg-purple-500 absolute -bottom-0.5 -right-1 animate-ping"></div>}
      </div>

      {/* timeline points of action */}
      {
        history.map(gain => {
          let { name, type, start, end } = gain;
          start = new Date(start);
          end = new Date(end);
          const startDayPercentage = start ? (((start.getHours())*60+(start.getMinutes()))/(24*60) * 100) : null;
          const endDayPercentage = (((end.getHours())*60+(end.getMinutes()))/(24*60) * 100)-startDayPercentage!;

          return (
            <div 
              className="absolute h-1 rounded-sm bg-green-600 hover:scale-125 transition-all cursor-pointer group"
              style={{width: endDayPercentage+'%', minWidth:'4px', left: startDayPercentage+'%'}}
            >
              <InfoTag {...{...gain, start, end}}/>
            </div>
          )
        })
      }
      <div className="absolute w-full h-1 rounded-sm top-1 left-0 flex justify-between">
        {
          Array(24).fill(false).map((v, hour) => (
            <span className="w-[2ch] text-xs">{hour}</span>
          ))
        }
        <span className="w-0 text-xs"></span>
      </div>
    </div>
  )
}

function InfoTag(props: IGainsHistory) {
  const {name, type, start, end} = props;
  return (
    <div className="absolute p-2 hidden group-hover:block bg-green-600 rounded-sm text-xs top-3 left-1/2 -translate-x-1/2">
      <div className="">{type}</div>
      <div className="font-bold" style={{width:name.length > 24 ? '24ch' : name.length+'ch'}}>{name}</div>
      {(start && end) && <div className="">{Math.round((end.getTime() - start.getTime())/1000/60)} minutes</div>}
      <div className="absolute border-8 border-transparent border-b-green-600 w-0 h-0 top-0 left-1/2 -translate-x-1/2 -translate-y-3"></div>
    </div>
  )
}