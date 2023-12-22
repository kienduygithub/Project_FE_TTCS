import React from "react";
import Slider from 'react-slick'
import { Image } from "antd";
import './SliderComponent.scss'
const SliderComponent = ({arrImages}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 2000
    };
    let i = 1;
    return (
       <Slider {...settings} className="slider">
            {
                
                arrImages.map((image) => {
                    return(
                        <Image key={`${i = i + 1}`}
                            src={image} 
                            alt="Slider"
                            preview={false}
                            width={'100%'}
                            height={'100%'}
                            className="slick-image"
                        />
                    )
                })
            }
       </Slider>
    )
}
export default SliderComponent