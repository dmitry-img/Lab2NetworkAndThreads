import {DestroyRef, Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable} from "rxjs";
import { NodeTransition } from "./features/minty/minty-table/node-transition";
import { HttpClient } from "@angular/common/http";
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class DataService {
    data$: BehaviorSubject<NodeTransition[]> = new BehaviorSubject<NodeTransition[]>([]);
    constructor(private http: HttpClient, private destroyRef: DestroyRef) {
    }

    getData(){
        return this.data$.value;
    }

    getVariantsData(): Observable<Array<[NodeTransition[], string]>> {
        return forkJoin({
            banduraBohdan: this.http.get<NodeTransition[]>('/assets/bandura-bohdan.json'),
            paskarDmytro: this.http.get<NodeTransition[]>('/assets/paskar-dmytro.json'),
            pataraykoMaksym: this.http.get<NodeTransition[]>('/assets/potarayko-maksym.json'),
            kaptarDiana: this.http.get<NodeTransition[]>('/assets/kaptar-diana.json'),
        }).pipe(
            map(results => {
                return [
                    [results.banduraBohdan, 'Bandura Bohdan'],
                    [results.paskarDmytro, 'Paskar Dmytro'],
                    [results.pataraykoMaksym, 'Potarayko Maksym'],
                    [results.kaptarDiana, 'Kaptar Diana']
                ];
            })
        );
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

    setData(transitions: NodeTransition[]){
        this.data$.next(transitions)
    }
}
