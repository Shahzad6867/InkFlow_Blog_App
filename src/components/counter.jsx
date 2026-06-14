import { useReducer } from "react"

function reducer(action,value){
    if(action === "increment"){
        return value + 1
    }else if(action === "decrement"){
        return value - 1
    }else{
        return 0
    }
}

const Counter = () => {
    const [value,dispatch] = useReducer(reducer,0)

    return (
        <div>
            <h1>Count : {value}</h1>
            <button onClick={() => dispatch("increment")}>Increment</button>
            <button onClick={() => dispatch("decrement")}>Decrement</button>
            <button onClick={() => dispatch("reset")}>Reset</button>
        </div>
    )
}