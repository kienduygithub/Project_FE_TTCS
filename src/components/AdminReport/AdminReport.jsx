import React, { memo, useEffect, useState } from "react";
import './AdminReport.scss'
import * as orderServices from '../../services/orderServices'
import * as productServices from '../../services/productServices'
import { useMutationHooks } from "../../hooks/userMutationHook";
import BarChartQuarter from "./BarChartQuarter";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet'
import { useQuery } from "react-query";
import { CarryOutFilled, CarryOutOutlined, CrownFilled, PropertySafetyFilled, ShopOutlined, ShoppingFilled, ToolFilled, UnorderedListOutlined } from "@ant-design/icons";
const AdminReport = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const [isLoading, setIsLoading] = useState(false);
    const [quarterData, setQuarterData] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [sumRevenue, setSumRevenue] = useState(0);
    const [sumSelledQuantity, setSumSelledQuantity] = useState(0);
    const fetchAllTypeProducts = () => {
        const res = productServices.getAllTypeProducts();
        return res;
    }
    const getQuarterbyMonth = () => {
        if (0 <= month && month <= 2) {
            return [1];
        } else if (3 <= month && month <= 5) {
            return [1, 2];
        } else if (6 <= month && month <= 8) {
            return [1, 2, 3];
        } else if (9 <= month && month <= 11) {
            return [1, 2, 3, 4];
        }
    }
    let optionsNow = Array?.isArray(getQuarterbyMonth(month)) && getQuarterbyMonth(month)?.map(opt => {
                return { quar: opt, year: year }
            })  
    const options = [
        { quar: 1, year: year - 1 },
        { quar: 2, year: year - 1 },
        { quar: 3, year: year - 1 },
        { quar: 4, year: year - 1 },
        ...optionsNow
    ]
    const [selectedReport, setSelectedReport] = useState(options[options.length - 1]);
    const queryTypes = useQuery({ queryKey: ['types-products'], queryFn: fetchAllTypeProducts });
    const { data: dataTypes, isLoading: isLoadingTypes, isSuccess: isSuccessTypes, isError: isErrorTypes } = queryTypes;
    const mutationSelectedQuarter = useMutationHooks(
        (data) => {
            const { quarter, year } = data;
            const res = orderServices.getBySelectedQuarter({ quarter, year });
            return res;
        }
    )
    const { data: dataSelectedQuarter, isLoading: isLoadingSelectedQuarter, isSuccess: isSuccessSelectedQuarter, isError: isErrorSelectedQuarter } = mutationSelectedQuarter;
    // console.log('dataSelectedQuarter', dataSelectedQuarter)
    const handleSetAllTypes = () => {
        setIsLoading(true);
        if (dataTypes?.data) {
            let arrType = [];
            Array.isArray(dataTypes?.data) &&
                dataTypes?.data?.forEach((type) => {
                    arrType.push(type?.type);
                })
            setAllTypes(arrType);
        }
        setIsLoading(false);
    }
    // useEffect
     useEffect(() => {
        if (selectedReport) {
            mutationSelectedQuarter.mutate({
                quarter: selectedReport?.quar,
                year: selectedReport?.year
            });
        }
    }, [selectedReport])
    useEffect(() => {
        if (isSuccessTypes && dataTypes?.status === 'OK') {
            handleSetAllTypes()
        }
    }, [isSuccessTypes, isErrorTypes])
    useEffect(() => {
        if (isSuccessSelectedQuarter && dataSelectedQuarter?.status === 'OK') {
            Array.isArray(dataSelectedQuarter?.data) && setQuarterData(dataSelectedQuarter?.data)
        }
    }, [isSuccessSelectedQuarter, isErrorSelectedQuarter])
    const handleChangeSelect = (e) => {
        setSelectedReport(JSON.parse(e.target.value));
    }
    const getSumRevenue = (sum) => {
        setSumRevenue(sum);
    }
    return (
        <LoadingComponent isLoading={isLoading}>
            <div className="report-container">
                <div className="report-header">
                    <h1>Thống kê số liệu: </h1>
                    <select
                        style={{
                            width: '144px', height: '30px', outline: 'none',
                            fontSize: '15px', borderRadius: '4px', marginTop: '11px'
                        }} onChange={handleChangeSelect}
                    >    
                        {
                            options?.map((opt, index) => {
                                if (index === options.length - 1) {
                                    return (
                                        <option key={index} value={JSON.stringify(opt)} selected>{`Năm ${opt.year} - Quí ${opt.quar}`}</option>
                                    )
                                }
                                return (
                                    <option key={index} value={JSON.stringify(opt)} >{`Năm ${opt.year} - Quí ${opt.quar}`}</option>
                                )
                            })       
                        }
                    </select>
                </div>
                <div className="report-chart">    
                    <div className="quarter quarter-up">
                        <div className="quarter-left">
                            <div>
                                <PropertySafetyFilled className="icon"/>
                                <h4>Tổng doanh thu</h4>
                            </div>
                            <span className="quarter-value">{`${sumRevenue.toLocaleString().replaceAll(',', '.')} VNĐ`}</span>
                        </div>
                        <div className="quarter-center">
                            <div>
                                <ShoppingFilled className="icon"/>
                                <h4>Doanh số sản phẩm</h4>
                            </div>
                            <span className="quarter-value">{sumSelledQuantity}</span>
                        </div>
                        <div className="quarter-right">
                            <div>
                                <CarryOutFilled className="icon"/>
                                <div className="target-text">
                                    <h4>Chỉ tiêu đạt được</h4>
                                    <h6>(/400000000)</h6>
                                </div>
                            </div>                        
                            <span className="quarter-value">{Math.round((sumRevenue / 400000000) * 100)}%</span>
                        </div>
                    </div>
                    <div className="quarter quarter-down">
                        {/* <div className="quarter-hr"></div> */}
                        <div style={{ width: '100%', height: '300px', position: 'relative', boxSizing: 'border-box', marginTop: 'auto', userSelect: 'none' }}>
                            <h4>Sản phẩm bán ra</h4>
                            <BarChartQuarter
                                dataBar={quarterData}
                                dataTypes={allTypes}
                                getSumRevenue={getSumRevenue}
                                setSumSelledQuantity={setSumSelledQuantity}
                            />
                        </div>   
                    </div>
                </div>
            </div>
        </LoadingComponent>    
    )
}

export default memo(AdminReport);