import React from 'react';
import {Component} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {Line } from 'react-chartjs-2';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Visualize chart',
    },
  },
  scales:{
    y: {
          grid: {
            display: true,
          },
          ticks:{
            color: 'white',
          }
        },
        x: {
          border: {
            display: true
          },
          grid: {
            display: true,
          },
          ticks:{
            color: 'white',
          }
        },
  }
};





export default class FRChart extends Component <any,any> {
  static displayName = FRChart.name
  constructor(props:any) {
    super(props);
    this.state = {loading_block: true };
  }
  render() {
    // const getProp = (prop: any) => (obj: any) => obj[prop];
    // const getDate = getProp('ngay_cong_bo');
    // const dates = this.props.chart_days_data.map(getDate);
    // const getData = getProp('tong_nhiem_hq')
    // const dates_data = this.props.chart_days_data.map(getData);
    const labels = this.props.f //dates.reverse()
    const f_data = this.props.r2 //dates.reverse()
    const data = {
      labels,
      datasets: [
        {
          label: "R2",
          data: f_data,
          fill: true,
          backgroundColor: "rgba(29, 31, 72,0.2)",
          borderColor: "#0c62ed"
        }
      ]
    };
    return <Line  options={options} data={data} width = {20}
    height = {15} />;
  }
}