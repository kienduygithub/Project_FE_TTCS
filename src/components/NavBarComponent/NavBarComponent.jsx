import React from "react";
import './NavBarComponent.scss'
import * as productServices from '../../services/productServices'
import { Checkbox, Rate } from "antd";
const NavBarComponent = (props) => {
    const onChange = () => {}
    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
    
    const renderContent = (type, options) => {
        switch(type){
            case 'text':
                return options.map((option) => {
                    return <span className="text-value" style={{cursor: 'pointer'}} onClick={() => props.handleSetProductsNav(option, props.page, props.limit)}>{option}</span>
                })
            case 'checkbox': 
                return (
                    <Checkbox.Group className="checkbox-value-options" onChange={() => onChange()}>
                        {options.map((option => {
                            return(
                                <Checkbox className="checkbox-value" value={option.value}>
                                    {option.label}
                                </Checkbox>
                            )
                        }))}
                    </Checkbox.Group>
                )
            case 'star-rate':
                return (
                    <div className="star-rate-list">
                        {options.map(option => {
                            return (
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <Rate style={{fontSize: '12px'}} defaultValue={option} tooltips={desc} disabled>
                                        
                                    </Rate>
                                    <span className="rate-label">{desc[option - 1]}</span>
                                </div>
                            )
                        })}
                    </div>
                )
            case 'price':
                return (
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}} className="price-content">
                        {
                            options.map(option => {
                                return (
                                    <div className="price-text" style={{
                                        fontSize: '12px', display: 'inline-block', padding: '5px 8px',
                                        boxSizing: 'border-box', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.45)'
                                    }} onClick={() => props.handleSetProductsRangePriceNav(option.text, option.min, option.max)}>{option.text}</div>
                                )
                            })
                        }
                    </div>
                )
            default: 
                return {}
            }
    }
    return(
        <div className="nav-background">
            <div className="navigation-container">
                <h4 className="nav-label">{ props.label }</h4>
                <div className="text-value-content">
                    { renderContent(props.type, props.categoris)}
                </div>
                {/* <div className="checkbox-value-content">
                    {renderContent('checkbox', [
                        { value: 'a', label: 'A'},
                        { value: 'b', label: 'B'},
                        { value: 'c', label: 'C'}
                    ])}
                </div>
                <div className="rate-star-content">
                    {renderContent('star-rate', [
                       1, 2, 3, 4, 5
                    ])}
                </div>
                <div className="price-content">
                    {renderContent('price', [
                        'Dưới 40.000', 'Trên 50.000'
                    ])}
                </div> */}
            </div>
        </div>
    )
}

export default NavBarComponent