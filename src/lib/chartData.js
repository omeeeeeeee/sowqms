export const BarData = (type, labels, data, color) => {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: type,
          data: data.map((d, i) => ({ x: labels[i], y: d })),
          backgroundColor: color,
        },
      ],
    },
    options: {
      spanGaps: 5 * 60 * 1000,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day', // or 'hour', 'minute', etc.
            tooltipFormat: 'PPpp', // optional: how to show on tooltip
            displayFormats: {
              day: 'MMM d',
            },
          },
          title: {
            display: true,
            text: 'Date',
          },
          /*
          ticks: {
            callback: function(index) {
              if (index < 6) return labels[index].slice(0, 10);

              const currDate = labels[index].slice(0, 10); // YYYY-MM-DD
              const prevDate = labels[index - 6].slice(0, 10);

              return currDate !== prevDate ?     currDate : '';
            },
          },
          */
        },
      },
    },
  };
};