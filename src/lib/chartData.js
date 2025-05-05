export const ChartData = (type, labels, data, color, day) => {
  return {
    type: 'line',
    data: {
      labels: labels.filter(p => day !== "" ? p.startsWith(day) : true),
      datasets: [
        {
          label: type,
          data: data
            .map((d, i) => ({ x: labels[i], y: d }))
            .filter(p => day !== "" ? p.x.startsWith(day) : true)
            ,
          backgroundColor: color,
        },
      ],
    },
    options: {
      spanGaps: 5 * 60 * 1000,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: day ? day + 'T00:00:00' : undefined,
          max: day ? day + 'T23:59:59' : undefined,
          type: 'time',
          time: {
            unit: day ? 'hour' : 'day', 
            tooltipFormat: 'PPpp',
            displayFormats: {
              day: day ? 'HH:mm' : 'MMM d',
            },
          },
          title: {
            display: true,
            text: day ? 'Time' : 'Date',
          },
        },
        y: {
          min: 0,
          max: type === 'pH level' ? 14 : undefined,
        }
      },
    },
  };
};