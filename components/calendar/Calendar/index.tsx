import ReactDatePicker from "react-datepicker";

import CalendarIcon from "@public/images/vector/calendar.svg";

import "react-datepicker/dist/react-datepicker.css";

interface CalendarFilterProps {
    value: Date;
    onChange: (date: Date) => void;
}

const CalendarFilter: React.FC<CalendarFilterProps> = ({ value, onChange }) => {
    return (
        <div className="flex items-center bg-white border-secondary-30 w-full p-3 h-[47px] cursor-pointer border rounded-md">
            <ReactDatePicker
                selected={value}
                onChange={(date) => onChange(date as Date)}
                dateFormat="dd/MM/yyyy"
                className="outline-none text-medium"
            />
            <div>
                <CalendarIcon />
            </div>
        </div>
    );
};

export default CalendarFilter;
