import GridIcon from "@public/images/vector/grid_view.svg";
import ListIcon from "@public/images/vector/list_view.svg";
import SwitchItem from '../SwitchItem';

interface ViewSwitchProps {
    value: "grid" | "list";
    onChange: (type: "grid" | "list") => void;
}

const ViewSwitch: React.FC<ViewSwitchProps> = ({ value, onChange }) => {
    return (
        <div className="flex h-12 border border-black-50 rounded-md bg-white overflow-hidden">
            <SwitchItem className="border-r border-black-50" isActive={value === "grid"} onClick={() => onChange("grid")}>
                <GridIcon />
            </SwitchItem>
            <SwitchItem isActive={value === "list"} onClick={() => onChange("list")}>
                <ListIcon />
            </SwitchItem>
        </div>
    );
}

export default ViewSwitch;
