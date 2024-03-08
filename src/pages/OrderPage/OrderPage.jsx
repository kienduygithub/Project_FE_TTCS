import {Button, Checkbox, Form, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
import './OrderPage.scss'
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
import * as  userServices from '../../services/userServices'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import StepComponent from '../../components/StepComponent/StepComponent';
import Footer from '../../components/FooterComponent/Footer'
// import StepComponent from '../../components/StepConponent/StepComponent';
const OrderPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [checkedList, setCheckedList] = useState([]);
    const [listCheckedAll, setListCheckedAll] = useState(false);
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })
    // TẠM TÍNH
    const priceMemo = useMemo(() => {
        let result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + (cur.price * cur.amount)
        }, 0)
        return result;
    }, [order])
    const priceDiscountMemo = useMemo(() => {
        let result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur?.discount ? cur?.discount : 0;
            return total + (cur?.price * (totalDiscount * cur?.amount) / 100);
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
            return res;
        }
    )
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    // HANDLE ACTION
    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))
    }
    const handleDeleteAllOrder = () => {
        if (checkedList?.length >= 1) {
            dispatch(removeAllOrderProduct({ listChecked: checkedList }))
            setCheckedList([])
        }
    }
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
    const handleAddCart = () => {
        console.log('user:', user);
        if (!order?.orderItemsSelected?.length) {
            message.error('Vui lòng chọn sản phẩm trước khi mua')
        }else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
            setIsOpenModalUpdateInfo(true);
        } else {
            navigate('/payment');
        }
    }
    // useEffect
    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])
    useEffect(() => {
        dispatch(selectedOrder({listChecked: checkedList}))
    }, [checkedList])
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
    // HANDLE ONCHANGE
    const onChange = (e) => {
        console.log(`checked = ${e.target.value}`);
        if (checkedList.includes(e.target.value)) {
            const newCheckedList = checkedList.filter((item) => item !== e.target.value);
            setCheckedList(newCheckedList)
        } else {
            setCheckedList([...checkedList, e.target.value])
        }
    };
    console.log('>>> CheckedList: ', checkedList);
    const handleChangeCount = (text ,idProduct, limited) => {
        if (text === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({idProduct}))
            }
        } else if (text === 'decrease') {
            if (!limited) {
                dispatch(decreaseAmount({idProduct}))
            }
        }
    }
    const handleOnChangeCheckAll = (e) => {
        setListCheckedAll(!e.target.value)
        if (e.target.value) {
            const newListChecked = [];
            order?.orderItems?.forEach((item) => newListChecked.push(item?.productId));
            setCheckedList(newListChecked);
        } else {
            setCheckedList([]);
        }
    }
    const handleOnChangeDetails = (e) => {
        console.log('e.target.name: ', e.target.name, e.target.value);
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
    
    const handleOnChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    }
    const itemsDelivery = [
        {
            title: '200.000₫',
            description: 'Dưới 2.000.000 VNĐ'
        },
        {
            title: '100.000₫',
            description: 'Từ 2.000.000 đến 5.000.000 VNĐ'
        },
        {
            title: '0₫',
            description: 'Trên 5.000.000 VNĐ'
        }
    ]
    const stepPrice = (DeliveryPriceMemo) => {
        if (DeliveryPriceMemo === 0 || order?.orderItemsSelected?.length === 0) {
            return 2;
        } else if (DeliveryPriceMemo === 200000) {
            return 0;
        } else if (DeliveryPriceMemo === 100000) {
            return 1;
        }
    }
    return (
        <div className='order-background'>
            <h3 className='cart-order-title'>Giỏ hàng</h3>
            <div className='order-container'>
                <div className="container-left">
                    <div className='header-left-delivery'>
                        <StepComponent current={stepPrice(DeliveryPriceMemo)} items={itemsDelivery}/>
                    </div>
                    <div className='header-left'>
                        <span className='sum-quality-product'>
                            <Checkbox onChange={(e) => handleOnChangeCheckAll(e)} checked={checkedList?.length === order?.orderItems?.length} value={listCheckedAll}></Checkbox>
                            <span className='text'>Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                        </span>
                        <div className='col-bill'>
                            <span style={{marginLeft: '4px'}}>Đơn giá</span>
                            <span style={{marginLeft: '17px'}}>Số lượng</span>
                            <span style={{marginLeft: '9px'}}>Thành tiền</span>
                            <DeleteOutlined onClick={() => handleDeleteAllOrder()} style={{cursor: 'pointer', fontSize: '14px'}}/>
                        </div>
                    </div>
                    <div className='list-orders'>
                        { order?.orderItems?.length > 0 &&  order?.orderItems?.map(
                            (order) => {
                                return(
                                    <div className='item-order' key={order?.productId}>
                                        <div className='item-content'>
                                            <Checkbox onChange={onChange} value={order?.productId} checked={checkedList.includes(order?.productId)}></Checkbox>
                                            <img src={order?.image} alt='img'/>
                                            <div className='name-text'>{order?.name}</div>
                                        </div>
                                        <div className='item-bill'>
                                            <span className='price'>{convertPrice(order?.price)}</span>
                                            {/* <span className='price-discount'>{order?.amount}</span> */}
                                            <div className='count-item'>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.productId, order?.amount === 1)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <InputNumber className='input-count' style={{width: 50}} defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInStock}/>
                                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.productId, order?.amount === order?.countInStock)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                                                </button>
                                            </div>
                                            <span className='total-price-text'> {convertPrice(order?.price * order?.amount)}</span>
                                            <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.productId)}/>
                                        </div>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
                <div className="container-right">
                    <div className='bill'>
                        <div className='bill-info' style={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: 5}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                <span>Địa chỉ: </span>
                                <span className='change-address' onClick={handleOnChangeAddress} style={{
                                    color: '#1677ff'
                                }}>
                                    Thay đổi
                                </span>
                            </div>
                            <span style={{
                                textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden',
                                fontSize: '13px', fontWeight: 'bold', userSelect: 'none',
                                width: '150px'
                            }}>{`${user?.address} - ${user?.city}`}</span>
                        </div>
                        <div className='bill-info' style={{borderRadius: '0px'}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0px'}}>
                                <span>Tạm tính</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0px'}}>
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
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            backgroundColor: '#ff4d4b',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            
                        }}
                        textButton={'Mua hàng'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        onClick={() => handleAddCart()}
                    />
                </div>
            </div>
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
            <Footer isHiddenFooter={true}/>
        </div>
    )
}

export default OrderPage