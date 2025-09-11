import Link_ from "next/link";

interface Props {
    children: React.ReactNode;
    href: string;
    className?: string;
    target?: string;
    disable?: boolean;
}

const Link: React.FC<Props> = ({ children, href, className, target, disable }) => {
    if (disable) return <div className={"inline " + className}>{children}</div>;

    return (
        <Link_ href={href} className={className} target={target}>
            {children}
        </Link_>
    );
};

Link.defaultProps = {
    href: "#",
};

export default Link;
