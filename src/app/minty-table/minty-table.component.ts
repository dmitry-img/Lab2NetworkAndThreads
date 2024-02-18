import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NodeTransition} from "./node-transition";

@Component({
    selector: 'app-minty-table',
    templateUrl: './minty-table.component.html',
    styleUrls: ['./minty-table.component.css']
})
export class MintyTableComponent implements OnInit{
    form: FormGroup;
    private _data: NodeTransition[] = [];

    get data() {
        return this._data;
    }
    @Input()
    set data(data: NodeTransition[]){
        if(!data){
            data = [];
        }
        this._data = data;
        this.reset()
        this.data.forEach(column => this.addColumn(column));

    }

    @Output() removeElement = new EventEmitter<string>();
    @Output() addElement = new EventEmitter<NodeTransition>();

    constructor(private fb: FormBuilder) {
    }

    get columns(): FormArray {
        return this.form.get('columns') as FormArray;
    }


    ngOnInit(): void {
        this.reset()
    }

    private addColumn(column: NodeTransition): void {
        this.columns.insert(this.columns.length - 1,
            this.fb.group({
                id: [{value: column.id, disabled: true}],
                start: [column.start, Validators.required],
                end: [column.end, Validators.required],
                weight: [column.weight, Validators.required]
            }))

    }

    reset(){
        this.form = this.fb.group({
            columns: this.fb.array<NodeTransition>([])
        });
        this.addColumn({start: null, end: null, weight: null, id: null })
    }

    onAddButtonClick() {
        if(this.form.valid){
            this.addElement.emit(this.columns.at(this.columns.length - 1).value as NodeTransition);
        } else{
            console.log(this.form)
        }

    }

    onRemoveButtonCLick(index: number) {
        const column = this.columns.at(index);
        const value = column.value as NodeTransition;
        this.removeElement.emit(value.id);
    }
}
