import React, { PureComponent, memo, useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import LoadingComponent from '../LoadingComponent/LoadingComponet';
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as XLSX from 'xlsx';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
const BarChartQuarter = (props) => {
    const { dataBar = [], dataTypes = [] } = props;
    const [dataChart, setDataChart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const sumRevenue = useMemo(() => {
        const result = dataBar?.reduce((total, curr) => {
            return total + (curr?.amount * curr?.price - curr?.amount * curr?.price * (curr?.discount /100))
        }, 0)
        props.getSumRevenue(result)
        return result;
    }, [dataBar])
    const sumSelledQuantity = useMemo(() => {
        const result = dataBar?.reduce((total, curr) => {
            return total + curr?.amount
        }, 0);
        props.setSumSelledQuantity(result)
        return result;
    }, [dataBar])
    const convertTypeChart = (data, types) => {
        const objectData = {};
        try {
            Array.isArray(types) && types.forEach((type) => {
                objectData[type] = 0;
            });
            Array.isArray(data) && data.forEach((d) => {
                objectData[d?.type] += d?.amount;
            })
        } catch (error) {
            return {}
        }
        return objectData;
    }
    const convertDataChart = (objects) => {
        const result = Array.isArray(Object.keys(objects)) && Object.keys(objects).map((key) => {
            return {
                name: key,
                ['Số lượng']: objects[key]
            }
        })
        return result;
    }
    const findGreatestSelledProducts = (objects) => {
        if (Object.keys(objects).length === 0) {
            console.log('Object rỗng');
            return {
                ['Loại sản phẩm']: '',
                ['Số lượng']: 'Top Selled',
                ['Doanh thu sản phẩm']: 'Không có'
            }
        } else {
            let maxKey = Object.keys(objects)[0];
            let maxValue = objects[maxKey];
            for (const key in objects) {
                if (objects[key] > maxValue) {
                    maxKey = key;
                    maxValue = objects[key]
                }
            }  
            if (maxValue === 0) {
                return {
                    ['Loại sản phẩm']: '',
                    ['Số lượng']: 'Top Selled',
                    ['Doanh thu sản phẩm']: 'Không có'
                }
            }
            return {
                ['Loại sản phẩm']: '',
                ['Số lượng']: 'Top Selled',
                ['Doanh thu sản phẩm']: maxKey
            }
        }
    }
    const convertDataExcel = (data, types) => {
        const objects = {};
        Array.isArray(types) && types.forEach((type) => {
            objects[type] = 0;
        })
        Array.isArray(data) && data.map((d) => {
            objects[d?.type] += d?.amount
        })
        const topSelled = findGreatestSelledProducts(objects);
        const result = Array.isArray(Object.keys(objects)) && Object.keys(objects).map((key) => {
            return {
                ['Loại sản phẩm']: key,
                ['Số lượng']: objects[key]
            }
        })
        Array.isArray(result) && result?.forEach((res) => {
            let sum = 0;
            data.forEach((d) => {
                if (res['Loại sản phẩm'] === d?.type) {
                    sum += d?.price * d?.amount - d?.price * d?.amount * (d?.discount/100);
                }
            })
            res['Doanh thu sản phẩm'] = sum.toLocaleString().replaceAll(',', '.');
        })
        result.push({
            ['Loại sản phẩm']: '',
            ['Số lượng']: 'Tổng kết',
            ['Doanh thu sản phẩm']: ''
        })
        result.push(topSelled)
        return result;
    }
    const exportToExcel = () => {
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Convert data to worksheet
        let dataExcel = convertDataExcel(dataBar, dataTypes);
        dataExcel = [
            ...dataExcel,
            {
                ['Loại sản phẩm']: '',
                ['Số lượng']: 'Tổng doanh thu',
                ['Doanh thu sản phẩm']: sumRevenue.toLocaleString().replaceAll(',', '.')
            }
        ]
        const ws = XLSX.utils.json_to_sheet(dataExcel);
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Chart Data');
        // Save workbook as Excel file
        XLSX.writeFile(wb, 'chart_data.xlsx');
    }
    useEffect(() => {
        const objectChart = convertTypeChart(dataBar, dataTypes);
        const dataConvert = convertDataChart(objectChart);
        setDataChart(dataConvert)
    }, [dataBar])
   
    return (
        <LoadingComponent isLoading={isLoading}>
            <BarChart
                width={1150}
                height={300}
                data={dataChart}
                margin={{
                    top: 5,
                    right: 30,
                    left: -10,
                    bottom: 5,
                }}
                barSize={50}
            >
                <XAxis dataKey="name" scale="point" padding={{ left: 40, right: 80 }} />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="Số lượng" fill="#8884d8" background={{ fill: '#eee' }}>
                    <LabelList dataKey="Số lượng" position={'top'}/>
                </Bar>
            </BarChart>
            {/* <div style={{
                position: 'absolute', top: '-5%', left: '40%',
                transform: 'translate(-50%, -50%)'
            }}>
                <h4 style={{ margin: 0, fontSize: '11px' }}>Doanh thu: &nbsp;
                    <span>{sumRevenue.toLocaleString().replaceAll(',', '.')} VND</span>
                </h4>
            </div> */}
            <div
                style={{
                    position: 'absolute', top: '-14px', right: '0%',
                    transform: 'translate(-50%, -50%)', fontSize: '12px', textAlign: 'center',
                    border: 'none', borderRadius: '4px', outline: 'none',
                    backgroundColor: 'white', padding: '4px 8px', boxSizing: 'border-box',
                    cursor: 'pointer', height: '24px', width: '65px'
                }}
                onClick={exportToExcel}
                className='button-export-excel-report'
            >
                <VerticalAlignBottomOutlined />
                <span>Export</span>
            </div>
                
        </LoadingComponent>    
    )
}

export default memo(BarChartQuarter);