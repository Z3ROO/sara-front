import { HiInboxArrowDown } from 'react-icons/hi2';
import { GiHillConquest } from 'react-icons/gi';
import { useEffect, useState } from "react";
import useClock from "../../lib/hooks/useClock";
import { Link } from "../../lib/Router/index";
import { DefaultProps } from "../_general/types";

export default function TaskBar() {
  const {time, date} = useClock();
  return (
    <div className="h-6 w-full bg-gray-300 flex relative justify-between">
      <div className="w-full flex px-2 items-center">
        <div className="mr-2 pr-2 grow-0 border-r border-black">
          <MainMenu />
        </div>
        <div className='mr-2'>
          <HiInboxArrowDown className='w-4' />
        </div>
      </div>
      <div className="min-w-fit shrink-0">
        <span className="text-sm font-bold">{`${date} - ${time}`}</span>
      </div>
      <div className="w-full flex justify-end px-2 items-center">
        <GiHillConquest className="w-4 fill-green-600" />
      </div>
    </div>
  )
}

function MainMenu() {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      { toggle && <MenuIconsList {...{toggle, setToggle}} /> }
      <MenuIcon className="w-3.5 cursor-pointer" onClick={() => { setToggle(prev => !prev) }} />
    </>
  )
}

function MenuIconsList(props: {toggle: boolean, setToggle: React.Dispatch<React.SetStateAction<boolean>>}) {
  const iconList = [
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Notes', link: '/notes', Icon: MenuIcon },
    { title: 'Flashcard', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon },
    { title: 'Home', link: '/', Icon: MenuIcon }
  ];

  return (
    <div className="flex flex-wrap max-w-[288px] absolute top-8 bg-gray-300 rounded-md shadow-md z-30 taskbar-menu-growing ">
      {
        iconList.map(icon => (
            <SectionIcon {...icon} onClick={() =>props.setToggle(false)} />
          )
        )
      }
    </div>
  )
}

function SectionIcon(props: {Icon:(props:DefaultProps) => JSX.Element, title:string, link: string, [key: string]:any}) {
  const {Icon, title, link} = props;

  return (
    <div className="flex flex-col w-24 h-24 justify-center items-center">
      <Link href={link}>
        <div className="rounded p-2 shadow-md cursor-pointer" onClick={props.onClick}>
          <Icon className="w-6" />
        </div>
      </Link>
      <span>{title}</span>
    </div>
  )
}

export function MenuIcon(props: DefaultProps) {
  return (
    <svg x="0px" y="0px" viewBox="0 0 210 210" {...props}>
      <g id="XMLID_16_">
        <path id="XMLID_17_" d="M195,0h-20c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V15
          C210,6.716,203.284,0,195,0z"/>
        <path id="XMLID_18_" d="M115,0H95c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V15
          C130,6.716,123.284,0,115,0z"/>
        <path id="XMLID_19_" d="M35,0H15C6.716,0,0,6.716,0,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V15
          C50,6.716,43.284,0,35,0z"/>
        <path id="XMLID_20_" d="M195,160h-20c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15v-20
          C210,166.716,203.284,160,195,160z"/>
        <path id="XMLID_21_" d="M115,160H95c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15v-20
          C130,166.716,123.284,160,115,160z"/>
        <path id="XMLID_22_" d="M35,160H15c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15v-20
          C50,166.716,43.284,160,35,160z"/>
        <path id="XMLID_23_" d="M195,80h-20c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V95
          C210,86.716,203.284,80,195,80z"/>
        <path id="XMLID_24_" d="M115,80H95c-8.284,0-15,6.716-15,15v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V95
          C130,86.716,123.284,80,115,80z"/>
        <path id="XMLID_25_" d="M35,80H15C6.716,80,0,86.716,0,95v20c0,8.284,6.716,15,15,15h20c8.284,0,15-6.716,15-15V95
          C50,86.716,43.284,80,35,80z"/>
      </g>
    </svg>
  )
}

