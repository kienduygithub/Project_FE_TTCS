import React, { useEffect, useRef, useState } from "react";
import './AdminUser.scss'
import { Button, Form, Space} from "antd";
// import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as userServices from '../../services/userServices'
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import TableComponent from "../TableComponent/TableComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import InputComponent from "../InputComponent/InputComponent";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { WrapperUploadFile } from "../AdminProduct/style";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponet";
import { getBase64 } from "../../utils";
import { useMutationHooks } from "../../hooks/userMutationHook";
import * as message from '../Message/Message'
const AdminUser = () => {
    // KHAI BÁO CÁC STATE
    const [rowSelected ,setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate ,setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        isAdmin: false,
        avatar: '',
    })
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user);
    const [nameSearch, setNameSearch] = useState('');
    // KHAI BÁO CÁC MUTATION
    const mutationUpdate = useMutationHooks(
        async (data) => {
            const { id, token, ...rests} = data;
            const res = await userServices.updateUser({id, access_token: token, ...rests})
            console.log(res);
            return res;
        }
    )
    const mutationDelete = useMutationHooks(
        async (data) => {
            const {id, token} = data;
            const res = await userServices.deleteUser(id, token);
            return res;
        }
    )
    const mutationDeletedMany = useMutationHooks(
        async (data) => {
            const {token, ids} = data;
            const res = await userServices.deleteManyUser(ids, token);
            return res;
        }
    )
    const handleDetailsUser = () => {
        setIsOpenDrawer(true)
    }
    const handleDeleteUser = () => {
        mutationDelete.mutate({id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }
    const handleDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
            onSettled: () => {
                queryUser.refetch();
            }
        })
    }
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
            address: '',
            avatar: '',
        });
        form.resetFields()
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    }
    const getAllUsers = async () => {
        const res = await userServices.getAllUsers(user?.access_token);
        return res;
    }
    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await userServices.getDetailsUser(rowSelected, user?.access_token);
        if(res?.data){
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data.avatar,
            })
        }
        setIsLoadingUpdate(false);
    }
    const queryUser = useQuery({queryKey: ['users'], queryFn: getAllUsers});
    const { data: users, isLoading: isLoadingUsers} = queryUser;
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate;
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany; 
    // KHAI BÁO TABLE
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };
    
    const searchInput = useRef(null)
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
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     // <Highlighter
        //     //   highlightStyle={{
        //     //     backgroundColor: '#ffc069',
        //     //     padding: 0,
        //     //   }}
        //     //   searchWords={[searchText]}
        //     //   autoEscape
        //     //   textToHighlight={text ? text.toString() : ''}
        //     // />
        //   ) : (
        //     text
        //   ),
      });
    const renderAction = () => {
        return (
            <div style={{display: 'flex', gap: '20px'}}>
                <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
                <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={() => handleDetailsUser()}/>
            </div>
        )
    }
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
          ...getColumnSearchProps('name')
        },
        {
          title: 'Email',
          dataIndex: 'email',
          sorter: (a, b) => a.email.length - b.email.length,
          ...getColumnSearchProps('email')
        },
        {
          title: 'Address',
          dataIndex: 'address',
          sorter: (a, b) => a.address.length - b.address.length,
          ...getColumnSearchProps('address')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
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
                return record?.isAdmin.toLowerCase().includes(value.toLowerCase())
            }
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          sorter: (a, b) => a.phone - b.phone,
          ...getColumnSearchProps('phone')
        },
        {
          title: 'Action',
          dataIndex: 'action',
          render: renderAction,
          fixed: 'right'
        },
    ];
    const dataTable = users?.data?.length && users?.data?.map(user => {
        return { ...user, key: user.id, isAdmin: user.isAdmin === 1 ? 'TRUE' : 'FALSE' }
    });
    
    // useEffect
    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails])
    useEffect(() => {
        if(rowSelected){
            setIsLoadingUpdate(true);
            fetchGetDetailsUser(rowSelected)
            console.log(stateUserDetails)
        }
    }, [rowSelected, isOpenDrawer])
    useEffect(() => {
        if(isSuccessUpdated && dataUpdated?.status === 'OK'){
            message.success('Cập nhật thành công!');
            handleCloseDrawer();
        }else if(isErrorUpdated){
            message.error('Lỗi');
        }
    }, [isSuccessUpdated])
    useEffect(() => {
        if(isSuccessDeleted && dataDeleted?.status === 'OK'){
            message.success('Xóa người dùng thành công');
            handleCancelDelete()
        }else if(isErrorDeleted){
            message.error('Lỗi');
        }
    }, [isSuccessDeleted])
    useEffect(() => {
        if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK'){
            message.success('Xóa thành công');
        }else if(isErrorDeletedMany){
            message.error();
        }
    }, [isSuccessDeletedMany])

    // HANDLE ONCHANGE
    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }
    const onUpdateUser = () => {
        mutationUpdate.mutate({id: rowSelected, access_token: user?.access_token, ...stateUserDetails}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }
    const onChangeNameSearch = (e) => {
        setNameSearch(e.target.value);
    }
    const handleDeleteNameSearch = () => {
        setNameSearch('');
    }
    return (
        <div className="container">
            <h1 style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>Quản lý người dùng</span>
                <div style={{position: 'relative', boxSizing: 'border-box', width: 'fit-content'}}>
                    <input
                        style={{
                            padding: '4px 15px 4px 20px', outline: 'none', fontSize: '12px',
                            boxSizing: 'border-box', border: '1px solid rgba(0, 0, 0, 0.45)'
                        }}
                        type="text" name="search"
                        value={nameSearch} onChange={(e) => onChangeNameSearch(e)} placeholder="Tìm kiếm..."
                    />
                    <i
                        className="fa-solid fa-magnifying-glass"
                        style={{
                            position: 'absolute', top: '50%', left: '8px',
                            transform: 'translateY(-50%)', fontSize: '10px', color: 'rgba(0, 0, 0, 0.55)'
                        }}>    
                    </i>
                    {nameSearch &&
                        <i 
                            className="fa-solid fa-xmark mark-delete"
                            style={{
                                position: 'absolute', top: '54%', right: '5px',
                                transform: 'translateY(-50%)', color: 'rgba(0, 0, 0, 0.45)', fontSize: '10px'
                            }}
                            onClick={() => handleDeleteNameSearch()}
                        >
                        </i>
                    }
                </div>
            </h1>
            <div className="table-container">
                <TableComponent 
                    columns={columns} 
                    isLoading={isLoadingUsers} 
                    data={dataTable} 
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: e => {
                                setRowSelected(record.id)
                            }
                        }
                    }}
                    handleDeleteMany={handleDeleteManyUsers}
                    nameSearch={nameSearch}
                    pagination={{ pageSize: 5 }}
                    scroll={{
                        y: 250,
                    }}
                    style={{marginTop: '15px'}}
                />
            </div>
{/* Drawer Update || isLoadingUpdated*/}
            <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
                <LoadingComponent isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onUpdateUser}
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
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <InputComponent value={stateUserDetails.email} onChange={(e) => handleOnChangeDetails(e)} name="email" />
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
                            label="Avatar"
                            name="avatar"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile onChange={(e) => handleOnchangeAvatarDetails(e)} maxCount={1}>
                                <Button>Select File</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
                                        height: '25px',
                                        width: '25px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px',
                                        float: 'right',
                                        marginTop: '4px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Apply
                        </Button>
                        </Form.Item>
                    </Form>
                </LoadingComponent>
            </DrawerComponent>
{/* Modal Delete */}
            <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <LoadingComponent isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa tài khoản này không?</div>
                </LoadingComponent>
            </ModalComponent>
        </div>
    )
}
export default AdminUser