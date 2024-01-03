import React from "react";
import Slider from 'react-slick'
// import { Image } from "antd";
import './LatestProductComponent.scss'
import { CheckOutlined, StarFilled } from "@ant-design/icons";
import { convertPrice } from "../../utils";
import { useNavigate } from "react-router";
const LatestProductComponent = ({ arrProduct }) => {
    const navigate = useNavigate();
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`);
    }
    // console.log('arrProduct', arrProduct)
    return (
        <Slider {...settings} className="slider-product">
            {Array.isArray(arrProduct) && arrProduct?.map(
                (product) => {
                    return (
                        <div className="card-product" onClick={() => handleDetailsProduct(product?.id)} key={product?.id} >
                            <div className="card-header">
                                <img src={ product?.image } className="card-image"/>
                                <div className="card-label">
                                    <CheckOutlined className='label-icon'/>
                                    <span className='label-text'>OFFICIAL</span>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="card-name">{product?.name}</div>
                                <div className="card-report">
                                    <span className="rate">
                                        <span className="star-text">{product?.rating}</span>
                                        <StarFilled className='star-icon'/>
                                    </span>
                                    <span className="quality">Đã bán { product?.selled ? product?.selled : 0}+</span>
                                </div>
                                <div className="card-price">
                                    <span className="price-text"><strong>{convertPrice(product?.price)}</strong></span>
                                    <span className="price-discount">-{ product?.discount ? product?.discount : 0 }%</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            )}
        </Slider>
    )
}
export default LatestProductComponent