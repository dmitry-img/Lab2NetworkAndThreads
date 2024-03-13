import {Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Edge, GraphComponent, Node} from "@swimlane/ngx-graph";
import {Observable, Subject} from "rxjs";
import {NodeTransition} from "./minty-table/node-transition";
import {MintyTableComponent} from "./minty-table/minty-table.component";
import {MintyService} from "../../minty.service";
import {DataService} from "../../data.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

import {TransitionStyle} from "./transition-style";
import {Result} from "./minty-table/result";
import {LinkData} from "./link-data";

@Component({
  selector: 'app-minty',
  templateUrl: './minty.component.html',
  styleUrls: ['./minty.component.css']
})
export class MintyComponent implements OnInit, OnDestroy {
    protected readonly Math = Math;
    private localStorageTemplate = 'storageItem_'
    nodes!: Node[];
    links!: Edge[];
    savedDatasets: Set<string> = new Set<string>();

    defaultTransitionStyle: TransitionStyle = {width: 2, color: 'black'};
    optimalTransitionStyle: TransitionStyle = {width: 5, color: '#6F0'};

    result?: Result = null;

    data$: Observable<NodeTransition[]>;
    updateGraph$: Subject<boolean> = new Subject();

    @ViewChild(MintyTableComponent) table: MintyTableComponent;
    @ViewChild(GraphComponent) graph: GraphComponent;
    @ViewChild('setsSelect') setsSelect: ElementRef;
    constructor(
        private mintyService: MintyService,
        private dataService: DataService,
        private destroyRef: DestroyRef
    ) {

    }


    ngOnInit(): void {
        this.data$ = this.dataService.data$.asObservable();

        // for (const key in localStorage){
        //     if(key.startsWith(this.localStorageTemplate, 0)){
        //         this.savedDatasets.add(key.replace(this.localStorageTemplate, '').trim())
        //     }
        // }

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
                        label: column.weight.toString(),
                        data: {nodeTransitionId: column.id, transitionStyle: this.defaultTransitionStyle} as LinkData
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
        this.result = null;
    }

    onRemoveElement(id : string) {
        this.dataService.removeElement(id)
    }

    onAddElement(nodeTransition: NodeTransition) {
        this.dataService.addElement(nodeTransition);
    }

    onNodeClick(node: Node) {
        this.result = this.mintyService.getShortestPath(+node.id)
        this.links.forEach(l => (l.data as LinkData).transitionStyle = this.defaultTransitionStyle);

        if(this.result?.isSuccessful && this.result.mintyResult.path.length) {
            this.result.mintyResult.path.forEach(tr => {
                const link = this.links.find(l => (l.data as LinkData).nodeTransitionId == tr.id);
                (link.data as LinkData).transitionStyle = this.optimalTransitionStyle;
            });

            this.updateGraph$.next(true)
        }
    }

    ngOnDestroy(): void {
        this.clear();
    }

    private clear(){
        this.dataService.resetData();
        this.clearMintyResult();
        this.setsSelect.nativeElement.options.selectedIndex = 0;
    }

    // saveToLocalStorage(value: string){
    //     if(!value) {
    //         alert("Invalid group name")
    //         return;
    //     }
    //     this.savedDatasets.add(value)
    //     localStorage.setItem(this.localStorageTemplate + value, JSON.stringify(this.dataService.getData()))
    // }
    //
    // onSetSelect(value: any) {
    //     const selectedOption = value.target.value;
    //
    //     const key = this.localStorageTemplate + selectedOption;
    //     const stringData = localStorage.getItem(key);
    //
    //     const data = JSON.parse(stringData) as NodeTransition[];
    //
    //     this.dataService.setData(data)
    // }
}
