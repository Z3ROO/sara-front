import { useEffect, useRef } from "react";

export interface IFreeWidgetProps {
  children: JSX.Element
  side: 'right'|'left'
}

export function FreeWidget(props: IFreeWidgetProps) {
  const { children, side } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const div = ref.current;
      
      const posX = localStorage.getItem('handyNoteX');
      const posY = localStorage.getItem('handyNoteY');
      if (typeof posX === 'string') {
        div.style.top = `${posY}px`;
        div.style.left = `${posX}px`;
      }

      div.onmousedown = (downEvent) => {
        if ((downEvent.target as Element).id !== 'free-widget-move-button')
          return;

        div.onmousemove = (moveEvent) => {
          const {pageX, pageY} = moveEvent;

          div.style.top = `${pageY-10}px`;
          div.style.left = `${pageX-10}px`;
        }
      }

      div.onmouseup = (upEvent) => {
        const {x, y} = div.getBoundingClientRect();

        localStorage.setItem('handyNoteX', `${x-10}`);
        localStorage.setItem('handyNoteY', `${y-10}`);

        div.onmousemove = null;
      }
    }
  },[ref.current]);

  return (
    <div ref={ref}
      className={`fixed top-8 left-10 p-4 z-50 rounded bg-gray-300 growing-to-left-ani`}>
      <button 
        id="free-widget-move-button"
        className="absolute top-0 left-0 p-2 active:-top-56 active:-left-56 active:p-[14.5rem] cursor-pointer"
      >
        <div
          className="w-1 h-1 bg-gray-400 rounded-full "
        ></div>
      </button>
      {children}
    </div>
  )
}