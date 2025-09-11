import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

import usePortofolio from "@hooks/usePortofolio";

import { intersection } from "@functions/common";

import { filterByName } from "@features/home/functions";

import { TextField } from "@components/input";

import { GridCard } from "./components";

const Main: React.FC<{ user: User }> = ({ user }) => {
    console.log("user", user);
    
    const [search, setSearch] = useState("");
    const [portofoliosBySearch, setPortofoliosBySearch] = useState<Portofolio[]>([]);
    const portofolios = usePortofolio();

    // console.log("portofolios", portofolios);
    

    const initPortofolio = () => {
        return portofolios.filter((portofolio) => {
            if (portofolio.guest) return true;
            return intersection(portofolio.permission, user.permission_keys).length;
        });
    };

    useEffect(() => {
        setPortofoliosBySearch(initPortofolio());
    }, [portofolios]);

    return (
        <div className="mt-10">
            <span className="block mb-2 font-bold text-medium text-black-80">Pencarian</span>
            <div className="flex flex-wrap items-center gap-3">
                <TextField
                    placeholder="Masukan nama portofolio"
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        const newPortofolio = filterByName(value);
                        setPortofoliosBySearch(newPortofolio);
                    }}
                    prefix={<MdSearch />}
                    suffix={
                        search && (
                            <MdClose
                                className="cursor-pointer"
                                title="search-reset"
                                onClick={() => {
                                    setSearch("");
                                    setPortofoliosBySearch(initPortofolio());
                                }}
                            />
                        )
                    }
                    className="px-4 w-80"
                    parentClassName="mr-auto"
                />
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-8">
                {portofoliosBySearch.map((portofolio) => {
                    return <GridCard portofolio={portofolio} user={user} key={portofolio.path} />;
                })}
            </div>
        </div>
    );
};

export default Main;
