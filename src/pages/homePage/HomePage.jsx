import React, { useState } from "react";
import './HomePage.scss'
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import CardComponent from "../../components/CardComponent/CardComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet'
import  Slicker5 from '../../assests/images/Slicker5.jpg'
import  Slicker6 from '../../assests/images/Slicker6.jpeg'
import  Slicker7 from '../../assests/images/Slicker7.png'
import  Slicker8 from '../../assests/images/Slicker8.png'
import  Slicker9 from '../../assests/images/Slicker9.png'
import  Slicker10 from '../../assests/images/Slicker10.png'
import * as productServices from '../../services/productServices'
import { useRef } from "react";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { Link, useNavigate } from "react-router-dom";
import bannerHome from '../../assests/images/BannerHome/bannerHome.jpg'  
import Footer from "../../components/FooterComponent/Footer";
import LatestProductComponent from "../../components/LatestProductComponent/LatestProductComponent";
const HomePage = () => {
    const arr = ['Television', 'Laptop', 'refrigerator', 'abc'];
    const [typeProducts, setTypeProducts] = useState([]);
    const user = useSelector((state) => state.user);
    const searchProduct = useSelector((state) => state.product?.search);
    const refSearch = useRef();
    const [stateProducts, setStateProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchDebounce = useDebounce(searchProduct, 1000);
    const [limit, setLimit] = useState(5);
    const [limitLatest, setLimitLatest] = useState(10);
    const [sortLatest, setSortLatest] = useState('DESC');
    const [productLatest, setProductLatest] = useState([]);
    const navigate = useNavigate();
    const fetchProductAll = async (context) => {
        // console.log('context:', context);
        const limit = context?.queryKey && context?.queryKey[1];
        const searchValue = context?.queryKey && context?.queryKey[2];
        const res = await productServices.getAllProduct(searchValue, limit);
        return res;
    }
    const fetchProductLatest = (context) => {
        const limitLatest = context?.queryKey && context?.queryKey[1];
        const sortLatest = context?.queryKey && context?.queryKey[2];
        const res = productServices.getProductLatest(limitLatest, sortLatest);
        return res;
    }
    const fetchAllTypeProduct = async () => {
        const res = await productServices.getAllTypeProducts();
        return res;
    }
    const {data: products, isLoading, isPreviousData} = useQuery(
        ['products', limit, searchDebounce], 
        fetchProductAll, {retry: 3, retryDelay: 1000, keepPreviousData: true}
    );
    const { data: dataLatest, isLoading: isLoadingLatest, isSuccess: isSuccessLatest, isError: isErrorLatest }
        = useQuery({ queryKey: ['latests', limitLatest, sortLatest], queryFn: fetchProductLatest })
    useEffect(() => {
      const fetchApi = async () => {
        const res = await fetchAllTypeProduct();
        if(res?.status === 'OK'){
            let newRes = [];
            res?.data?.map((item) => newRes.push(item?.type))
            setTypeProducts(newRes)
        }
      }
      fetchApi();
    }, [])
    useEffect(() => {
        if (isSuccessLatest && dataLatest?.status === 'OK') {
            Array.isArray(dataLatest?.data) && setProductLatest(dataLatest?.data)
        }
    }, [isSuccessLatest, isErrorLatest, dataLatest])
    return(
        <LoadingComponent isLoading={isLoading || loading}>
        <div className="homePage">
            <div className="home-TypeProduct" style={{ padding: '0 120px', fontSize: 16}}>
                <div style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Trang chủ</div>
                <div className="type-product-container" style={{position: 'relative'}}>
                    <div className="type-product-text">Loại sản phẩm</div>
                        <div className="type-product" style={{
                            position: 'absolute', top: '0px', right: '-120px',
                            zIndex: '1000', boxSizing: 'border-box',
                            borderRadius: '4px', display: 'none'
                        }}>
                        { typeProducts?.length > 0 &&
                            typeProducts.map(
                                (item) => {
                                    return(
                                        <TypeProduct
                                            name={item} key={item} 
                                        />
                                        
                                    )
                                }
                            )
                        }    
                    </div>
                </div>    
            </div>
            <div className="header-product-container" style={{ backgroundColor: '#f7f7f7', padding: '0 120px'}}>
                <div style={{position: 'relative'}}>
                    <a className="link-go-shop" href={'#shop'}><img src={bannerHome} style={{ width: '100%', position: 'relative' }}/></a>
                    <SliderComponent
                        arrImages = 
                            {[Slicker7, Slicker8, Slicker9, Slicker10, Slicker5, Slicker6]}
                    />
                    <a href="#shop">
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                width: 'fit-content',
                                height: '25px',
                                backgroundColor: '#1677ff',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'absolute',
                                top: '155px', left: '270px', zIndex: '999',
                                display: 'flex', alignItems: 'center',
                            }}
                            textButton={'Mua ngay'}
                            styleTextButton={{ color: 'white', fontSize: '13px', fontWeight: 'bold'}}
                        />
                    </a>
                </div>
                <div style={{margin: '100px 0 20px'}}>
                    <div className="header-latest d-flex flex-column align-items-center" style={{textAlign: 'center'}}>
                        <span style={{color: 'rgba(0, 0, 0, 0.55)'}}>Gần nhất</span>
                        <hr style={{ width: '250px', height: '1px', borderTop: '1px solid rgba(0, 0, 0, 0.55)', borderLeft: 'none', marginBottom: '18px' }}></hr>
                    </div>
                    <LoadingComponent isLoading={isLoadingLatest}>
                        <LatestProductComponent
                            arrProduct={productLatest}
                        />
                    </LoadingComponent>    
                </div>  
                <section id="shop"></section>    
                <div className="header-products d-flex flex-column align-items-center">
                    <span style={{color: 'rgba(0, 0, 0, 0.55)'}}>Sản phẩm</span>
                    <hr style={{ width: '250px', height: '1px', borderTop: '1px solid rgba(0, 0, 0, 0.55)', borderLeft: 'none' }}></hr>
                </div>
                <div className="product" style={{ marginTop: '20px', marginLeft: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {   
                        products?.data?.map((product) => {
                            return(
                                <CardComponent key={product.id}
                                    type={product.type}
                                    rating={product.rating} 
                                    price={product.price}
                                    name={product.name}
                                    image={product.image}
                                    description={product.description}
                                    countInStock={product.countInStock}
                                    selled={product.selled}
                                    discount={product.discount}
                                    className="card-home"
                                    id={product.id}
                                />
                            )
                        })
                    }
                </div>
                {/* <NavBarComponent /> */}
                <div className="button-more-container">
                    <ButtonComponent 
                        textButton={isPreviousData ? 'Load more' : 'Xem thêm'}
                        styleButton={{
                            border: '1px solid rgb(11, 116, 229)',
                            color: `${products?.total === products?.data?.length || products?.totalPage <= 1 ? '#fff' : 'rgb(11, 116, 229)'}`,
                            width: '240px',
                            height: '28px',
                            lineHeight: '7px',
                            borderRadius: '5px',
                            margin: '15px 0 10px 12px',
                            cursor: `${products?.total === products?.data?.length || products?.totalPage <= 1 ? 'default' : 'pointer'}`
                        }}
                        styleTextButton={{
                            fontWeight: 500
                        }}
                        className="button-more"
                        onClick={() => setLimit((prev) => prev + 5)}
                        disabled={products?.total === products?.data?.length || products?.totalPage <= 1}
                        type="outline"
                    />
                </div>
            </div>
            <Footer isHiddenFooter={false}/>    
        </div>
        </LoadingComponent>
    )
}
export default HomePage