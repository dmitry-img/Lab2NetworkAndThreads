import {Injectable} from '@angular/core';
import {NodeTransition} from "./features/minty/minty-table/node-transition";
import {NodeData} from "./node-data";
import {Result} from "./features/minty/minty-table/result";
import {filter} from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class MintyService {
    private transitions: NodeTransition[] = [];

    init(transitions: NodeTransition[]) {
        this.transitions = transitions;
    }

    getShortestPath(destinationNodeIndex: number): Result {
        const initialNode: NodeData = {index: Math.min(...this.getNodesIndexes()), h: 0}
        const I: Set<number> = new Set<number>([initialNode.index]);

        const initialNodeTransitions = this.getNodeTransitions(initialNode.index)
        const J: Set<number> = new Set<number>(initialNodeTransitions.map(transition => transition.end));

        let stepHs = this.getHs([initialNode], initialNodeTransitions);
        const nodesData: NodeData[] = [initialNode]
        let step = 1;
        const stringBuilder: string[] = [];

        while (!I.has(destinationNodeIndex) && J.size !== 0){
            stringBuilder.push(`Step ${step}:`)

            const addedNodesToMessage: number[] = [];
            const nodesDataMessage = nodesData.map(n => {
                if(addedNodesToMessage.some(a => a === n.index))
                    return '';
                addedNodesToMessage.push(n.index);
                return "h" + n.index + " = " + n.h;
            })
                .filter(m => m !== '')
                .join(', ')
            stringBuilder.push(`${nodesDataMessage}`)
            stringBuilder.push(`I={${[...I].join(', ')}}`);
            stringBuilder.push(`J={${[...J].join(', ')}}`);

            const stepHsMessage = stepHs.map(n => {
                const transition = this.transitions.find(t => t.id === n.createdFromTransitionId);
                return `h${n.index} = h${transition.start} + c${transition.start}${transition.end} = ${n.h}`
            })
                .join('; ')
            stringBuilder.push(`New hs: ${stepHsMessage}`)

            const minH = Math.min(...stepHs.map(node => node.h));
            const nodesWithMinH = stepHs.filter(node => node.h === minH)
            nodesData.push(...nodesWithMinH);

            const minTransitions = this.transitions
                .filter(t => nodesWithMinH.some(s => s.createdFromTransitionId === t.id))
                .map(tr => `(${tr.start}, ${tr.end})`)
                .join(', ')
            stringBuilder.push(`Minimal value ${minH} corresponds to the transitions: ${minTransitions}`)
            const newTransitions: NodeTransition[] = [];
            nodesWithMinH.forEach(node => {
                I.add(node.index);
                J.delete(node.index);

                newTransitions.push(...this.getNodeTransitions(node.index))
            });
            newTransitions.forEach(destination => {
                if(!I.has(destination.end))
                    J.add(destination.end)
            });

            const availableTransitions = this.transitions
                .filter(transition => I.has(transition.start) && J.has(transition.end));

            stepHs = this.getHs(nodesData, availableTransitions)
            step++;
            stringBuilder.push('----------------------------------------------')
        }

        stringBuilder.push(`Step ${step}:`)

        const addedNodesToMessage: number[] = [];
        const nodesDataMessage = nodesData.map(n => {
            if(addedNodesToMessage.some(a => a === n.index))
                return '';
            addedNodesToMessage.push(n.index);
            return "h" + n.index + " = " + n.h;
        })
            .filter(m => m !== '')
            .join(', ')
        stringBuilder.push(`${nodesDataMessage}`)
        stringBuilder.push(`I={${[...I].join(', ')}}`);
        stringBuilder.push(`J={${[...J].join(', ')}}`);

        const finalNode = nodesData.find(node => node.index === destinationNodeIndex);
        if(!finalNode) {
            return {isSuccessful: false, message: "The path was not detected"};
        }


        const path :NodeTransition[] = [];
        let node: NodeData | null = {... finalNode};
        while(node){
            const transition = this.transitions.find(t => t.id == node.createdFromTransitionId);
            if(node.createdFromTransitionId) {
                path.push(transition)
            }

            node = nodesData.find(n => n.index == transition?.start);
        }

        return {
                mintyResult: {
                        h: finalNode.h,
                        path: path.reverse(),
                        detailedPath: stringBuilder,
                },
                isSuccessful: true,

        }

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
