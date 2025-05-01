export const BarData = (type, labels, data, color) => {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: type,
          data,
          backgroundColor: color,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            callback: function(index) {
              if (index < 6) return labels[index].slice(0, 10);

              const currDate = labels[index].slice(0, 10); // YYYY-MM-DD
              const prevDate = labels[index - 6].slice(0, 10);

              return currDate !== prevDate ? currDate : '';
            },
          },
        },
      },
    },
  };
};