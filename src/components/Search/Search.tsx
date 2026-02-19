interface IProps {
    value: string;
    onChangeValue: (value: string) => void;
}

export function Search(props: IProps) {
    const { value, onChangeValue } = props;
    const handleChangeValue = (e: any) => onChangeValue(e.target.value);
    
    return <input type="text" value={value} onChange={handleChangeValue} />
}
