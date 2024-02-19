import {Component, DestroyRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Edge, GraphComponent, Node} from "@swimlane/ngx-graph";
import {Observable} from "rxjs";
import {NodeTransition} from "./minty-table/node-transition";
import {MintyTableComponent} from "./minty-table/minty-table.component";
import {MintyService} from "../../minty.service";
import {DataService} from "../../data.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-minty',
  templateUrl: './minty.component.html',
  styleUrls: ['./minty.component.css']
})
export class MintyComponent implements OnInit, OnDestroy {
    protected readonly Math = Math;

    nodes!: Node[];
    links!: Edge[];

    mintyResult?: number | string = null;

    data$: Observable<NodeTransition[]>;

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
        this.data$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((data: NodeTransition[]) => {
                this.mintyService.init(data);

                this.nodes = this.mintyService.getNodesIndexes()
                    .map(nodeIndex => nodeIndex.toString())
                    .map(nodeIndex => ({ id: nodeIndex, label: nodeIndex  } as Node))

                this.links = data.map((column, index) =>
                    ({
                        id: 'l' + index,
                        source: column.start.toString(),
                        target: column.end.toString(),
                        label: column.weight.toString()
                    } as Edge)
                )
                this.clearMintyResult();
            })
    }

    onSeed(): void {
        this.dataService.seedData();
    }

    onClear(): void {
        this.clear();
    }

    clearMintyResult(){
        this.mintyResult = null;
    }

    onRemoveElement(id : string) {
        this.dataService.removeElement(id)
    }

    onAddElement(nodeTransition: NodeTransition) {
        this.dataService.addElement(nodeTransition);
    }

    onNodeClick(node: Node) {
        this.mintyResult = this.mintyService.getShortestPath(+node.id) ?? "The path was not detected"
    }

    ngOnDestroy(): void {
        this.clear();
    }

    private clear(){
        this.dataService.resetData();
        this.clearMintyResult();
    }
}
