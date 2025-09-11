import Checked from '@public/images/vector/box_checked.svg'
import UnCheck from '@public/images/vector/box_uncheck.svg'
import { useState } from 'react'
import { Else, If, Then } from 'react-if'

export default function CheckBoxMysiista({ onChange }: { onChange: (e: boolean) => void }) {

  const [check, setCheck] = useState(false)

  const handleCheck = () => {
    onChange(!check)
    setCheck(!check)
  }

  return (
    <button onClick={() => handleCheck()}>
      <If condition={check}>
        <Then><Checked /></Then>
        <Else><UnCheck /></Else>
      </If>
    </button>
  )
}
