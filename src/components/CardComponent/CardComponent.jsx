import React from 'react';
import './CardComponent.scss'
import ImageCard1 from '../../assests/images/ImageCard1.jpg'
import { Card } from 'antd';
import { useNavigate } from 'react-router';
import { convertPrice } from '../../utils';
import { StarFilled, CheckOutlined } from '@ant-design/icons';
// const { Meta } = Card;
const CardComponent = (props) => {
    const navigate = useNavigate();
    const {countInStock, description, image, name, price, rating, type, discount, selled, id}
          = props;

    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <Card
            hoverable
            style={{
                width: `${props.style ? props.style.width : 'calc(20% - 15px)'}`,
                backgroundColor: `${countInStock === 0 ? '#ccc' : '#fff'}`,
                cursor: `${countInStock === 0 ? 'not-allowed' : 'pointer'}`,
            }}
          // disable={countInStock === 0}
          // headStyle={{width: '200px', height: '200px'}}
            bodyStyle={{boxSizing: 'border-box'}}
            cover={
                <div className='card-cover-content'>
                    <img alt="Card-Image" src={image}/>
                    <div className='card-label'>
                        <CheckOutlined className='label-icon'/>
                        <span className='label-text'>OFFICIAL</span>
                    </div>
                </div>
            }
            onClick={() => handleDetailsProduct(id)}
        > 
            <div className='name'>{name}</div>
            <div className='report'>
                <span className='rate'>
                    <span className='star-text'>{rating}</span>
                    <StarFilled className='star-icon'/>
                </span>
              <span className='report-quality'>{`Đã bán ${selled ? selled : 0} `}</span>
            </div>
            <div className='price'>
                <span className='price-text'>
                    <strong>{convertPrice(price)}</strong>
                </span>
                <span className='discount'>
                    -{discount ? discount : 0}%
                </span>
            </div>
        </Card>
    )

}

export default CardComponent