export const BarData = {
  type: 'line',
  data: {
      labels: ['January','February', 'March', 'April', 'May'],
      datasets: [{
          label: 'Bar Dataset',
          data: [55, 20, 30, 10, 85],
          backgroundColor:[
              'rgba(115, 90, 145, 0.8)'
          ]
      },],
  },
  options: {
      maintainAspectRatio: true,
  },
 }