const options = {
	animation: {
		duration: 0
	},
	elements: {
		line: {
			tension: 0
		},
		point: {
			radius: 0
		}
	},
	xAxes: [{
		type: 'time',
		ticks: {
			autoSkip: true,
			maxTicksLimit: 10,
			min: 0,
			max: 1,
		}
	}],
	scales: {
		yAxes: [{
			ticks: {
				max: 1,
				min: 0,
				stepSize: 0.2
			}
		}]
	},
	layout: {
		padding: {
			left: 40,
			right: 40,
			top: 20,
			bottom: 20
		}
	}
}

export default options;
