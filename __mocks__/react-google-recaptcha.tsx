import React, {useEffect} from "react";

interface Props {
    onChange: any
}

const ReCAPTCHA = ({onChange}: Props) => {
    useEffect(() => {
        onChange("token");
    },[]);

    return(
        <div></div>
    )
};

export default ReCAPTCHA;