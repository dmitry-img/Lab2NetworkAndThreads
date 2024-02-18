import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {NodeTransition} from "./minty-table/node-transition";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SeedService {

  constructor(private http: HttpClient) { }

  getData(): Observable<NodeTransition[]>{
    return this.http.get<NodeTransition[]>('./node-data.json');
  }
}
