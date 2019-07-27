//filter start
(function(document) {
	'use strict';

	var LightTableFilter = (function(Arr) {

		var _input;

		function _onInputEvent(e) {
			_input = e.target;
			var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
			Arr.forEach.call(tables, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, _filter);
				});
			});
		}

		function _filter(row) {
			var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
			
		}

		return {
			init: function() {
				var inputs = document.getElementsByClassName('light-table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = _onInputEvent;
				});
			}
		};
	})(Array.prototype);

	document.addEventListener('readystatechange', function() {
		if (document.readyState === 'complete') {
			LightTableFilter.init();
			
		}
	});

})(document);

//for taple class="order-table"
//for Search input class="light-table-filter " data-table="order-table"

//Search filter end


  $(function(){
    $('#example').simpleLightbox();
  });

  hov.onclick = function hover() {
    document.getElementById("mynav").classList.toggle("longnav");
    document.getElementById("hov").classList.toggle("text-center");
    document.getElementById("arrow").classList.toggle("fa-angle-double-left");
    document.getElementById("arrow").classList.toggle("fa-angle-double-right");
	}
	
	$(function () {
		$('[data-toggle="tooltip"]').tooltip({trigger:'hover'})
	})

	$(function () {
		$('[data-toggle="popover"]').popover({})
	})

   //--------------------Chart-------------------------------------

	  var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
	type: 'line',
    data: {
		labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'],
		
         datasets: [{
            label: 'vistors',
            data: [20, 20, 30, 50, 20, 30, 5],
            backgroundColor: [
                'transparent',
                
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
		}] 
		
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}); 
  // -------------------------secund chart------------------------

var barChartData = {
	labels: ["1", "2", "3", "4", "5", "6", "7","8","9","10","11","12","13","14","15"],
	datasets: [{
		type: 'bar',
		  label: "vistors",
			data: [600,2300,3500,600,16000,5000,2300,500,100,500,19000,1200,20000,5000,12050],
			fill: false,
			backgroundColor: 'rgba(49,157,238,1)',
			borderColor: "rgba(49,157,238,0.5)",
			hoverBackgroundColor: 'rgba(49,157,238,0.9)',
								borderWidth: 0,	
			yAxisID: 'y-axis-1'
	}, {
		type: 'bar',
		  label: "new users",
			data: [800,1300,4500,1200,600,24000,5000,20000,5000,12050,600,6000,100,500,19000],
			fill: false,
			backgroundColor: 'rgba(224,195,36,1)',
			borderColor: "rgba(224,195,36,0.5)",
			hoverBackgroundColor: 'rgba(224,195,36,0.45)',
								borderWidth: 0,	
			yAxisID: 'y-axis-1'
	}, {
		label: "income",
			type:'line',
			data: [1200,5300,6500,800,16000,35000,2300,500,100,600,9000,24000,20000,15000,250],
								fill: false,
								lineTension: 0.1,
								backgroundColor: "rgba(49,157,238,1)",
								borderColor: "rgba(49,157,238,0.45)",
								borderCapStyle: 'butt',
								borderWidth: 1,
								pointRadius: 2,
								spanGaps: true,
								lineTension: 0,
			yAxisID: 'y-axis-1'
	}, {
		label: "photos",
			type:'line',
			data: [1200,4100,4900,800,5000,16000,21000,4500,15000,600,1600,5000,12000,800,250],
								fill: false,
								lineTension: 0.1,
								backgroundColor: "rgba(244,225,61,01)",
								borderColor: "rgba(244,225,61,0.6)",
								borderCapStyle: 'butt',
								borderWidth: 1,
								pointRadius: 2,
								spanGaps: true,
								lineTension: 0,
			yAxisID: 'y-axis-1'
	} ]
};

window.onload = function() {
	var ctx = document.getElementById("canvas").getContext("2d");
	window.myBar = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
		responsive: true,
		tooltips: {
		  mode: 'label'
	  },
	  elements: {
		line: {
			fill: false
		}
	},
	  scales: {
		xAxes: [{
			display: true,
								categoryPercentage: 0.3,
								barPercentage: 1,
			gridLines: {
				display: false
			},
			labels: {
				show: true,
			}
		}],
		yAxes: [{
			type: "linear",
			display: true,
			position: "left",
			id: "y-axis-1",
			gridLines:{
									color:"rgba(76,87,102,0.1)",
									zeroLineColor:"rgba(76,87,102,0.1)",
			  display: true,
									offsetGridLines: true,
									drawBorder: false,
									drawTicks: false,
			},
			labels: {
				show:true,   
			}
		}]
	}
	}
	});
};



   //--------------------Chart-------------------------------------


	//--------------------counter-------------------------------------
	 //need <script src="https://cdnjs.cloudflare.com/ajax/libs/countup.js/1.8.5/countUp.min.js"></script>
// These are the options that I'm going to be using on each statistic
var options = {
	useEasing: true,
	useGrouping: true,
	separator: ",",
	decimal: "."
};

// Find all Statistics on page, put them inside a variable
var statistics = $(".count");

// For each Statistic we find, animate it
statistics.each(function(index) {
	// Find the value we want to animate (what lives inside the p tags)
	var value = $(statistics[index]).html();
	// Start animating
	var statisticAnimation = new CountUp(statistics[index], 0, value, 0, 5, options);
	statisticAnimation.start();
});

	//--------------------counter-------------------------------------