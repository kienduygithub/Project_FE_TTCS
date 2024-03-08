import React, { useEffect, useState } from 'react'
import './MyOrderPage.scss'
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slices/orderSlice';
import { convertPrice } from '../../utils';
import * as orderServices from  '../../services/orderServices'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router';
import { useMutationHooks } from '../../hooks/userMutationHook'
import * as message from '../../components/Message/Message'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { type } from '@testing-library/user-event/dist/type';
import Footer from '../../components/FooterComponent/Footer';
const MyOrderPage = () => {
    const user = useSelector((state) => state.user);
    const [orders, setOrders] = useState({
        orderItems: [],
        shippingAddress: [],
        paymentMethod: '',
        itemsPrice: '',
        shippingPrice: '',
        totalPrice: '',
        userId: '',
        id: ''
    })
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const fetchMyOrder = async () => {
        const res = await orderServices.getOrderByUserId(state?.id, state?.token);
        return res.data;
    }
    const mutationGetAll = useMutationHooks(
       async (data) => await orderServices.getAllOrder(data?.access_token)
    )
    const { data: dataGetAll, isLoading: isLoadingGetAll, isSuccess: isSuccessGetAll, isError: isErrorGetAll } = mutationGetAll;
    useEffect(() => {
        if (isSuccessGetAll && dataGetAll?.status === 'OK') {
            if (dataGetAll?.data) {
                let newData = [];
                dataGetAll?.data?.forEach((order) => {
                    newData.push({
                        ...order,
                        orderItems: JSON.parse(JSON.parse(order?.orderItems)),
                        shippingAddress: JSON.parse(JSON.parse(order?.shippingAddress))
                    })
                })
            }
        }
    }, [isSuccessGetAll, isErrorGetAll])
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder }, {
        // enabled: user?.id && user?.access_token,
        enabled: state?.id && state?.token
    });

    const { data, isLoading, isSuccess, isError } = queryOrder;
    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                id: id,
                token: state?.token
            }
        })
    }
    // KHAI BÁO CÁC MUTATION
    const mutationCancel = useMutationHooks(
        (data) => {
            const { id, token, orderItems, userId } = data;
            const res = orderServices.cancelOrder(id, token, orderItems, userId);
            return res;
        }
    )
    const { data: dataCancel, isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel } = mutationCancel;
    const handleCancelOrder = (order) => {
        mutationCancel.mutate({
            id: order?.id,
            token: state?.token,
            orderItems: order?.orderItems,
            userId: user?.id
        }, {
            onSuccess: () => {
                queryOrder.refetch();
            }
        })
    }
    useEffect(() => {
        if (isSuccess) {
            if (data) {
                let newOrderData = [];
                Array.isArray(data) && data?.forEach((order) => {
                    newOrderData.push({
                        ...order,
                        orderItems: order.OrderItems,
                        shippingAddress: JSON.parse(JSON.parse(order?.shippingAddress))
                    })
                })
                setOrders(newOrderData)
            }
        }
    }, [isSuccess, isError, data])
    // Quan trọng
    // console.log('orders: ', data)
    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            message.success('Hủy đơn hàng thành công');
        } else if (isErrorCancel) {
            message.error('Hủy đơn hàng thất bại');
        }
    }, [isSuccessCancel, isErrorCancel])
    const renderProduct = (data) => {
        return data?.map((order) => {
            return (
                <div className='header-item' key={order?.name}>
                    <img src={order?.image} className='image-item'/>
                    <div  className='name-item'>
                        {order?.name} 
                    </div>
                    <span className='price-item'>
                        {convertPrice(order?.price)}
                    </span>
                </div>
            )
        })
    }
    return (
    <LoadingComponent isLoading={isLoading || isLoadingCancel}>
        <div className='order-background'>    
            <h3 className='cart-order-title'>Các đơn hàng</h3>
            <div className='list-order'>
                {   orders?.length > 0 &&
                        
                    orders?.map(
                        (order) => {
                            return (
                                <div key={order?.id} className='item-order'>
                                    <div className='status'>
                                        <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                                        <div>
                                            <span style={{ color: 'rgb(255,66,78)' }}>Giao hàng: </span>
                                            {`${order?.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}
                                        </div>
                                        <div>
                                            <span style={{color: 'rgb(255,66,78)'}}>Thanh toán: </span>
                                            {`${order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}
                                        </div>
                                    </div>
                                    {renderProduct(order?.orderItems)}
                                    <div className='footer-item'>
                                        <div>
                                            <span style={{ color: 'rgb(255,66,78)' }}>Tổng tiền: </span>
                                            <span style={{fontSize: '13px', color: 'rgb(56, 56, 61)'}}>{ convertPrice(order?.totalPrice)}</span>
                                        </div>
                                        <div style={{display: 'flex', gap: '10px'}}>
                                            <ButtonComponent
                                                onClick={() => handleCancelOrder(order)}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: order.isPaid ? '1px solid red' : '1px solid rgb(11, 116, 229)',
                                                    borderRadius: '4px',
                                                }}
                                                textButton={order.isPaid ? 'Xóa đơn hàng' : 'Hủy đơn hàng'}
                                                styleTextButton={{color: order.isPaid ? 'red' : 'rgb(11, 116, 229)', fontSize: '14px'}}
                                            />
                                            <ButtonComponent
                                                onClick={() => handleDetailsOrder(order?.id)}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11,116,229)',
                                                    borderRadius: '4px'
                                                }}
                                                textButton={'Xem chi tiết'}
                                                styleTextButton={{color: 'rgb(11,116,229)', fontSize: '14px'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                            
                            
                        }    
                    )
                }
            </div>
            <Footer isHiddenFooter={true}/>    
        </div>
    </LoadingComponent>
    )
}

export default MyOrderPage