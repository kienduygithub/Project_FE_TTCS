import React, { useEffect, useMemo, useState } from "react";
import './DetailsOrderPage.scss'
import logo from '../../assests/images/logo.jpg'
import { useLocation, useParams } from "react-router";
import * as orderServices from '../../services/orderServices'
import { useQuery } from "react-query";
import { orderConstants } from '../../constants'
import { convertPrice } from "../../utils";
import { useSelector } from "react-redux";
import Footer from "../../components/FooterComponent/Footer";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponet";
// import { useSelector } from "react-redux";
const DetailsOrderPage = () => {
    const params = useParams();
    const location = useLocation();
    const user = useSelector((state) => state.user);
    const { state } = location;
    const { id } = params;
    const [ordercc, setOrder] = useState(null); 
    const [isLoadingOrder, setIsLoadingOrder] = useState(true) 
    const fetchDetailsOrder = async () => {
        const res = await orderServices.getOrderDetailsById(id, user?.access_token);
        return res;
    }
    const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder })
    const { data: dataDetails, isLoading: isLoadingDetails, isSuccess: isSuccessDetails, isError: isErrorDetails } = queryOrder;

    // TÍNH TẠM
    const priceMemo = useMemo(() => {
        const result = dataDetails?.items?.reduce((total, cur) => {
            return total + (cur?.price * cur?.amount)
        }, 0)
        return result;
    }, [dataDetails])
    const setOrderDisplay = useMemo(() => {
        if (dataDetails?.data) {
            setOrder({
                    // ...dataDetails?.data,
                    // orderItems: JSON.parse(JSON.parse(dataDetails?.data?.orderItems)),
                    shippingAddress: JSON.parse(JSON.parse(dataDetails?.data?.shippingAddress)),
                    isPaid: dataDetails?.data?.isPaid,
                    isDelivered: dataDetails?.data?.isDelivered,
                    itemsPrice: dataDetails?.data?.itemsPrice,
                    paymentMethod: dataDetails?.data?.paymentMethod,
                    shippingMethod: dataDetails?.data?.shippingMethod,
                    shippingPrice: dataDetails?.data?.shippingPrice,
                    totalPrice: dataDetails?.data?.totalPrice
                })
        }
        return null;
    }, [dataDetails])
    return (
        <div className="order-background">
            <LoadingComponent isLoading={ isLoadingOrder && isLoadingDetails}>
            <h4 className="order-details-text">Chi tiết đơn hàng</h4>
            <div className="header-user">
                <div className="info-user">
                    <span>Địa chỉ người nhận</span>
                    <div className="content-info">
                        <div className="name-info">{ ordercc?.shippingAddress?.fullName }</div>
                        <div className="address-info">
                            <span>Địa chỉ: </span> {`${ordercc?.shippingAddress?.address} - ${ordercc?.shippingAddress?.city}`}
                        </div>
                        <div className="phone-info">
                            <span>Điện thoại: </span> {ordercc?.shippingAddress?.phone}
                        </div>
                    </div>
                </div>
                <div className="info-user">
                    <span>Hình thức giao hàng</span>
                    <div className="content-info">
                        <div className="delivery-info">
                            <span className="name-delivery">{orderConstants.delivery[ordercc?.shippingMethod]}</span>
                            &nbsp;Giao hàng tiết kiệm
                        </div>
                        <div className='delivery-fee'>
                            <span>Phí giao hàng: </span>
                            &nbsp;{convertPrice(ordercc?.shippingPrice)}
                        </div>
                    </div>
                </div>
                <div className="info-user">
                    <span>Hình thức thanh toán</span>
                    <div className="content-info">
                        <div className="payment-info">
                            {orderConstants.payment[ordercc?.paymentMethod]}
                        </div>
                        <div className='status-payment'>
                            {ordercc?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </div>
                    </div>
                </div>
            </div>
            <div className="style-content">
                <div className="style-content-header">
                    <div style={{ width: '45%' }}>
                        <span style={{marginLeft: '10px'}}>Sản phẩm</span>
                    </div>
                    <div className="item-label">
                        <span>Giá</span>
                        <span>Số lượng</span>
                        <span>Giảm giá</span>
                    </div>
                </div>
                {dataDetails?.items?.map((item) => {
                    console.log('item', item)
                    return (
                        <div className="item-product">
                            <div className="name-product">
                                <img src={item?.image} className="item-product-image"/>
                                <div className="item-product-phone">
                                    {item?.name} 
                                </div>
                            </div>
                            <div className="value-product">
                                <span className="item">{convertPrice(item?.price)}</span>
                                <span className="item">{item?.amount}</span>
                                <span className="item">{item?.discount ? convertPrice(item?.price * (item?.discount * item?.amount) / 100) : `0₫`}</span>
                            </div>
                        </div>
                    )
                })}
                <div style={{ borderTop: '1px solid black' }}>
                    <div className="order-all-price">
                        <div className="all-price">
                            <div className="item-label">Tạm tính</div>
                            <div className="item">{ convertPrice(priceMemo) }</div>
                        </div>
                        <div className="all-price">
                            <div className="item-label">Phí vận chuyển</div>
                            <div className="item">{ convertPrice(ordercc?.shippingPrice) }</div>
                        </div>
                        <div className="all-price">
                            <div className="item-label">Tổng cộng </div>
                            <div className="item">{ convertPrice(ordercc?.totalPrice)}</div>
                        </div>
                    </div>
                </div>
            </div>
            </LoadingComponent>    
            <Footer isHiddenFooter={true} />
        </div>
    )
}
export default DetailsOrderPage