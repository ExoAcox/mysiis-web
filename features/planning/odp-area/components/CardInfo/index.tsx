import { Title } from "@components/text";
import { tw } from "@functions/style";
import { ReactNode, useState } from "react"
import ArrowDown from "@images/vector/arrow_down.svg";
import useOverlay from "@hooks/useOverlay";
import useModal from "@hooks/useModal";

interface PropsCardInfo {
  children: ReactNode;
  className?: string;
  id: string;
  title: string
}

export default function CardInfo({ children, className, title, id }: PropsCardInfo) {

  const { modal, setModal } = useModal(id)

  return (
    <div className={tw("w-[334px] rounded-md shadow-md bg-white p-[16px] flex flex-col gap-[16px]", className)}>
      <div id={id} onClick={() => setModal(!modal)} className="flex items-center justify-between cursor-pointer select-none">
        <Title size="large">{title}</Title>
        <ArrowDown className={modal ? 'block' : `hidden`} />
      </div>
      <div className={tw('flex-col gap-[16px]', modal ? 'hidden' : `flex`)}>
        {children}
      </div>
    </div>
  )
}