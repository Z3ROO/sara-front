import { useEffect } from 'react';
import * as Icons from '../../lib/icons/UI'

export default function DesignSystems() {
  return (
    <div className='flex w-full h-full bg-gray-550 bg-opacity-75 overflow-auto' style={{backdropFilter: 'blur(8px)'}}>
      <div className='flex flex-col text-white h-full w-64 bg-gray-700 bg-opacity-75'>
        <a href='#icons-listing'>Icons</a>
      </div>
      <div className='w-full h-full overflow-auto'>
        <IconsListing />
      </div>
    </div>
  )
}

function IconsListing() {
  return (
    <div id="icons-listing" className='mx-auto'>
    {
      Object.keys(Icons).map(icon => {
        const Icon = Icons[icon as keyof typeof Icons];
        return (
          <div className='grow px-4 py-6 rounded m-4 bg-gray-700 bg-opacity-80 w-[28rem] inline-block h-64'>
            <div className='text-lg text-white'>
              <span className=''>{`<${icon} />`}</span>
            </div>
            <div className='flex items-center justify-around h-full'>
              <div className='flex flex-col h-full justify-around'>
                <Icon className="bg-white bg-opacity-5 w-4" />
                <Icon className="bg-white bg-opacity-5 w-4 fill-white" />
              </div>
              <div className='flex flex-col h-full justify-around'>
                <Icon className="bg-white bg-opacity-5 w-8" />
                <Icon className="bg-white bg-opacity-5 w-8 fill-white" />
              </div>
              <div className='flex flex-col h-full justify-around'>
                <Icon className="bg-white bg-opacity-5 w-12" />
                <Icon className="bg-white bg-opacity-5 w-12 fill-white" />
              </div>
              <div className='flex flex-col h-full justify-around'>
                <Icon className="bg-white bg-opacity-5 w-16" />
                <Icon className="bg-white bg-opacity-5 w-16 fill-white" />
              </div>
            </div>
          </div>
        )
      })
    }
    </div>
  )
}