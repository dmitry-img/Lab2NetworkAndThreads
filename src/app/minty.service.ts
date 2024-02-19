import {Injectable} from '@angular/core';
import {NodeTransition} from "./features/minty/minty-table/node-transition";
import {NodeData} from "./node-data";
import {MintyResult} from "./minty-table/minty-result";

@Injectable({
    providedIn: 'root'
})
export class MintyService {
    private transitions: NodeTransition[] = [];

    init(transitions: NodeTransition[]) {
        this.transitions = transitions;
    }

    getShortestPath(destinationNodeIndex: number): MintyResult | null {
        const initialNode: NodeData = {index: Math.min(...this.getNodesIndexes()), h: 0}
        const I: Set<number> = new Set<number>([initialNode.index]);

        const initialNodeTransitions = this.getNodeTransitions(initialNode.index)
        const J: Set<number> = new Set<number>(initialNodeTransitions.map(transition => transition.end));

        let stepHs = this.getHs([initialNode], initialNodeTransitions);
        const nodesData: NodeData[] = [initialNode]

        while (!I.has(destinationNodeIndex) && J.size !== 0){
            const minH = Math.min(...stepHs.map(node => node.h));
            const nodesWithMinH = stepHs.filter(node => node.h === minH)
            nodesData.push(...nodesWithMinH);

            const newTransitions: NodeTransition[] = [];
            nodesWithMinH.forEach(node => {
                I.add(node.index);
                J.delete(node.index);

                newTransitions.push(...this.getNodeTransitions(node.index))
            });
            newTransitions.forEach(destination => J.add(destination.end));

            const availableTransitions = this.transitions
                .filter(transition => I.has(transition.start) && J.has(transition.end));

            stepHs = this.getHs(nodesData, availableTransitions)
        }

        const finalNode = nodesData.find(node => node.index === destinationNodeIndex);
        const path :number[] = [];
        if(finalNode !== null) {
            let node: NodeData | null = {... finalNode};
            while(node){
                path.push(node.index)
                const transition = this.transitions.find(t => t.id == node.createdFromTransitionId);
                node = nodesData.find(n => n.index == transition?.start);
            }

            return {h: finalNode.h, path: path.reverse()};
        }
        return {errorMessage: "The path was not detected"};
    }

    private getHs(nodesData: NodeData[], transitions: NodeTransition[]): NodeData[]{
        const result: NodeData[] = [];
        transitions.map(transition => {
            nodesData.filter(node => node.index == transition.start)
                .forEach(node => {
                    result.push({ index: transition.end, h: node.h + transition.weight, createdFromTransitionId: transition.id } as NodeData)
                })
        });

        return result
    }
    getNodesIndexes() {
        const nodesIndexes: Set<number> = new Set<number>();
        this.transitions.forEach(transition => {
            nodesIndexes.add(transition.start);
            nodesIndexes.add(transition.end);
        })
        return [...nodesIndexes]
    }

    private getNodeTransitions(nodeIndex: number): NodeTransition[] {
        return this.transitions
            .filter(transition => transition.start === nodeIndex)
    }
}
