import React, { useEffect, useMemo } from "react";
import './ProducDetailComponent.scss'
import { Col, Image, InputNumber, Row } from "antd";
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import ImageProduct1 from '../../assests/images/Iphone/Iphone1.1.jpg'
import ImageProductSmall2 from '../../assests/images/Iphone/Iphoen1.2.jpg'
import ImageProductSmall3 from '../../assests/images/Iphone/Iphone1.3.jpg'
import ImageProductSmall4 from '../../assests/images/Iphone/Iphone1.4.jpg'
import ImageProductSmall5 from '../../assests/images/Iphone/Iphone1.5.jpg'
import ImageProductSmall6 from '../../assests/images/Iphone/Iphone1.6.jpg'
import {
    MinusOutlined,
    PlusOutlined,
    StarFilled
} from '@ant-design/icons'
import * as productServices from '../../services/productServices'
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../LoadingComponent/LoadingComponet";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { addOrderProduct, resetOrder } from "../../redux/slices/orderSlice";
import { convertPrice, initFacebookSDK } from "../../utils";
import * as message from '../../components/Message/Message'
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";
const ProductDetailComponent = ({idProduct}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [numProduct, setNumProduct] = useState(1);
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const dispatch = useDispatch();
    const onChange = (e) => {
        setNumProduct(e);
    }
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const fetchGetDetailsProduct = async (context) => {
        console.log('context: ', context)
        const id = context?.queryKey && context?.queryKey[1];
        if(id){
            const res = await productServices.getDetailsProduct(id, user?.access_token);
            return res.data;
        }
    }
    const queryProduct = useQuery(
        {queryKey: ['product-details', idProduct], queryFn: fetchGetDetailsProduct}, 
        {enabled: !!idProduct}
    );
    const { data: productDetails, isLoading: isLoadingProductDetails } = queryProduct;
    const renderStars = (num) => {
        let stars = [];
        for(let i = 1; i <= num;i ++){
            stars.push(i);
        }
        return stars;
    }
    const handleChangeCount = (text, limited) => {
        if (text === 'decrease') {
            if (!limited) {
                setNumProduct((prev) => prev - 1);
            }
        } else if (text === 'increase') {
            if (!limited) {
                setNumProduct((prev) => prev + 1);
            }
        }
    }
    // console.log('Location: ', location)
    const handleAddOrderProduct = () => {
        if(!user?.id){
            navigate('/sign-in', {state: location.pathname});
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.productId === productDetails?.id)
            if ((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        productId: productDetails?.id,
                        discount: productDetails?.discount,
                        countInStock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true);
            }
        }
    }
  
    useEffect(() => {
        if (order?.isSuccessOrder) {
            message.success('Thêm vào giỏ hàng thành công')
        }
        return () => {
            dispatch(resetOrder());
        }
    }, [order?.isSuccessOrder])

    useEffect(() => {
        const orderRedux = order?.orderItems.find((item) => item.productId === productDetails?.id)
        if ((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false);
        } else if(productDetails?.countInStock === 0){
            setErrorLimitOrder(true);
        }
    }, [numProduct])
    
    useEffect(() => {
        initFacebookSDK()
    }, [])
    // console.log('productDetails: ', productDetails, user);
    return(
        <LoadingComponent isLoading={isLoadingProductDetails}>
            <Row style={{padding: '16px'}}>
                <Col span={10} className="image-product-detail" style={{height: 500}}>
                    <Image src={productDetails?.image} alt="image product" preview={false}/>
                    <Row className="list-product-image">
                        <Col span={4}>
                            <Image src={ImageProductSmall2} alt="image small" preview={false}/>
                        </Col>
                        <Col span={4}>
                            <Image src={ImageProductSmall3} alt="image small" preview={false}/>
                        </Col>
                        <Col span={4}>
                            <Image src={ImageProductSmall4} alt="image small" preview={false}/>
                        </Col>
                        <Col span={4}>
                            <Image src={ImageProductSmall5} alt="image small" preview={false}/>
                        </Col>
                        <Col span={4}>
                            <Image src={ImageProductSmall6} alt="image small" preview={false}/>
                        </Col>
                    </Row>
                </Col>
                <Col span={14} className="product-detail-info" style={{paddingTop: '20px'}}>
                    <h1 className="name-product">
                        {productDetails?.name}
                    </h1>
                    <div className="report-sale-product">
                        { productDetails?.rating > 0 && 
                            renderStars(productDetails?.rating).map(
                                star => {
                                    return(
                                        <StarFilled key={star} style={{ fontSize: '12px', color: 'rgb(253, 216,54)'}}/>
                                    )
                                }
                            )
                        }
                        <span className="text">| Đã bán {productDetails?.selled || '1000+'}</span>
                    </div>
                    <div className="price-product">
                        <h1 className="price-text">{convertPrice(productDetails?.price)}</h1>
                    </div>
                    <div className="address-product">
                        Giao đến: &nbsp;
                        <span className="address">{user?.address || ''}</span>
                    </div>
                    <LikeButtonComponent
                        dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href}
                    />
                    <div className="quality-product">
                        <div className="message">Số lượng</div>
                        <div className="quality-button">   
                            <MinusOutlined className="btn btn-minus" style={{width: 35, height: 30}} onClick={() => handleChangeCount('decrease', numProduct === 1)}/>
                            <InputNumber className="input" size="small" 
                                            min={1} max={productDetails?.countInStock} defaultValue={1} value={numProduct}
                                            onChange={(e) => onChange(e)} style={{userSelect: 'none'}}
                            />
                            <PlusOutlined  className="btn btn-plus" style={{width: 35, height: 30}} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}/>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    backgroundColor: 'red',
                                    height: '35px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '5px'
                                }}
                                textButton={'Chọn mua'}
                                styleTextButton={{color: '#fff', fontSize: '15px', fontWeight: '700'}}
                                onClick={handleAddOrderProduct}
                            />
                            {errorLimitOrder && <div><span style={{color: 'red'}}>Sản phẩm đã hết hàng</span></div>}
                        </div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'white',
                                height: '35px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 182)',
                                borderRadius: '5px'
                            }}
                            textButton={'Mua trả sau'}
                            styleTextButton={{
                                color: 'rgb(13, 92, 182)',
                                fontSize: '15px',
                            }}
                        />
                    </div>
                </Col>
                <CommentComponent
                    dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href}
                    width="100%" 
                />
            </Row>
        </LoadingComponent>
    )
}

export default ProductDetailComponent