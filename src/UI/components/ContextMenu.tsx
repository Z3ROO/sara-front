export function ContextMenu(props: {xPos: number, yPos: number, options: {title: string, action(): void}[]}) {
  const {xPos, yPos, options} = props;
  
  return  <div
            className="list-none p-0 m-0 border-blue-300 rounded-lg absolute bg-gray-800"
            style={{
              top: yPos,
              left: xPos
            }}
          >
            {
            options.map( option => (
              <li 
                className="w-52 m-1 p-0 px-1 rounded-md text-blue-300 hover:bg-gray-600 cursor-pointer select-none"
                onClick={option.action}>{option.title}</li>
            ))
            }
          </div>
}