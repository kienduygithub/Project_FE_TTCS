import React from "react";
import './TypeProduct.scss'
import { useNavigate } from "react-router";

const TypeProduct = ({name}) => {
    const navigate = useNavigate();
    const handleNavigateType = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')?.replace(/đ/g, 'd').replace(/Đ/g, 'D')}`, {state: type})
    }
    return (
        <div className="one-type" style={{cursor: 'pointer', height: '25px', display: 'flex', alignItems: 'center', borderRadius: '4px', width: '100%', padding: '0 10px', boxSizing: 'border-box'}} onClick={() => handleNavigateType(name)}>{name}</div>
    )
}

export default TypeProduct