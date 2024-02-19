import {Component, DestroyRef, OnInit, ViewChild} from '@angular/core';
import {NodeTransition} from "./minty-table/node-transition";
import {Edge} from "@swimlane/ngx-graph/lib/models/edge.model";
import {GraphComponent, Node} from "@swimlane/ngx-graph";
import {Observable, Subscription} from "rxjs";
import {MintyService} from "./minty.service";
import {DataService} from "./data.service";
import {MintyTableComponent} from "./minty-table/minty-table.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    protected readonly Math = Math;

    nodes!: Node[];
    links!: Edge[];

    mintyResult?: number;

    data$: Observable<NodeTransition[]>;
    dataSubscription: Subscription;

    @ViewChild(MintyTableComponent) table: MintyTableComponent;
    @ViewChild(GraphComponent) graph: GraphComponent;
    constructor(
        private mintyService: MintyService,
        private dataService: DataService,
        private destroyRef: DestroyRef
    ) {
        this.data$ = dataService.data$.asObservable();
    }


    ngOnInit(): void {
       this.dataSubscription = this.data$
           .pipe(
               takeUntilDestroyed(this.destroyRef)
           )
           .subscribe((data: NodeTransition[]) => {
                this.mintyService.init(data);

                this.nodes = this.mintyService.getNodesIndexes()
                    .map(nodeIndex => nodeIndex.toString())
                    .map(nodeIndex => ({ id: nodeIndex, label: nodeIndex  } as Node))

                this.links = data.map((column, index) =>
                    ({
                        id: index.toString(),
                        source: column.start.toString(),
                        target: column.end.toString(),
                        label: column.weight.toString()
                    } as Edge)
            )
        })
    }

    onSeed(): void {
        this.dataService.seedData();
    }

    onClear(): void {
        this.dataService.resetData();
        this.mintyResult = undefined;
    }

    onRemoveElement(id : string) {
        this.dataService.removeElement(id)
    }

    onAddElement(nodeTransition: NodeTransition) {
        this.dataService.addElement(nodeTransition);
    }

    onNodeClick(node: Node) {
        this.mintyResult = this.mintyService.getShortestPath(+node.id);
    }
}
