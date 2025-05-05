import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

export const chartRender = (node, options) => {
  new Chart (node, options)
}