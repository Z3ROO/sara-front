export function OneDigitNotificationCounter({notifications}: {notifications: number}) {
  if (notifications === 0)
    return null
    
  return (
    <div className="absolute flex justify-center items-center rounded-full bg-red-400 w-5 h-5 -top-2 -right-2 shadow-md">
      <span className="text-xs text-white font-bold">
        {notifications <= 9 ? notifications : '9+'}
      </span>
    </div>
  )
}