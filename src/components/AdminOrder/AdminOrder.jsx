import React, { useEffect, useRef, useState } from "react";
import './AdminOrder.scss'
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined
} from '@ant-design/icons'
import * as orderServices from '../../services/orderServices'
import InputComponent from '../InputComponent/InputComponent'
import TableComponent from '../TableComponent/TableComponent'
import PieCharts from "./PieChart";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponet";
import ModalComponent from "../ModalComponent/ModalComponent"
import { Button, Form, Select, Space, message } from "antd";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { orderConstants } from '../../constants'
import { convertPrice } from '../../utils'
import { useMutationHooks } from "../../hooks/userMutationHook";

const AdminOrder = () => {
    const user = useSelector((state) => state?.user);
    const [form] = Form.useForm();
    const searchInput = useRef(null);
    const [orderDataGiven, setOrderDataGiven] = useState([]);
    const [isPaidSelect, setIsPaidSelect] = useState('');
    const [isDeliveredSelect, setIsDeliveredSelect] = useState('');
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [stateOrder, setStateOrder] = useState({
        isPaid: false,
        isDelivered: false
    });
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const getAllOrder = async () => {
        const res = await orderServices.getAllOrder(user?.access_token);
        return res;
    }
    const fetchOrderDetails = async (rowSelected) => {
        const res = await orderServices.getOrderDetailsById(rowSelected, user?.access_token);
        if (res?.data) {
            setStateOrder({
                isPaid: res?.data?.isPaid,
                isDelivered: res?.data?.isDelivered
            })
        }
        console.log('stateOrder', res)
    }
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateOrder({
            isPaid: '',
            isDelivered: ''
        })
        form.resetFields();
    }
    // QUERY & MUTATION
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder });
    const { data: dataOrder, isLoading: isLoadingOrder, isSuccess: isSuccessOrder, isError: isErrorOrder } = queryOrder;
    const mutationUpdate = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data;
            const res = await orderServices.updateOrder(data);
            return res;
        }
    )
    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, access_token } = data;
            const res = orderServices.deleteOrderAdmin(data);
            return res;
        }
    )
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;
    // useEffect
    useEffect(() => {
        if (isOpenDrawer) {
            form.setFieldsValue(stateOrder)
        } else {
            form.resetFields();
        }
    }, [isOpenDrawer, stateOrder ,form])
    useEffect(() => {
        if (isSuccessOrder && dataOrder?.status === 'OK') {
            if (dataOrder?.data) {
                let newData = [];
                dataOrder?.data?.forEach((order) => {
                    newData.push({
                        ...order,
                        orderItems: JSON.parse(JSON.parse(order?.orderItems)),
                        shippingAddress: JSON.parse(JSON.parse(order?.shippingAddress))
                    })
                })
                setOrderDataGiven(newData);
            }
        }
    }, [isSuccessOrder, isErrorOrder, dataOrder])
    useEffect(() => {
        if (rowSelected) {
            setIsLoadingUpdate(true);
            fetchOrderDetails(rowSelected);
            setIsLoadingUpdate(false)
        }
    }, [rowSelected, isOpenDrawer])
    useEffect(() => {
        if (isSuccessUpdated) {
            handleCloseDrawer();
            form.resetFields()
        }
    }, [isErrorUpdated, isSuccessUpdated])
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa đơn hàng thành công');
            setIsModalOpenDelete(false);
        } else if (isErrorDeleted) {
            message.error('Gặp trục trặc đâu đó');
        }
    }, [isSuccessDeleted, isErrorDeleted])
    // KHAI BÁO BẢNG DỮ LIỆU
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div
            style={{
            padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
        >
            <InputComponent
                ref={searchInput}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{
                    marginBottom: 8,
                    display: 'block',
            }}
            />
            <Space>
            <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                    width: 90
                }}
            >
                Search
            </Button>
            <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                    width: 90,
                }}
            >
                Reset
            </Button>
            </Space>
        </div>
        ),
        filterIcon: (filtered) => (
        <SearchOutlined
            style={{
            color: filtered ? '#1890ff' : undefined,
            }}
        />
        ),
        onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
        if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
        }
        },
    });
    const columns = [
        {
            title: 'User name',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName'),
            fixed: 'left',
            width: '15%'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address')
        },
        {
            title: 'Paided',
            dataIndex: 'isPaid',
            // sorter: (a, b) => a.isPaid.length - b.isPaid.length,
            // ...getColumnSearchProps('isPaid')
            filters: [
                {
                    text: 'TRUE',
                    value: 'TRUE'
                },
                {
                    text: 'FALSE',
                    value: 'FALSE'
                }
            ],
            onFilter: (value, record) => {
                return record?.isPaid?.indexOf(value) === 0
            }
        },
        {
            title: 'Shipped',
            dataIndex: 'isDelivered',
            // sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
            filters: [
                {
                    text: 'TRUE',
                    value: 'TRUE',
                },
                {
                    text: 'FALSE',
                    value: 'FALSE',
                }
            ],
            onFilter: (value, record) => {
                return record?.isDelivered.indexOf(value) === 0
            }
            // ...getColumnSearchProps('isDelivered')
        },
        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.paymentMethod?.length - b.paymentMethod?.length,
            ...getColumnSearchProps('paymentMethod')
        },
        {
            title: 'Total price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
            ...getColumnSearchProps('totalPrice')
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: () => {
                return (
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <div>
                            <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={() => handleUpdateOrder()}/>
                        </div>
                        <div>
                            <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}}  onClick={() => handleDeleteOrder()}/>
                        </div>
                    </div>
                )
            },
            fixed: 'right',
            width: '10%'
        }
    ];
    const dataTable = orderDataGiven?.length && orderDataGiven?.map(
        (order) => {
            // console.log('order', order);
            return {
                ...order,
                key: order?.id,
                userName: order?.shippingAddress?.fullName,
                phone: order?.shippingAddress?.phone,
                address: order?.shippingAddress?.address,
                paymentMethod: orderConstants.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
                isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
                totalPrice: convertPrice(order?.totalPrice)
            }
        }
    ).reverse()

    //CÁC XỬ LÍ
    const handleUpdateOrder = () => {
        setIsOpenDrawer(true);
    }
    const handleDeleteOrder = () => {
        setIsModalOpenDelete(true);
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    }
    const onUpdateOrder = () => {
        mutationUpdate.mutate({ id: rowSelected, access_token: user?.access_token, ...stateOrder }, {
            onSuccess: () => {
                queryOrder.refetch();
            }
        })
    }
    const onDeleteOrder = () => {
        mutationDelete.mutate({ id: rowSelected, access_token: user?.access_token }, {
            onSuccess: () => {
                queryOrder.refetch();
            }
        });
    }
    const handleChangeIsPaidSelect = (value) => {
        setIsPaidSelect(value);
        setStateOrder({
            ...stateOrder,
            isPaid: value
        })
    }
    const handleChangeIsDeliveredSelect = (value) => {
        setIsDeliveredSelect(value);
        setStateOrder({
            ...stateOrder,
            isDelivered: value
        })
    }
    console.log('orderDataGiven', orderDataGiven)
    return (
        <div className="admin-order-container">
            <div className="admin-order-header">
                Quản lý đơn hàng
            </div>
            <div style={{width: '200px', height: '200px'}}>
                <PieCharts data={ orderDataGiven } />
            </div>
            <div style={{
                marginTop: '20px',
                boxSizing: 'border-box',
                width: '100%'
            }}>
                <TableComponent
                    style={{marginTop: '10px'}}
                    data={dataTable}
                    columns={columns}
                    isLoading={isLoadingOrder}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record.id)
                            }
                        }
                    }}
                    pagination={{ pageSize: 5 }}
                    scroll={{
                        x: 50,
                        y: 230,
                    }}
                />
            </div>
             <DrawerComponent width='50%' title="Chi tiết hóa đơn" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
                <LoadingComponent isLoading={isLoadingUpdate || isLoadingDeleted || isLoadingUpdated}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onUpdateOrder}
                    autoComplete="off"
                    form={form}
    
                >
                    <Form.Item
                        label="Được thanh toán"
                        name="isPaid"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your type!',
                            },
                        ]}
                    >
                            <Select
                                name='isPaid'
                                onChange={handleChangeIsPaidSelect}
                                options={[
                                    { label: 'TRUE', value: true },
                                    { label: 'FALSE', value: false }
                                ]}
                                value={stateOrder?.isPaid}
                            />
                    </Form.Item>
                    <Form.Item
                        label="Được giao hàng"
                        name="isDelivered"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your type!',
                            },
                        ]}
                    >
                        <Select
                            name='isDelivered'
                            onChange={handleChangeIsDeliveredSelect}
                            options={[
                                    { label: 'TRUE', value: true },
                                    { label: 'FALSE', value: false }
                            ]}
                            value={stateOrder.isDelivered}
                        />
                    </Form.Item>
                        
                    <Form.Item
                        wrapperCol={{
                            offset: 20,
                            span: 4,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
                </LoadingComponent>
            </DrawerComponent>
            <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={() => onDeleteOrder()}>
                <LoadingComponent isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa đơn hàng này không?</div>      
                </LoadingComponent>
            </ModalComponent>

        </div>
    )
}

export default AdminOrder