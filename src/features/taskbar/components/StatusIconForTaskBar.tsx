import { useState, useEffect } from "react";

export default function StatusIconForTaskbar(props: { Icon: ((props:any)=>JSX.Element), statusCaller: any, showUndefined?: boolean }) {
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

export const QuestStatusCaller4Taskbar: any = {
  setStatus: (status:any) => {
    QuestStatusCaller4Taskbar.toUpdate(status);
  },
  toUpdate: undefined
}