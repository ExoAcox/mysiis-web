import { tw } from "@functions/style"

interface ItemProps {
  title?: string,
  subTitle: string | number,
  children?: React.ReactNode,
  titleClassname?: string
  parentClassName?: string
  subtitleClassName?: string
}
export default function ListItem({ title, subTitle, children, titleClassname, parentClassName, subtitleClassName }: ItemProps) {
  return (
    <div className={tw('flex', parentClassName)}>
      <div className={`${'w-full'} ${children ? 'flex items-center' : ''} ${titleClassname}`}>{children ? children : title}</div>
      <div className={tw('w-full flex-wrap', subtitleClassName)}>: {subTitle}</div>
    </div>
  )
}
