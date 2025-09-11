import { usePortofolioStore } from "@features/home/store";

interface Props {
    permissions?: string[];
    category?: Portofolio["category"];
}

const usePortofolio = (props: Props = {}) => {
    const { category } = props;
    const portofolios = usePortofolioStore.getState().data;

    let filteredPortofoliosByCategory = portofolios;
    if (category) {
        filteredPortofoliosByCategory = portofolios.filter((portofolio) => {
            return category.includes(portofolio.category);
        });
    }

    return filteredPortofoliosByCategory;
};

export default usePortofolio;
