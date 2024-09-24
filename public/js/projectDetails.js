document.addEventListener('DOMContentLoaded', function () {
    const milestonesElement = document.getElementById('milestoneData');

    document.getElementById('closeSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').style.display = 'none';
    });

    if (milestonesElement) {
        const rawMilestones = JSON.parse(milestonesElement.getAttribute('data-milestones'));
        const milestones = transformData(rawMilestones);

        const minWidth = 120;

        function calculateTextWidth(text) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '12px Arial'; // Adjust font to match the actual font
            return context.measureText(text).width;
        }

        const width = 1000, height = 600;
        const svg = d3.select("#milestoneTree")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(50, 50)");

        const treeLayout = d3.tree()
            .size([width - 100, height - 100]);

        const root = d3.hierarchy(milestones);
        treeLayout(root);

        // Create a diagonal path generator for the links
        const diagonal = d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y);

        // Add links between nodes
        svg.selectAll(".link")
            .data(root.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", diagonal) // Use the diagonal generator for curvy links
            .style("fill", "none") // Ensure the path has no fill
            .style("stroke", "#333") // Link color
            .style("stroke-width", "2px"); // Link thickness

        // Add the nodes (rectangles)
        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .on("click", (event, d) => {
                const currentPath = window.location.pathname;
                window.location.href = `${currentPath}/${d.data.name}`;
            });

        // Add rectangles to the nodes with dynamic width and padding
        node.append("rect")
            .attr("width", d => Math.max(minWidth, calculateTextWidth(d.data.name) + 20)) // Padding added for text
            .attr("height", 40)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", d => -Math.max(minWidth, calculateTextWidth(d.data.name) + 20) / 2)
            .attr("y", -20)
            .style("fill", "#e0f7fa") // Light background for better contrast
            .style("stroke", "#333")  // Dark border for rectangles
            .style("stroke-width", "2px")
            

        // Add text to the rectangles
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", 0)
            .style("text-anchor", "middle")
            .style("fill", "#333")  // Dark text color for visibility
            .text(d => d.data.name)
            .each(function (d) {
                // If text is too wide, reduce font size to fit
                const textWidth = calculateTextWidth(d.data.name);
                const rectWidth = Math.max(minWidth, textWidth + 20);
                if (textWidth > rectWidth - 20) {
                    d3.select(this).style("font-size", "10px"); // Adjust font size if overflowing
                }
            });
    }
});

function transformData(milestones) {
    const root = { name: "Start", children: [] };
    const lookup = {};

    milestones.forEach(milestone => {
        lookup[milestone.id] = { 
            name: milestone.title, 
            children: [] 
        };
    });

    milestones.forEach(milestone => {
        if (milestone.dependencies.length === 0) {
            root.children.push(lookup[milestone.id]);
        } else {
            milestone.dependencies.forEach(depId => {
                if (lookup[depId]) {
                    lookup[depId].children.push(lookup[milestone.id]);
                }
            });
        }
    });

    return root;
}
