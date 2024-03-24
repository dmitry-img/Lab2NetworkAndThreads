import {NodeTransition} from "./node-transition";

export interface Result{
    mintyResult?: MintyResult;
    isSuccessful: boolean;
    message?: string;
}

export interface MintyResult{
    h: number;
    path: NodeTransition[];
    detailedPath: string[];
}

