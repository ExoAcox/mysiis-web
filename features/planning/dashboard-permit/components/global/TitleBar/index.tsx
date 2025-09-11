const TitleBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <p className="py-6 text-black-100 md:text-medium sm:text-small sm:py-3">{children}</p>;
};

export default TitleBar;
