import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import './OrderSuccess.scss'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined, RollbackOutlined} from '@ant-design/icons'

import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useMutationHooks } from '../../hooks/userMutationHook'
import * as userServices from '../../services/userServices'
import * as orderServices from '../../services/orderServices'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';
import { orderConstants } from '../../constants';
// import StepComponent from '../../components/StepConponent/StepComponent';
const OrderSuccess = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    console.log(state)
    return (
        <div className='order-background'>
            <h3 className='back-to-home'
                onClick={() => navigate('/')} style={{cursor: 'pointer'}}
            >
                <span>Trở về trang chủ</span>
                <RollbackOutlined />
            </h3>
            {/* <LoadingComponent isLoading={isLoadingAddOrder}> */}
            <h3 className='cart-order-title'>Đơn hàng đã đặt thành công</h3>
            <div className='order-success-container'>
                <div>
                    <label className='text-info'>Phương thức giao hàng</label>
                    <div className='text-value'>
                        <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{ orderConstants.delivery[state?.delivery] }</span>
                            &nbsp; Giao hàng tiết kiệm
                    </div>
                </div>
                <div style={{borderTop: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px'}}>
                    <label className='text-info'>Phương thức thanh toán</label>
                    <div className='text-value'>
                        {orderConstants.payment[state?.payment]}  
                    </div>
                </div>
                <div className='list-order-items'>
                    {
                        state?.orders?.map((order) => {
                            return (
                                <div className='item-order' key={order?.name}>
                                    <div className='item-content'>
                                        <img src={order?.image} alt='img'/>
                                        <div className='name-text'>{order?.name}</div>
                                    </div>
                                    <div className='item-bill'>
                                        <span className='price'>Giá tiền:&nbsp;{convertPrice(order?.price)}</span>
                                        <span className='amount'>Số lượng:&nbsp;{order?.amount}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>  
                <div style={{ textAlign: 'right' }}>
                    Tổng tiền:&nbsp;
                    <span className='total-price-text'>{convertPrice(state?.totalPrice)}</span>
                </div>
            </div>
            {/* </LoadingComponent>*/}
        </div>
    )
}

export default OrderSuccess