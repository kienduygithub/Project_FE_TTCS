import React, { memo, useEffect, useState } from "react";
import './AdminReport.scss'
import * as orderServices from '../../services/orderServices'
import * as productServices from '../../services/productServices'
import { useMutationHooks } from "../../hooks/userMutationHook";
import BarChartQuarter from "./BarChartQuarter";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponet'
import { useQuery } from "react-query";
const AdminReport = () => {
    const year = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(false);
    const [quarter, setQuarter] = useState({
        quarterOne: [],
        quarterTwo: [],
        quarterThree: [],
        quarterFour: []
    })
    const [allTypes, setAllTypes] = useState([]);
    const fetchAllTypeProducts = () => {
        const res = productServices.getAllTypeProducts();
        return res;
    }
    const fetchQuarter = () => {
        const res = orderServices.getQuarter(selectedYear);
        return res;
    }
    const queryTypes = useQuery({ queryKey: ['types-products'], queryFn: fetchAllTypeProducts });
    // const queryQuarter = useQuery({ queryKey: ['quarters'], queryFn: fetchQuarter })
    const { data: dataTypes, isLoading: isLoadingTypes, isSuccess: isSuccessTypes, isError: isErrorTypes } = queryTypes;
    // const { data: dataQuarter, isLoading: isLoadingQuarter, isSuccess: isSuccessQuarter, isError: isErrorQuarter } = queryQuarter;
    const mutationQuarter = useMutationHooks(
        (data) => {
            const { year } = data;
            console.log('data', data)
            const res = orderServices.getQuarter(year);
            return res;
        }
    )
    const { data: dataQuarter, isLoading: isLoadingQuarter, isSuccess: isSuccessQuarter, isError: isErrorQuarter } = mutationQuarter;
    
    useEffect(() => {
        if (selectedYear) {
            mutationQuarter.mutate({ year: selectedYear }, {
                onSuccess: () => {
                    queryTypes.refetch();
                }
            })
        }
    }, [selectedYear])
    const handleSetQuarter = () => {
        setIsLoading(true);
        if (dataQuarter?.data) {
            Array.isArray(dataQuarter?.data) ? 
                setQuarter({
                    quarterOne: dataQuarter?.data[0],
                    quarterTwo: dataQuarter?.data[1],
                    quarterThree: dataQuarter?.data[2],
                    quarterFour: dataQuarter?.data[3],
                })
                :
                setQuarter({...quarter})
        }
        setIsLoading(false);
    }
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
    useEffect(() => {
        if (isSuccessQuarter && dataQuarter?.status === 'OK') {
            handleSetQuarter();
        }
    }, [isSuccessQuarter, isErrorQuarter])
    useEffect(() => {
        if (isSuccessTypes && dataTypes?.status === 'OK') {
            handleSetAllTypes()
        }
    }, [isSuccessTypes, isErrorTypes])
    // console.log('dataQuarter', dataQuarter);
    // console.log('dataTypes', dataTypes);
    const handleChangeSelect = (e) => {
        setSelectedYear(e.target.value);
    }
    return (
        <LoadingComponent isLoading={isLoading}>
            <div className="report-container">
                <h1>Báo cáo - Thống kê</h1>
                {
                    quarter && allTypes &&
                    <div className="report-chart">
                        <select style={{
                            width: '80px',
                            height: '30px',
                            outline: 'none',
                            fontSize: '20px'
                        }} onChange={handleChangeSelect}>
                            <option value={year - 1}>{ `${year - 1}`}</option>
                            <option value={year} selected>{ `${year}`}</option>
                        </select>    
                        <div className="quarter quarter-up">
                            <div className="quarter-left">
                                <h4>Quý 1</h4>
                                <div className="chart">
                                    <div style={{ width: '100%', height: '150px', position: 'relative', boxSizing: 'border-box'}}>
                                        <BarChartQuarter
                                            dataBar={quarter.quarterOne}
                                            dataTypes={allTypes}
                                        />
                                    </div>  
                                </div>
                            </div>
                            <div className="quarter-right">
                                <h4>Quý 2</h4>
                                <div className="chart">
                                    <div style={{ width: '100%', height: '150px', position: 'relative', boxSizing: 'border-box'}}>
                                        <BarChartQuarter
                                            dataBar={quarter.quarterTwo}
                                            dataTypes={allTypes}
                                        />
                                    </div>   
                                </div>
                            </div>    
                        </div>
                        <div className="quarter quarter-down">
                            <div className="quarter-left">
                                <h4>Quý 3</h4>
                                <div className="chart">
                                    <div style={{ width: '100%', height: '150px', position: 'relative', boxSizing: 'border-box'}}>
                                        <BarChartQuarter
                                            dataBar={quarter.quarterThree}
                                            dataTypes={allTypes}
                                        />
                                    </div>   
                                </div>
                            </div>
                            <div className="quarter-right">
                                <h4>Quý 4</h4>
                                <div className="chart">
                                    <div style={{ width: '100%', height: '150px', position: 'relative', boxSizing: 'border-box'}}>
                                        <BarChartQuarter
                                            dataBar={quarter.quarterFour}
                                            dataTypes={allTypes}
                                        />
                                    </div>  
                                </div>
                            </div>    
                        </div>
                    </div>
                }
            </div>
        </LoadingComponent>    
    )
}

export default memo(AdminReport);