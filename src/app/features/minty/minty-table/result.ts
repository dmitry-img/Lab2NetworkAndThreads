import {NodeTransition} from "./node-transition";

export interface Result{
    mintyResult?: MintyResult;
    isSuccessful: boolean;
    errorMessage?: string;
}

export interface MintyResult{
    h: number;
    path: NodeTransition[];
}

