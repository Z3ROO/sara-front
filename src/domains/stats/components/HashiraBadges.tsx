import { useStatsController } from "../Stats";


export default function Hashiras(props: any) {
  const controller = useStatsController()!;
  const {planningHashira, focusHashira, perseverenceHashira, weekProgress, day} = controller;

  const weekDay = day.getDay();
  const perseverenceProgress = Math.floor(weekProgress[weekDay]?.hours/perseverenceHashira.goal * 100) || 0;

  return  <div className="flex h-32">
            <Hashira hashira={planningHashira}/>
            <Hashira hashira={focusHashira} />
            <Hashira hashira={perseverenceHashira}>
              {
                perseverenceProgress < 100 &&
                <div className="absolute top-0">
                  <img className="w-12" src="/icons/progress-circle.png" alt="perseverence-progress"/>
                  <span className="absolute top-2.5 right-2">{perseverenceProgress}%</span>
                </div>
              }
            </Hashira>
          </div>
}

function Hashira(props:any) {
  const {hashira} = props;

  return  <div className="flex flex-col items-center w-28 h-28 m-2 p-2 relative rounded cursor-pointer hover:z-10 hover:scale-125 hover:h-32 bg-slate-800 hover:border transition-transform group">
            <span className="mb-2 font-bold text-sky-200">{hashira.title}</span>
            <div className="relative">
              <img className={`w-12 ${props.children && 'blur-sm'}`} src='/icons/icon1.png' alt={'Pilar de '+hashira.name}/>
              {props.children && props.children}
            </div>
            <span className={`hidden group-hover:block text-[11px]`}>{hashira.name} <strong>Lv.{hashira.level}</strong></span>
            <span className={`absolute bottom-1 right-1 ${hashira.todaysEarnings > 0 ? 'text-green-500' : 'text-red-500'} group-hover:hidden`}>{hashira.todaysEarnings > 0 ? '+'+hashira.todaysEarnings : hashira.todaysEarnings}</span>
          </div>
}
