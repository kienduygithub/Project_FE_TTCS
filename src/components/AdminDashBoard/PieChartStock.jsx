import React, { PureComponent, useEffect, useState } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Bar, YAxis, XAxis, BarChart, LabelList } from 'recharts';

const PieChartStock = (props) => {
    const { data } = props;
    const [dataChart, setDataChart] = useState([]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    useEffect(() => {
        const objectProducts = {};
        Array.isArray(data) &&
            data?.forEach((product) => {
                if (!objectProducts[product?.type]) {
                    objectProducts[product?.type] = product?.countInStock;
                } else {
                    objectProducts[product?.type] += product?.countInStock;
                }
            })
        console.log('objectProducts', Object.keys(objectProducts))
        const dataConvert = Array.isArray(Object.keys(objectProducts)) &&
            Object.keys(objectProducts).map((item) => {
                return {
                    name: item,
                    ["Số lượng"]: objectProducts[item]
                }      
            })
        setDataChart(dataConvert);
    }, [data])

    return (
        <BarChart
            width={500}
            height={400}
            data={dataChart}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            barSize={40}
        >
            <XAxis dataKey="name" scale="point" padding={{ left: 25, right: 10 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Bar dataKey="Số lượng" fill="#8884d8" background={{ fill: '#eee' }}>
                <LabelList dataKey={'Số lượng'} position={'top'} fontWeight={400} />
            </Bar>
        </BarChart>
    )
}
export default PieChartStock