import React, { useEffect, useMemo, useRef, useState } from "react";
import './AdminDashBoard.scss';
import * as message from '../Message/Message'
import * as userServices from '../../services/userServices'
import * as orderServices from '../../services/orderServices'
import * as productServices from '../../services/productServices'
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { PropertySafetyFilled, SearchOutlined, ShoppingOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import TableComponent from '../TableComponent/TableComponent'
import { Button, Input, Space } from "antd";
import PieChartStock from "./PieChartStock";
const AdminDashBoard = () => {
    const user = useSelector((state) => state.user);
    const [latestOrders, setLatestOrders] = useState([]);
    const [rowSelected, setRowSelected] = useState('');
    const handleGetAllProducts = () => {
        const res = productServices.getAllProduct();
        return res;
    }
    const handleGetAllOrders = () => {
        const res = orderServices.getAllOrder(user?.access_token);
        return res;
    }
    const handleGetAllLatestOrders = () => {
        const res = orderServices.getLatestOrders();
        return res;
    }
    const handleGetAllUsers = () => {
        const res = userServices.getAllUsers(user?.access_token);
        return res;
    }
    const queryUsers = useQuery({ queryKey: 'users', queryFn: handleGetAllUsers }, {
        enabled: user?.access_token
    });
    const queryOrders = useQuery({ queryKey: 'orders', queryFn: handleGetAllOrders }, {
        enabled: user?.access_token
    });
    const queryProducts = useQuery({ queryKey: 'products', queryFn: handleGetAllProducts });
    const queryLatestOrders = useQuery({ queryKey: 'latest-orders', queryFn: handleGetAllLatestOrders });
    const { data: dataUsers, isLoading: isLoadingUsers, isSuccess: isSuccessUsers, isError: isErrorUsers } = queryUsers;
    const { data: dataOrders, isLoading: isLoadingOrders, isSuccess: isSuccessOrders, isError: isErrorOrders } = queryOrders;
    const { data: dataProducts, isLoading: isLoadingProducts, isSuccess: isSuccessProducts, isError: isErrorProducts } = queryProducts;
    const { data: dataLatestOrders, isLoading: isLoadingLatestOrders, isSuccess: isSuccessLatestOrders, isError: isErrorLatestOrders } = queryLatestOrders;
    const totalInventory = useMemo(
        () => {
            const result = Array.isArray(dataProducts?.data) ? dataProducts?.data?.reduce(
                (total, curr) => {
                    return total + curr?.countInStock
                }, 0) : 0;
            return result;
        }, [dataProducts?.data] 
    )
    const totalEarned = useMemo(() => {
        const result = Array.isArray(dataOrders?.data) ? dataOrders?.data?.reduce(
            (total, curr) => {
                return total + curr.totalPrice;
            }
        , 0) : 0;
        return result;
    }, [dataOrders?.data])
    const totalUsers = Array.isArray(dataUsers?.data) && dataUsers?.data?.filter((user) => {
        return user?.isAdmin === 0
    })?.length;
    useEffect(() => {
        if (isSuccessLatestOrders && dataLatestOrders?.status === 'OK') {
            let arrLatestOrders = [];
            dataLatestOrders?.data && Array.isArray(dataLatestOrders?.data) &&
                dataLatestOrders?.data?.forEach((order) => {
                    arrLatestOrders.push({
                        ...order,
                        orderItems: JSON.parse(JSON.parse(order?.orderItems)),
                        shippingAddress: JSON.parse(JSON.parse(order?.shippingAddress))
                    })
                })
            setLatestOrders(arrLatestOrders);
        }
    }, [dataLatestOrders, isSuccessLatestOrders, isErrorLatestOrders])
    // KHAI BÁO BẢNG
    const searchInput = useRef(null);
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
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
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
                        width: 90,
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
                color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });
    const columns = [
        {
            title: 'ID đơn hàng',
            dataIndex: 'id',
            width: '25%',
            
        },
        {
            title: 'ID Người dùng',
            dataIndex: 'userId',
            width: '30%',
            ...getColumnSearchProps('userId')
        },
        {
            title: 'Thanh toán',
            dataIndex: 'isPaid',
            width: '20%',
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
                return record?.isPaid.indexOf(value) === 0
            }
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            width: '20%',
            sorter: (a, b) => a?.totalPrice - b?.totalPrice
        },
    ];
    const dataTable = Array.isArray(latestOrders) && latestOrders?.length > 0 &&
        latestOrders?.map(
            (order) => {
                return {
                    ...order,
                    id: order?.id,
                    key: order?.id,
                    userId: order?.userId,
                    isPaid: order?.isPaid === 0 ? 'FALSE' : 'TRUE',
                    isDelivered: order?.isDelivered === 0 ? 'FALSE' : 'TRUE',
                    totalPrice: order?.totalPrice
                }    
            })
    return (
        <div className="admin-dashboard-container">
            <h1>Tổng quan hệ thống</h1>
            <div className="dashboard-up">
                <div className="dashboard-item">
                    <div className="dashboard-item-header">
                        <PropertySafetyFilled className="dashboard-icon"/>
                        <span>Tổng doanh thu</span>
                    </div>
                    <div className="dashboard-item-value">
                        {totalEarned ? totalEarned.toLocaleString().replaceAll(',', '.') : 0} VND
                    </div>
                </div>
                <div className="dashboard-item">
                    <div className="dashboard-item-header">
                        <UnorderedListOutlined className="dashboard-icon" />
                        <span>Tất cả sản phẩm</span>
                    </div>
                    <div className="dashboard-item-value">
                        {totalInventory ? totalInventory : 0}
                    </div>
                </div>
                <div className="dashboard-item">
                    <div className="dashboard-item-header">
                        <ShoppingOutlined className="dashboard-icon" />
                        <span>Tất cả đơn hàng</span>
                    </div>
                    <div className="dashboard-item-value">
                        {Array.isArray(dataOrders?.data) && dataOrders?.data?.length > 0 ? dataOrders?.data?.length : 0 }
                    </div>
                </div>
                <div className="dashboard-item">
                    <div className="dashboard-item-header">
                        <UserOutlined className="dashboard-icon" />
                        <span>Tất cả người dùng</span>
                    </div>
                    <div className="dashboard-item-value">
                        {totalUsers ? totalUsers : 0}
                    </div>
                </div>
            </div>
            <div className="dashboard-down">
                <div className="order-latest">
                    <h1>Đơn hàng <span style={{fontSize: '10px', fontWeight: '400'}}>(Trong tuần)</span></h1>
                    <TableComponent
                        isShowButtonExcel={false}
                        style={{ marginTop: '10px', width: '100%' }}
                        columns={columns}
                        data={dataTable}
                        pagination={{ pageSize: 5 }} scroll={{ y: 300, }}
                    />
                </div>
                <div style={{ width: 'calc(50%)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ }}>Sản phẩm tồn kho</h1>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>
                        <PieChartStock data={dataProducts?.data} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashBoard