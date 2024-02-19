import {DestroyRef, Injectable} from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { NodeTransition } from "./features/minty/minty-table/node-transition";
import { HttpClient } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class DataService {
    data$: BehaviorSubject<NodeTransition[]> = new BehaviorSubject<NodeTransition[]>([]);
    constructor(private http: HttpClient, private destroyRef: DestroyRef) {
    }

    seedData(): void {
        this.http
            .get<NodeTransition[]>('/assets/seed-data.json')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(data => {
                  this.data$.next(data.map(n => ({...n, id: uuidv4()})))
            })
    }

    resetData(){
        this.data$.next([]);
    }

    removeElement(id: string){
        const newData = this.data$
            .value
            .filter(e => e.id !== id)
        this.data$.next(newData);
    }

    addElement(nodeTransition: NodeTransition){
        const list = this.data$.value;

        if(list.find(n =>
            n.end === nodeTransition.end
            && n.start === nodeTransition.start
            && n.weight === nodeTransition.weight)){
            this.data$.next([...list])
        } else {
            nodeTransition.id = uuidv4()
            this.data$.next([...list, nodeTransition])
        }
    }
}
