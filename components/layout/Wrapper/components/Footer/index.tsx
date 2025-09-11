import { Responsive } from "@components/layout";
import { Subtitle } from "@components/text";

import MySiisLogo from "@images/vector/mysiis.svg";

const Footer = () => {
    return (
        <Responsive className="flex items-center gap-10 py-9 md:gap-4 md:flex-col md:pt-4 md:pb-8" parentClassName="border-t border-secondary-20">
            <MySiisLogo className="w-[92px] h-[40px] md:hidden" />
            <Subtitle className="block max-w-[22.75rem] text-center text-black-100">
                Jl. Medan Merdeka Sel. No.11, RT.11/RW.2, Kec. Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10110
            </Subtitle>
            <Subtitle className="ml-auto text-right text-black-80 md:ml-0">mySIIS © 2023 all rights reserved</Subtitle>
        </Responsive>
    );
};

export default Footer;
