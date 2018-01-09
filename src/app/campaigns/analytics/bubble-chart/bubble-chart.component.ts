import {Directive, OnInit} from '@angular/core'; 

declare var d3: any;

@Directive({
    selector: 'bubble-chart'
})
export class BubbleChartComponent implements OnInit {

ngOnInit(){
   let diameter = 240,
            format = d3.format(",d"),
            color = d3.scale.category20c();

    var bubble = d3.layout.pack()
            .sort(null)
            .size([diameter, diameter])
            .padding(1.5);

    var svg = d3.select("#analytics").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");


    d3.json("https://socialubuntu.com/assets/data.json", function(error, root) {
        if (error) throw error;

        var node = svg.selectAll(".node")
                .data(bubble.nodes(classes(root))
                 .filter(function(d) { return !d.children; }))
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
                .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("circle")
                .attr("r", function(d) { return d.size; })
                .style("fill", function(d) { return color(d.size); });

        node.append("text")
                .attr("dy", ".3em")
                .style("text-anchor", "middle")
                .text(function(d) { return d.className.substring(0, d.r / 3); });
        node.selectAll("title").remove();
        node.on("click", click);
        function click(d){
            
        }
    });

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];
        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
           else classes.push({packageName: name, className: node.name, value: node.size, size: node.size});
        }
        recurse(null, root);
        return {children: classes};
    }
    d3.select(self.frameElement).style("height", diameter + "px");
}
}