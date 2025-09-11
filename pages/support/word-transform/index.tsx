import { GetServerSideProps } from "next";
import { useState } from "react";
import { Case, Default, Switch } from "react-if";

import { getServer, session } from "@libs/session";

import { Sidebar } from "@features/support/word-transform/components";
import { transformMaskText } from "@features/support/word-transform/functions/masking";
import { useMasking } from "@features/support/word-transform/functions/store";

import { Wrapper } from "@components/layout";

const WordTransform: React.FC<{ user: User }> = ({ user }) => {
    const words = useMasking();
    const [input, setInput] = useState("");

    return (
        <Wrapper title="Word Transform" user={user}>
            <div className="relative flex items-center justify-center h-full overflow-hidden shadow-lg">
                <Switch>
                    <Case condition={words.isPending}>
                        <span>Loading</span>
                    </Case>
                    <Default>
                        <div className="flex flex-col gap-8 p-8 bg-white rounded-lg w-[560px] shadow">
                            <textarea className="px-4 py-3 rounded shadow bg-slate-100" value={input} onChange={(e) => setInput(e.target.value)} />
                            <div className="w-full h-1 bg-slate-500" />
                            {input ? (
                                <p className="px-4 break-words">{transformMaskText(input, words.data || [])}</p>
                            ) : (
                                <p className="font-bold text-center">Masukan kalimat yg akan di-tranform</p>
                            )}
                        </div>
                        <Sidebar />
                    </Default>
                </Switch>
            </div>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["development"],
    });

    return server;
});

export default WordTransform;
