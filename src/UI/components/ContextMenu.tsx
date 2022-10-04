import styled from "styled-components";

const ContextMenu_css = styled.ul<{xPos: number, yPos: number}>`
    list-style: none;
    padding: 0;
    margin: 0;
    border: lightblue;
    background-color: black;
    border-radius: 8px;
    position: absolute;
    ${({xPos, yPos}) => `
      top: ${yPos}px;
      left: ${xPos}px;
    `}

    > li {
      width: 200px;
      margin: 5px;
      padding: 0 5px;
      border-radius: 5px;
      color: lightblue;

      :hover {
        background-color: #272727;
      }
    }
  `

export function ContextMenu(props: {xPos: number, yPos: number, options: {title: string, action(): void}[]}) {
  const {xPos, yPos, options} = props;
  
  return  <ContextMenu_css xPos={xPos} yPos={yPos}>
            {options.map( option => <li onClick={option.action}>{option.title}</li>)}
          </ContextMenu_css>
}