import { Chart } from 'chart.js/auto';

export const chartRender = (node, options) => {
  new Chart (node, options)
}