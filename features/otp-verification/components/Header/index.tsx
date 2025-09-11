import { Responsive } from "@components/layout";
import { Link } from "@components/navigation";
import MySiisLogo from "@images/vector/mysiis.svg";

const Header = () => {
    return (
        <Responsive parentClassName="shadow-md" className="py-2">
            <Link href="/">
                <MySiisLogo className="w-[92px] h-[40px]" />
            </Link>
        </Responsive>
    );
};

export default Header;
