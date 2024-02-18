import {Component, OnInit} from '@angular/core';
import {NodeTransition} from "./minty-table/node-transition";
import {Edge} from "@swimlane/ngx-graph/lib/models/edge.model";
import {Node} from "@swimlane/ngx-graph";
import {Observable, of} from "rxjs";
import * as shape from 'd3-shape';
import {MintyService} from "./minty.service";
import {HttpClient} from "@angular/common/http";
import {SeedService} from "./seed.service";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    protected readonly Math = Math;

    nodes!: Node[];
    links!: Edge[];

    data: NodeTransition[] = []

    seedData$: Observable<NodeTransition[]> = of([]);
    constructor(private mintyService: MintyService, private seedService: SeedService) {
    }

    ngOnInit(): void {
        this.mintyService.init(this.data);
        this.mintyService.getShortestPath(4)


        const nodesIndexes : Set<string> = new Set<string>();
        this.nodes = this.mintyService.getNodesIndexes()
            .map(nodeIndex => nodeIndex.toString())
            .map(nodeIndex => ({ id: nodeIndex, label: nodeIndex  } as Node))

        this.links = this.data.map((column, index) =>
            ({
                id: index.toString(),
                source: column.start.toString(),
                target: column.end.toString(),
                label: column.weight.toString()
            } as Edge)
        )
    }

    onSeed(){
        this.seedData$ = this.seedService.getData();
    }

    onClear(){

    }
}
