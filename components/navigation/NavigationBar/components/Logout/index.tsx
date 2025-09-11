import { useState } from "react";

import { logout } from "@functions/common";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Subtitle, Title } from "@components/text";

const LogoutPopup: React.FC<{ visible: boolean; close: () => void }> = ({ visible, close }) => {
    const [isLoading, setLoading] = useState(false);

    return (
        <Modal visible={visible} className="p-8 rounded-xl">
            <Title className="text-center">Yakin Ingin Keluar?</Title>
            <Subtitle className="py-4 text-center">
                Jika keluar, Anda tidak akan mendapatkan
                <br />
                notifikasi lagi terkait mySIIS
            </Subtitle>
            <div className="flex gap-4 mt-2">
                <Button className="flex-1 h-10 text-medium" variant="ghost" onClick={close} disabled={isLoading}>
                    Batal
                </Button>
                <Button
                    className="flex-1 h-10 text-medium"
                    loading={isLoading}
                    onClick={async () => {
                        setLoading(true);
                        logout();
                    }}
                >
                    Keluar
                </Button>
            </div>
        </Modal>
    );
};

export default LogoutPopup;
