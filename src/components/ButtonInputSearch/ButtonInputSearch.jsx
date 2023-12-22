import React from "react";
import { Button } from "antd";
import InputComponent from "../InputComponent/InputComponent";
import {
    SearchOutlined
} from '@ant-design/icons'
import './ButtonInputSearch.scss'
const ButtonInputSearch = (props) => {
    // const [size, setSize] = useState('large')
    const { 
        size, placeholder, textbutton,
        bordered, backgroundColorInput = '#fff',
        backgroundColorButton = '#0d5cb6',
        colorButton = '#fff'
    } = props 
    return (
        <div className="header-search">
            <InputComponent 
                size={size}
                placeholder={placeholder}
                bordered={bordered}
                style={{
                    backgroundColorInput: backgroundColorInput,
                    borderRadius: '5px 0 0 5px'
                }}
                {...props}
            />
            <Button size={size} 
                    icon={<SearchOutlined />} 
                    className="search-button"
            >
                {textbutton}
            </Button>
        </div>
    )
}
export default ButtonInputSearch