import {Button, Checkbox, Form, InputNumber, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import './PagementPage.scss'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import { WrapperInputNumber } from '../../components/ProductDetailComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slices/orderSlice';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/userMutationHook'
import * as userServices from '../../services/userServices'
import * as orderServices from '../../services/orderServices'
import * as paymentServices from '../../services/paymentServices'
import * as message from '../../components/Message/Message'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet';
import { updateUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { PayPalButton } from "react-paypal-button-v2";
// import StepComponent from '../../components/StepConponent/StepComponent';
const PaymentPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [delivery, setDelivery] = useState('fast');
    const [payment, setPayment] = useState('later_money');
    const [sdkReady, setSdkReady] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })
    // TẠM TÍNH
    const priceMemo = useMemo(() => {
        let result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + (cur?.price * cur?.amount);
        }, 0)
        return result;
    }, [order])
    const priceDiscountMemo = useMemo(() => {
        let result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur?.discount ? cur?.discount : 0;
            return total + (cur?.price * ((totalDiscount * cur?.amount) / 100))
        }, 0)
        if (Number(result)) {
            return result;
        }
        return 0
    }, [order])
    const DeliveryPriceMemo = useMemo(() => {
         if (priceMemo >= 2000000 && priceMemo < 5000000) {
            return 100000;
        } else if(priceMemo === 0 && order?.orderItemsSelected?.length === 0|| priceMemo >= 5000000){
            return 0;
        } else {
            return 200000;
        }
    }, [priceMemo])
    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(DeliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, DeliveryPriceMemo])
    // KHAI BÁO CÁC MUTATION
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data;
            const res = userServices.updateUser(data);
            // console.log('resUpdate', res)
            return res;
        }
    )
    const mutationAddOrder = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data;
            const res = await orderServices.createOrder({...rests}, access_token);
            // console.log('resOrder', res)
            return res;
        }
    )
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataAddOrder, isLoading: isLoadingAddOrder, isSuccess: isSuccessAddOrder, isError: isErrorAddOrder } = mutationAddOrder;
    // HANDLE ACTION
   
    const handleCancelUpdateInfo = () => {
        setIsOpenModalUpdateInfo(false);
        setStateUserDetails({
            name: '',
            address: '',
            phone: '',
            city: ''
        })
        form.resetFields();
    }
    const handleUpdateInfoUser = () => {
        console.log('stateUserDetails: ', stateUserDetails);
        const { name, address, city, phone } = stateUserDetails;
        if (name && address && city && phone) {
            mutationUpdate.mutate({ id: user?.id, access_token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ ...user, name, city, phone, address }))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }
    const handleAddOrder = () => { 
        mutationAddOrder.mutate({
            access_token: user?.access_token,
            orderItems: JSON.stringify(order?.orderItemsSelected),
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            shippingMethod: delivery,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: DeliveryPriceMemo,
            totalPrice: totalPriceMemo,
            userId: user?.id,
            email: user?.email
        })
    }
   
    // useEffect
    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])
    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                ...stateUserDetails,
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isOpenModalUpdateInfo])
    useEffect(() => {
        if (isSuccessAddOrder && dataAddOrder?.status === 'OK') {
            const arrayOrder = [];
            order?.orderItemsSelected?.forEach(
                (order) => {
                    arrayOrder.push(order?.productId);
                }
            )
            dispatch(removeAllOrderProduct({ listChecked: arrayOrder }));
            message.success('Đặt hàng thành công');
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPrice: totalPriceMemo
                }
            })
        } else if (isErrorAddOrder) {
            message.error('Đặt hàng thất bại')
        }
    }, [isSuccessAddOrder, isErrorAddOrder])
    // HANDLE ONCHANGE
    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    }
    const handlePayment = (e) => {
        setPayment(e.target.value);
    }
    const handleDelivery = (e) => {
        setDelivery(e.target.value);
    }

    const addPaypalScript = async () => {
        const {data} = await paymentServices.getConfig();
        const script = document.createElement('script'); 
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }
    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate({
            access_token: user?.access_token,
            orderItems: JSON.stringify(order?.orderItemsSelected),
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            shippingMethod: delivery,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: DeliveryPriceMemo,
            totalPrice: totalPriceMemo,
            userId: user?.id,
            isPaid: true,
            paidAt: details.update_time,
            email: user?.email
        })
        // console.log('details, data', details, data);
    }
    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript();
        } else {
            setSdkReady(true);
        }
    }, [])
    return (
        <div className='order-background'>
            <LoadingComponent isLoading={isLoadingAddOrder}>
            <h3 className='cart-order-title'>Thanh toán</h3>
            <div className='payment-container'>
                <div className="container-left">
                    <div className='method-info'>
                        <label className='text-info'>Chọn phương thức giao hàng</label>
                        <Radio.Group onChange={handleDelivery} value={delivery}>
                            <Radio value={'fast'}>
                                <span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> 
                                &nbsp; Giao hàng tiết kiệm
                            </Radio>
                            <Radio value="gojek">
                                <span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span>
                                &nbsp; Giao hàng tiết kiệm
                            </Radio>
                        </Radio.Group>
                    </div>
                    <div className='method-info'>
                    <label className='text-info'>Chọn phương thức thanh toán</label>
                        <Radio.Group onChange={handlePayment} value={payment}>
                            <Radio value={'later_money'}>
                                Thanh toán tiền mặt trước khi nhận hàng
                            </Radio>
                            <Radio value={'paypal'}>
                                Thanh toán bằng paypal
                            </Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div className="container-right">
                    <div className='bill'>
                        <div className='bill-info' style={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: 5}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <span>Địa chỉ: </span>
                                <span className="change-address" onClick={handleOnChangeAddress} style={{ color: '#1677ff', cursor: 'pointer' }}>
                                    Thay đổi
                                </span>    
                            </div>
                            <span style={{
                                fontWeight: 'bold', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                overflow: 'hidden', width: '150px', fontSize: '13px'
                            }}>
                                {`${user?.address} - ${user?.city}`}
                            </span>            
                        </div>
                        <div className='bill-info' style={{borderRadius: '0px'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Tạm tính</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Giảm giá</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Phí giao hàng</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(DeliveryPriceMemo)}</span>
                            </div>
                        </div>
                        <div className='bill-total'>
                            <span>Tổng tiền</span>
                            <span style={{display:'flex', flexDirection: 'column'}}>
                                <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{
                                    convertPrice(totalPriceMemo)
                                }</span>
                                <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                            </span>
                        </div>
                    </div>
                    {payment === 'paypal' && sdkReady ? 
                            <div style={{width: '100%'}}>
                                <PayPalButton
                                    amount={ Math.round(totalPriceMemo / 300000) }
                                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                    onSuccess={onSuccessPaypal}
                                    onError={() => {
                                        message.error('Lỗi không thể thanh toán')
                                    }}
                                />
                            </div>
                            :
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    backgroundColor: '#ff4d4b',
                                    height: '48px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: '4px',
                                    
                                }}
                                textButton={'Đặt hàng'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                onClick={() => handleAddOrder()}
                            />
                    }
                </div>
            </div>
            </LoadingComponent>    
            <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdateInfo} onOk={handleUpdateInfoUser}>
                <LoadingComponent isLoading={isLoadingUpdated}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    // onFinish={onUpdateUser}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <InputComponent value={stateUserDetails.name} onChange={(e) => handleOnChangeDetails(e)} name="name" />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <InputComponent value={stateUserDetails['phone']} onChange={(e) => handleOnChangeDetails(e)} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                        <InputComponent value={stateUserDetails.address} onChange={(e) => handleOnChangeDetails(e)} name="address" />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please input your city!' }]}
                    >
                        <InputComponent value={stateUserDetails.city} onChange={(e) => handleOnChangeDetails(e)} name="city" />
                    </Form.Item>
                </Form>
                </LoadingComponent>
            </ModalComponent>
        </div>
    )
}

export default PaymentPage