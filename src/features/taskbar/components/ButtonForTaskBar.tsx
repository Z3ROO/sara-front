import { useState, useRef, useEffect } from 'react';
import Modal, { FullScreenModal } from '../../../ui/Modal';

export default function ButtonForTaskBar(props: { Icon: (props:any) => JSX.Element, children: JSX.Element|((props:any) => JSX.Element), fullScreen?: boolean, maintainOpen?: boolean, modal?: boolean }) {
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
  
  if (children) {

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
      let side = 'right';
      if(buttonRef.current)
        side = buttonRef.current!.getBoundingClientRect().right > (window.innerWidth / 2) ? 'right' : 'left'
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