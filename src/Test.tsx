import { useState } from 'react';

import { Graph } from './components/Graph';
import { Node } from './components/Node';
import { Chain, getBacklinks } from './components/Chain';

import './patterns.css';

function Test() {
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({
        'node-1': { x: 100, y: 100 },
        'node-2': { x: 400, y: 200 },
        'node-3': { x: 200, y: 400 },
    });

    const handleNodeDrop = (draggedId: string, position: { x: number; y: number }) => {
        console.log(`Узел ${draggedId} перемещен в позицию`, position);
        setNodePositions(prev => ({
            ...prev,
            [draggedId]: position
        }));
    };

    const handleNodeDropOnNode = (draggedId: string, targetId: string) => {
        console.log(`Узел ${draggedId} перемещен на узел ${targetId}`);
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
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <div style={{ 
                padding: '10px', 
                backgroundColor: '#f0f0f0', 
                borderBottom: '1px solid #ccc',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
            }}>
                <h2 style={{ margin: 0 }}>Тестовый компонент XLA</h2>
                <button onClick={handleShowBacklinks} style={{ padding: '5px 10px' }}>
                    Показать Backlinks
                </button>
        </div>
            <Graph 
                onNodeDrop={handleNodeDrop}
                className="pattern13"
                style={{ width: '100%', height: 'calc(100vh - 60px)' }}
                chains={
                    <>
                        <Chain
                            id="chain-1"
                            from={{ nodeId: 'node-1', docId: 'node-1' }}
                            to={{ nodeId: 'node-2', docId: 'node-2' }}
                            color="#007bff"
                        />
                        <Chain
                            id="chain-2"
                            from={{ nodeId: 'node-2', docId: 'node-2' }}
                            to={{ nodeId: 'node-1', docId: 'node-1' }}
                            color="#28a745"
                        />
                        <Chain
                            id="chain-3"
                            from={{ nodeId: 'node-2', docId: 'node-2' }}
                            to={{ nodeId: 'node-3', docId: 'node-3' }}
                            color="#28a745"
                        />
                        <Chain
                            id="chain-4"
                            from={{ nodeId: 'node-3', docId: 'node-3' }}
                            to={{ nodeId: 'node-2', docId: 'node-2' }}
                            color="#ffc107"
                        />
                        <Chain
                            id="chain-5"
                            from={{ nodeId: 'node-1', docId: 'node-1' }}
                            to={{ nodeId: 'node-3', docId: 'node-3' }}
                            color="#007bff"
                        />
                        <Chain
                            id="chain-6"
                            from={{ nodeId: 'node-3', docId: 'node-3' }}
                            to={{ nodeId: 'node-1', docId: 'node-1' }}
                            color="#ffc107"
                        />
                    </>
                }
            >
                {/* Узел 1 с Markdown контентом */}
                <Node 
                    id="node-1"
                    docId={['node-1', 'node-3']}
                    onDrop={handleNodeDropOnNode}
                    style={{ 
                        position: 'absolute', 
                        left: nodePositions['node-1'].x, 
                        top: nodePositions['node-1'].y,
                        // width: '300px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        border: '2px solid #007bff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    content={`# Узел 1\n\nЭто первый узел с markdown контентом.\n\n- Список элементов\n- Ещё элемент\n\n**Жирный текст** и *курсив*.\n\n > [Цитата из узла 2 is quote](node-2) \n\n > Цитата из третьего узла \n\n Ссылка на [узел 3](node-3)`}
                />  
                {/* Узел 2 с несколькими Chain ссылками */}
                <Node 
                    id="node-2"
                    onDrop={handleNodeDropOnNode}
                    style={{ 
                        position: 'absolute', 
                        left: nodePositions['node-2'].x, 
                        top: nodePositions['node-2'].y,
                        // width: '300px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        border: '2px solid #28a745',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    content={`## Узел 2\n\nВторой узел с содержимым.\n\n> Цитата из документации\n\nСсылки: [узел 1](node-1), [узел 3](node-3)`}
                />

                {/* Узел 3 с тестовой ссылкой на внешний документ */}
                <Node 
                    id="node-3"
                    onDrop={handleNodeDropOnNode}
                    style={{ 
                        position: 'absolute', 
                        left: nodePositions['node-3'].x, 
                        top: nodePositions['node-3'].y,
                        // width: '300px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        border: '2px solid #ffc107',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    content={`### Узел 3
                        \n\n Третий узел.\n\n> Цитата из третьего узла\n\nСсылка на [узел 2](node-2)
                    `}
                />
            </Graph>
        </div>
    );
}

export default Test;
