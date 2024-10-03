const ROOT_MILESTONE_NAME = "Initial Setup"

document.addEventListener('DOMContentLoaded', function () {
    const milestonesElement = document.getElementById('milestoneData');

    document.getElementById('closeSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove("open")
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

        const width = 1400, height = 500;
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

        // Add the nodes (rectangles)
        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .on("click", async (event, d) => {
                if (d.data.name === ROOT_MILESTONE_NAME) {
                    const sidebarContent = document.getElementById('sidebarContent');
                    sidebarContent.innerHTML = `
                        <h2>${d.data.name}</h2>
                        <p>Some description here for first root milestone</p>
                        <p><strong>Explanation:</strong> fill this in later on</p>
                    `;
                    document.getElementById('sidebar').classList.add("open")
                    return
                }
                const currentPath = window.location.pathname;

                try {
                    const response = await fetch(`${currentPath}/${d.data.name}`);
                    const data = await response.json();
    
                    if (data.success) {
                        const sidebarContent = document.getElementById('sidebarContent');
                        sidebarContent.innerHTML = `
                            <h2>${data.milestoneDetails.title}</h2>
                            <p>${data.milestoneDetails.description}</p>
                            <p><strong>Explanation:</strong> ${data.milestoneDetails.explanation}</p>
                        `;
                        document.getElementById('sidebar').classList.add("open")
                    } else {
                        alert(data.message);
                    }
                } catch (err) {
                    console.error('Error fetching milestone details:', err);
                }
            });

        // Add rectangles to the nodes with dynamic width and padding
        node.append("rect")
            .attr("width", d => Math.max(minWidth, calculateTextWidth(d.data.name) + 60)) // Padding added for text
            .attr("height", 40)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", d => -Math.max(minWidth, calculateTextWidth(d.data.name) + 60) / 2)
            .attr("y", -20)
            
        // Add text to the rectangles
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", 0)
            .text(d => d.data.name)
    }
});

function transformData(milestones) {
    const root = { name: ROOT_MILESTONE_NAME, children: [] };
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
