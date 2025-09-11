import { AddressHeader, AddressForm } from "./components";

const Address = ({ access }: { access: Access }) => {
    return (
        <>
            <AddressHeader />

            <main className="mt-4">
                <AddressForm access={access} />
            </main>
        </>
    );
};

export default Address;
