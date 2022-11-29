export function Label(
  props:{
    children: JSX.Element, 
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