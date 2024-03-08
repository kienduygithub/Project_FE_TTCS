import React, { Fragment, useEffect, useMemo, useState } from "react";
import './TypeProductPage.scss'
import Footer from "../../components/FooterComponent/Footer";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavBarComponent from "../../components/NavBarComponent/NavBarComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponet";
import * as productServices from '../../services/productServices'
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { Col, Pagination, Row } from "antd";
import { useLocation, useNavigate } from "react-router";
import { convertPrice } from "../../utils";
const TypeProductPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState([]);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 8,
        total: 0
    })
    const [range, setRange] = useState({
        text: '',
        min: 0,
        max: 0
    })
    const [again, setAgain] = useState(true);
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 1000); 
    const fetchAllType = async () => {
        const res = await productServices.getAllTypeProducts();
        return res;
    }
    const fetchProductType = async (type, page, limit) => {
        setLoading(true);
        const res = await productServices.getAllProductType(type, page, limit);
        if(res?.status === 'OK'){
            setLoading(false)
            setProducts(res?.data)
            setPanigate({...panigate, total: res?.total}) 
        }else{
            setLoading(false)
        }
    }
    const fetchProductRangePrice = async (range, page, limit) => {
        setLoading(true);
        const res = await productServices.getAllProductRangePrice(state ,range, page, limit);
        if (res?.status === 'OK') {
            setLoading(false);
            setProducts(res?.data);
            setPanigate({...panigate, total: res?.total})
        } else {
            setLoading(false);
        }
    }
    const handleSetProductsNav = async (type, page, limit) => {
        setAgain(true);
        setPanigate({ ...panigate, page: 0 })
        setRange({...range, text: null, min: 0, max: 0})
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/ /g, '_')}`, { state: type})
    }
    const handleSetProductsRangePriceNav = (text, min, max) => {
        // console.log('range', text, min, max);
        // navigate(`/product/${text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/ /g, '_')}`, {state: {range: {min, max}}})
        // console.log('range', text, min, max);
        setPanigate({...panigate, page: 0})
        setRange({ ...range, text: text, min: min, max: max }) 
    } 
    // KHAI BÁO CÁC QUERY & MUTATION
    const queryType = useQuery({ queryKey: ['types-nav'], queryFn: fetchAllType });
    const { data: dataType, isLoading: isLoadingType, isSuccess: isSuccessType } = queryType;
    const setTypeDisplayNav = useMemo(() => {
        if (dataType) { 
            let newTypeArr = [];
            Array.isArray(dataType?.data) && dataType?.data?.forEach((type) => {
                newTypeArr.push(type?.type);
            })
            setType(newTypeArr);
        }
    }, [dataType])
    useEffect(() => {
        if (state) {
            if (again) {
                fetchProductType(state, panigate.page, panigate.limit);
                setAgain(false)
            }
        } 
    }, [state, panigate.page, panigate.limit, again]);
    useEffect(() => {
        if (range) {
            range.text && fetchProductRangePrice(range, panigate.page, panigate.limit);
        }
    }, [range, panigate.limit, panigate.page])
    const onChange = (current, pageSize) => {
        console.log('current', current, pageSize);
        setPanigate({ ...panigate, page: current - 1, limit: pageSize }) 
        setAgain(true);
    }
    console.log('panigate:', panigate)
    return(
        <LoadingComponent isLoading={isLoadingType || loading}>
        <div style={{ padding: '0 120px', height: '100%', backgroundColor: '#efefef' }}>
            <h3 style={{ margin: 0, paddingTop: '10px', fontSize: '16px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Trang chủ</span>
                &gt; Danh mục sản phẩm
            </h3>    
            <div className="type-product-row row flex-nowrap" style={{paddingLeft: '10px'}}>
                <div className="type-product-nav col-2" style={{marginBottom: '10px', fontSize: '100px !important'}}>
                        <NavBarComponent type="text" label={'Danh mục'} categoris={type} page={panigate?.page} limit={panigate?.limit}
                            handleSetProductsNav={handleSetProductsNav}
                        />
                        <NavBarComponent
                            type="price" label={'Bảng giá'}
                            categoris={[
                                { text: `5-10tr`, min: 5000000, max: 10000000 },
                                { text: `10-20tr`, min: 10000000, max: 20000000 },
                            ]}
                            handleSetProductsRangePriceNav={handleSetProductsRangePriceNav}
                        />
                </div>
                <div className="type-products col-10 row flex-column align-items-center">
                    <div className="product-cards" style={{marginBottom: '15px'}}>
                        { products?.filter((pro) => {
                            if(searchDebounce === ''){
                                return pro;
                            }else if(pro?.name.toLowerCase().includes(searchDebounce.toLowerCase())){
                                return pro;
                            }
                        }).map((product) => {
                            return(
                                <CardComponent
                                    key={product.id} type={product.type} rating={product.rating} 
                                    price={product.price} name={product.name} image={product.image}
                                    description={product.description} countInStock={product.countInStock} selled={product.selled}
                                    discount={product.discount}id={product.id} className="card-home"
                                    style={{width: 'calc(25% - 15px)'}}
                                />
                            )
                        })}
                    </div>
                    <div className="type-product-pagination" style={{marginTop: 'auto', marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
                        <Pagination defaultCurrent={panigate?.page + 1} current={panigate?.page + 1} total={panigate?.total} onChange={onChange}
                            className="pagination" defaultPageSize={8}
                        />
                    </div>
                </div>
            </div>
        </div>
        <Footer isHiddenFooter={false}/>    
        </LoadingComponent>
    )
}

export default TypeProductPage