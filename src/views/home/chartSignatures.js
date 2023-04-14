import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: 'x',
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		plugins: {
			legend: {
				position: 'bottom',
			},
			title: {
				display: true,
				text: 'Assinaturas por mês',
			},
		},
	};

	const labels = props.label;

	const data = {
		labels,
		datasets: [
			{
				label: 'Assinaturas',
				data: props.values,
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	};

	return <Bar height={300} options={options} data={data} />;
}
