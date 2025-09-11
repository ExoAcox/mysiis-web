const WarningCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div className="flex flex-col text-warning-60 py-2 px-3.5 rounded-md bg-[#FFF6EE] text-left">
            <label className="font-bold">{title}</label>
            <span className="font-medium text-medium">{children}</span>
        </div>
    );
};

export default WarningCard;
