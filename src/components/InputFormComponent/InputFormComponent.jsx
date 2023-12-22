import { Input } from "antd";
import React from "react";
import './InputFormComponent.scss'
const InputFormComponent = ( props ) => {

    const { placeholder = 'Nhập text', ...rests } = props
    return(
        <Input 
            placeholder={placeholder}
            value={props.valueInput}
            // onChange={(e) => onChangeInput(e)}
            // hidden={true}
            {...rests}
        />
    )
}

export default InputFormComponent