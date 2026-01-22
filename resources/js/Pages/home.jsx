/*Ne pas enlever sinon c'est la merde*/
/* eslint-disable react/react-in-jsx-scope */

import { useState } from "react"
import styled from "styled-components";

/* Pour l'insstant je met le theme là-dedans le temps de faire des tests */

const theme = {
    blue: {
        default: "#8DB5CF",
        hover: "#B4CDDF"
    },
};

const Button = styled.button`
    background-color: ${(props) => theme[props.theme].default};
    color: white;
    padding: 5px 15px;
    border-radius: 5px;
    outline: 0;
    border: 0; 
    text-transform: uppercase;
    margin: 10px 0px;
    cursor: pointer;
    box-shadow: 0px 2px 2px lightgray;
    transition: ease background-color 250ms;
    &:hover {
        background-color: ${(props) => theme[props.theme].hover};     
    }
    &:disabled {
        cursor: default;
        opacity: 0.7;
    }
`;

Button.defaultProps = {
    theme: "blue",
};

export default function Home(){
    const [nb,setNb] = useState(0);

    const increment = _ =>{
        setNb(nb+1)
    }

    return (
        <>
            <h1>Hello user</h1>
            <button onClick={increment}>{nb} clicks</button>
        </>
    )
}

/*
const ButtonToggle = styled(Button)`
    opacity: 0.7;
    ${({ active })} =>
        active &&
        `
        opacity: 1;
        `}
    `;
*/

    /*
const Tab = styled.button`
    padding: 10px 30px;
    cursor: pointer;
    opacity: 0.6;
    background: white;
    border: 0;
    outline: 0;
    border-bottom: 2px solid transparent;
    transition: ease border-bottom 250ms;
    ${({ active })} =>
        active &&
        `
        border-bottom: 2px solid black;
        opacity: 1;
        `}
    `;*/