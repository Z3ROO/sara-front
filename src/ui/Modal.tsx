import { useEffect, useRef } from "react";

export default function Modal(props: {children:JSX.Element|JSX.Element[], close: () => void}) {
  const { children, close } = props;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current)
      return;
    
    const node = divRef.current as HTMLElement;
    node.onmousedown = (e) => {
      e.stopPropagation();
    }

    return () => {node.onmousedown = null};

  },[divRef.current]);

  return (
    <div ref={divRef} className='fixed z-[250] top-0 left-0 w-full h-screen flex justify-center items-center bg-gray-800 bg-opacity-60'>
      <div className='rounded p-2 relative bg-gray-300'>
        {children}
      <button 
        onClick={close}
        className='absolute top-2 right-2 px-3 py-1 rounded hover:bg-gray-400 border bg-gray-350'
        >x</button>
      </div>
    </div>
  )
}

export function FullScreenModal(props: {children:JSX.Element|JSX.Element[], close: () => void}) {
  const { children, close } = props;
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current)
      return;
    
    const node = divRef.current as HTMLElement;
    node.onmousedown = (e) => {
      e.stopPropagation();
    }

    return () => {node.onmousedown = null};

  },[divRef.current]);

  return (
    <div ref={divRef} className='fixed z-[100] top-0 left-0 w-full h-screen flex justify-center items-center'>
      {children}
      <button 
        onClick={close}
        className='absolute top-2 right-2 px-3 py-1 rounded hover:bg-gray-250 border bg-gray-350'
        >x</button>
    </div>
  )
}