import { Responsive } from '@components/layout';
import { tw } from '@functions/style';
import useMediaQuery from '@hooks/useMediaQuery';
import { useState } from 'react'

interface TabsProps {
  tabs: Option<string>[];
  onChange?: (e: string) => void
}

export default function Tabs(props: TabsProps) {

  const { isMobile } = useMediaQuery();
  const { tabs, onChange } = props

  const [currentTab, setCurrentTab] = useState<string>(tabs[0].value)

  const handleClick = (e: string) => {
    setCurrentTab(e)
    onChange && onChange(e)
  }

  return (
    <Responsive
      className="relative flex w-full mx-auto p-0 sm:px-0 overflow-x-auto whitespace-nowrap"
      parentClassName="px-0 py-2"
    >
      {tabs?.map((option) => {
        return (
          <div
            key={option.value}
            onClick={() => handleClick(option.value)}
            className={tw(
              `cursor-pointer w-full border-b-4 border-b-transparent  text-black-70 py-1 min-w-[133.5px] text-center`,
              currentTab === option.value && "border-b-primary-40 font-bold text-black-90"
            )}
          >
            {option.label && <label className={"cursor-pointer"}>{option.label}</label>}
          </div>
        );
      })}
    </Responsive>
  )
}
