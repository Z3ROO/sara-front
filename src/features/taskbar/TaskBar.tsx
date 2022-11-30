import { GiHillConquest } from 'react-icons/gi';
import StatsPanelAndDashboard from '../Leveling/stats/Stats';
import useClock from '../../lib/hooks/useClock';
import { InboxInputWidget, InboxReviewModal, ReviewedInboxWidget } from '../inbox/components/Inbox';
import * as Icons from '../../lib/icons/UI';
import MainMenu from './components/MainMenu';
import ButtonForTaskBar from './components/ButtonForTaskBar';
import StatusIconForTaskbar, { QuestStatusCaller4Taskbar } from './components/StatusIconForTaskBar';
import UsernameAndLevel from './components/UsernameAndLevel';
import { HandyNoteWidget } from '../notes/components/HandyNote';

export default function TaskBar() {
  return (
    <div className="h-6 w-full bg-gray-300 flex relative justify-between">
      <LeftMenu />
      <Clock />
      <RightMenu />
    </div>
  )
}

function LeftMenu() {
  return (
    <div className="w-full flex px-2 items-center">
      <ButtonForTaskBar Icon={Icons.Menu9Square} children={MainMenu} />
      <div className='pr-1 mr-1 border-r border-black h-4/6' />
      <ButtonForTaskBar Icon={Icons.InboxArrowIn}>
        <InboxInputWidget />
      </ButtonForTaskBar>
      <ButtonForTaskBar Icon={Icons.InfoCards} freeWidget>
        <HandyNoteWidget />
      </ButtonForTaskBar>
    </div>
  )
}

function Clock() {  
  const {time, date} = useClock();
  return (
    <div className="min-w-fit shrink-0">
      <span className="text-sm font-bold">{`${date} - ${time}`}</span>
    </div>
  )
}

function RightMenu() {
  return (
    <div className="w-full flex justify-end px-2 items-center">
      <ButtonForTaskBar Icon={UsernameAndLevel} fullScreen maintainOpen>
        <StatsPanelAndDashboard />
      </ButtonForTaskBar>
      <ButtonForTaskBar Icon={Icons.CheckList}>
        <ReviewedInboxWidget />
      </ButtonForTaskBar>
      {
        !(new Date().getHours() > 2 && new Date().getHours() < 20) &&
        <ButtonForTaskBar Icon={Icons.InboxArrowOut} modal>
          <InboxReviewModal />
        </ButtonForTaskBar>
      }
      <StatusIconForTaskbar Icon={GiHillConquest} statusCaller={QuestStatusCaller4Taskbar} />
    </div>
  )
}
