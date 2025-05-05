import { Chart } from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

export function chartRender(node, options) {
	let chart = new Chart(node, options);

	return {
		update(newData) {
			chart.destroy();
			chart = new Chart(node, newData);
		},
		destroy() {
			chart.destroy();
		}
	};
}
