
export default function UsernameAndLevel(props: any) {
  return (
    <span {...props}>
      <div className='bg-gray-350 px-1'>
        <span className='font-bold'>zero </span><span className='text-red-400 text-xs'>Lv</span><span>49</span>
      </div>
    </span>
  )
}