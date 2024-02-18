import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NodeTransition} from "./node-transition";
import {SeedService} from "../seed.service";

@Component({
    selector: 'app-minty-table',
    templateUrl: './minty-table.component.html',
    styleUrls: ['./minty-table.component.css']
})
export class MintyTableComponent implements OnInit{
    form!: FormGroup;
    private _data!: NodeTransition[];

    @Input()
    get data(){
        return this._data
    }

    set data(data: NodeTransition[]){
        this._data = data;

        this.reset()

        this.data!.forEach(column => this.addColumn(column));
    }

    constructor(private fb: FormBuilder) {
    }

    get columns(): FormArray {
        return this.form.get('columns') as FormArray;
    }


    ngOnInit(): void {
        this.form = this.fb.group({
            columns: this.fb.array([])
        });
    }

    addColumn(column: NodeTransition): void {
        this.columns.push(this.fb.group({
            start: [column.start, Validators.required],
            end: [column.end, Validators.required],
            weight: [column.weight, Validators.required]
        }));
    }

    reset(){
        this.form.reset();
    }
}
