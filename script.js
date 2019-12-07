

//Output-side real GDP per capita (2011 international-$)

//"Deaths - Air pollution - Sex: Both - Age: Age-standardized (Rate) (deaths per 100,000)"
var screen= {width:750, height:500}
var margins={top:10,right:50,bottom:50,left:50}


    svg= d3.select("#map").attr("width",850).attr("height",500)

var projection=d3.geoEqualEarth().translate([370,300]).scale([170])


var path= d3.geoPath().projection(projection);
worldPromise= d3.json("world.json");
carbonPromise= d3.csv("newCo2.csv");
gdpPromise=d3.csv("GDP.csv");
airPromise=d3.csv("air.csv");
Promise.all([worldPromise,carbonPromise, gdpPromise, airPromise]).then(
    function(values){
        setup(values);
	
    }, function(err){
        console.log("broken",err);
    }
)
//Draw Legend
var drawLegend=function(min,max,show,text){
d3.select("#legend").selectAll("circle").remove();
d3.select("#legend").selectAll("text").remove();
var size=d3.scaleSqrt()
.domain([min,max])
.range([2,20])
var show=show
var xCircle=110
var xLabel=150
var yCircle=400
d3.select("#legend").append("text").text(text).attr("x",function(){
	if (text=="Carbon Emissions"){
		return 76}
	else{ return 100}
	}).attr("y",350).style("font-size",10);
d3.select("#legend").selectAll("legend").data(show)
	.enter()
	.append("circle")
	.attr("cx",xCircle)
	.attr("cy",function(d){return yCircle-size(d)})
	.attr("r",function(d){return size(d)})
	.style("fill","none")
	.attr("stroke","black")
	    .style('stroke-dasharray',('2,2'));
//labels
	d3.select("#legend").selectAll("legend").data(show).enter()
	.append("text").attr("x",xLabel)
	.attr("y",function(d){return yCircle-size(d)})
	.text(function(d){return d})
	.style("font-size",10)
	
	
}




//First visual
var displayAll=function(values){
	var color= d3.scaleQuantize()
.range(["rgb(237,248,233)","rgb(116,196,118)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,90,50)"]);
color.domain([
	215,510321]);
//getting the topoJson;
	svg.selectAll("path")
	.data(values[0].features)
	.enter()
.append("path").attr("d",path).style("stroke","black");
	d3.select(".d")
	.style("fill",function(d){
		var value=GDP(d.datag,year)
        if (value){
            return color(value);}
        else { return "#ccc"}
	
	});
}




//Set Up function creates the Map in the background and displays the circles for year: by default

var setup= function(values){
	//Creating the background Map

//getting the topoJson;
	svg.selectAll("path")
	.data(values[0].features)
	.enter()
.append("path").attr("d",path).style("stroke","white").style("fill","#92b6d5");
var combined=merge(values);
    year=1990;



var values=["Emissions Tonnes per Capita/GDP","Emissions Tonnes per Capita/Deaths related to Air Pollution","GDP/Deaths related to Air Pollution"];
d3.select("#options").append("td").text(values[0]).on("click",function(d){
    drawCircles(combined,year)
	

	years=[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]
d3.select("#year").selectAll("tr").remove();
d3.select("#year").selectAll("tr").data(years).enter().append("tr").attr("class","timebutton").text(function(d){
	return d
}).on("mouseover",function(d){
	console.log("d",d)
	year=d;
	d3.select("#time").text(d)
	drawCircles(combined,year)	
})
});
	

d3.select("#options").append("td").text(values[1]).on("click",function(d){
	optionED(combined,year)
	d3.select("#year").selectAll("tr").remove();
	years=[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]
d3.select("#year").selectAll("tr")
.data(years).enter().append("tr").attr("class","timebutton").text(function(d){
	return d
}).on("mouseover",function(d){
	console.log("d",d)
	year=d;
	d3.select("#time").text(d)
	optionED(combined,year);
})
});

d3.select("#options").append("td").text(values[2]).on("click",function(d){
	optionGD(combined,year)	
	years=[1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]
	d3.select("#year").selectAll("tr").remove();
d3.select("#year").selectAll("tr")
.data(years).enter().append("tr").attr("class","timebutton").text(function(d){
	return d
}).on("mouseover",function(d){
	console.log("d",d)
	year=d;
	d3.select("#time").text(d)
	optionGD(combined,year)	
})
});
}



	
	

var merge= function(values)
{
    console.log("values",values)
    var dataA= values[0].features;
    var dataB= values[1];
	var dataC= values[2];
    var dataD= values[3]
    var hash={}
    
dataA.forEach(function(element)
{  
    element.data={}
	element.datag={}
    element.datar={}
	hash[element.properties.name]=element
})
	
dataB.forEach(function(e2)
{
		if (hash[e2.Name]){
			hash[e2.Name].data[e2.Year]=e2;
		} 
})
dataC.forEach(function(e3)
{	
    if(hash[e3.Name])//and the year maybe??
{
	hash[e3.Name].datag[e3.Year]
		=e3;}
 
	}
)
    dataD.forEach(function(e4)
    {	
    if(hash[e4.Name])//and the year maybe??
{
	hash[e4.Name].datar[e4.Year]
		=e4;}
 
	})
       console.log("dataA",dataA)
    return dataA
                  }
 




//Parameters:Takes in data and Year as input
var drawCircles= function(data,year)
{
	show=[10,30,64]
drawLegend(0,64,show,"Carbon Emissions")
    var radius = d3.scaleSqrt()
    .domain([0,64])
    .range([2,20]);

    // Color Scale for GDP
var logScale= d3.scaleLog().domain([215,510321])
var color= d3.scaleSequential((d)=> d3.interpolateGreens(logScale(d)));


	d3.select("#legend").selectAll("rect").remove();
	d3.select("#legend").append("text").text("GDP").attr("x",40).attr("y",355).style("font-size",10)
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",360).attr("width",10).attr("height",10).style("fill",color(215))
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",370).attr("width",10).attr("height",10).style("fill",color(25642.5))
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",380).attr("width",10).attr("height",10).style("fill",color(510321))
	svg.selectAll(".bubble").remove();
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
	.enter().append("circle")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
    //Options changes this information 
	.attr("r",function(d)

	{ 	
		if (d.data){
            emission=getEmission(d.data,year)
		r=radius(emission);
		}
		else {
			r=0
		}
		return r;
	})
	.style("fill",function(d){
        var value=GDP(d.datag,year)
        if (value){
            return color(value);}
        else { return "#ccc"}
        }
    )
.on("mouseover",function(d){
    
		name=d.data[year].Name
		d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
		d3.select("#info").append("h1").text(name+" "+year);
		d3.select("#info").append("p").text("Emission: "+ getEmission(d.data,year)+" Tonnes per Capita")
		d3.select("#info").append("p").text("GDP: "+GDP(d.datag,year))
	}).on("mouseout",function(){
d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
})


}

// Function that draws circles for deaths Vs Emissions
var optionED= function(data,year){
show=[10,30,64]
svg.selectAll(".bubble").remove();
	//Death counts will be bubble color
var logScale= d3.scaleLog().domain([8,320])
var color= d3.scaleSequential((d)=> d3.interpolateReds(logScale(d)));
drawLegend(0,64,show,"Carbon Emissions")
	d3.select("#legend").append("text").text("Deaths per 100,000").attr("x",5).attr("y",358).style("font-size",10)
	d3.select("#legend").selectAll("rect").remove();
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",360).attr("width",10).attr("height",10).style("fill",color(8))
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",370).attr("width",10).attr("height",10).style("fill",color(150))
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",380).attr("width",10).attr("height",10).style("fill",color(320))
	

    
	var radius = d3.scaleSqrt()
    .domain([0,64])
    .range([2,20]);
	
    //svg.selectAll(".bubble").remove();
svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
		/*.sort(function(a,b){ console.log(b.getEmission(d.data,year)-a.getEmission(d.data,year));})*/
	.enter().append("circle")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
    //Options changes this information 
	.attr("r",function(d)

	{ 	
		if (d.data){
      emission=getEmission(d.data,year)
		r=radius(emission);
		}
		else {
			r=0
		}
		return r;
	})
	.style("fill",function(d){
        var value=Death(d.datar,year)
        if (value){
            return color(value);}
        else { return "#ccc"}
        }
    ).on("mouseover",function(d){
		name=d.data[year].Name
		d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
		d3.select("#info").append("h1").text(name+" "+year);
		d3.select("#info").append("p").text("Emission: "+ getEmission(d.data,year)+" Tonnes Per Capita")
		d3.select("#info").append("p").text("Deaths: "+Death(d.datar,year)+ " Deaths - Air pollution - Sex: Both - Age: Age-standardized (Rate) (deaths per 100,000)")
	
	
       
	}).on("mouseout",function(){
d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
})

	
	
}



var optionGD=function(data,year){

    var radius = d3.scaleSqrt()
    .domain([215,510321])
    .range([2,20]);
show=[215,257392,510321]
drawLegend(215,510321,show,"GDP")
    svg.selectAll(".bubble").remove();
var logScale= d3.scaleLog().domain([8,320])
var color= d3.scaleSequential((d)=> d3.interpolateReds(logScale(d)));
	svg.selectAll(".bubble").remove();
	svg.append("g")
	.attr("class","bubble")
	.selectAll("circle")
	.data(data)
	.enter().append("circle").attr("class","cb");
	svg.selectAll(".cb")
        .attr("transform", function(d) 
		  { 
		return "translate(" + path.centroid(d) + ")";
		  })
	
	
	.attr("r",function(d)

	{ 	
		if (d.datag){
            money=GDP(d.datag,year)
		  r=radius(money);
		}
		else {
			r=0
		}
		return r;
	})
	.style("fill",function(d){
        var value=Death(d.datar,year)
        if (value){
            return color(value);}
        else { return "#ccc"}
        }
    );
	d3.select("#legend").selectAll("rect").remove();
	d3.select("#legend").append("text").text("Deaths per 100,000").attr("x",5).attr("y",358).style("font-size",10);
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",360).attr("width",10).attr("height",10).style("fill",color(8))
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",370).attr("width",10).attr("height",10).style("fill",color(150))
	d3.select("#legend").append("rect").attr("x",50)
	.attr("y",380).attr("width",10).attr("height",10).style("fill",color(320))
svg.selectAll(".cb").on("mouseover",function(d){
    
		name=d.data[year].Name
		d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
		d3.select("#info").append("h1").text(name+" "+year);
		d3.select("#info").append("p").text("GDP: "+GDP(d.datag,year));
		d3.select("#info").append("p").text("Deaths by Air Pollution: "+ Death(d.datar,year)+"Deaths - Air pollution - Sex: Both - Age: Age-standardized (Rate) (deaths per 100,000)")
	}).on("mouseout",function(){
d3.select("#info").selectAll("h1").remove();
		d3.select("#info").selectAll("p").remove();
})

}

var Death= function(country,time){
    if(country[time]){
       return country[time].Deaths
       }
}
var GDP=function(country,time){
    if(country[time]){
       return country[time].Gdp
       }
}
var getEmission=function(country,time)
{    if (country[time]){
	return country[time].Emissions}
 else{ return 0}
}


