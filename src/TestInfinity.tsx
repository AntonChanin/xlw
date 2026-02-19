import { useState } from 'react';

import { InfiniteGraph } from './components/Graph'; // Импортируем новый компонент
import { Node } from './components/Node';
import { Chain, getBacklinks } from './components/Chain';
import store from './store/store';

import './patterns.css';

function TestInfinity() {
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>( {
        'node-1': { x: 100, y: 100 },
        'node-2': { x: 400, y: 200 },
        'node-3': { x: 200, y: 400 },
    });

    const { chains, nodes } = store.getState();

    const handleNodeDrop = (draggedId: string, position: { x: number; y: number }) => {
        console.log(`Узел ${draggedId} перемещен в позицию`, position);
        setNodePositions(prev => ({
            ...prev,
            [draggedId]: position
        }));
    };

    const handleNodeDropOnNode = (draggedId: string, targetId: string) => {
        console.log(`Узел ${draggedId} переместился на узел ${targetId}`);
    };

    const handleShowBacklinks = () => {
        const backlinks = getBacklinks({ 
            docId: 'test-doc.md', 
            fragmentId: 'section-1' 
        });
        console.log('Backlinks для test-doc.md#section-1:', backlinks);
        alert(`Найдено ${backlinks.length} входящих ссылок`);
    };

    return (
        <InfiniteGraph 
            onNodeDrop={handleNodeDrop}
            className="pattern13"
            style={{ width: '100%', height: 'calc(100vh - 60px)' }}
            chains={
                <>
                    {chains.chains.map((props) => <Chain {...props} />)}
                </>
            }
        >
            {/* Узел 1 с Markdown контентом */}
            {nodes.nodes.map(({ id, style, ...props }) => (
                <Node
                    id={id}
                    onDrop={handleNodeDropOnNode}
                    style={{ ...style, left: nodePositions[id].x,  top: nodePositions[id].y  }}
                    {...props}
                />
            ))}
        </InfiniteGraph>
    );
}

    // <>
    //     <Chain
    //         id="chain-1"
    //         from={{ nodeId: 'node-1', docId: 'node-1' }}
    //         to={{ nodeId: 'node-2', docId: 'node-2' }}
    //         color="#007bff"
    //     />
    //     <Chain
    //         id="chain-2"
    //         from={{ nodeId: 'node-2', docId: 'node-2' }}
    //         to={{ nodeId: 'node-1', docId: 'node-1' }}
    //         color="#28a745"
    //     />
    //     <Chain
    //         id="chain-3"
    //         from={{ nodeId: 'node-2', docId: 'node-2' }}
    //         to={{ nodeId: 'node-3', docId: 'node-3' }}
    //         color="#28a745"
    //     />
    //     <Chain
    //         id="chain-4"
    //         from={{ nodeId: 'node-3', docId: 'node-3' }}
    //         to={{ nodeId: 'node-2', docId: 'node-2' }}
    //         color="#ffc107"
    //     />
    //     <Chain
    //         id="chain-5"
    //         from={{ nodeId: 'node-1', docId: 'node-1' }}
    //         to={{ nodeId: 'node-3', docId: 'node-3' }}
    //         color="#007bff"
    //     />
    //     <Chain
    //         id="chain-6"
    //         from={{ nodeId: 'node-3', docId: 'node-3' }}
    //         to={{ nodeId: 'node-1', docId: 'node-1' }}
    //         color="#ffc107"
    //     />
    // </>

            // <Node 
            //     id="node-1"
            //     docId={['node-1', 'node-3']}
            //     onDrop={handleNodeDropOnNode}
            //     style={{ 
            //         position: 'absolute', 
            //         left: nodePositions['node-1'].x, 
            //         top: nodePositions['node-1'].y,
            //         // width: '300px',
            //         padding: '10px',
            //         backgroundColor: '#fff',
            //         border: '2px solid #007bff',
            //         borderRadius: '8px',
            //         boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            //     }}
            //     content={`# Узел 1\n\nЭто первый узел с markdown контентом.\n\n- Список элементов\n- Ещё элемент\n\n**Жирный текст** и *курсив*.\n\n [Во поле ягода цвела](node-2) \n\n  Цитата из третьего узла \n\n Ссылка на [узел 3](node-3)`}
            // />  
            // {/* Узел 2 с несколькими Chain ссылками */}
            // <Node 
            //     id="node-2"
            //     onDrop={handleNodeDropOnNode}
            //     style={{ 
            //         position: 'absolute', 
            //         left: nodePositions['node-2'].x, 
            //         top: nodePositions['node-2'].y,
            //         // width: '300px',
            //         padding: '10px',
            //         backgroundColor: '#fff',
            //         border: '2px solid #28a745',
            //         borderRadius: '8px',
            //         boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            //     }}
            //     content={`## Узел 2\n\nВторой узел с содержимым.\n\n [Во поле ягода цвела](node-2). Во бору желудь спел.  Цитата из документации\n\nСсылки: [узел 1 был](node-1), [узел 3](node-3)`}
            // />

            // {/* Узел 3 с тестовой ссылкой на внешний документ */}
            // <Node 
            //     id="node-3"
            //     onDrop={handleNodeDropOnNode}
            //     style={{ 
            //         position: 'absolute', 
            //         left: nodePositions['node-3'].x, 
            //         top: nodePositions['node-3'].y,
            //         // width: '300px',
            //         padding: '10px',
            //         backgroundColor: '#fff',
            //         border: '2px solid #ffc107',
            //         borderRadius: '8px',
            //         boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            //     }}
            //     content={`### Узел 3
            //         \n\n Третий узел.\n\n Цитата из третьего узла\n\nСсылка на [Цитата из третьего узла узел 2](node-2)
            //     `}
            // />

export default TestInfinity;