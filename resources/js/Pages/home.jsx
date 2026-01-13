import { useState } from "react"

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