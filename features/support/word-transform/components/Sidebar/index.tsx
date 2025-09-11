import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { When } from "react-if";

import { useMasking } from "@features/support/word-transform/functions/store";

import ModalAdd from "../ModalAdd";
import ModalDelete, { Word } from "../ModalDelete";

const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isModalAddOpen, setModalAddOpen] = useState(false);
    const [isModalDeleteOpen, setModalDeleteOpen] = useState<Word>();
    const words = useMasking();

    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);
    const openModalAdd = () => setModalAddOpen(true);
    const closeModalAdd = () => setModalAddOpen(false);
    const openModalDelete = (word: Word) => setModalDeleteOpen(word);
    const closeModalDelete = () => setModalDeleteOpen(undefined);

    return (
        <>
            <div onClick={openSidebar} className="absolute px-5 py-4 font-bold bg-white rounded shadow cursor-pointer top-4 right-6">
                WORD LISTS
            </div>

            <When condition={isSidebarOpen}>
                <div className="absolute inset-0 bg-black/30" onClick={closeSidebar} />
            </When>
            <div
                className={
                    "transition duration-300 absolute right-0 w-[500px] h-full shadow bg-white overflow-auto " +
                    (isSidebarOpen ? "translate-x-0" : "translate-x-[500px]")
                }
            >
                <div className="sticky top-0 flex items-center justify-between p-4 bg-white shadow">
                    <h5 className="text-xl font-bold">Word Lists</h5>
                    <button onClick={openModalAdd} className="px-4 py-2.5 text-sm text-white bg-red-400 rounded">
                        + Add word
                    </button>
                </div>
                <div className="flex flex-col gap-4 p-4">
                    {words.data
                        ?.sort((a, b) => a.words.localeCompare(b.words))
                        .map((word, index) => {
                            return (
                                <div key={word.id} className="flex items-center gap-4 px-4 py-3 rounded-sm shadow">
                                    <span>{word.words}</span>
                                    <label className="text-red-500">{word.label}</label>
                                    <MdDelete className="ml-auto cursor-pointer" onClick={() => openModalDelete({ ...word, index })} />
                                </div>
                            );
                        })}
                </div>
            </div>
            <ModalAdd visible={isModalAddOpen} onClose={closeModalAdd} />
            <ModalDelete visible={!!isModalDeleteOpen} onClose={closeModalDelete} word={isModalDeleteOpen} />
        </>
    );
};

export default Sidebar;
