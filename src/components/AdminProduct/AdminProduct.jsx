import React, { memo, useEffect, useRef, useState } from "react";
import './AdminProduct.scss'
import { Button, Form, Modal, Select, Space, Upload } from "antd";
import * as message from '../../components/Message/Message'
import * as productServices from '../../services/productServices'
import InputComponent from '../InputComponent/InputComponent'
import TableComponent from "../TableComponent/TableComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import LoadingComponent from "../LoadingComponent/LoadingComponet";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined, SearchOutlined, UploadOutlined
} from '@ant-design/icons'
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useMutationHooks } from "../../hooks/userMutationHook";
import { WrapperUploadFile } from "./style";
import { convertPrice, getBase64, renderOptions } from "../../utils";
const AdminProduct = () => {
    // KHAI BÁO CÁC STATE
    const user = useSelector((state) => state.user);
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [typeSelect, setTypeSelect] = useState('');
    const initial = () => (
        {
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            newType: '',
            discount: ''
        }
    )
    const [stateProduct, setStateProduct] = useState(initial())
    const [stateProductDetails, setStateProductDetails] = useState(initial())
    const [stateTypeProducts, setStateTypeProducts] = useState([]) 
    // CÁC CHỨC NĂNG MODAL
    const handleOk = () => {
        onFinish();
        setIsModalOpen(false)
    }
    const openModal = () => {
        form.resetFields();
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            newType: '',
            discount: ''
        })
        setIsModalOpen(false)
    }
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: ''
        })
    }
    // KHAI BÁO CÁC MUTATION
    const mutation = useMutationHooks(
        (data) => {
            const { name, price, description, rating, image, type, countInStock, discount } = data;
            const res = productServices.createProduct({ name, price, description, rating, image, type, countInStock, discount }, user?.access_token)
            return res;
        }
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data;
            const res = productServices.updateProduct(id, token, { ...rests })
            return res;
        }
    )
    const mutationDelete = useMutationHooks(
        (data) => {
            const {id, token} = data;
            const res = productServices.deleteProduct(id, token);
            return res;
        }
    )
    const mutationDeletedMany = useMutationHooks(
        async (data) => {
            const {token, ids} = data;
            const res = productServices.deleteManyProducts(ids, token);
            return res;
        }
    )
    console.log('rowSelected: ', rowSelected)
    const getAllProduct = async () => {
        const res =  await productServices.getAllProduct();
        return res;
    }
    const fetchGetProductDetails = async (rowSelected) => {
        const res = await productServices.getDetailsProduct(rowSelected, user?.access_token);
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount
            })
        }
    }
    const fetchAllTypeProduct = async () => {
        const res = await productServices.getAllTypeProducts();
        return res.data; 
    }
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct });
    const queryTypeProduct = useQuery({queryKey: ['types'], queryFn: fetchAllTypeProduct});
    const { data: products, isLoading: isLoadingProducts } = queryProduct
    console.log('queryProduct', queryProduct)
    const { data: typeProducts, isLoading: isLoadingTypeProducts } = queryTypeProduct;
    /* GÁN CÁC KEY VALUE MUTATION */
    const {data, isLoading, isSuccess, isError} = mutation
    const {data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate;
    const {data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;
    const {data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany;
    // KHAI BÁO DỮ LIỆU CỘT VÀ DÒNG TRONG BẢNG
    const renderAction = () => {
        return(
            <div style={{display: 'flex', gap:'10px'}}>
                <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
                <EditOutlined style={{color: 'orange', fontSize: '30px', cursor: 'pointer'}} onClick={() => handleDetailsProduct()}/>
            </div>
        )
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };
    // KHAI BÁO TABLE
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
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => {
                return a.price - b.price
            },
            filters: [
                {
                    text: '>= 5000000',
                    value: '>=',
                },
                {
                    text: '<= 5000000',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                console.log('Value: ', {value, record});
                if(value === '>='){
                    return record.price >= 5000000
                }else if(value === '<='){
                    return record.price <= 5000000
                }
            }
        },
        {
          title: 'Rating',
          dataIndex: 'rating',
          sorter: (a, b) => a.rating - b.rating,
          filters: [
            {
              text: '>= 3',
              value: '>=',
            },
            {
              text: '<= 3',
              value: '<=',
            },
          ],
          onFilter: (value, record) => {
            if(value === '>='){
                return record.rating >= 3
            }else if(value === '<='){
                return record.rating <= 3
            }
          },
        },
        {
          title: 'Type',
          dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            fixed: 'right',
            render: renderAction
        }
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
      return {...product, key: product.id}
    })
    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }
    const handleDeleteProduct = () => {
        mutationDelete.mutate({id: rowSelected,token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const handleDeleteManyProducts = (ids) => {
        mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            type: stateProduct.type === 'add-type' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    // useEffect
    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateProductDetails)
        } else {
            form.setFieldsValue(initial())
        }
    }, [form, stateProductDetails, isModalOpen])
    useEffect(() => {
        if(rowSelected){
            setIsLoadingUpdate(true);
            fetchGetProductDetails(rowSelected);
            setIsLoadingUpdate(false);     
        }
    }, [rowSelected, isOpenDrawer]) 
    useEffect(() => {
        if(isSuccess && data?.status === 'OK'){
            message.success('Tạo thành công')
            handleCancel();
            form.resetFields();
            
        }else if(isError){
            message.error('Lỗi')
        }
    }, [isSuccess])
    useEffect(() => {
        if(isSuccessUpdated && dataUpdated?.status === 'OK'){
            handleCloseDrawer();
            message.success('Cập nhật thành công');
        }else if(isErrorUpdated){
            message.error('Lỗi')
        }
        form.resetFields()
    }, [isSuccessUpdated])
    useEffect(() => {
        if(isSuccessDeleted && dataDeleted?.status === 'OK'){
            message.success('Xóa sản phẩm thành công');
            handleCancelDelete();
        }else if(isErrorDeleted){
            message.error('Lỗi')
        }
    }, [isSuccessDeleted])
    useEffect(() => {
        if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK'){
            message.success('Xóa thành công');
        }else if(isErrorDeletedMany){
            message.error('Lỗi');
        }
    }, [isSuccessDeletedMany])
    // HANDLE ONCHANGE
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
        // console.log('e.target.name: ', e.target.name, e.target.value)
    }
    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChangeAvatar = async ({fileList}) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    const handleOnChangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }
    const onUpdateProduct = () => {
        mutationUpdate.mutate({id: rowSelected,token: user?.access_token, ...stateProductDetails}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const handleChangeSelect = (value) => {
        setTypeSelect(value);
        setStateProduct({
            ...stateProduct,
            type: value
        })
    }
    const newArrType = () => {
        let res = [];
        if (typeProducts) {
            console.log('typeProducts', typeProducts)
            Array.isArray(typeProducts) &&  typeProducts?.map((type) => {
                res.push(type?.type);
            })
        }
        return res;
    }
    return ( 
        <div className="container">
        <LoadingComponent isLoading={isLoadingProducts}>            
{/* Title Component */}
            <h1>Quản lý sản phẩm</h1>
            <div className="button">
                <Button className="btn-plus" onClick={() => openModal()}>
                    <PlusOutlined className="btn-plus-icon"/>
                </Button>
            </div>
{/* Table Data */}
            <div className="table-product-container">
                <TableComponent  columns={columns} data={dataTable} isLoading={isLoadingProducts} handleDeleteMany={handleDeleteManyProducts}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record.id)
                            }
                        }
                    }}
                    pagination={{ pageSize: 5 }}
                    scroll={{
                        y: 230,
                    }}
                    style={{marginTop: '10px'}}
                />
            </div>
{/* Modal Create */}
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} footer={null} onCancel={handleCancel}>
                <LoadingComponent isLoading={isLoading}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 5,
                    }}
                    wrapperCol={{
                        span: 19,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    // initialValues={{
                    //     remember: true,
                    // }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name"/>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your type!',
                            },
                        ]}
                    >
                        <Select
                            name='type'
                            onChange={handleChangeSelect}
                            options={renderOptions(newArrType())}
                            value={stateProduct.type}
                        />
                    </Form.Item>
                    { stateProduct.type === 'add-type' &&
                        <Form.Item
                            label="New type"
                            name="newType"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your type!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProduct?.newType} onChange={handleOnChange} name="newType"/>
                        </Form.Item>
                    }
                    <Form.Item
                        label="countInStock"
                        name="countInStock"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your count inStock!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock"/>
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your price!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price"/>
                    </Form.Item>
                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your rating!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating"/>
                    </Form.Item>
                    <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your discount!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.discount} onChange={handleOnChange} name="discount"/>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your description!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description"/>
                    </Form.Item>    
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your image!',
                            },
                        ]}
                    >
                        <WrapperUploadFile onChange={(e) => handleOnChangeAvatar(e)} maxCount={1}>
                            <Button>Upload</Button>
                            <div>
                                {stateProduct.image && 
                                    <img src={stateProduct.image} style={{
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '50%',
                                        objectFit: 'cover', marginLeft: '10px'
                                    }} alt="Image"/>
                                }
                            </div>
                        </WrapperUploadFile>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 20,
                            span: 4,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                </LoadingComponent>
            </ModalComponent>
{/* Drawer Update */}
            <DrawerComponent width='50%' title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
                <LoadingComponent isLoading={isLoadingUpdated || isLoadingUpdate}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 5,
                    }}
                    wrapperCol={{
                        span: 19,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onUpdateProduct}
                    autoComplete="off"
                    form={form}
    
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetails.name} onChange={handleOnChangeDetails} name="name"/>
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your type!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetails.type} onChange={handleOnChangeDetails} name="type"/>
                    </Form.Item>
                    <Form.Item
                        label="countInStock"
                        name="countInStock"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your count inStock!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name="countInStock"/>
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your price!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name="price"/>
                    </Form.Item>
                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your rating!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetails.rating} onChange={handleOnChangeDetails} name="rating"/>
                    </Form.Item>
                    <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your discount!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetails.discount} onChange={handleOnChangeDetails} name="discount"/>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your description!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProductDetails.description} onChange={handleOnChangeDetails} name="description"/>
                    </Form.Item>
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your image!',
                            },
                        ]}
                    >
                        <WrapperUploadFile onChange={(e) => handleOnChangeAvatarDetails(e)} maxCount={1}>
                            <Button>Upload</Button>
                            <div>
                                {stateProductDetails.image && 
                                    <img src={stateProductDetails.image} style={{
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '50%',
                                        objectFit: 'cover', marginLeft: '10px'
                                    }} alt="Image"/>
                                }
                            </div>
                        </WrapperUploadFile>
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
{/* Modal Delete */}
            <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <LoadingComponent isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa sản phẩm này không?</div>      
                </LoadingComponent>
            </ModalComponent>
        </LoadingComponent>
        </div>
    )
}
export default memo(AdminProduct)