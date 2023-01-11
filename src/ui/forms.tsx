import { useEffect, useRef, useState } from "react"

export function Label(
  props:{
    children: JSX.Element|JSX.Element[], 
    title: string, 
    inline?:boolean,
    className?: string
  }) {

  return (
    <label className={props.className || 'p-2'}>
      <span className={`${!props.inline && 'block'}`}>{props.title}</span>
      {props.children}
    </label>
  )
}

export interface InputWithOptionsAttributes<T> {
  defaultValue: T
  setValue: (value:T) => void
  options: { title: string, value: T }[]
  className?: string
  ulClassName?: string
  liClassName?: string
}

export function InputWithOptions<T>(props: InputWithOptionsAttributes<T>) {
  let { defaultValue, setValue, options, className, ulClassName, liClassName } = props;
  
  const [displayList, setDisplayList] = useState(false);
  const toggleList = () => setDisplayList(prev => !prev);
  
  const [inputText, setInputText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  
  if (!className)
    className = '';

  useEffect(() => {
    const regex = new RegExp(inputText);
    setFilteredOptions(options.filter(option => option.title.match(regex)));
  },[inputText]);

  return (
    <div className="relative w-min">
      <input 
        value={inputText}
        onChange={(e) => {
          setDisplayList(true);

          const textContent = e.target.value;
          setInputText(textContent);

          const option = options.find(opt => textContent === opt.title);
          if (option)
            setValue(option.value);
          else
            setValue(defaultValue);
        }}
        type="text" onFocus={toggleList}
        className={' '+(className || 'w-64')} 
      />
      { displayList && <OptionsDataList<T> {...{setInputText, setValue, liClassName, ulClassName, options:filteredOptions, toggleList}}/> }
    </div>
  )
}

function OptionsDataList<T>(props: { 
    options: { title: string, value: T }[]
    liClassName?: string
    ulClassName?: string
    toggleList: () => void
    setValue: (value: T) => void
    setInputText: React.Dispatch<React.SetStateAction<string>>
  }) {
  const { options, liClassName, ulClassName, toggleList, setValue, setInputText } = props;
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    window.onclick = (e) => {
      if ((e.target as HTMLElement).nodeName !== 'INPUT')
        toggleList();
    }
    return () => { window.onclick = null };
  },[]);

  return (
    <ul ref={ulRef} className={'absolute top-full left-0 overflow-auto '+ (ulClassName || 'bg-white border border-gray-650 border-t-transparent w-full max-h-48')}>
      {
        options.map(option => {
          const { title, value } = option;
          return (
            <li 
              className={' '+(liClassName || 'hover:bg-gray-200 w-full hover:font-bold cursor-pointer')}
              onClick={(e) => {
                e.stopPropagation();
                setValue(value);
                setInputText(title);
                toggleList();
              }}
            >{title}</li>
          )
        })
      }
    </ul>
  )
}