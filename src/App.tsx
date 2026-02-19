import React, { useMemo, useState, useTransition } from 'react';
import { Provider } from 'react-redux';

import Test from './Test';
import TestInfinity from './TestInfinity';
import store from './store/store';

import './App.css';

function App() {
    const [value, setValue] = useState<string>('');
    const [filtredValue, setfiltredValue] = useState<string>('');
    const [items, setItems] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();

    const filtredItems = useMemo(() => {
        return items.filter(item => item.title.toLowerCase().includes(value))
    }, [filtredValue]);

    const onChangeValue = (serachStr: string) => {
        setValue(serachStr);
        startTransition(() => setfiltredValue(serachStr));
    };
    
    return (
        <div>   
            <Provider store={store}>
            {/* <Test /> */}
                <TestInfinity />
            </Provider>
        </div>
    )
}

export default App


