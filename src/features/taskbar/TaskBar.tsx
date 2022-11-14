import { GiHillConquest } from 'react-icons/gi';
import { useEffect, useRef, useState } from "react";
import StatsPanelAndDashboard from '../Leveling/stats/Stats'
import useClock from "../../lib/hooks/useClock";
import { Link } from "../../lib/Router/index";
import { DefaultProps } from "../../ui/types";
import { InboxInputWidget, InboxReviewModal, ReviewedInboxWidget } from '../inbox/components/Inbox';
import * as Icons from '../../lib/icons/UI';

export default function TaskBar() {
  const {time, date} = useClock();
  return (
    <div className="h-6 w-full bg-gray-300 flex relative justify-between">
      <div className="w-full flex px-2 items-center">
        <ButtonForTaskBar Icon={Icons.Menu9Square} children={MainMenu} />
        <div className='pr-1 mr-1 border-r border-black h-4/6' />
        <ButtonForTaskBar Icon={Icons.InboxArrowIn}>
          <InboxInputWidget />
        </ButtonForTaskBar>
      </div>
      <div className="min-w-fit shrink-0">
        <span className="text-sm font-bold">{`${date} - ${time}`}</span>
      </div>
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
    </div>
  )
}

function UsernameAndLevel(props: any) {
  return (
    <span {...props}>
      <div className='bg-gray-350 px-1'>
        <span className='font-bold'>zero </span><span className='text-red-400 text-xs'>Lv</span><span>49</span>
      </div>
    </span>
  )
}

function ButtonForTaskBar(props: { Icon: (props:any) => JSX.Element, children: JSX.Element|((props:any) => JSX.Element), fullScreen?: boolean, maintainOpen?: boolean, modal?: boolean }) {
  let { Icon, children, maintainOpen, fullScreen, modal } = props;
  const [toggle, setToggle] = useState(false);
  let content:JSX.Element|null = null;
  const buttonRef = useRef<null|HTMLDivElement>(null);

  useEffect(()=> {
    function handler() {
      setToggle(false);
      window.removeEventListener('click', handler);
    }

    if (toggle && !fullScreen)
      window.addEventListener('click', handler);

  }, [toggle]);
  
  if (typeof children === 'function') {
    const Children = children;
    children = <Children close={() => setToggle(false)} />
  }
  
  if (children && buttonRef.current) {

    if (fullScreen)
      children = (
        <FullScreenModal close={() => setToggle(false)}>
          { children }
        </FullScreenModal>
      );
    else if (modal) {
      children = (
        <Modal close={() => setToggle(false)}>
          { children }
        </Modal>
      );
    }
    else {
      const side = buttonRef.current.getBoundingClientRect().right > (window.innerWidth / 2) ? 'right' : 'left'
      children = (
        <div className={`absolute top-8 -${side}-2 z-50 rounded bg-gray-300 growing-to-${side}-ani`}>
          { children }
        </div>
      )
    }

    if (toggle && !maintainOpen)
      content = children;
    else if (maintainOpen) 
      content = (
        <div style={{display: toggle ? 'block' : 'none'}}>
          { children }
        </div>
      );
  }

  return (
    <div ref={buttonRef} className='mx-1 relative' onClick={e => e.stopPropagation() }>
      <Icon className="h-3.5 hover:scale-110 transition-all cursor-pointer" onClick={()=> setToggle(prev => !prev)} />
      { content }
    </div>
  )
}

function Modal(props: {children:JSX.Element, close: () => void}) {
  const { children, close } = props;

  return (
    <div className='fixed z-50 top-0 left-0 w-full h-screen flex justify-center items-center bg-gray-800 bg-opacity-60'>
      <div className='rounded p-2 relative bg-gray-300'>
      <button 
        onClick={close}
        className='absolute top-2 right-2 px-3 py-1 rounded hover:bg-gray-400 border bg-gray-350'
        >x</button>
        {children}
      </div>
    </div>
  )
}

function FullScreenModal(props: {children:JSX.Element, close: () => void}) {
  const { children, close } = props;

  return (
    <div className='fixed z-50 top-0 left-0 w-full h-screen flex justify-center items-center'>
      <button 
        onClick={close}
        className='absolute top-2 right-2 px-3 py-1 rounded hover:bg-gray-250 border bg-gray-350'
        >x</button>
      {children}
    </div>
  )
}

export const QuestStatusCaller4Taskbar: any = {
  setStatus: (status:any) => {
    QuestStatusCaller4Taskbar.toUpdate(status);
  },
  toUpdate: undefined
}

function StatusIconForTaskbar(props: { Icon: ((props:any)=>JSX.Element), statusCaller: any, showUndefined?: boolean }) {
  let { Icon, statusCaller, showUndefined } = props;

  const [status, setStatus] = useState<any>();
  let {color, name}:any = status||{};

  useEffect(() => {
    statusCaller.setStatus = setStatus;
    if (statusCaller.toUpdate !== undefined)
      setStatus(statusCaller.toUpdate);
  },[]);
  
  if (!showUndefined && !color)
    return <></>

  return (
    <div className='mr-2'>
      <Icon fill={color||'black'} title={name||false} className={`h-4 `} />
    </div>
  )
}

function MainMenu(props: {close: () => void}) {
  const iconList = [
    { title: 'Home', link: '/', Icon: Icons.Menu9Square },
    { title: 'Notes', link: '/notes', Icon: Icons.NoteApp },
    { title: 'Flashcard', link: '/flashcards', Icon: Icons.InfoCards},
    { title: 'Design Systems', link: '/design-systems', Icon: Icons.DesignSystems },
    { title: 'Config', link: '/', Icon: Icons.TripleGear },
    { title: 'Teste', link: '/teste', Icon: Icons.Menu9Square },
    { title: 'Home', link: '/', Icon: Icons.Menu9Square }
  ];

  return (
    <div className="flex flex-wrap w-72 shadow-md">
      {
        iconList.map(icon => (
            <SectionIcon {...icon} onClick={props.close} />
          )
        )
      }
    </div>
  )
}

function SectionIcon(props: {Icon:(props:DefaultProps) => JSX.Element, title:string, link: string, [key: string]:any}) {
  const {Icon, title, link} = props;

  return (
    <div className="flex flex-col w-24 h-24 justify-center items-center text-center">
      <Link href={link}>
        <div className="rounded p-2 shadow-md cursor-pointer" onClick={props.onClick}>
          <Icon className="w-6" />
        </div>
      </Link>
      <span className='text-sm'>{title}</span>
    </div>
  )
}
