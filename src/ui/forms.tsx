import { useEffect, useRef, useState } from "react"
import { IconType } from "./icons/UI"

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
  value: T
  setValue: (value:T) => void
  options: { title: string, value: T }[]
  className?: string
  ulClassName?: string
  liClassName?: string
}

export function InputWithOptions<T>(props: InputWithOptionsAttributes<T>) {
  let { defaultValue, value, setValue, options, className, ulClassName, liClassName } = props;
  
  const [displayList, setDisplayList] = useState(false);
  const toggleList = (state: boolean) => setDisplayList(state);
  
  const [inputText, setInputText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  
  if (!className)
    className = '';

  useEffect(() => {
    const regex = new RegExp(inputText);
    setFilteredOptions(options.filter(option => option.title.match(regex)));
  },[inputText]);

  return (
    <div className="relative">
      <input 
        className={' '+(className || 'w-64')} 
        value={inputText} type="text"
        onChange={(e) => {
          const textContent = e.target.value;
          setInputText(textContent);

          const option = options.find(opt => textContent === opt.title);
          if (option) {
            setValue(option.value);
            toggleList(false);
          }
          else {
            setValue(defaultValue);
            toggleList(true);
          }
        }}
        onFocus={() => {
          if (value === defaultValue)
            toggleList(true)
        }} 
        onBlur={
          (e) => setTimeout(()=> {
            if (document.activeElement !== e.target)
              toggleList(false);
          }, 150)
        }
      />
      { displayList && <OptionsDataList<T> {...{setInputText, setValue, liClassName, ulClassName, options:filteredOptions, toggleList}}/> }
    </div>
  )
}

function OptionsDataList<T>(props: { 
    options: { title: string, value: T }[]
    liClassName?: string
    ulClassName?: string
    toggleList: (state: boolean) => void
    setValue: (value: T) => void
    setInputText: React.Dispatch<React.SetStateAction<string>>
  }) {
  const { options, liClassName, ulClassName, toggleList, setValue, setInputText } = props;

  return (
    <ul
    className={'text-input-data-list absolute top-full left-0 overflow-auto '+ (ulClassName || 'bg-white border border-gray-650 border-t-transparent w-full max-h-48')}>
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
                toggleList(false);
              }}
            >{title}</li>
          )
        })
      }
    </ul>
  )
}

export function InputList(props: { value: string[], setValue: (value:string[]) => void }) {
  const { value, setValue } = props;

  useEffect(() => {
    setValue([''])
  },[])

  return  <div className="relative px-4 py-8">
            {
              value.map((item, index) => {
                return  (
                  <InputListItem {...{value, setValue, index}} />
                  )
                })
              }
              <button className="button-icon absolute top-1 right-1" onClick={() => {
                  const updatedList = [...value];
                  updatedList[updatedList.length] = '';
                  setValue(updatedList);
                }
              }><img className="w-3" src="/icons/ui/plus-sign.svg" alt="plus-sign" /></button>
            </div>
}

function InputListItem(props: {
  value: string[]
  setValue: (value: string[]) => void
  index: number
}) {
  const { value, setValue, index } = props;
  const [inputText, setInputText] = useState('');

  return (
    <div className="flex p-2 pt-1 pr-1">
      <input className="w-full text-black" type="text" value={inputText}
        onChange={({target}) => {
          setInputText(target.value);
          value[index] = target.value;
          setValue([...value]);
        }}/>
      <button className="button-icon bg-red-600" onClick={() => {
          if (value.length === 1) return
          const newTodos = [...value];
          newTodos.splice(index, 1);
          setValue(newTodos);
        }
      }>
        <img className="w-3" src="/icons/ui/close-x.svg" alt="close-x" />
      </button>
    </div>
  )
}
