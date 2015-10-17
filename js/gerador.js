var BarChart = function(dados, destino){

	var margin 	= { top: 50, right: 0, bottom: 200, left: 100 };
	var width 	= 960 - margin.left - margin.right;
	var height 	= 1100 - margin.top - margin.bottom;
	var tip 	= CustomTooltip("transp_tooltip_two", 240);
	var color 	= d3.scale.category20();

	var dados;
	var destino;
	var x, y;
	var xAxis, yAxis;
	var yAxisLabel = "Valor";
	var svg;

	this.init = function(){
		this.dados = dados;
		this.destino = destino;

		create_axis();
		create_svg();
		create_bars(this.dados);
	}

	var create_axis = function(){
		x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        y = d3.scale.linear()
            .range([height, 0]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10)
            .tickFormat(function (d) {
		        // var prefix = d3.formatPrefix(d);
		        // return prefix.scale(d) + prefix.symbol;
		        return "R$ " + d;
		    });
    }

    var create_svg = function(){
        svg = d3.select(destino)
                .append("svg")
	                .attr("width", width + margin.left + margin.right)
	                .attr("height", height + margin.top + margin.bottom)
	                .append("g")
		                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}

	var create_bars = function(data){
		x.domain(data.map(function(d) { return d.txt; }));
		y.domain([0, d3.max(data, function(d) { return d.val; })]);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

    	svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(yAxisLabel);

        svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll("text")  
				.style("text-anchor", "end")
				.style("font-size", ".8em")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)" );;

		svg.selectAll(".bar")
            .data(data)
            .enter()
                .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.txt); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.val); })
                    .attr("title", function(d) { return d.txt; })
                    .attr("title", function(d) { return d.txt; })
                    .attr("height", function(d) { return height - y(d.val); })
                    .style("fill", function(d){ return color(d.txt); })
                    .style("cursor", "pointer")
                    .on("mouseover", overRect)
                    .on("mouseout", outRect)
                    .on("click", this.mouseClick)
                    .each(function(d) { this._data = d; }); // store the initial angles
	}

	var outRect = function(){
		tip.hideTooltip();
	}

    var overRect = function(){
        g = d3.select(this);
        var text = "<span>Credor: " + g.attr("title") + "</span><br />";
        	text += "<span>Itens: " + this._data.count + "</span><br />";
        	text += "<span>Valor Pago: R$ " + roundToTwo(this._data.val) + "</span>";

		tip.showTooltip(text, d3.event);
    }

	var roundToTwo = function(num) {    
	    return +(Math.round(num + "e+2")  + "e-2");
	}

   	this.mouseClick = function(){
		console.warn(this);    
    }

}